(function () {
  const WORKER_API_BASE = 'https://thai-vi-portfolio.supasiao.workers.dev';

  const BASELINE_QUOTES = {
    PTT: {
      code: 'PTT',
      name: 'บมจ.ปตท.',
      price: 41.50,
      prevClose: 40.75,
      change: 0.75,
      changePct: 1.84,
      fairValue: 41.48,
      totalDps: 2.30,
      normalDps: 2.10,
      eps: 3.15,
      bvps: 39.96,
      t1Max: 38.00,
      t2Max: 35.00,
      t3Max: 32.50,
      floorPrice: 30.50
    },
    BBL: {
      code: 'BBL',
      name: 'ธ.กรุงเทพ',
      price: 183.50,
      prevClose: 181.00,
      change: 2.50,
      changePct: 1.38,
      fairValue: 237.59,
      totalDps: 10.00,
      normalDps: 10.00,
      eps: 24.10,
      bvps: 300.67,
      t1Max: 180.50,
      t2Max: 165.00,
      t3Max: 148.00,
      floorPrice: 138.00
    },
    KTB: {
      code: 'KTB',
      name: 'ธ.กรุงไทย',
      price: 43.25,
      prevClose: 43.25,
      change: 0,
      changePct: 0,
      fairValue: 35.72,
      totalDps: 2.67,
      normalDps: 2.07,
      eps: 3.45,
      bvps: 33.20,
      t1Max: 35.50,
      t2Max: 31.00,
      t3Max: 27.50,
      floorPrice: 25.00
    },
    BDMS: {
      code: 'BDMS',
      name: 'กรุงเทพดุสิตเวชการ',
      price: 19.40,
      prevClose: 19.50,
      change: -0.10,
      changePct: -0.51,
      fairValue: 24.13,
      totalDps: 1.00,
      normalDps: 0.75,
      eps: 1.00,
      bvps: 6.66,
      t1Max: 19.50,
      t2Max: 18.75,
      t3Max: 17.40,
      floorPrice: 16.50
    },
    MEGA: {
      code: 'MEGA',
      name: 'เมก้า ไลฟ์ไซแอ็นซ์',
      price: 34.50,
      prevClose: 33.50,
      change: 1.00,
      changePct: 2.99,
      fairValue: 34.20,
      totalDps: 1.60,
      normalDps: 1.60,
      eps: 2.19,
      bvps: 11.72,
      t1Max: 31.50,
      t2Max: 28.50,
      t3Max: 26.00,
      floorPrice: 24.00
    }
  };

  window.VI_BASELINE_QUOTES = BASELINE_QUOTES;
  window.VI_LATEST_QUOTES = JSON.parse(JSON.stringify(BASELINE_QUOTES));

  let deferredInstallPrompt = null;

  // Evaluate 3-Tranche Traffic Light Signal
  function evaluateActionSignal(code, price) {
    const cfg = BASELINE_QUOTES[code];
    if (!cfg) {
      return { label: '—', bg: '#F1F5F9', color: '#334155', border: '#CBD5E1', tier: 'neutral' };
    }
    if (price <= cfg.t3Max) {
      return {
        label: '🟢 เข้าโซนไม้ 3 (≤ ' + cfg.t3Max.toFixed(2) + ') — Deep Value!',
        bg: '#ECFDF5',
        color: '#15803D',
        border: '#6EE7B7',
        tier: 'buy-3'
      };
    }
    if (price <= cfg.t2Max) {
      return {
        label: '🟢 เข้าโซนไม้ 2 (≤ ' + cfg.t2Max.toFixed(2) + ') — สะสมไม้หลัก!',
        bg: '#ECFDF5',
        color: '#15803D',
        border: '#A7F3D0',
        tier: 'buy-2'
      };
    }
    if (price <= cfg.t1Max) {
      return {
        label: '🟢 เข้าโซนไม้ 1 (≤ ' + cfg.t1Max.toFixed(2) + ') — เคาะซื้อได้!',
        bg: '#ECFDF5',
        color: '#15803D',
        border: '#A7F3D0',
        tier: 'buy-1'
      };
    }
    if (price <= cfg.fairValue) {
      return {
        label: '🟡 ต่ำกว่า FV — รอรับไม้ 1 (≤ ' + cfg.t1Max.toFixed(2) + ')',
        bg: '#FFFBEB',
        color: '#B45309',
        border: '#FDE68A',
        tier: 'wait'
      };
    }
    return {
      label: '🔴 เกิน Fair Value (' + cfg.fairValue.toFixed(2) + ') — ห้ามไล่ราคา',
      bg: '#FEF2F2',
      color: '#B91C1C',
      border: '#FECACA',
      tier: 'overvalued'
    };
  }

  window.evaluateViActionSignal = evaluateActionSignal;

  // Register Service Worker for PWA and force update check
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.update().catch(() => {});
      }).catch(() => {});
    });
  }

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
      'padding: 16px 18px',
      'margin-bottom: 20px'
    ].join(';');

    const topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px;';

    const statusLeft = document.createElement('div');
    statusLeft.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;';

    const statusBadge = document.createElement('span');
    statusBadge.id = 'viLiveStatusBadge';
    statusBadge.style.cssText = 'display:inline-block;padding:5px 13px;border-radius:999px;font-size:13px;font-weight:700;background:#ECFDF5;color:#15803D;border:1px solid #A7F3D0;';
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
    refreshBtn.id = 'viRefreshLiveBtn';
    refreshBtn.type = 'button';
    refreshBtn.className = 'btn-pill secondary';
    refreshBtn.setAttribute('aria-label', 'อัปเดตราคาหุ้นล่าสุด');
    refreshBtn.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid #1D4ED8;background:#FFFFFF;color:#1D4ED8;font-family:inherit;font-size:14px;font-weight:600;line-height:1;text-align:center;cursor:pointer;';
    refreshBtn.textContent = '🔄 อัปเดตราคาสด';
    refreshBtn.addEventListener('click', () => fetchAndRenderQuotes(true));

    const installBtn = document.createElement('button');
    installBtn.id = 'viPwaInstallBtn';
    installBtn.type = 'button';
    installBtn.className = 'btn-pill';
    installBtn.setAttribute('aria-label', 'ติดตั้งแอปลงเครื่อง');
    installBtn.style.cssText = 'display:none;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid #1D4ED8;background:#1D4ED8;color:#FFFFFF;font-family:inherit;font-size:14px;font-weight:600;line-height:1;text-align:center;cursor:pointer;';
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
    tickerGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:12px;';

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
        badge.textContent = '🟢 Online: ราคาตลาดสด & สัญญาณซื้ออัตโนมัติ (SET Live)';
      } else {
        badge.style.background = '#FEF9EC';
        badge.style.color = '#8A6410';
        badge.style.borderColor = '#FDE68A';
        badge.textContent = '📌 โหมดออฟไลน์: ราคาปิดตลาดอ้างอิงล่าสุด';
      }
    }

    if (timeLabel && updatedAtStr) {
      try {
        const dt = new Date(updatedAtStr);
        const anyMarketTime = quotesMap?.PTT?.marketTime ? new Date(quotesMap.PTT.marketTime) : null;
        const marketTimeStr = anyMarketTime
          ? anyMarketTime.toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
          : '';
        timeLabel.textContent =
          (marketTimeStr ? 'ข้อมูลตลาด SET ณ ' + marketTimeStr + ' น. | ' : '') +
          'เช็คล่าสุด: ' + dt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } catch (_e) {
        timeLabel.textContent = '';
      }
    }

    ['PTT', 'BBL', 'KTB', 'BDMS', 'MEGA'].forEach((code) => {
      const base = BASELINE_QUOTES[code];
      const q = quotesMap[code] || base;
      const price = Number(q.price) || base.price;
      const changePct = (typeof q.changePct === 'number') ? q.changePct : base.changePct;
      const grossYield = ((base.totalDps / price) * 100).toFixed(2);
      const pe = (price / base.eps).toFixed(1);
      const pbv = (price / base.bvps).toFixed(2);
      const mosNum = ((base.fairValue - price) / base.fairValue) * 100;
      const mosPct = mosNum.toFixed(1);
      const signal = evaluateActionSignal(code, price);

      window.VI_LATEST_QUOTES[code] = Object.assign({}, base, q, {
        price,
        changePct,
        grossYield: Number(grossYield),
        pe: Number(pe),
        pbv: Number(pbv),
        mosPct: Number(mosPct),
        signal
      });

      const card = document.createElement('div');
      card.style.cssText = 'background:#F7F9FC;border:1px solid #E2E8F0;border-radius:13px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;';

      // Row 1: Symbol + Live Price
      const row1 = document.createElement('div');
      row1.style.cssText = 'display:flex;justify-content:space-between;align-items:baseline;';

      const sym = document.createElement('strong');
      sym.style.cssText = 'font-size:15px;color:#0F172A;';
      sym.textContent = code;

      const priceSpan = document.createElement('span');
      priceSpan.style.cssText = 'font-size:15.5px;font-weight:700;color:#1D4ED8;';
      const sign = changePct > 0 ? '+' : '';
      priceSpan.textContent = price.toFixed(2) + ' บ.' + (changePct !== 0 ? ' (' + sign + changePct.toFixed(2) + '%)' : ' (0.00%)');

      row1.appendChild(sym);
      row1.appendChild(priceSpan);

      // Row 2: P/E, Yield, MoS
      const row2 = document.createElement('div');
      row2.style.cssText = 'font-size:12px;color:#334155;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;';

      const metricLeft = document.createElement('span');
      metricLeft.textContent = 'P/E ' + pe + 'x · Yield ' + grossYield + '%';

      const mosSpan = document.createElement('span');
      mosSpan.style.fontWeight = '700';
      mosSpan.style.color = mosNum >= 15 ? '#15803D' : (mosNum >= 0 ? '#8A6410' : '#B91C1C');
      mosSpan.textContent = 'MoS ' + (mosNum > 0 ? '+' : '') + mosPct + '%';

      row2.appendChild(metricLeft);
      row2.appendChild(mosSpan);

      // Row 3: Visual Price Gauge Bar (Floor -> T1 -> Fair Value)
      const gaugeWrap = document.createElement('div');
      gaugeWrap.style.cssText = 'margin:2px 0;';

      const gaugeTrack = document.createElement('div');
      gaugeTrack.style.cssText = 'position:relative;height:7px;background:#E2E8F0;border-radius:999px;overflow:hidden;';

      const minScale = base.floorPrice * 0.95;
      const maxScale = Math.max(base.fairValue, price) * 1.12;
      const buyZonePct = Math.max(0, Math.min(100, ((base.t1Max - minScale) / (maxScale - minScale)) * 100));
      const fvPct = Math.max(0, Math.min(100, ((base.fairValue - minScale) / (maxScale - minScale)) * 100));
      const curPct = Math.max(3, Math.min(97, ((price - minScale) / (maxScale - minScale)) * 100));

      const buyZoneBar = document.createElement('div');
      buyZoneBar.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:' + buyZonePct.toFixed(1) + '%;background:#A7F3D0;';
      gaugeTrack.appendChild(buyZoneBar);

      const fvMarker = document.createElement('div');
      fvMarker.style.cssText = 'position:absolute;left:' + fvPct.toFixed(1) + '%;top:0;bottom:0;width:2px;background:#8A6410;';
      gaugeTrack.appendChild(fvMarker);

      const pointerDot = document.createElement('div');
      pointerDot.style.cssText = 'position:absolute;left:calc(' + curPct.toFixed(1) + '% - 4px);top:0;width:8px;height:7px;border-radius:999px;background:#1D4ED8;';
      gaugeTrack.appendChild(pointerDot);

      const gaugeLabels = document.createElement('div');
      gaugeLabels.style.cssText = 'display:flex;justify-content:space-between;font-size:10.5px;color:#475569;margin-top:2px;';
      const lblBuy = document.createElement('span');
      lblBuy.textContent = 'ไม้1 ≤' + base.t1Max.toFixed(2);
      const lblFv = document.createElement('span');
      lblFv.textContent = 'FV ' + base.fairValue.toFixed(2);
      gaugeLabels.appendChild(lblBuy);
      gaugeLabels.appendChild(lblFv);

      gaugeWrap.appendChild(gaugeTrack);
      gaugeWrap.appendChild(gaugeLabels);

      // Row 4: Traffic Light Action Signal Pill
      const sigPill = document.createElement('div');
      sigPill.style.cssText = [
        'font-size: 11.5px',
        'font-weight: 700',
        'padding: 4px 8px',
        'border-radius: 8px',
        'text-align: center',
        'background:' + signal.bg,
        'color:' + signal.color,
        'border: 1px solid ' + signal.border
      ].join(';');
      sigPill.textContent = signal.label;

      card.appendChild(row1);
      card.appendChild(row2);
      card.appendChild(gaugeWrap);
      card.appendChild(sigPill);
      grid.appendChild(card);

      // Sync with Master Portfolio Simulator if present
      if (typeof window.PORTFOLIO_STOCKS !== 'undefined' && Array.isArray(window.PORTFOLIO_STOCKS)) {
        const targetStock = window.PORTFOLIO_STOCKS.find((s) => s.code === code);
        if (targetStock) {
          targetStock.currentPrice = price;
          targetStock.statusText = signal.label;
          targetStock.statusClass = signal.tier.startsWith('buy') ? 'badge-success' : (signal.tier === 'wait' ? 'badge-warning' : 'badge-danger');
        }
      }
    });

    if (typeof window.renderPortfolio === 'function') {
      window.renderPortfolio();
    }
    if (typeof window.renderActualPortfolio === 'function') {
      window.renderActualPortfolio();
    }
    if (typeof window.renderTaxCalculator === 'function') {
      window.renderTaxCalculator();
    }
  }

  async function tryFetchQuotesEndpoint(baseUrl, forceRefresh) {
    const qs = forceRefresh ? `?refresh=1&t=${Date.now()}` : `?t=${Date.now()}`;
    const res = await fetch(`${baseUrl}/api/quotes${qs}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function fetchAndRenderQuotes(isManualRefresh) {
    const btn = document.getElementById('viRefreshLiveBtn');
    const badge = document.getElementById('viLiveStatusBadge');
    if (isManualRefresh && btn) {
      btn.textContent = '⏳ กำลังดึงราคาสด...';
      btn.disabled = true;
      if (badge) {
        badge.textContent = '⏳ กำลังดึงราคาตลาดล่าสุดจาก SET...';
      }
    }

    try {
      let data = null;
      if (location.protocol === 'https:' || location.protocol === 'http:') {
        try {
          data = await tryFetchQuotesEndpoint('', Boolean(isManualRefresh));
        } catch (_localErr) {
          data = await tryFetchQuotesEndpoint(WORKER_API_BASE, Boolean(isManualRefresh));
        }
      } else {
        data = await tryFetchQuotesEndpoint(WORKER_API_BASE, Boolean(isManualRefresh));
      }

      if (data && data.ok && data.quotes) {
        const anyLive = Object.values(data.quotes).some((q) => q.source === 'live-yahoo');
        renderTickerCards(data.quotes, anyLive, data.updatedAt);
        if (isManualRefresh && btn) {
          btn.textContent = '✅ อัปเดตราคาสดแล้ว!';
          btn.disabled = false;
          setTimeout(() => {
            if (btn) btn.textContent = '🔄 อัปเดตราคาสด';
          }, 2200);
        }
        return;
      }
    } catch (_err) {
      // Offline fallback
    }

    renderTickerCards(BASELINE_QUOTES, false, new Date().toISOString());
    if (isManualRefresh && btn) {
      btn.textContent = '📌 ใช้ราคาปิดล่าสุด (ออฟไลน์)';
      btn.disabled = false;
      setTimeout(() => {
        if (btn) btn.textContent = '🔄 อัปเดตราคาสด';
      }, 2200);
    }
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
    fetchAndRenderQuotes(false);
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAndRenderQuotes(false);
      }
    }, REFRESH_INTERVAL_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiveQuotes);
  } else {
    initLiveQuotes();
  }
})();
