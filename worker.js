const SYMBOLS = [
  { code: 'PTT',  yahoo: 'PTT.BK',  baselinePrice: 33.25, fairValue: 40.66, totalDps: 2.10, normalDps: 1.90, eps: 3.15,  bvps: 39.96 },
  { code: 'BBL',  yahoo: 'BBL.BK',  baselinePrice: 161.50, fairValue: 214.08, totalDps: 10.00, normalDps: 10.00, eps: 24.11, bvps: 303.40 },
  { code: 'KTB',  yahoo: 'KTB.BK',  baselinePrice: 34.25, fairValue: 34.33, totalDps: 2.07, normalDps: 1.47, eps: 3.45,  bvps: 32.72 },
  { code: 'BDMS', yahoo: 'BDMS.BK', baselinePrice: 19.50, fairValue: 24.13, totalDps: 1.00, normalDps: 0.75, eps: 1.00,  bvps: 6.66 },
  { code: 'MEGA', yahoo: 'MEGA.BK', baselinePrice: 33.75, fairValue: 34.20, totalDps: 1.60, normalDps: 1.60, eps: 2.19,  bvps: 11.72 }
];

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

    if (url.pathname === '/api/quotes') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS'
          }
        });
      }

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
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, max-age=60',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
