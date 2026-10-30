import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SQUASH_COURT, COURT_FLOOR_LINES } from '../src/lib/squashCourt.js';
import { mannequinSVG } from './sports-mannequin.mjs';

// All markings, contact points and ball shadows share a court projection.
// Squash dimensions are shared with the site's existing regulation court.
// Tennis: https://www.itftennis.com/en/about-us/organisation/tennis-glossary/
// Cricket: MCC Laws 6–8, rectangular pitch 20.12 × 3.05 m.
const DURATION = 10;
const CHAPTER = 2.5;
const HOLD = 1.9;
const HIT = .18;
const FINISH = 1.68;
const GRAVITY = 9.81;
const INK = '#656963';
const RED = '#c93638';
const n = (value) => String(Number(value.toFixed(4)));
const p = (point) => point.map(n).join(' ');
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const subtract = (a, b) => a.map((v, i) => v - b[i]);

function projection(width, length, vertical = .72) {
  const scale = 350 / (.94 * width + .66 * length);
  const origin = [295 - scale * (.94 * width - .66 * length) / 2,
    185 - scale * (.30 * width + .44 * length) / 2];
  const project = (x, y, z = 0) => [origin[0] + scale * (.94 * x - .66 * y),
    origin[1] + scale * (.30 * x + .44 * y - vertical * z)];
  return project;
}

const squash = projection(SQUASH_COURT.width, SQUASH_COURT.length, .62);
const tennis = projection(10.97, 23.77);
const cricketPitch = projection(3.05, 20.12);
const CRICKET_ZOOM = .86;
const cricket = (...point) => cricketPitch(...point).map((value, axis) => [295, 185][axis] + (value - [295, 185][axis]) * CRICKET_ZOOM);
const golf = projection(13.5, 9.5);

function line(a, b) {
  return `M${p(a)} C${p(mix(a, b, 1 / 3))} ${p(mix(a, b, 2 / 3))} ${p(b)}`;
}

function polyline(points, segments = points.length - 1, closed = false) {
  const count = points.length - 1;
  if (segments % count) throw new Error('Polyline subdivisions must preserve the corners.');
  const divided = [points[0]];
  for (let i = 0; i < count; i++) {
    for (let j = 1; j <= segments / count; j++) divided.push(mix(points[i], points[i + 1], j / (segments / count)));
  }
  return `M${p(divided[0])}` + divided.slice(1).map((b, i) => {
    const a = divided[i];
    return ` C${p(mix(a, b, 1 / 3))} ${p(mix(a, b, 2 / 3))} ${p(b)}`;
  }).join('') + (closed ? ' Z' : '');
}

const pair = (a, b) => line(...a) + ' ' + line(...b);
const splitLine = (a, b) => polyline([a, b], 2);
const rect = (project, x1, y1, x2, y2) => [project(x1, y1), project(x2, y1), project(x2, y2), project(x1, y2), project(x1, y1)];
const collapsed = line([295, 185], [295, 185]);
const worldLine = (project, a, b) => line(project(...a), project(...b));

function curve(project, start, controls, close = false) {
  return `M${p(project(...start))}` + controls.map((part) => ' C' + part.map((c) => p(project(...c))).join(' ')).join('') + (close ? ' Z' : '');
}

function oval(centre, major, minor, rotation) {
  const step = Math.PI / 4;
  const handle = 4 / 3 * Math.tan(step / 4);
  const rotate = ([x, y]) => [x * Math.cos(rotation) - y * Math.sin(rotation), x * Math.sin(rotation) + y * Math.cos(rotation)];
  const at = (angle) => rotate([major * Math.cos(angle), minor * Math.sin(angle)]).map((v, axis) => v + centre[axis]);
  const tangent = (angle) => rotate([-major * Math.sin(angle), minor * Math.cos(angle)]);
  let result = `M${p(at(-Math.PI / 2))}`;
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI / 2 + i * step;
    const b = a + step;
    const from = at(a);
    const to = at(b);
    const t1 = tangent(a);
    const t2 = tangent(b);
    result += ` C${p(from.map((v, axis) => v + handle * t1[axis]))} ${p(to.map((v, axis) => v - handle * t2[axis]))} ${p(to)}`;
  }
  return result + ' Z';
}

function field() {
  return { paths: [], opacity: [] };
}

function setField(result, path, opacity = .65) {
  result.paths.push(path);
  result.opacity.push(opacity);
}

const squashField = field();
const sw = SQUASH_COURT.width;
const sl = SQUASH_COURT.length;
setField(squashField, polyline(rect(squash, 0, 0, sw, sl), 8, true), .85);
setField(squashField, polyline([
  squash(0, sl), squash(0, sl, SQUASH_COURT.backOut),
  squash(0, 0, SQUASH_COURT.frontOut), squash(sw, 0, SQUASH_COURT.frontOut), squash(sw, 0),
], 8));
setField(squashField, splitLine(squash(0, 0, SQUASH_COURT.service), squash(sw, 0, SQUASH_COURT.service)));
setField(squashField, splitLine(squash(0, 0, SQUASH_COURT.tin), squash(sw, 0, SQUASH_COURT.tin)));
// Both 1.6 m service boxes are attached to the short line and side wall.
setField(squashField, pair(...COURT_FLOOR_LINES.slice(0, 2).map((points) => points.map((pt) => squash(...pt)))));
for (const box of COURT_FLOOR_LINES.slice(2)) {
  setField(squashField, pair([squash(...box[0]), squash(...box[1])], [squash(...box[1]), squash(...box[2])]));
}
setField(squashField, worldLine(squash, [0, 0], [0, 0, SQUASH_COURT.frontOut]));
for (let i = 1; i < 8; i++) setField(squashField, collapsed, 0);

const tennisField = field();
const tw = 10.97;
const tl = 23.77;
const singles = (tw - 8.23) / 2;
const serviceY = tl / 2 - 6.4;
setField(tennisField, polyline(rect(tennis, 0, 0, tw, tl), 8, true), .85);
setField(tennisField, polyline(rect(tennis, singles, 0, tw - singles, tl), 8));
// A slightly sagging net; the centre is 0.914 m above the floor.
const netLeft = tennis(-.5, tl / 2, 1.07);
const netRight = tennis(tw + .5, tl / 2, 1.07);
const netMiddle = tennis(tw / 2, tl / 2, .914);
setField(tennisField, `M${p(netLeft)} C${p(mix(netLeft, netMiddle, .33))} ${p(mix(netLeft, netMiddle, .67))} ${p(netMiddle)} C${p(mix(netMiddle, netRight, .33))} ${p(mix(netMiddle, netRight, .67))} ${p(netRight)}`, .8);
setField(tennisField, splitLine(tennis(-.5, tl / 2), tennis(tw + .5, tl / 2)), .35);
setField(tennisField, pair([tennis(tw / 2, serviceY), tennis(tw / 2, tl / 2)], [tennis(tw / 2, tl / 2), tennis(tw / 2, tl - serviceY)]));
for (const y of [serviceY, tl - serviceY]) {
  setField(tennisField, pair([tennis(singles, y), tennis(tw / 2, y)], [tennis(tw / 2, y), tennis(tw - singles, y)]));
}
for (const x of [-.5, tw + .5]) setField(tennisField, worldLine(tennis, [x, tl / 2], [x, tl / 2, 1.12]), .8);
for (let i = 1; i <= 6; i++) {
  const x = -.5 + (tw + 1) * i / 7;
  setField(tennisField, worldLine(tennis, [x, tl / 2], [x, tl / 2, .914 + .156 * Math.abs(2 * i / 7 - 1)]), .24);
}

const cricketField = field();
const cw = 3.05;
const cl = 20.12;
const middle = cw / 2;
// A close boundary follows the pitch's perspective without dwarfing it.
setField(cricketField, oval([295, 185], 188, 80, Math.atan2(-.44, .66)), .58);
setField(cricketField, polyline(rect(cricket, 0, 0, cw, cl), 8), .85);
for (const y of [1.22, cl - 1.22]) setField(cricketField, splitLine(cricket(middle - 1.83, y), cricket(middle + 1.83, y)), .8);
setField(cricketField, pair([cricket(middle - 1.32, 0), cricket(middle + 1.32, 0)], [cricket(middle - 1.32, cl), cricket(middle + 1.32, cl)]), .85);
for (const y of [0, cl]) {
  const direction = y === 0 ? 1 : -1;
  setField(cricketField, pair([cricket(middle - 1.32, y - direction * .5), cricket(middle - 1.32, y + direction * 1.55)], [cricket(middle + 1.32, y - direction * .5), cricket(middle + 1.32, y + direction * 1.55)]));
}
for (const y of [0, cl]) for (const x of [middle - .1143, middle, middle + .1143]) setField(cricketField, worldLine(cricket, [x, y], [x, y, .711]), .95);
for (const y of [0, cl]) setField(cricketField, worldLine(cricket, [middle - .14, y, .72], [middle + .14, y, .72]), .95);

const golfField = field();
const greenStart = [3, .1];
const green = [
  [[4, -.2], [5.7, -.1], [7.1, .3]],
  [[9, .7], [12.7, 1], [12.9, 2.8]],
  [[13.3, 4], [11.6, 4.9], [11.2, 6.2]],
  [[10.9, 7.8], [11.6, 9.3], [9, 9.9]],
  [[7.5, 10.1], [5.8, 8.5], [4.7, 8.7]],
  [[3.5, 8.9], [1.8, 9.8], [.7, 8.1]],
  [[-.3, 6.2], [1.4, 4.9], [1, 3.9]],
  [[.3, 2.2], [1.1, .4], [3, .1]],
];
setField(golfField, curve(golf, greenStart, green, true), .85);
const inset = (pt) => [6.5 + (pt[0] - 6.5) * .945, 4.8 + (pt[1] - 4.8) * .925];
setField(golfField, curve(golf, inset(greenStart), green.map((segment) => segment.map(inset))), .5);
const hole = golf(9.8, 3);
const pin = [hole[0], hole[1] - 37];
const flagTip = [pin[0] + 19, pin[1] + 6];
const flagBase = [pin[0], pin[1] + 12];
setField(golfField, splitLine(hole, pin), .85);
setField(golfField, splitLine(pin, flagTip), .85);
setField(golfField, pair([flagTip, flagBase], [flagBase, pin]), .85);
// A separate crescent bunker beside the green, with a narrow sculpted lip.
const bunkerOffset = (pt) => [pt[0] - 1.68, pt[1] - .58];
const bunker = [
  [[-.8, 4.7], [-1.2, 5.8], [-.65, 6.7]],
  [[-.2, 7.5], [.6, 8.1], [1.05, 7.7]],
  [[1.5, 7.3], [.65, 6.5], [.4, 6.05]],
  [[.05, 5.45], [.8, 4.85], [.5, 4.5]],
  [[.2, 4.1], [-.1, 4.15], [-.3, 4.3]],
  [[-.5, 4.4], [-.6, 4.55], [-.65, 4.7]],
];
setField(golfField, pair([golf(...bunkerOffset([-.6, 5])), golf(...bunkerOffset([-.7, 5.9]))], [golf(...bunkerOffset([-.7, 5.9])), golf(...bunkerOffset([-.25, 6.8]))]), .28);
setField(golfField, pair([hole, hole], [hole, hole]), 0);
let previous = [-.65, 4.7];
for (const segment of bunker) {
  setField(golfField, curve(golf, bunkerOffset(previous), [segment.map(bunkerOffset)]), .7);
  previous = segment[2];
}
for (let i = 0; i < 2; i++) setField(golfField, collapsed, 0);

// Constant horizontal velocity and gravity between discrete contacts. Every
// bounce changes vertical velocity at z=0; wall contacts reverse only y.
function ballistic(start, end, duration) {
  const velocity = [(end[0] - start[0]) / duration, (end[1] - start[1]) / duration,
    (end[2] - start[2] + .5 * GRAVITY * duration ** 2) / duration];
  return { duration, velocity, at: (t) => [start[0] + velocity[0] * t, start[1] + velocity[1] * t,
    start[2] + velocity[2] * t - .5 * GRAVITY * t * t] };
}

function continueFlight(start, velocity, duration) {
  return { duration, velocity, at: (t) => [start[0] + velocity[0] * t, start[1] + velocity[1] * t,
    Math.max(0, start[2] + velocity[2] * t - .5 * GRAVITY * t * t)] };
}

function combine(parts) {
  const duration = parts.reduce((sum, part) => sum + part.duration, 0);
  const boundaries = [0];
  for (const part of parts) boundaries.push(boundaries.at(-1) + part.duration);
  return { duration, boundaries, at(time) {
    let remainder = Math.max(0, Math.min(duration, time));
    for (const part of parts) {
      if (remainder <= part.duration + 1e-8) return part.at(Math.min(remainder, part.duration));
      remainder -= part.duration;
    }
    return parts.at(-1).at(parts.at(-1).duration);
  } };
}

const squashOut = ballistic([1.7, 7.1, .7], [3.3, 0, .9], .35);
const wallVelocity = [squashOut.velocity[0] * .98, -squashOut.velocity[1] * .9,
  (squashOut.velocity[2] - GRAVITY * .35) * .95];
const wallToFloorTime = (wallVelocity[2] + Math.sqrt(wallVelocity[2] ** 2 + 2 * GRAVITY * .9)) / GRAVITY;
const squashWall = continueFlight([3.3, 0, .9], wallVelocity, wallToFloorTime);
const squashBouncePoint = squashWall.at(wallToFloorTime);
const squashUp = continueFlight(squashBouncePoint, [wallVelocity[0] * .98, wallVelocity[1] * .98,
  -(wallVelocity[2] - GRAVITY * wallToFloorTime) * .7], .13);
const squashFlight = combine([squashOut, squashWall, squashUp]);

const tennisOut = ballistic([3, 23.4, 1], [7.1, 4.3, 0], .84);
const tennisBounce = continueFlight([7.1, 4.3, 0], [tennisOut.velocity[0] * .94,
  tennisOut.velocity[1] * .94, -(tennisOut.velocity[2] - GRAVITY * .84) * .75], .15);
const returnPoint = tennisBounce.at(.15);
const tennisReturn = ballistic(returnPoint, [3.15, 20.5, 0], .85);
const tennisReturnBounce = continueFlight([3.15, 20.5, 0], [tennisReturn.velocity[0] * .94,
  tennisReturn.velocity[1] * .94, -(tennisReturn.velocity[2] - GRAVITY * .85) * .75], .12);
const tennisFlight = combine([tennisOut, tennisBounce, tennisReturn, tennisReturnBounce]);

const delivery = ballistic([1.7, 20.12, 3.9], [1.5, 4.5, 0], .44);
const deliveryBounce = continueFlight([1.5, 4.5, 0], [delivery.velocity[0] * .95, delivery.velocity[1] * .95,
  -(delivery.velocity[2] - GRAVITY * .44) * .55], .09);
const batPoint = deliveryBounce.at(.09);
const driveDuration = (1.2 + Math.sqrt(1.2 ** 2 + 2 * GRAVITY * batPoint[2])) / GRAVITY;
const drive = continueFlight(batPoint, [.6, 25, 1.2], driveDuration);
const driveEnd = drive.at(driveDuration);
const driveRoll = { duration: .23, at(t) {
  return [driveEnd[0] + .6 * t, driveEnd[1] + 22 * t - 4 * t * t, 0];
} };
const cricketFlight = combine([delivery, deliveryBounce, drive, driveRoll]);

const golfStart = [4.2, 6.8, 0];
const golfEnd = [9.8, 3, 0];
const puttDirection = subtract(golfEnd, golfStart);
const puttDistance = Math.hypot(puttDirection[0], puttDirection[1]);
const puttNormal = [-puttDirection[1] / puttDistance, puttDirection[0] / puttDistance];
const golfFlight = { duration: 2.8, boundaries: [0, 2.8], at(t) {
  // A shallow break follows the green's slope and eases into the cup.
  const fraction = Math.max(0, Math.min(1, t / 2.8));
  const progress = 2 * fraction - fraction * fraction;
  const bend = 4 * 1.6 * progress * (1 - progress);
  const position = mix(golfStart, golfEnd, progress);
  return [position[0] + puttNormal[0] * bend, position[1] + puttNormal[1] * bend, 0];
} };

const chapterTime = (flight, physicalTime) => HIT + physicalTime / flight.duration * (FINISH - HIT);
const scenes = [
  { name: 'Squash', project: squash, field: squashField, flight: squashFlight, split: squashFlight.duration,
    players: [
      { foot: [1.1, 7.4], contact: squashFlight.at(0), events: [HIT], equipment: 'racket' },
      { foot: [5, 8.4], contact: squashFlight.at(squashFlight.duration), events: [FINISH], equipment: 'racket' },
    ] },
  { name: 'Tennis', project: tennis, field: tennisField, flight: tennisFlight, split: .99,
    players: [
      { foot: [2.3, 24], contact: tennisFlight.at(0), contacts: [tennisFlight.at(0), tennisFlight.at(tennisFlight.duration)], events: [HIT, FINISH], equipment: 'racket' },
      { foot: [8.05, .65], contact: returnPoint, events: [chapterTime(tennisFlight, .99)], equipment: 'racket' },
    ] },
  { name: 'Cricket', project: cricket, field: cricketField, flight: cricketFlight, split: .53,
    players: [
      { foot: [1.4, 20.25], contact: delivery.at(0), events: [HIT], equipment: 'bowling' },
      { foot: [1, .9], contact: batPoint, events: [chapterTime(cricketFlight, .53)], equipment: 'bat' },
    ] },
  { name: 'Golf', project: golf, field: golfField, flight: golfFlight, split: golfFlight.duration,
    players: [
      { foot: [3.7, 7.3], contact: golfStart, events: [HIT], equipment: 'putter' },
      { foot: [4.1, 2], contact: [4.1, 2, 0], events: [], equipment: 'putter' },
    ] },
];

function anim(attribute, entries, options = '') {
  const unique = new Map(entries.map(([time, value]) => [Number(time.toFixed(7)), value]));
  const keys = [...unique].sort((a, b) => a[0] - b[0]);
  if (keys[0][0] !== 0) keys.unshift([0, keys[0][1]]);
  if (keys.at(-1)[0] !== DURATION) keys.push([DURATION, keys[0][1]]);
  return `<animate attributeName="${attribute}" dur="${DURATION}s" repeatCount="indefinite" keyTimes="${keys.map(([t]) => Number((t / DURATION).toFixed(8))).join(';')}" values="${keys.map(([, v]) => typeof v === 'number' ? n(v) : v).join(';')}" ${options}/>`;
}

function morphEntries(values) {
  const entries = [[0, values[0]]];
  for (let i = 0; i < 4; i++) entries.push([i * CHAPTER + HOLD, values[i]], [(i + 1) * CHAPTER, values[(i + 1) % 4]]);
  return entries;
}

const morphEase = `calcMode="spline" keySplines="${Array(8).fill('.65 0 .35 1').join(';')}"`;
function visibility(index, max = 1) {
  const offset = index * CHAPTER;
  const entries = index === 0
    ? [[0, max], [1.76, max], [1.91, 0], [9.85, 0], [DURATION, max]]
    : [[0, 0], [offset - .15, 0], [offset, max], [offset + 1.76, max], [offset + 1.91, 0], [DURATION, 0]];
  return anim('opacity', entries);
}

const svg = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="65 -8 460 336" fill="none" role="img" aria-label="Squash, tennis, cricket and golf: two jointed athletes and their courts morph together in a continuous ten-second loop">
  <!-- Generated by scripts/generate-sports-morph.mjs. Transparent 10s loop.
       Courts and two persistent, articulated mannequins morph together.
       Shaded vector bodies are projected from fixed-length 3D skeletons. -->
  <g stroke="${INK}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">`];
for (let i = 0; i < squashField.paths.length; i++) {
  svg.push(`<path d="${squashField.paths[i]}" opacity="${squashField.opacity[i]}">${anim('d', morphEntries(scenes.map((scene) => scene.field.paths[i])), morphEase)}${anim('opacity', morphEntries(scenes.map((scene) => scene.field.opacity[i])))}</path>`);
}
svg.push('</g>');

// Trail geometry uses equal point counts for native SVG morph interpolation.
// Only the current shot is drawn; the previous shot fades at racket/bat contact.
function shotTimes(flight, start, end) {
  if (end - start < 1e-7) return Array(65).fill(start);
  const knots = [start, ...flight.boundaries.filter((time) => time > start + 1e-7 && time < end - 1e-7), end];
  const counts = knots.slice(1).map((time, i) => Math.max(1, Math.floor(64 * (time - knots[i]) / (end - start))));
  while (counts.reduce((sum, count) => sum + count, 0) < 64) {
    const longest = counts.map((count, i) => (knots[i + 1] - knots[i]) / count);
    counts[longest.indexOf(Math.max(...longest))]++;
  }
  return [start, ...counts.flatMap((count, i) => Array.from({ length: count }, (_, j) => knots[i] + (knots[i + 1] - knots[i]) * (j + 1) / count))];
}

for (let shot = 0; shot < 2; shot++) {
  const paths = [];
  const dashKeys = [];
  const opacityKeys = [];
  scenes.forEach((scene, index) => {
    const start = shot === 0 ? 0 : scene.split;
    const end = shot === 0 ? scene.split : scene.flight.duration;
    const times = shotTimes(scene.flight, start, end);
    const points = times.map((time) => scene.project(...scene.flight.at(time)));
    paths.push('M' + p(points[0]) + points.slice(1).map((pt) => ' L' + p(pt)).join(''));
    const lengths = [0];
    for (let i = 1; i < points.length; i++) lengths.push(lengths.at(-1) + Math.hypot(...subtract(points[i], points[i - 1])));
    const offset = index * CHAPTER;
    dashKeys.push([offset, 1]);
    const active = end > start + 1e-6;
    for (let i = 0; i < points.length; i++) {
      dashKeys.push([offset + chapterTime(scene.flight, times[i]), 1 - lengths[i] / (lengths.at(-1) || 1)]);
    }
    dashKeys.push([offset + 1.9, active ? 0 : 1], [offset + 2.49, 1]);
    const hitTime = chapterTime(scene.flight, start);
    const endTime = chapterTime(scene.flight, end);
    opacityKeys.push([offset, 0], [offset + Math.max(0, hitTime - .01), 0], [offset + hitTime + .015, active ? .72 : 0],
      [offset + endTime, active ? .72 : 0], [offset + Math.min(1.87, endTime + .17), 0], [offset + 2.49, 0]);
  });
  svg.push(`<path d="${paths[0]}" stroke="${RED}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" opacity="0">${anim('d', morphEntries(paths), morphEase)}${anim('stroke-dashoffset', dashKeys)}${anim('opacity', opacityKeys)}</path>`);
}

const mannequins = mannequinSVG(scenes, anim);
svg.push(mannequins.svg);

svg.push(`<ellipse cx="${n(hole[0])}" cy="${n(hole[1])}" rx="3.3" ry="1.6" fill="#434c43" opacity="0">${visibility(3)}</ellipse>`);

const frames = [];
scenes.forEach((scene, index) => {
  const times = new Set([0, scene.flight.duration, ...scene.flight.boundaries]);
  for (let i = 0; i <= 80; i++) times.add(scene.flight.duration * i / 80);
  const append = (time, position) => frames.push({ time, position: scene.project(...position), ground: scene.project(position[0], position[1]), height: position[2] });
  append(index * CHAPTER, scene.flight.at(0));
  for (const time of [...times].sort((a, b) => a - b)) append(index * CHAPTER + chapterTime(scene.flight, time), scene.flight.at(time));
  append(index * CHAPTER + HOLD, scene.flight.at(scene.flight.duration));
});
frames.push({ ...frames[0], time: DURATION });
const coords = (type, axis) => frames.map((frame) => [frame.time, frame[type][axis]]);
const ballVisibility = [];
scenes.forEach((scene, index) => {
  const offset = index * CHAPTER;
  ballVisibility.push([offset, 1], [offset + (index === 3 ? 1.62 : 1.72), 1], [offset + (index === 3 ? 1.7 : 1.86), 0], [offset + 2.46, 0]);
});
ballVisibility.push([DURATION, 1]);
svg.push(`<ellipse cx="${n(frames[0].ground[0])}" cy="${n(frames[0].ground[1])}" rx="2.3" ry=".8" fill="#434c43" opacity=".17">${anim('cx', coords('ground', 0))}${anim('cy', coords('ground', 1))}${anim('opacity', ballVisibility.map(([t, opacity]) => [t, opacity * .17]))}</ellipse>`);
svg.push(`<circle cx="${n(frames[0].position[0])}" cy="${n(frames[0].position[1])}" r="2.25" fill="${RED}">${anim('cx', coords('position', 0))}${anim('cy', coords('position', 1))}${anim('opacity', ballVisibility)}</circle>`);
svg.push(`<g fill="${INK}" font-family="Outfit, Arial, sans-serif" font-size="15" text-anchor="middle" aria-hidden="true">`);
scenes.forEach((scene, index) => svg.push(`<text x="295" y="316" opacity="${index === 0 ? 1 : 0}">${scene.name}${visibility(index)}</text>`));
svg.push('</g></svg>\n');

const target = fileURLToPath(new URL('../src/assets/sports-morph.svg', import.meta.url));
writeFileSync(target, svg.join('\n'));
process.stdout.write(`Generated sports-morph.svg (${Buffer.byteLength(svg.join('\n'))} bytes).\n`);

// A disposable visual review page exposes the native SVG clock through real
// controls, so all four courts and exact contact moments can be inspected.
if (process.argv.includes('--review')) {
  const contacts = scenes.flatMap((scene, index) => scene.players.flatMap((player, playerIndex) => player.events.map((time) => `<button data-time="${index * CHAPTER + time}">${scene.name} contact ${playerIndex + 1}</button>`))).join('');
  const review = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Sports motion review</title><style>body{margin:0;background:#f7f6f2;color:#434c43;font:16px Arial,sans-serif}main{max-width:800px;margin:32px auto}#art{max-width:660px;margin:auto}svg{display:block;width:100%;height:auto}nav{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:24px}button{padding:12px 18px;cursor:pointer;background:transparent;color:inherit;border:1px solid #ccc}input{width:100%}</style><main><div id="art">${svg.join('\n')}</div><nav>${scenes.map((scene, index) => `<button data-time="${index * CHAPTER + .9}">${scene.name}</button>`).join('')}<button id="play">Play loop</button></nav><input id="clock" aria-label="Animation time" type="range" min="0" max="10" step="0.01" value="0"><output id="time">0</output><nav>${contacts}</nav></main><script>const svg=document.querySelector('svg');const range=document.querySelector('#clock');const label=document.querySelector('#time');svg.pauseAnimations();function seek(t){svg.pauseAnimations();svg.setCurrentTime(Number(t));range.value=t;label.textContent=Number(t).toFixed(2)+' s'}document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>seek(b.dataset.time));range.oninput=()=>seek(range.value);document.querySelector('#play').onclick=()=>svg.unpauseAnimations();</script></html>`;
  writeFileSync(fileURLToPath(new URL('../.sports-morph-review.html', import.meta.url)), review);
}

export { scenes, chapterTime, squashBouncePoint, returnPoint, batPoint, mannequins };
