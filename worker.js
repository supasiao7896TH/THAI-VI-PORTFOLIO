const SYMBOLS = [
  { code: 'PTT',  yahoo: 'PTT.BK',  baselinePrice: 41.50,  fairValue: 41.48,  totalDps: 2.30, normalDps: 2.10, eps: 3.15,  bvps: 39.96 },
  { code: 'BBL',  yahoo: 'BBL.BK',  baselinePrice: 183.50, fairValue: 237.59, totalDps: 10.00, normalDps: 10.00, eps: 24.10, bvps: 300.67 },
  { code: 'KTB',  yahoo: 'KTB.BK',  baselinePrice: 43.25,  fairValue: 35.72,  totalDps: 2.67, normalDps: 2.07, eps: 3.45,  bvps: 33.20 },
  { code: 'BDMS', yahoo: 'BDMS.BK', baselinePrice: 19.40,  fairValue: 24.13,  totalDps: 1.00, normalDps: 0.75, eps: 1.00,  bvps: 6.66 },
  { code: 'MEGA', yahoo: 'MEGA.BK', baselinePrice: 34.50,  fairValue: 34.20,  totalDps: 1.60, normalDps: 1.60, eps: 2.19,  bvps: 11.72 }
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Cache-Control'
};

function sanitizeSyncKey(raw) {
  const cleaned = String(raw || 'supasit-vi-5m').trim().replace(/[^a-zA-Z0-9_-]/g, '');
  return cleaned.slice(0, 64) || 'supasit-vi-5m';
}

async function queryYahooHost(host, yahooSymbol, forceRefresh) {
  const cacheBuster = forceRefresh ? `&_=${Date.now()}` : '';
  const url = `https://${host}/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1m&range=1d${cacheBuster}`;
  const fetchOpts = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  };
  if (!forceRefresh) {
    fetchOpts.cf = { cacheTtl: 30, cacheEverything: true };
  }
  const res = await fetch(url, fetchOpts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchYahooQuote(item, forceRefresh) {
  try {
    let data;
    try {
      data = await queryYahooHost('query1.finance.yahoo.com', item.yahoo, forceRefresh);
    } catch (_e1) {
      data = await queryYahooHost('query2.finance.yahoo.com', item.yahoo, forceRefresh);
    }

    const result = data?.chart?.result?.[0];
    const meta = result?.meta;
    const price = Number(meta?.regularMarketPrice) || item.baselinePrice;
    const prevClose = Number(meta?.chartPreviousClose || meta?.previousClose) || price;
    const change = price - prevClose;
    const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;

    return {
      code: item.code,
      price,
      prevClose,
      change,
      changePct,
      pe: price / item.eps,
      pbv: price / item.bvps,
      grossYield: (item.totalDps / price) * 100,
      normalYield: (item.normalDps / price) * 100,
      fairValue: item.fairValue,
      mosPct: ((item.fairValue - price) / item.fairValue) * 100,
      source: 'live-yahoo',
      marketTime: meta?.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString()
    };
  } catch (_err) {
    const price = item.baselinePrice;
    return {
      code: item.code,
      price,
      prevClose: price,
      change: 0,
      changePct: 0,
      pe: price / item.eps,
      pbv: price / item.bvps,
      grossYield: (item.totalDps / price) * 100,
      normalYield: (item.normalDps / price) * 100,
      fairValue: item.fairValue,
      mosPct: ((item.fairValue - price) / item.fairValue) * 100,
      source: 'baseline-56-1',
      marketTime: new Date().toISOString()
    };
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // 1. Live Stock Quotes Endpoint
    if (url.pathname === '/api/quotes') {
      const forceRefresh = url.searchParams.has('refresh') || url.searchParams.has('t');
      const results = await Promise.all(SYMBOLS.map((item) => fetchYahooQuote(item, forceRefresh)));
      const quotesMap = {};
      results.forEach((q) => {
        quotesMap[q.code] = q;
      });

      return new Response(
        JSON.stringify({
          ok: true,
          updatedAt: new Date().toISOString(),
          quotes: quotesMap
        }),
        {
          headers: Object.assign(
            {
              'Content-Type': 'application/json; charset=utf-8',
              'Cache-Control': 'no-store, no-cache, must-revalidate'
            },
            CORS_HEADERS
          )
        }
      );
    }

    // 2. Cloud KV Portfolio Sync Endpoint (/api/portfolio)
    if (url.pathname === '/api/portfolio') {
      if (!env || !env.VI_PORTFOLIO_KV) {
        return new Response(
          JSON.stringify({ ok: false, error: 'KV namespace not bound' }),
          { status: 503, headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS) }
        );
      }

      if (request.method === 'GET') {
        const keyParam = sanitizeSyncKey(url.searchParams.get('key'));
        const kvKey = `portfolio:${keyParam}`;
        const stored = await env.VI_PORTFOLIO_KV.get(kvKey, 'json');
        return new Response(
          JSON.stringify({
            ok: true,
            syncKey: keyParam,
            data: stored || null
          }),
          {
            headers: Object.assign(
              { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
              CORS_HEADERS
            )
          }
        );
      }

      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const keyParam = sanitizeSyncKey(body.syncKey);
          const kvKey = `portfolio:${keyParam}`;
          const payload = {
            totalCapital: Number(body.totalCapital) || 5000000,
            holdings: body.holdings || {},
            dividendLedger: Array.isArray(body.dividendLedger) ? body.dividendLedger.slice(0, 200) : [],
            updatedAt: new Date().toISOString()
          };
          await env.VI_PORTFOLIO_KV.put(kvKey, JSON.stringify(payload));
          return new Response(
            JSON.stringify({ ok: true, syncKey: keyParam, updatedAt: payload.updatedAt }),
            {
              headers: Object.assign(
                { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
                CORS_HEADERS
              )
            }
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ ok: false, error: String(err) }),
            { status: 400, headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS) }
          );
        }
      }
    }

    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
