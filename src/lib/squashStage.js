// Squash stage: a real PSA rally (Mueller v El Hammamy, rally 38) drawn over the court photo as
// shot flights and player tracking, then lifted into one stacked court per game whose dots form the
// drive-length heatmap. Nothing is tied to scrolling: play() runs the sequence, stop() returns to the hero.

export const MEDIA = '/media/squash/';
const G = 9.81;
const WALL_SCALE = 112; // plate px per metre of height at w = 1, fitted to the tin, service line and out line on the plate
export const COL = { A: '143,184,255', B: '240,194,75' }; // Mueller blue, El Hammamy gold
const surname = { A: 'Mueller', B: 'El Hammamy' };
export const COURT_LINES = [[[0, 5.44], [6.4, 5.44]], [[3.2, 5.44], [3.2, 9.75]], [[1.6, 5.44], [1.6, 7.04], [0, 7.04]], [[4.8, 5.44], [4.8, 7.04], [6.4, 7.04]]];
// [kind, length]: playback position runs through these segments; 'hold' is the resting end state
const SEG = [['hero', 1], ['rally', 0.35], ['play', 1.3], ['hold', 0.35]];
const END = SEG.slice(0, -1).reduce((a, s) => a + s[1], 0);

export const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ramp = (t, a, d) => clamp((t - a) / d, 0, 1);
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
export const stackUnit = (x, y, z) => { // elevated view of a free-standing court, before scaling
  const P = [x - 3.2, y - 4.875, z], eye = [0, 17, 12.5], tg = [0, -0.6, 2.4];
  const f = norm(sub(tg, eye)), r = norm(cross([0, 0, 1], f)), u = cross(f, r), d = sub(P, eye), cz = dot(d, f);
  return [dot(d, r) / cz, -dot(d, u) / cz];
};

// Phones: three same-size courts one above the other with clear air between them, game labels in their own column.
const STACK_LABELS = 48, STACK_LABEL_GAP = 14;
export function phoneStackFit(W, H, { left, right, top, bottom, air }) {
  const c = [[0, 0], [6.4, 0], [6.4, 9.75], [0, 9.75]].map(([x, y]) => stackUnit(x, y, 0));
  const x0 = Math.min(...c.map((q) => q[0])), x1 = Math.max(...c.map((q) => q[0])), y0 = Math.min(...c.map((q) => q[1])), y1 = Math.max(...c.map((q) => q[1]));
  const F = Math.max(1, Math.min((W - left - right - STACK_LABELS - STACK_LABEL_GAP) / (x1 - x0), (H - top - bottom - 2 * air) / (3 * (y1 - y0))));
  const cw = F * (x1 - x0), ch = F * (y1 - y0), gx = left + (W - left - right - cw - STACK_LABEL_GAP - STACK_LABELS) / 2;
  const first = top + (H - top - bottom - 3 * ch - 2 * air) / 2; // top edge of the highest court
  return { F, cw, ox: gx - F * x0, oy: (level) => first + (2 - level) * (ch + air) - F * y0, mid: (level) => first + (2 - level) * (ch + air) + ch / 2, labelX: gx + cw + STACK_LABEL_GAP, centre: gx + (cw + STACK_LABEL_GAP + STACK_LABELS) / 2 };
}

const driveLists = new WeakMap();
const drives = (side) => {
  if (!driveLists.has(side)) driveLists.set(side, side.pts.filter((q) => q[2].includes('drive')));
  return driveLists.get(side);
};
export function drawPhoneCourt(ctx, pt, game, { reveal, alpha, cw }) { // dots over the lines: flat colour, no glow
  const r = clamp(cw * 0.0085, 1.7, 2.6), trace = (pts, close) => { ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); if (close) ctx.closePath(); };
  const outline = [pt(0, 0), pt(6.4, 0), pt(6.4, 9.75), pt(0, 9.75)];
  ctx.fillStyle = `rgba(47,111,214,${0.2 * alpha})`; trace(outline, true); ctx.fill();
  const shown = ['A', 'B'].map((w) => { const all = drives(game[w]); return [w, all.slice(0, Math.round(reveal * all.length)).map((q) => pt(q[0], q[1]))]; });
  ctx.lineWidth = clamp(cw / 180, 1, 1.5);
  ctx.strokeStyle = `rgba(255,255,255,${0.75 * alpha})`; trace(outline, true); ctx.stroke();
  ctx.strokeStyle = `rgba(255,255,255,${0.5 * alpha})`; COURT_LINES.forEach((l) => { trace(l.map((q) => pt(...q))); ctx.stroke(); });
  for (const [w, pts] of shown) {
    ctx.fillStyle = `rgba(${COL[w]},.95)`; ctx.beginPath();
    for (const q of pts) { ctx.moveTo(q[0] + r, q[1]); ctx.arc(q[0], q[1], r, 0, 7); }
    ctx.fill();
  }
}
export function drawPhoneLabel(ctx, x, y, g, a, b, alpha) {
  ctx.globalAlpha = alpha; ctx.textBaseline = 'middle';
  ctx.font = '400 13px Outfit, system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.fillText(`Game ${g}`, x, y - 20);
  ctx.font = '600 20px Outfit, system-ui, sans-serif'; ctx.fillStyle = `rgb(${COL.A})`; ctx.fillText(`${a}%`, x, y + 1);
  ctx.font = '600 20px Outfit, system-ui, sans-serif'; ctx.fillStyle = `rgb(${COL.B})`; ctx.fillText(`${b}%`, x, y + 22);
  ctx.globalAlpha = 1;
}

// Canvas text has no font-swap: hold the labels back until Outfit is really there, so the first paint is never a fallback font.
let fontsReady = false, fontsLoading = null;
export const stackFontsReady = () => fontsReady;
export function loadStackFonts() {
  if (!fontsLoading) {
    const t0 = performance.now(), fonts = document.fonts;
    const attempt = () => (fonts ? Promise.all(['500 12.5px Outfit', '600 22px Outfit', '450 15px Outfit'].map((f) => fonts.load(f, 'Game 0123456789%'))) : Promise.resolve([[1]])).catch(() => [[1]]).then((found) => {
      if (found.every((l) => l.length) || performance.now() - t0 > 4000) { fontsReady = true; return undefined; }
      return new Promise((res) => { setTimeout(res, 120); }).then(attempt); // the @font-face rules may not have arrived yet
    });
    fontsLoading = attempt();
  }
  return fontsLoading;
}

const shotName = (s) => ({ cross_court_drive: 'Cross-court drive', straight_drive: 'Straight drive', straight_kill: 'Straight kill', straight_lob: 'Straight lob', boast_2_wall: 'Two-wall boast', serve: 'Serve' }[s] || s.replace(/_/g, ' '));

function homography(src, dst) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  for (let c = 0; c < 8; c++) {
    let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; }
  }
  const h = b.map((v, i) => v / A[i][i]);
  const map = (x, y) => { const w = h[6] * x + h[7] * y + 1; return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w]; };
  map.w = (x, y) => h[6] * x + h[7] * y + 1; // depth term: a vertical metre on the plate scales with 1/w
  return map;
}

export function mountSquashStage(root, { onBeat, onPlaying } = {}) {
  const $ = (s) => root.querySelector(s);
  const stage = $('.sq-stage'), cv = $('.sq-overlay'), plate = $('.sq-plate');
  const hero = $('.sq-hero'), slot = $('.sq-slot'), cap = $('.sq-cap'), capIn = $('.sq-cap-in'), boxEl = $('.sq-box');
  const ctx = cv.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let onResize = () => {}, wake = () => {}, onScreen = true;
  let disposed = false, raf = 0, W = 0, H = 0, dpr = 1, PX = 1, CAMNOW = null;
  const fold = document.createElement('div'); fold.style.cssText = 'position:absolute;width:0;height:100svh;visibility:hidden;pointer-events:none'; stage.append(fold);
  const visibleHeight = () => fold.offsetHeight; // the screen above a floating browser toolbar: the stage runs on underneath it
  let pos = Number(new URLSearchParams(window.location.search).get('p')) || 0, dir = 0; // ?p=2.5 opens part-way in
  const LW = 1.7;
  const rallyLW = () => 1; // phones: thinner tracking lines; the stacked courts keep LW

  const poly = (pts, close) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); if (close) ctx.closePath(); };
  const glowDot = (x, y, r, col, glow) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * glow);
    g.addColorStop(0, col.replace('A', '.55')); g.addColorStop(1, col.replace('A', '0'));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * glow, 0, 7); ctx.fill();
    ctx.fillStyle = col.replace('A', '1'); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  };
  const text = (t, x, y, size = 13, col = 'rgba(255,255,255,.85)') => { ctx.font = `500 ${size * PX}px Outfit`; ctx.fillStyle = col; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y); };
  const tracer = (pts, col, width) => {
    for (let i = 1; i < pts.length; i++) {
      const a = i / pts.length; ctx.strokeStyle = col.replace('A', (a * a).toFixed(3)); ctx.lineWidth = width * PX * (0.35 + 0.65 * a) * rallyLW();
      ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
    }
  };

  // broadcast head-to-head rows
  const rowsEl = $('.sq-rows'), H2H = [];
  for (let i = 0; i < 4; i++) {
    const r = document.createElement('div'); r.className = 'sq-row';
    r.innerHTML = `<span class="v"></span><span class="bar l" style="--c:rgb(${COL.A})"><i></i></span><span class="lb"></span><span class="bar r" style="--c:rgb(${COL.B})"><i></i></span><span class="v r"></span>`;
    rowsEl.appendChild(r);
    H2H.push({ a: r.children[0], ba: r.children[1].firstChild, lb: r.children[2], bb: r.children[3].firstChild, b: r.children[4], ta: 0, tb: 0, ca: 0, cb: 0, dec: 0, unit: '' });
  }
  const h2h = (i, lb, a, b, dec = 0, unit = '') => { const r = H2H[i]; if (r.lb.textContent !== lb) { r.lb.textContent = lb; r.ca = a; r.cb = b; } r.ta = a; r.tb = b; r.dec = dec; r.unit = unit; };
  const tickH2H = (dt) => {
    for (const r of H2H) {
      const k = reduce ? 1 : 1 - Math.exp(-dt * 9); r.ca += (r.ta - r.ca) * k; r.cb += (r.tb - r.cb) * k;
      const f = (v, target) => (r.unit === ' m' && !target ? '–' : v.toLocaleString('en-GB', { minimumFractionDigits: r.dec, maximumFractionDigits: r.dec }) + (r.unit ? `<small>${r.unit}</small>` : '')); // no wall contact yet: no height to show
      const ha = f(r.ca, r.ta), hb = f(r.cb, r.tb); if (r.a.innerHTML !== ha) r.a.innerHTML = ha; if (r.b.innerHTML !== hb) r.b.innerHTML = hb;
      const m = r.ta + r.tb || 1; r.ba.style.width = `${(100 * r.ta) / m}%`; r.bb.style.width = `${(100 * r.tb) / m}%`;
    }
  };
  const setText = (s, t) => { const e = $(s); if (e.textContent !== t) e.textContent = t; };
  const setHTML = (s, t) => { const e = $(s); if (e.innerHTML !== t) e.innerHTML = t; };

  function size() {
    const r = stage.getBoundingClientRect(), nd = Math.min(window.devicePixelRatio || 1, r.width < 720 ? 3 : 2.5);
    if (r.width === W && r.height === H && nd === dpr) return; // iOS fires resize as its bars slide: resizing the canvas would clear it
    W = r.width; H = r.height; dpr = nd;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    onResize();
  }

  async function start() {
    const [rally, match] = await Promise.all([fetch(`${MEDIA}rally.json`).then((r) => r.json()), fetch(`${MEDIA}match.json`).then((r) => r.json())]);
    if (disposed) return;
    const floorH = homography([[0, 0], [6.4, 0], [6.4, 9.75], [0, 9.75]], [[2468, 1058], [3318, 1068], [3625, 1242], [1840, 1150]]);
    const P3 = (x, y, z) => {
      const [u, v] = floorH(x, y);
      return [u, v - (z * WALL_SCALE) / floorH.w(x, y)]; // phones: heights land on the plate's real wall lines
      const [a] = floorH(x - 0.5, y), [b] = floorH(x + 0.5, y); return [u, v - z * Math.abs(b - a)];
    };
    const T1 = rally.duration, shots = rally.shots, keys = [];
    shots.forEach((s, i) => {
      const hp = [s.pos[0] + (s.pos[0] < 3.2 ? 0.35 : -0.35), s.pos[1] - 0.25, 0.55];
      keys.push({ t: s.t, p: hp, kind: 'hit', i });
      if (s.type.startsWith('boast')) keys.push({ t: s.t + 0.4 * (s.wt - s.t), p: [hp[0] < 3.2 ? 0.06 : 6.34, Math.max(0.8, hp[1] - 1.4), 1.1], kind: 'side', i });
      keys.push({ t: s.wt, p: [clamp(s.wx, 0.06, 6.34), 0.02, s.wh], kind: 'wall', i });
      if (s.fb) keys.push({ t: s.ft, p: [clamp(s.fb[0], 0.06, 6.34), clamp(s.fb[1], 0.1, 9.7), 0], kind: 'floor', i });
      if (!shots[i + 1] && s.fb) keys.push({ t: T1, p: [clamp(s.fb[0], 0.06, 6.34) * 0.98, Math.min(9.6, s.fb[1] + 2.6), 0.05], kind: 'end', i });
    });
    const ballAt = (t) => {
      const j = keys.findIndex((k) => k.t > t); if (j <= 0) return j === 0 ? keys[0].p : keys[keys.length - 1].p;
      const a = keys[j - 1], b = keys[j], T = b.t - a.t, u = clamp((t - a.t) / T, 0, 1), tau = u * T, vz = (b.p[2] - a.p[2] + 0.5 * G * T * T) / T;
      return [lerp(a.p[0], b.p[0], u), lerp(a.p[1], b.p[1], u), Math.max(0, a.p[2] + vz * tau - 0.5 * G * tau * tau)];
    };
    const trackAt = (arr, t) => {
      const i = clamp(Math.floor(t * rally.fps), 0, arr.length - 2), a = arr[i], b = arr[i + 1], u = clamp((t - a[0]) / (b[0] - a[0] || 1), 0, 1);
      return [lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
    };
    const runDist = {};
    for (const w of ['A', 'B']) { let d = 0; runDist[w] = rally.tracks[w].map((p, i, a) => (i && (d += Math.hypot(p[1] - a[i - 1][1], p[2] - a[i - 1][2])), d)); }
    const distAt = (w, t) => runDist[w][clamp(Math.round(t * rally.fps), 0, runDist[w].length - 1)];
    const ring = (f, n = 32) => { const pts = []; for (let a = 0; a <= n; a++) pts.push(f(Math.cos((a / n) * 6.283), Math.sin((a / n) * 6.283))); return pts; };
    const floorRing = (x, y, r) => ring((c, s) => floorH(x + r * c, y + r * s));
    const wallRing = (x, z, r) => ring((c, s) => P3(x + r * c, 0.02, z + r * s));
    const lastBounce = keys.filter((k) => k.kind === 'floor').pop(), WB = floorH(lastBounce.p[0], lastBounce.p[1]);
    const flights = shots.map((s, i) => {
      const t1 = shots[i + 1] ? shots[i + 1].t : T1, pts = [];
      for (let u = s.t; u <= t1 + 1e-6; u += 1 / 60) pts.push([u, ...ballAt(u)]);
      return { who: s.who, t0: s.t, t1, pts };
    });
    const SQ_ALL = T1 + 0.8, PL = SQ_ALL + 3.4;
    const SHOWN = 5, FIRST = shots.length - SHOWN, T0 = shots[FIRST].t - 0.4; // only the closing exchange is played
    const pct = (g, w) => { const d = match.games[g][w]; return Math.round((100 * d.length) / d.drives); };
    const narrow = () => true; // every width draws the flat court; W >= 720 places it in the right-hand column
    let phoneFit = null, capH = 216, capBelow = 0, capNow = 0, capAt = 0; // phones: the finished stack fills the visible space under the caption
    const settlePhoneStack = () => { // the caption grows when its buttons arrive: the courts make way, never slide under it
      const now = performance.now(), vis = Math.min(H, visibleHeight());
      capBelow = capNow ? Math.max(capBelow, capH) : capH; // within a run the courts only ever make more room, so they don't wobble between beats
      capNow = capNow ? capNow + (capBelow - capNow) * (1 - Math.exp(-Math.min(0.05, (now - capAt) / 1000) * 14)) : capBelow; capAt = now;
      if (Math.abs(capBelow - capNow) < 0.3) capNow = capBelow;
      if (phoneFit && phoneFit.W === W && phoneFit.vis === vis && phoneFit.cap === capNow) return;
      phoneFit = { ...phoneStackFit(W, vis, wide() ? { left: fr.x, right: W - fr.x - fr.w, top: 91 + 12, bottom: 36, air: 12 } : { left: 8, right: 8, top: capNow, bottom: 30, air: 12 }), W, vis, cap: capNow };
    };
    const synth = (x, y, level) => { // in screen px
      if (narrow()) { const q = stackUnit(x, y, 0); return [phoneFit.ox + phoneFit.F * q[0], phoneFit.oy(level) + phoneFit.F * q[1]]; }
      const q = stackUnit(x, y, level * 3.3), F = Math.min(W * 0.56, H * 0.92);
      return [W * 0.6 + F * q[0], H * 0.47 + F * q[1]];
    };
    const regS = (x, y) => { const q = floorH(x, y); return [q[0] * CAMNOW.k + CAMNOW.ox, q[1] * CAMNOW.k + CAMNOW.oy]; };

    const SQ = {
      w: 3840, h: 2143, sy: 0.47, dur: PL + 6,
      cam: [[0, 2760, 860, 1.12], [4, 2760, 880, 1.28], [12, 2700, 900, 1.34], [20, 2820, 900, 1.3], [28, 2780, 880, 1.28], [29.9, WB[0], WB[1] - 140, 1.5], [T1 + 0.5, WB[0], WB[1] - 140, 1.5], [T1 + 2.2, 2760, 860, 1.12], [PL + 6, 2760, 860, 1.12]],
      beats: [
        [0, 'Every shot, tracked.', 'The closing shots of a real pro rally, Mueller v El Hammamy: each shot’s flight, both players tracked frame by frame, every wall contact and bounce.'],
        [SQ_ALL, 'The last five shots.', 'The last five shots, every wall contact and every bounce, in one picture.'],
        [PL, 'Stack the games and the pattern shows.', `One court per game, every drive’s bounce marked. Mueller found more length each game: ${pct(1, 'A')}%, then ${pct(2, 'A')}%, then ${pct(3, 'A')}% behind the short line.`],
        [PL + 4.2, 'Now picture your match.', 'Register your interest and we’ll analyse one of your matches for free.', true],
      ],
    };

    // Phones hold the whole court still and sharp: it sits in the hero's slot at rest and between caption and stats box in play.
    const band = { slot: H / 2, play: H / 2 };
    const measureBand = () => {
      if (slot) band.slot = hero.offsetTop + slot.offsetTop + W * 0.242; // pins the top of the court's fade to the slot's top, whatever the form below is doing
      band.play = (cap.offsetTop + (parseFloat(getComputedStyle(capIn).minHeight) || capIn.offsetHeight) + boxEl.offsetTop) / 2; // the reserved height, so caption text can't move the court
    };
    const COURT = { width: 1880, x: 2732, y: 745 }; // plate px: the floor's widest span plus a margin, and the court's centre
    const RALLY = { width: 2030, x: 2640, y: 804 }; // plate px in play: everything the rally draws, from the left of the back wall to the floor's right corner
    // Wide screens: words on the left, the court on the right, one still frame from rest through play.
    const BAND = { top: 0.15, bottom: 0.595 }, BAR = 91, scrim = $('.sq-scrim'), wideQuery = window.matchMedia('(min-width:720px),(max-height:500px) and (orientation:landscape)'), wide = () => wideQuery.matches;
    const fr = { x: 16, w: W - 32 };
    const placeFrame = () => {
      if (!wide()) { fr.x = 16; fr.w = W - 32; scrim.style.borderLeftWidth = scrim.style.borderRightWidth = ''; return; }
      const col = hero.getBoundingClientRect().right, m = hero.getBoundingClientRect().left, gap = Math.max(24, Math.min(56, W * 0.035)), ratio = (BAND.bottom - BAND.top) * SQ.h / RALLY.width;
      const avail = W - col - gap - m; fr.w = Math.round(Math.min(avail, (H - BAR - 112) / ratio)); fr.x = Math.round(col + gap + (avail - fr.w) / 2);
      const h = fr.w * ratio, top = Math.round(BAR + (H - BAR - 64 - h) / 2);
      band.slot = band.play = top + h / 2; scrim.style.borderLeftWidth = `${fr.x}px`; scrim.style.borderRightWidth = `${Math.round(W - fr.x - fr.w)}px`;
      stage.style.setProperty('--pic-x', `${fr.x}px`); stage.style.setProperty('--pic-w', `${fr.w}px`); stage.style.setProperty('--pic-top', `${top}px`); stage.style.setProperty('--pic-bot', `${Math.round(top + h)}px`); stage.style.setProperty('--pic-mid', `${Math.round(top + h / 2)}px`);
    };
    measureBand(); placeFrame(); onResize = () => { measureBand(); placeFrame(); wake(); };
    const camPhone = (u) => { if (wide()) { const k = fr.w / RALLY.width; return { k, ox: fr.x + fr.w / 2 - RALLY.x * k, oy: band.play - ((BAND.top + BAND.bottom) / 2) * SQ.h * k }; }
      const k = W / lerp(COURT.width, RALLY.width, u), x = lerp(COURT.x, RALLY.x, u), y = lerp(COURT.y, RALLY.y, u); return { k, ox: W / 2 - x * k, oy: lerp(band.slot, band.play, u) - y * k }; };
    function camAt(t) {
      const K = SQ.cam; const i = K.findIndex((k) => k[0] > t); let f;
      if (i <= 0) f = i === 0 ? K[0] : K[K.length - 1];
      else { const a = K[i - 1], b = K[i], u = easeIO(clamp((t - a[0]) / (b[0] - a[0]), 0, 1)); f = [t, lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)]; }
      const k = Math.max(W / SQ.w, H / SQ.h) * f[3];
      return { k, ox: clamp(0.64 * W - f[1] * k, W - SQ.w * k, 0), oy: clamp(SQ.sy * H - f[2] * k, H - SQ.h * k, 0) };
    }

    function draw(t) {
      const rt = Math.min(t, T1), whole = ramp(t, SQ_ALL, 1.2), pl = easeIO(ramp(t, PL, 2)), vis = 1 - pl, rw = rallyLW();
      if (vis > 0) {
        let ci = -1; flights.forEach((f, i) => { if (f.t0 <= rt) ci = i; });
        flights.forEach((f, i) => {
          if (i > ci || i < FIRST) return;
          const live = i === ci && rt < T1 && whole === 0, upto = f.pts.filter((p) => p[0] <= rt);
          if (upto.length < 2) return;
          const air = upto.map((p) => P3(p[1], p[2], p[3])), floor = upto.map((p) => floorH(p[1], p[2])).reverse();
          const age = ci - i, a = vis * (live ? 1 : lerp(Math.max(0.22, 0.62 - age * 0.07), 0.5, whole));
          const top = Math.min(...air.map((p) => p[1])), bot = Math.max(...floor.map((p) => p[1]));
          const g = ctx.createLinearGradient(0, top, 0, bot); g.addColorStop(0, `rgba(${COL[f.who]},${(live ? 0.3 : 0.16) * a})`); g.addColorStop(1, `rgba(${COL[f.who]},0)`);
          ctx.fillStyle = g; poly(air.concat(floor), true); ctx.fill();
          ctx.lineJoin = ctx.lineCap = 'round';
          ctx.strokeStyle = `rgba(${COL[f.who]},${a})`; ctx.lineWidth = (live ? 2.6 : 1.6) * PX * rw; poly(air); ctx.stroke();
          ctx.strokeStyle = `rgba(${COL[f.who]},${0.35 * a})`; ctx.lineWidth = PX * rw; poly(floor); ctx.stroke();
        });
        for (const k of keys) if (k.t <= rt && k.i >= FIRST && (k.kind === 'wall' || k.kind === 'floor')) {
          const e = easeOutQuint(clamp((rt - k.t) / 0.7, 0, 1)), who = shots[k.i].who, wall = k.kind === 'wall';
          ctx.globalAlpha = vis; ctx.fillStyle = wall ? `rgb(${COL[who]})` : '#fff';
          poly(wall ? wallRing(k.p[0], k.p[2], 0.08) : floorRing(k.p[0], k.p[1], 0.09), true); ctx.fill();
          if (e < 1) { ctx.strokeStyle = `rgba(${wall ? COL[who] : '255,255,255'},${1 - e})`; ctx.lineWidth = 2 * PX * rw; poly(wall ? wallRing(k.p[0], k.p[2], 0.12 + 0.5 * e) : floorRing(k.p[0], k.p[1], 0.12 + 0.5 * e), true); ctx.stroke(); }
          ctx.globalAlpha = 1;
        }
        // players: footprint ring, recent movement trail and a height marker
        const pa = vis * (1 - whole * 0.75);
        for (const w of ['A', 'B']) {
          ctx.globalAlpha = pa;
          const tr = []; for (let s = Math.max(0, rt - 2.4); s <= rt; s += 1 / 30) tr.push(floorH(...trackAt(rally.tracks[w], s)));
          ctx.lineCap = 'round'; tracer(tr, `rgba(${COL[w]},A)`, 3);
          const [x, y] = trackAt(rally.tracks[w], rt);
          ctx.fillStyle = `rgba(${COL[w]},.16)`; poly(floorRing(x, y, 0.34), true); ctx.fill();
          ctx.strokeStyle = `rgb(${COL[w]})`; ctx.lineWidth = 1.6 * PX * rw; poly(floorRing(x, y, 0.34), true); ctx.stroke();
          const foot = floorH(x, y), head = P3(x, y, 1.85), g = ctx.createLinearGradient(foot[0], foot[1], head[0], head[1]);
          g.addColorStop(0, `rgba(${COL[w]},.9)`); g.addColorStop(1, `rgba(${COL[w]},0)`);
          ctx.strokeStyle = g; ctx.lineWidth = 1.4 * PX * rw; ctx.beginPath(); ctx.moveTo(...foot); ctx.lineTo(...head); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (rt < T1 - 0.02 && whole === 0) { const bp = P3(...ballAt(rt)); if (narrow()) { ctx.fillStyle = 'rgb(253,71,70)'; ctx.beginPath(); ctx.arc(bp[0], bp[1], 4 * PX, 0, 7); ctx.fill(); } else glowDot(bp[0], bp[1], 5 * PX, 'rgba(253,71,70,A)', 3.2); }
      }
      // the match: one court per game lifts off the floor and stacks, drive bounces as a heatmap
      if (pl > 0) {
        ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const px0 = PX; PX = 1;
        ctx.fillStyle = `rgba(5,7,13,${(narrow() ? 1 : 0.72) * pl})`; ctx.fillRect(0, 0, W, H);
        if (narrow() && phoneFit && plate.complete) { // one dim picture of the court behind all three, as in the stacked courts section
          const ch = (phoneFit.mid(0) - phoneFit.mid(2)) / 2 - 12, top = phoneFit.mid(2) - ch / 2 - 6, dh = 2 * (ch + 12) + ch + 12, dw = fr.w;
          const iw = plate.naturalWidth, ih = plate.naturalHeight, sh = ih * 0.455, sw = sh * (dw / dh);
          ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 0.08 * pl; ctx.drawImage(plate, iw * 0.47 - sw / 2, ih * 0.13, sw, sh, fr.x, top, dw, dh); ctx.restore();
        }
        if (narrow()) settlePhoneStack();
        const labels = []; // drawn after every court so the next plane can't paint over them
        [3, 2, 1].forEach((g) => {
          const ge = easeIO(ramp(t, PL + (3 - g) * 0.3, 2)), level = 3 - g;
          const pt = (x, y) => { const a = regS(x, y), b = synth(x, y, level); return [lerp(a[0], b[0], ge), lerp(a[1], b[1], ge)]; };
          const de = ramp(t, PL + 1.6 + (3 - g) * 0.45, 1.2);
          if (narrow()) drawPhoneCourt(ctx, pt, match.games[g], { reveal: de, alpha: pl, dpr, cw: phoneFit.cw });
          else {
            const outline = [pt(0, 0), pt(6.4, 0), pt(6.4, 9.75), pt(0, 9.75)];
            ctx.fillStyle = `rgba(47,111,214,${0.2 * pl})`; poly(outline, true); ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${0.55 * pl})`; ctx.lineWidth = 1.2 * LW; poly(outline, true); ctx.stroke();
            ctx.strokeStyle = `rgba(255,255,255,${0.3 * pl})`; COURT_LINES.forEach((l) => { poly(l.map((p) => pt(...p))); ctx.stroke(); });
            for (const w of ['A', 'B']) {
              const pts = match.games[g][w].pts.filter((p) => p[2].includes('drive')), n = Math.round(de * pts.length);
              for (let j = 0; j < n; j++) { // soft glow first so overlapping bounces build heat
                const q = pt(pts[j][0], pts[j][1]), hg = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 11);
                hg.addColorStop(0, `rgba(${COL[w]},.28)`); hg.addColorStop(1, `rgba(${COL[w]},0)`);
                ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(q[0], q[1], 11, 0, 7); ctx.fill();
              }
              ctx.fillStyle = `rgba(${COL[w]},.95)`;
              for (let j = 0; j < n; j++) { const q = pt(pts[j][0], pts[j][1]); ctx.beginPath(); ctx.arc(q[0], q[1], 2.3, 0, 7); ctx.fill(); }
            }
          }
          if (de > 0 && stackFontsReady()) labels.push(() => {
            const q = pt(6.4, 4.4);
            if (narrow()) { drawPhoneLabel(ctx, phoneFit.labelX, lerp(q[1], phoneFit.mid(level), ge), g, pct(g, 'A'), pct(g, 'B'), de); return; }
            ctx.globalAlpha = de;
            const lx = q[0] + 26;
            text(`Game ${g}`, lx, q[1] - 12, 12.5, 'rgba(255,255,255,.7)');
            ctx.font = '600 22px Outfit'; ctx.fillStyle = `rgb(${COL.A})`; ctx.fillText(`${pct(g, 'A')}%`, lx, q[1] + 12);
            const wa = ctx.measureText(`${pct(g, 'A')}%`).width; ctx.font = '450 15px Outfit'; ctx.fillStyle = `rgba(${COL.B},.95)`;
            ctx.fillText(`${pct(g, 'B')}%`, lx + 10 + wa, q[1] + 13);
            ctx.globalAlpha = 1;
          });
        });
        labels.forEach((draw) => draw());
        if (narrow() && stackFontsReady() && labels.length) { // the stats box has gone by now: the colours still need naming
          const a = ramp(t, PL + 1.6, 1.2), y = Math.min(H, visibleHeight()) - 15;
          ctx.globalAlpha = a; ctx.font = '400 15px Outfit, system-ui, sans-serif'; ctx.textBaseline = 'middle';
          const m = ctx.measureText(surname.A).width, e = ctx.measureText(surname.B).width;
          let x = fr.x;
          for (const [w, tw] of [['A', m], ['B', e]]) {
            ctx.fillStyle = `rgb(${COL[w]})`; ctx.beginPath(); ctx.arc(x + 5, y, 5, 0, 7); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.fillText(surname[w], x + 18, y);
            x += 18 + tw + 20;
          }
          ctx.font = '400 13px Outfit, system-ui, sans-serif'; const key = '% past the short line', kw = ctx.measureText(key).width;
          if (x + kw <= fr.x + fr.w) { ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.fillText(key, fr.x + fr.w - kw, y); }
          ctx.globalAlpha = 1;
        }
        PX = px0; ctx.restore();
      }
      else capNow = 0;
      // broadcast head-to-head box
      if (t >= PL) {
        setHTML('.sq-ctx', 'Men’s pros<br>Whole match'); boxEl.style.setProperty('--hit', '#fff');
        setHTML('.sq-event', 'Drives behind the short line <span class="sub">· by game</span>');
        [1, 2, 3].forEach((g) => h2h(g - 1, `Game ${g}`, pct(g, 'A'), pct(g, 'B'), 0, '%'));
        const tot = (w) => { let n = 0, l = 0; [1, 2, 3].forEach((g) => { n += match.games[g][w].drives; l += match.games[g][w].length; }); return Math.round((100 * l) / n); };
        h2h(3, 'Match', tot('A'), tot('B'), 0, '%');
        setText('.sq-note', 'Dots on the courts: where each drive bounced.');
        return;
      }
      let si = 0; shots.forEach((s, i) => { if (s.t <= rt) si = i; });
      setHTML('.sq-ctx', 'Men’s pros<br>Rally 38'); setText('.sq-note', 'Real tracking data. Ball, both players and every contact.');
      const sh = (w) => shots.filter((s, i) => i >= FIRST && s.t <= rt && s.who === w);
      const wallAvg = (w) => { const l = sh(w).filter((s) => s.wt <= rt); return l.length ? l.reduce((a, s) => a + s.wh, 0) / l.length : 0; };
      const deep = (w) => sh(w).filter((s) => s.fb && s.ft <= rt && s.fb[1] > 5.44).length;
      h2h(0, 'Shots', sh('A').length, sh('B').length);
      h2h(1, 'Distance run', distAt('A', rt) - distAt('A', T0), distAt('B', rt) - distAt('B', T0), 1, ' m');
      h2h(2, 'Height on the wall', wallAvg('A'), wallAvg('B'), 2, ' m');
      h2h(3, 'Past the short line', deep('A'), deep('B'));
      if (t >= SQ_ALL) { setHTML('.sq-event', `The finish <span class="sub">· last ${SHOWN} of ${shots.length} shots</span>`); boxEl.style.setProperty('--hit', `rgb(${COL.B})`); }
      else if (rt >= 29.67) { setHTML('.sq-event', `Winner <span class="sub">· ${surname[rally.winner]}</span>`); boxEl.style.setProperty('--hit', `rgb(${COL[rally.winner]})`); }
      else { setHTML('.sq-event', `${shotName(shots[si].type)} <span class="sub">· shot ${si + 1} of ${shots.length}</span>`); boxEl.style.setProperty('--hit', `rgb(${COL[shots[si].who]})`); }
    }

    const resolve = (pos) => {
      let a = 0;
      for (const [kind, len] of SEG) {
        if (pos < a + len || kind === 'hold') {
          const u = clamp((pos - a) / len, 0, 1);
          if (kind === 'hero') return { t: T0, hero: u };
          if (kind === 'rally') return { t: T0 + u * (SQ_ALL - T0), hero: 1 };
          if (kind === 'play') return { t: SQ_ALL + u * (SQ.dur - SQ_ALL), hero: 1 };
          return { t: SQ.dur, hero: 1 };
        }
        a += len;
      }
      return { t: SQ.dur, hero: 1 };
    };

    // seconds each segment takes to play: the rally runs in real time, the stacked games a touch faster
    const secs = { hero: 0.8, rally: SQ_ALL - T0, play: (SQ.dur - SQ_ALL) / 1.15, hold: 1 };
    const segAt = (p) => { let a = 0; for (const s of SEG) { if (p < a + s[1]) return s; a += s[1]; } return SEG[SEG.length - 1]; };
    let last = performance.now(), beatKey = '', capTimer = 0;
    const setBeat = (t) => {
      let b = SQ.beats[0]; for (const x of SQ.beats) if (t >= x[0]) b = x;
      if (b[1] === beatKey) return; const first = !beatKey; beatKey = b[1];
      const apply = () => { onBeat?.({ title: b[1], body: b[2], cta: !!b[3], index: SQ.beats.indexOf(b) }); };
      if (first || reduce) { apply(); return; }
      capIn.classList.add('out'); clearTimeout(capTimer);
      capTimer = setTimeout(() => { apply(); capIn.classList.remove('out'); capIn.classList.add('pre'); requestAnimationFrame(() => requestAnimationFrame(() => capIn.classList.remove('pre'))); }, 300);
    };

    function frame(now) {
      if (disposed) return;
      const dt = clamp((now - last) / 1000, 0, 0.05); last = now;
      if (dir) {
        const [kind, len] = segAt(dir > 0 ? pos : pos - 1e-6);
        pos += (dir * dt * len) / secs[kind];
        if (pos >= END) { pos = END; dir = 0; }
        if (pos <= 0) { pos = 0; dir = 0; }
      }
      const st = resolve(pos);
      const breathe = !narrow() && st.hero < 1 ? 1 + 0.012 * Math.sin(now / 2600) * (1 - st.hero) : 1;
      const c = narrow() ? camPhone(easeIO(clamp(st.hero * 1.4, 0, 1))) : camAt(st.t);
      if (breathe !== 1) { c.k *= breathe; c.ox = clamp(c.ox - (breathe - 1) * W * 0.5, W - SQ.w * c.k, 0); c.oy = clamp(c.oy - (breathe - 1) * H * 0.5, H - SQ.h * c.k, 0); }
      plate.style.transform = `translate3d(${c.ox}px,${c.oy}px,0) scale(${c.k})`; plate.style.visibility = 'visible';
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      CAMNOW = c; ctx.setTransform(dpr * c.k, 0, 0, dpr * c.k, dpr * c.ox, dpr * c.oy); PX = 1 / c.k; draw(st.t);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const h = st.hero, ho = clamp(1 - h * 2.2, 0, 1);
      // at rest the hero carries no inline opacity, so nothing can leave the form half-transparent
      hero.style.opacity = ho === 1 ? '' : ho; stage.style.setProperty('--ho', ho); hero.style.setProperty('--lift', `${h * 60}px`); hero.style.visibility = ho ? 'visible' : 'hidden';
      stage.classList.toggle('is-playing', h > 0);
      cv.style.opacity = narrow() ? 1 - ho : ''; // phones show the clean court at rest; the tracking arrives with Play
      const co = clamp((h - 0.55) / 0.35, 0, 1);
      cap.style.opacity = co; cap.style.visibility = co ? 'visible' : 'hidden';
      boxEl.style.opacity = narrow() || H < 500 ? co * (1 - ramp(st.t, PL, 1)) : co; // phones: the stacked courts need the room
      if (co > 0) setBeat(st.t);
      cap.style.setProperty('--p', narrow() ? (st.t - T0) / (SQ.dur - T0) : st.t / SQ.dur); // phones: the line fills from empty over what actually plays
      tickH2H(dt);
      // nothing moving or nothing on screen: let the phone rest until play, stop, resize or scroll back
      still = dir ? 0 : still + 1;
      const rest = narrow() ? (!onScreen && dir >= 0) || still > 60 : !dir && !onScreen; // phones hold a rally off screen; a closing fade always finishes
      raf = rest ? 0 : requestAnimationFrame(frame);
    }
    let still = 0;
    wake = () => { still = 0; if (raf || disposed) return; last = performance.now(); raf = requestAnimationFrame(frame); };
    const seen = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; if (onScreen) wake(); });
    seen.observe(stage);
    const capSize = new ResizeObserver(() => { capH = cap.offsetTop + capIn.offsetHeight + 20; wake(); });
    capSize.observe(capIn);
    cleanups.push(() => capSize.disconnect());
    loadStackFonts().then(() => wake());
    cleanups.push(() => seen.disconnect());
    wake();
    cleanups.push(() => clearTimeout(capTimer));
  }

  const cleanups = [];
  size();
  window.addEventListener('resize', size);
  plate.decode?.().catch(() => {});
  start().catch(() => { root.classList.add('sq-static'); });
  return {
    play() { if (pos >= END) pos = 1; dir = 1; onPlaying?.(true); wake(); }, // replays skip the hero fade
    stop() { pos = Math.min(pos, 1); dir = -1; onPlaying?.(false); wake(); },
    destroy() { disposed = true; fold.remove(); cancelAnimationFrame(raf); window.removeEventListener('resize', size); cleanups.forEach((f) => f()); rowsEl.replaceChildren(); },
  };
}
