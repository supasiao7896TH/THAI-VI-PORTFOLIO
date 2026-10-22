(function () {
  const BASELINE_QUOTES = {
    PTT:  { code: 'PTT',  price: 33.25, change: 0, changePct: 0, fairValue: 40.66, totalDps: 2.10, normalDps: 1.90, eps: 3.15,  bvps: 39.96 },
    BBL:  { code: 'BBL',  price: 161.50, change: 0, changePct: 0, fairValue: 214.08, totalDps: 10.00, normalDps: 10.00, eps: 24.11, bvps: 303.40 },
    KTB:  { code: 'KTB',  price: 34.25, change: 0, changePct: 0, fairValue: 34.33, totalDps: 2.07, normalDps: 1.47, eps: 3.45,  bvps: 32.72 },
    BDMS: { code: 'BDMS', price: 19.50, change: 0, changePct: 0, fairValue: 24.13, totalDps: 1.00, normalDps: 0.75, eps: 1.00,  bvps: 6.66 },
    MEGA: { code: 'MEGA', price: 33.75, change: 0, changePct: 0, fairValue: 34.20, totalDps: 1.60, normalDps: 1.60, eps: 2.19,  bvps: 11.72 }
  };

  let deferredInstallPrompt = null;

  // 1. Register Service Worker for PWA
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  // 2. Inject Live Ticker & PWA Install Bar at the top of .container
  function createLiveBar() {
    const container = document.querySelector('.container');
    if (!container || document.getElementById('viLiveBar')) return;

    const bar = document.createElement('div');
    bar.id = 'viLiveBar';
    bar.className = 'no-print';
    bar.style.cssText = [
      'background-color: #FFFFFF',
      'border: 1px solid #E2E8F0',
      'border-radius: 13px',
      'box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06)',
      'padding: 14px 18px',
      'margin-bottom: 20px'
    ].join(';');

    const topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;';

    const statusLeft = document.createElement('div');
    statusLeft.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;';

    const statusBadge = document.createElement('span');
    statusBadge.id = 'viLiveStatusBadge';
    statusBadge.style.cssText = 'display:inline-block;padding:4px 12px;border-radius:999px;font-size:12.5px;font-weight:700;background:#ECFDF5;color:#15803D;border:1px solid #A7F3D0;';
    statusBadge.textContent = '🟢 กำลังเช็คราคาตลาดสด (Cloudflare Live)...';

    const timeLabel = document.createElement('span');
    timeLabel.id = 'viLiveTimeLabel';
    timeLabel.style.cssText = 'font-size:12.5px;color:#475569;font-weight:500;';
    timeLabel.textContent = '';

    statusLeft.appendChild(statusBadge);
    statusLeft.appendChild(timeLabel);

    const actionsRight = document.createElement('div');
    actionsRight.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;';

    const refreshBtn = document.createElement('button');
    refreshBtn.type = 'button';
    refreshBtn.setAttribute('aria-label', 'อัปเดตราคาหุ้นล่าสุด');
    refreshBtn.style.cssText = 'min-height:38px;padding:0 14px;border-radius:999px;border:1px solid #1D4ED8;background:#FFFFFF;color:#1D4ED8;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;';
    refreshBtn.textContent = '🔄 อัปเดตราคาสด';
    refreshBtn.addEventListener('click', () => fetchAndRenderQuotes(true));

    const installBtn = document.createElement('button');
    installBtn.id = 'viPwaInstallBtn';
    installBtn.type = 'button';
    installBtn.setAttribute('aria-label', 'ติดตั้งแอปลงเครื่อง');
    installBtn.style.cssText = 'display:none;min-height:38px;padding:0 14px;border-radius:999px;border:1px solid #1D4ED8;background:#1D4ED8;color:#FFFFFF;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;';
    installBtn.textContent = '📲 ติดตั้งแอป (PWA)';
    installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      installBtn.style.display = 'none';
    });

    actionsRight.appendChild(refreshBtn);
    actionsRight.appendChild(installBtn);

    topRow.appendChild(statusLeft);
    topRow.appendChild(actionsRight);

    const tickerGrid = document.createElement('div');
    tickerGrid.id = 'viLiveTickerGrid';
    tickerGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:10px;';

    bar.appendChild(topRow);
    bar.appendChild(tickerGrid);

    const topbar = container.querySelector('.topbar, .report-header');
    if (topbar && topbar.nextSibling) {
      container.insertBefore(bar, topbar.nextSibling);
    } else {
      container.insertBefore(bar, container.firstChild);
    }
  }

  function renderTickerCards(quotesMap, isLive, updatedAtStr) {
    const grid = document.getElementById('viLiveTickerGrid');
    const badge = document.getElementById('viLiveStatusBadge');
    const timeLabel = document.getElementById('viLiveTimeLabel');
    if (!grid) return;

    while (grid.firstChild) grid.removeChild(grid.firstChild);

    if (badge) {
      if (isLive) {
        badge.style.background = '#ECFDF5';
        badge.style.color = '#15803D';
        badge.style.borderColor = '#A7F3D0';
        badge.textContent = '🟢 Online: ราคาตลาดสด (SET Live)';
      } else {
        badge.style.background = '#FEF9EC';
        badge.style.color = '#8A6410';
        badge.style.borderColor = '#FDE68A';
        badge.textContent = '📌 ราคาอ้างอิงฐาน 56-1 (22 ต.ค. 69)';
      }
    }

    if (timeLabel && updatedAtStr) {
      try {
        const dt = new Date(updatedAtStr);
        timeLabel.textContent = 'อัปเดตล่าสุด: ' + dt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } catch (_e) {
        timeLabel.textContent = '';
      }
    }

    ['PTT', 'BBL', 'KTB', 'BDMS', 'MEGA'].forEach((code) => {
      const base = BASELINE_QUOTES[code];
      const q = quotesMap[code] || base;
      const price = Number(q.price) || base.price;
      const changePct = Number(q.changePct) || 0;
      const grossYield = ((base.totalDps / price) * 100).toFixed(2);
      const mosPct = (((base.fairValue - price) / base.fairValue) * 100).toFixed(1);

      const card = document.createElement('div');
      card.style.cssText = 'background:#F7F9FC;border:1px solid #E2E8F0;border-radius:10px;padding:10px 12px;';

      const row1 = document.createElement('div');
      row1.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;';

      const sym = document.createElement('strong');
      sym.style.cssText = 'font-size:14px;color:#0F172A;';
      sym.textContent = code;

      const priceSpan = document.createElement('span');
      priceSpan.style.cssText = 'font-size:15px;font-weight:700;color:#1D4ED8;';
      const sign = changePct > 0 ? '+' : '';
      priceSpan.textContent = price.toFixed(2) + ' บ.' + (changePct !== 0 ? ' (' + sign + changePct.toFixed(2) + '%)' : '');

      row1.appendChild(sym);
      row1.appendChild(priceSpan);

      const row2 = document.createElement('div');
      row2.style.cssText = 'font-size:12px;color:#334155;display:flex;justify-content:space-between;';

      const yieldSpan = document.createElement('span');
      yieldSpan.textContent = 'Yield: ' + grossYield + '%';

      const mosSpan = document.createElement('span');
      mosSpan.style.fontWeight = '600';
      mosSpan.style.color = Number(mosPct) >= 15 ? '#15803D' : '#8A6410';
      mosSpan.textContent = 'MoS: ' + (Number(mosPct) > 0 ? '+' : '') + mosPct + '%';

      row2.appendChild(yieldSpan);
      row2.appendChild(mosSpan);

      card.appendChild(row1);
      card.appendChild(row2);
      grid.appendChild(card);

      // Update Master Portfolio Simulator if present on page
      if (typeof window.PORTFOLIO_STOCKS !== 'undefined' && Array.isArray(window.PORTFOLIO_STOCKS)) {
        const targetStock = window.PORTFOLIO_STOCKS.find((s) => s.code === code);
        if (targetStock) {
          targetStock.currentPrice = price;
        }
      }
    });

    if (typeof window.renderPortfolio === 'function') {
      window.renderPortfolio();
    }
  }

  async function fetchAndRenderQuotes() {
    try {
      const res = await fetch('/api/quotes', { cache: 'no-store' });
      if (!res.ok) throw new Error('API not available');
      const data = await res.json();
      if (data && data.ok && data.quotes) {
        const anyLive = Object.values(data.quotes).some((q) => q.source === 'live-yahoo');
        renderTickerCards(data.quotes, anyLive, data.updatedAt);
        return;
      }
    } catch (_err) {
      // Fallback to baseline quotes when viewing via file:// or GitHub Pages without Worker
    }
    renderTickerCards(BASELINE_QUOTES, false, new Date().toISOString());
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const btn = document.getElementById('viPwaInstallBtn');
    if (btn) btn.style.display = 'inline-flex';
  });

  const REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 นาที (ประหยัดโควต้าตามสไตล์ VI)

  function initLiveQuotes() {
    createLiveBar();
    fetchAndRenderQuotes();
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAndRenderQuotes();
      }
    }, REFRESH_INTERVAL_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiveQuotes);
  } else {
    initLiveQuotes();
  }
})();
