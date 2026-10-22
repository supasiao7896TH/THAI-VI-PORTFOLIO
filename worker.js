const SYMBOLS = [
  { code: 'PTT',  yahoo: 'PTT.BK',  baselinePrice: 33.25, fairValue: 40.66, totalDps: 2.10, normalDps: 1.90, eps: 3.15,  bvps: 39.96 },
  { code: 'BBL',  yahoo: 'BBL.BK',  baselinePrice: 161.50, fairValue: 214.08, totalDps: 10.00, normalDps: 10.00, eps: 24.11, bvps: 303.40 },
  { code: 'KTB',  yahoo: 'KTB.BK',  baselinePrice: 34.25, fairValue: 34.33, totalDps: 2.07, normalDps: 1.47, eps: 3.45,  bvps: 32.72 },
  { code: 'BDMS', yahoo: 'BDMS.BK', baselinePrice: 19.50, fairValue: 24.13, totalDps: 1.00, normalDps: 0.75, eps: 1.00,  bvps: 6.66 },
  { code: 'MEGA', yahoo: 'MEGA.BK', baselinePrice: 33.75, fairValue: 34.20, totalDps: 1.60, normalDps: 1.60, eps: 2.19,  bvps: 11.72 }
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function sanitizeSyncKey(raw) {
  const cleaned = String(raw || 'supasit-vi-5m').trim().replace(/[^a-zA-Z0-9_-]/g, '');
  return cleaned.slice(0, 64) || 'supasit-vi-5m';
}

async function fetchYahooQuote(item) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.yahoo)}?interval=1d&range=5d`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      cf: { cacheTtl: 300, cacheEverything: true }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
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
      const results = await Promise.all(SYMBOLS.map(fetchYahooQuote));
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
              'Cache-Control': 'public, max-age=60'
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
