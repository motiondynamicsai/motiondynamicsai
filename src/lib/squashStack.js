// Stacked courts section: one court per game, drive bounces as a heatmap. Static by default; play() builds it up.
import { MEDIA, clamp, drawPhoneCourt, drawPhoneLabel, easeIO, lerp, loadStackFonts, phoneStackFit, ramp, stackFontsReady, stackUnit } from './squashStage';

const GAMES = [3, 2, 1]; // drawn bottom court first
const REVEAL = 2.6; // seconds

export function mountCourtStack(cv) {
  const ctx = cv.getContext('2d');
  let match = null, W = 0, H = 0, dpr = 1, raf = 0, p = 1, disposed = false, fit = null;
  const pct = (g, w) => { const d = match.games[g][w]; return Math.round((100 * d.length) / d.drives); };
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = 'round';
    const labels = [];
    GAMES.forEach((g) => {
      const ge = easeIO(clamp(p / 0.6, 0, 1)), level = 3 - g, de = ramp(p, 0.35 + level * 0.15, 0.35), oy = lerp(fit.oy(0), fit.oy(level), ge);
      const pt = (x, y) => { const q = stackUnit(x, y, 0); return [fit.ox + fit.F * q[0], oy + fit.F * q[1]]; };
      drawPhoneCourt(ctx, pt, match.games[g], { reveal: de, alpha: 1, dpr, cw: fit.cw });
      if (de > 0 && stackFontsReady()) labels.push(() => drawPhoneLabel(ctx, fit.labelX, lerp(fit.mid(0), fit.mid(level), ge), g, pct(g, 'A'), pct(g, 'B'), de));
    });
    labels.forEach((f) => f());
  }

  function size() {
    const r = cv.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, r.width < 720 ? 3 : 2);
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fit = phoneStackFit(W, H, { left: 8, right: 0, top: 6, bottom: 6, air: 16 });
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
    match = data; draw();
    loadStackFonts().then(() => { if (!disposed && p === 1) draw(); }); // the game labels are canvas text
  }).catch(() => {});
  return { play, destroy() { disposed = true; cancelAnimationFrame(raf); window.removeEventListener('resize', size); } };
}
