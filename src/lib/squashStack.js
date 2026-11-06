// Stacked courts section: one court per game, drive bounces as a heatmap. Static by default; play() builds it up.
import { COL, COURT_LINES, MEDIA, clamp, drawPhoneCourt, drawPhoneLabel, easeIO, lerp, loadStackFonts, phoneStackFit, ramp, stackFontsReady, stackUnit } from './squashStage';

const GAMES = [3, 2, 1]; // drawn bottom court first
const REVEAL = 2.6; // seconds

export function mountCourtStack(cv, { onPct } = {}) {
  const ctx = cv.getContext('2d');
  let match = null, W = 0, H = 0, dpr = 1, raf = 0, p = 1, disposed = false, view = { F: 1, ox: 0, oy: 0 }, phoneFit = null;
  const pct = (g, w) => { const d = match.games[g][w]; return Math.round((100 * d.length) / d.drives); };
  const phone = () => true;
  const narrow = () => W < 560; // a small canvas above phone width
  const RIGHT = () => (narrow() ? 76 : 130); // label column
  const gap = 3.3;
  const project = (x, y, z) => { const q = stackUnit(x, y, z); return [view.ox + view.F * q[0], view.oy + view.F * q[1]]; };
  const fit = () => { // the finished stack fills the canvas, leaving room on the right for the game labels
    const pad = 12, right = RIGHT(), c = [];
    for (const z of [0, 2 * gap]) for (const x of [0, 6.4]) for (const y of [0, 9.75]) c.push(stackUnit(x, y, z));
    const x0 = Math.min(...c.map((q) => q[0])), x1 = Math.max(...c.map((q) => q[0])), y0 = Math.min(...c.map((q) => q[1])), y1 = Math.max(...c.map((q) => q[1]));
    const F = Math.min((W - pad - right) / (x1 - x0), (H - 2 * pad) / (y1 - y0));
    view = { F, ox: (W - right + pad) / 2 - (F * (x0 + x1)) / 2, oy: H / 2 - (F * (y0 + y1)) / 2 };
  };
  const poly = (pts, close) => { ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); if (close) ctx.closePath(); };

  function drawPhone() {
    const labels = [];
    GAMES.forEach((g) => {
      const ge = easeIO(clamp(p / 0.6, 0, 1)), level = 3 - g, de = ramp(p, 0.35 + level * 0.15, 0.35), oy = lerp(phoneFit.oy(0), phoneFit.oy(level), ge);
      const pt = (x, y) => { const q = stackUnit(x, y, 0); return [phoneFit.ox + phoneFit.F * q[0], oy + phoneFit.F * q[1]]; };
      drawPhoneCourt(ctx, pt, match.games[g], { reveal: de, alpha: 1, dpr, cw: phoneFit.cw });
      if (de > 0 && stackFontsReady()) labels.push(() => drawPhoneLabel(ctx, phoneFit.labelX, lerp(phoneFit.mid(0), phoneFit.mid(level), ge), g, pct(g, 'A'), pct(g, 'B'), de));
    });
    labels.forEach((f) => f());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = 'round';
    if (phoneFit) { drawPhone(); return; }
    const labels = []; // drawn after every court so the next plane can't paint over them
    GAMES.forEach((g) => {
      const ge = easeIO(clamp(p / 0.6, 0, 1)), z = (3 - g) * gap * ge, de = ramp(p, 0.35 + (3 - g) * 0.15, 0.35);
      const pt = (x, y) => project(x, y, z);
      const outline = [pt(0, 0), pt(6.4, 0), pt(6.4, 9.75), pt(0, 9.75)];
      ctx.fillStyle = 'rgba(47,111,214,.2)'; poly(outline, true); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2; poly(outline, true); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.3)'; COURT_LINES.forEach((l) => { poly(l.map((q) => pt(...q))); ctx.stroke(); });
      for (const w of ['A', 'B']) {
        const pts = match.games[g][w].pts.filter((q) => q[2].includes('drive')), n = Math.round(de * pts.length);
        for (let j = 0; j < n; j++) { // soft glow first so overlapping bounces build heat
          const q = pt(pts[j][0], pts[j][1]), hg = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 11);
          hg.addColorStop(0, `rgba(${COL[w]},.28)`); hg.addColorStop(1, `rgba(${COL[w]},0)`);
          ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(q[0], q[1], 11, 0, 7); ctx.fill();
        }
        ctx.fillStyle = `rgba(${COL[w]},.95)`;
        for (let j = 0; j < n; j++) { const q = pt(pts[j][0], pts[j][1]); ctx.beginPath(); ctx.arc(q[0], q[1], 2.3, 0, 7); ctx.fill(); }
      }
      if (de > 0 && stackFontsReady()) labels.push(() => {
        const q = pt(6.4, 4.4), lx = W - RIGHT() + 12;
        ctx.globalAlpha = de; ctx.textBaseline = 'middle';
        ctx.font = '500 12.5px Outfit'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(`Game ${g}`, lx, q[1] - 12);
        ctx.font = '600 22px Outfit'; ctx.fillStyle = `rgb(${COL.A})`; ctx.fillText(`${pct(g, 'A')}%`, lx, q[1] + 12);
        if (!narrow()) { const wa = ctx.measureText(`${pct(g, 'A')}%`).width; ctx.font = '450 15px Outfit'; ctx.fillStyle = `rgba(${COL.B},.95)`; ctx.fillText(`${pct(g, 'B')}%`, lx + 10 + wa, q[1] + 13); }
        ctx.globalAlpha = 1;
      });
    });
    labels.forEach((f) => f());
  }

  function size() {
    const r = cv.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, r.width < 720 ? 3 : 2);
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fit();
    phoneFit = phone() ? phoneStackFit(W, H, { left: 8, right: 0, top: 6, bottom: 6, air: 16 }) : null;
    if (match) draw();
  }

  function play() {
    if (!match) return;
    cancelAnimationFrame(raf);
    p = 0;
    let last = performance.now();
    const frame = (now) => {
      if (disposed) return;
      p = Math.min(1, p + (now - last) / 1000 / REVEAL); last = now; draw();
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }

  size();
  window.addEventListener('resize', size);
  fetch(`${MEDIA}match.json`).then((r) => r.json()).then((data) => {
    if (disposed) return;
    match = data; onPct?.([1, 2, 3].map((g) => pct(g, 'A'))); draw();
    loadStackFonts().then(() => { if (!disposed && p === 1) draw(); }); // the game labels are canvas text
  }).catch(() => {});
  return { play, destroy() { disposed = true; cancelAnimationFrame(raf); window.removeEventListener('resize', size); } };
}
