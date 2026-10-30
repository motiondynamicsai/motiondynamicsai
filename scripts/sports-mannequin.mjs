// Orthographic, articulated mannequins rendered as shaded vector geometry.
// The same two skeletons and SVG elements survive every sport transition.
const ELEVATION = Math.PI / 6;
const S = Math.sin(ELEVATION);
const C = Math.cos(ELEVATION);
const VIEW = [0, C, S];
const LIGHT = unit([-.55, -.45, 1]);
const UPPER_ARM = 11;
const FOREARM = 10.3;
const THIGH = 13.4;
const SHIN = 13;
const add = (a, b) => a.map((v, i) => v + b[i]);
const sub = (a, b) => a.map((v, i) => v - b[i]);
const mul = (a, s) => a.map((v) => v * s);
const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function unit(a) { const length = Math.hypot(...a); return a.map((v) => v / (length || 1)); }
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const smooth = (t) => t * t * (3 - 2 * t);
function morphEase(t) {
  // Match the court's cubic-bezier(.65, 0, .35, 1), including moving feet.
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const u = (lo + hi) / 2;
    const x = 3 * (1 - u) ** 2 * u * .65 + 3 * (1 - u) * u ** 2 * .35 + u ** 3;
    if (x < t) lo = u; else hi = u;
  }
  const u = (lo + hi) / 2;
  return 3 * (1 - u) * u ** 2 + u ** 3;
}
const num = (v) => String(Number(v.toFixed(2)));
const xy = (point) => [point[0], S * point[1] - C * point[2]];
const points = (list) => list.flatMap(xy).map(num).join(' ');
const pathLine = (a, b) => `M${xy(a).map(num).join(' ')} L${xy(b).map(num).join(' ')}`;

// A single pole vector chooses the elbow/knee's bend plane. Bone lengths stay
// fixed, including the sampled court-to-court movement between contact poses.
function twoBone(root, target, upper, lower, pole) {
  const delta = sub(target, root);
  const distance = Math.hypot(...delta);
  if (distance > upper + lower + .001 || distance < Math.abs(upper - lower) + .001) {
    throw new Error(`Unreachable mannequin joint: ${distance.toFixed(3)} / ${upper + lower}`);
  }
  const axis = unit(delta);
  let bend = sub(pole, mul(axis, dot(pole, axis)));
  if (Math.hypot(...bend) < .01) bend = cross(axis, [1, 0, .1]);
  bend = unit(bend);
  const along = (upper ** 2 - lower ** 2 + distance ** 2) / (2 * distance);
  const height = Math.sqrt(Math.max(0, upper ** 2 - along ** 2));
  return [root, add(add(root, mul(axis, along)), mul(bend, height)), target];
}

function worldPoint(scene, point) {
  const floor = scene.project(point[0], point[1]);
  const image = scene.project(...point);
  return [floor[0], floor[1] / S, (floor[1] - image[1]) / C];
}

function eventPose(player, time) {
  if (!player.events.length) return { angle: 0, contact: player.contact, effort: 0 };
  let previous = { time: 0, angle: -48, contact: player.contacts?.[0] || player.contact };
  const beats = [];
  player.events.forEach((event, index) => {
    const contact = player.contacts?.[index] || player.contact;
    beats.push({ time: Math.max(0, event - .12), angle: -48, contact },
      { time: event, angle: 0, contact }, { time: event + .15, angle: 42, contact },
      { time: event + .34, angle: 30, contact });
  });
  for (const next of beats) {
    if (time <= next.time) {
      const t = smooth(clamp((time - previous.time) / (next.time - previous.time || 1), 0, 1));
      return { angle: previous.angle + (next.angle - previous.angle) * t,
        contact: lerp(previous.contact, next.contact, t), effort: Math.sin(Math.PI * t) };
    }
    previous = next;
  }
  return { ...previous, effort: 0 };
}

function motionDirection(scene, player, contact) {
  if (!player.events.length) return unit([-1, -.7, 0]);
  const candidates = player.contacts || [player.contact];
  const contactIndex = candidates.reduce((best, value, index) => Math.hypot(...sub(value, contact)) < Math.hypot(...sub(candidates[best], contact)) ? index : best, 0);
  const physical = Math.max(0, (player.events[contactIndex] - .18) / 1.5 * scene.flight.duration);
  let from;
  let to;
  if (physical >= scene.flight.duration - .001) {
    from = scene.flight.at(scene.flight.duration);
    to = scene.flight.at(Math.max(0, scene.flight.duration - .002));
  } else {
    from = scene.flight.at(physical);
    to = scene.flight.at(Math.min(scene.flight.duration, physical + .002));
  }
  const delta = sub(worldPoint(scene, to), worldPoint(scene, from));
  return unit([delta[0], delta[1], clamp(delta[2], -3, 3)]);
}

function handTargets(state) {
  const { face, shaft, shoulderNear, shoulderFar, forward, side } = state;
  const toFace = sub(face, shoulderNear);
  const faceDistance = Math.hypot(...toFace);
  const faceAxis = unit(toFace);
  let wristNear = face;
  if (shaft > .001) {
    const gap = Math.abs(faceDistance - shaft);
    const softReach = (11 + gap + Math.sqrt((11 - gap) ** 2 + 4)) / 2;
    const reach = Math.min(softReach, faceDistance + shaft - .02);
    const along = (faceDistance ** 2 + reach ** 2 - shaft ** 2) / (2 * faceDistance);
    // The lateral component prevents the hand/tool triangle from changing
    // branch as a swing crosses the vertical shoulder line.
    const handPole = add(add(mul(forward, -.35), mul(side, .55)), [0, 0, -1]);
    const offAxis = unit(sub(handPole, mul(faceAxis, dot(handPole, faceAxis))));
    wristNear = add(shoulderNear, add(mul(faceAxis, along), mul(offAxis, Math.sqrt(Math.max(0, reach ** 2 - along ** 2)))));
  }
  const direction = unit(sub(face, wristNear));
  const freeHand = add(shoulderFar, add(mul(forward, state.bowling ? -3 : 3.8), [0, 0, -16]));
  const sharedGrip = sub(wristNear, mul(direction, 2.2));
  return { ...state, wristNear, wristFar: lerp(freeHand, sharedGrip, state.twoHands),
    armPoleNear: add(mul(side, .95), [0, 0, -.5]), armPoleFar: add(mul(side, -.95), [0, 0, -.5]) };
}

function stateAt(scene, player, time) {
  const action = eventPose(player, time);
  const base = worldPoint(scene, [...player.foot, 0]);
  const contact = worldPoint(scene, action.contact);
  const stroke = motionDirection(scene, player, action.contact);
  let forward = unit([contact[0] - base[0], contact[1] - base[1], 0]);
  if (player.equipment === 'bowling' || player.equipment === 'putter') forward = unit([stroke[0], stroke[1], 0]);
  if (!player.events.length) forward = unit([-1, -.7, 0]);
  // Keep the near and far limb identities stable in this fixed camera view.
  let side = [forward[1], -forward[0], 0];
  if (side[1] < 0) side = mul(side, -1);
  const bowling = player.equipment === 'bowling';
  const putting = player.equipment === 'putter';
  const resting = !player.events.length;
  const crouch = resting ? 0 : bowling ? .4 : putting ? 2.8 : 1.5;
  const weight = resting ? 0 : action.angle / 48 * 1.1;
  const pelvis = add(base, add(mul(forward, weight), [0, 0, 27 - crouch]));
  const chest = add(pelvis, add(mul(forward, resting ? .8 : putting ? 6 : 4.6), [0, 0, 17]));
  const shoulderNear = add(chest, mul(side, 5.5));
  const shoulderFar = add(chest, mul(side, -5.5));
  const hipNear = add(pelvis, mul(side, 3.3));
  const hipFar = add(pelvis, mul(side, -3.3));
  const ankleNear = add(base, add(mul(side, 7.5), add(mul(forward, bowling ? -6 : -2), [0, 0, 1.6])));
  const ankleFar = add(base, add(mul(side, -7.5), add(mul(forward, bowling ? 6 : 3), [0, 0, 1.6])));
  const radians = action.angle * Math.PI / 180;
  const amplitude = putting ? 5.2 : bowling ? 12 : 17;
  let face = add(contact, mul(stroke, Math.sin(radians) * amplitude));
  if (!putting && !bowling) face[2] += (action.angle > 0 ? 26 : 9) * (action.angle / 48) ** 2;
  if (bowling) {
    // A nearly straight overhead delivery, rotating through the shoulder.
    const release = sub(contact, shoulderNear);
    const theta = radians * .85;
    const horizontal = dot(release, forward);
    face = add(shoulderNear, add(mul(forward, horizontal * Math.cos(theta) + release[2] * Math.sin(theta)),
      add(mul(side, dot(release, side)), [0, 0, release[2] * Math.cos(theta) - horizontal * Math.sin(theta)])));
  }
  let shaft = bowling ? 0 : putting ? 29 : player.equipment === 'bat' ? 25 : 20;
  if (resting) {
    face = add(base, add(mul(side, 11), mul(forward, 1)));
    shaft = 26;
  }
  const twoHands = (putting || player.equipment === 'bat') && !resting;
  return handTargets({ base, forward, side, pelvis, chest, shoulderNear, shoulderFar, hipNear, hipFar,
    ankleNear, ankleFar, face, shaft, twoHands: Number(twoHands), bowling: Number(bowling),
    // The head and neck move with the torso rather than floating above a pose.
    neck: add(chest, [0, 0, 3.1]), head: add(chest, add(mul(forward, 1.2), [0, 0, 8.6])),
    toolWidth: bowling ? 0 : putting ? 4 : player.equipment === 'bat' ? 2.1 : 4.2,
    toolLength: bowling ? 0 : putting ? 1 : player.equipment === 'bat' ? 12 : 6.4,
    toolRound: player.equipment === 'racket' ? 1 : 0,
    toolFill: bowling || player.equipment === 'racket' ? 0 : .7 });
}

function blendStates(a, b, t) {
  const result = {};
  for (const key of Object.keys(a)) result[key] = Array.isArray(a[key]) ? lerp(a[key], b[key], t) : a[key] + (b[key] - a[key]) * t;
  result.forward = unit(result.forward);
  result.side = unit(result.side);
  // During a sport morph, interpolate arm orientation and flexion. Blending
  // hand targets across an overhead delivery would pull a wrist through its
  // shoulder. Forward kinematics preserves bone length and bend direction.
  const from = skeleton(a);
  const to = skeleton(b);
  result.armOverrideNear = blendArm(from.armNear, to.armNear, result.shoulderNear, t);
  result.armOverrideFar = blendArm(from.armFar, to.armFar, result.shoulderFar, t);
  result.wristNear = result.armOverrideNear[2];
  result.wristFar = result.armOverrideFar[2];
  return result;
}

function armFrame(chain) {
  const x = unit(sub(chain[1], chain[0]));
  const lower = unit(sub(chain[2], chain[1]));
  const y = unit(sub(lower, mul(x, dot(lower, x))));
  const z = cross(x, y);
  const m = [[x[0], y[0], z[0]], [x[1], y[1], z[1]], [x[2], y[2], z[2]]];
  const trace = m[0][0] + m[1][1] + m[2][2];
  let q;
  if (trace > 0) {
    const s = 2 * Math.sqrt(trace + 1);
    q = [(m[2][1] - m[1][2]) / s, (m[0][2] - m[2][0]) / s, (m[1][0] - m[0][1]) / s, s / 4];
  } else {
    const i = [m[0][0], m[1][1], m[2][2]].indexOf(Math.max(m[0][0], m[1][1], m[2][2]));
    const j = (i + 1) % 3;
    const k = (i + 2) % 3;
    const s = 2 * Math.sqrt(1 + m[i][i] - m[j][j] - m[k][k]);
    q = [0, 0, 0, (m[k][j] - m[j][k]) / s];
    q[i] = s / 4;
    q[j] = (m[j][i] + m[i][j]) / s;
    q[k] = (m[k][i] + m[i][k]) / s;
  }
  return { q: unit(q), flex: Math.acos(clamp(dot(x, lower), -1, 1)) };
}

function blendArm(a, b, root, t) {
  const from = armFrame(a);
  const to = armFrame(b);
  if (dot(from.q, to.q) < 0) to.q = mul(to.q, -1);
  const cosine = clamp(dot(from.q, to.q), -1, 1);
  let q;
  if (cosine > .9995) q = unit(lerp(from.q, to.q, t));
  else {
    const angle = Math.acos(cosine);
    q = add(mul(from.q, Math.sin((1 - t) * angle) / Math.sin(angle)), mul(to.q, Math.sin(t * angle) / Math.sin(angle)));
  }
  const rotate = (v) => {
    const xyz = q.slice(0, 3);
    const twice = mul(cross(xyz, v), 2);
    return add(v, add(mul(twice, q[3]), cross(xyz, twice)));
  };
  const upper = rotate([1, 0, 0]);
  const bend = rotate([0, 1, 0]);
  const flex = from.flex + (to.flex - from.flex) * t;
  const elbow = add(root, mul(upper, UPPER_ARM));
  const wrist = add(elbow, mul(add(mul(upper, Math.cos(flex)), mul(bend, Math.sin(flex))), FOREARM));
  return [root, elbow, wrist];
}

function skeleton(state) {
  const a = state;
  const solve = (name, ...args) => {
    try { return twoBone(...args); } catch (error) { throw new Error(`${name}: ${error.message}`); }
  };
  return { ...a,
    armNear: a.armOverrideNear || solve('near arm', a.shoulderNear, a.wristNear, UPPER_ARM, FOREARM, a.armPoleNear),
    armFar: a.armOverrideFar || solve('far arm', a.shoulderFar, a.wristFar, UPPER_ARM, FOREARM, a.armPoleFar),
    legNear: solve('near leg', a.hipNear, a.ankleNear, THIGH, SHIN, a.forward),
    legFar: solve('far leg', a.hipFar, a.ankleFar, THIGH, SHIN, a.forward) };
}

function shade(hex, amount) {
  return '#' + hex.slice(1).match(/../g).map((v) => Math.round(clamp(parseInt(v, 16) * amount, 0, 255)).toString(16).padStart(2, '0')).join('');
}

// Three visible facets of a tapered cylinder. The circular joint geometry
// covers the ends; directional shading gives the reference's solid body form.
function cylinder(a, b, radiusA, radiusB) {
  const axis = unit(sub(b, a));
  let u = cross(axis, VIEW);
  if (Math.hypot(...u) < .001) u = [1, 0, 0];
  u = unit(u);
  const v = unit(cross(u, axis));
  const ring = (centre, radius, angle) => add(centre, add(mul(u, Math.cos(angle) * radius), mul(v, Math.sin(angle) * radius)));
  return Array.from({ length: 3 }, (_, i) => {
    const lo = i * Math.PI / 3;
    const hi = (i + 1) * Math.PI / 3;
    const normal = add(mul(u, Math.cos((lo + hi) / 2)), mul(v, Math.sin((lo + hi) / 2)));
    return { points: points([ring(a, radiusA, lo), ring(b, radiusB, lo), ring(b, radiusB, hi), ring(a, radiusA, hi)]),
      light: .72 + Math.max(0, dot(normal, LIGHT)) * .38 };
  });
}

function toolHead(state) {
  const face = xy(state.face);
  const grip = xy(state.wristNear);
  const direction = unit([face[0] - grip[0], face[1] - grip[1], 0]);
  const side = [-direction[1], direction[0]];
  const width = state.toolWidth;
  const length = state.toolLength;
  const at = (x, y) => [face[0] + side[0] * x + direction[0] * y, face[1] + side[1] * x + direction[1] * y];
  const shape = state.toolRound;
  const k = .55228475;
  // The same four cubic segments describe an ellipse, bat blade or club head.
  const rounded = [[0, -length], [k * width, -length], [width, -k * length], [width, 0],
    [width, k * length], [k * width, length], [0, length], [-k * width, length],
    [-width, k * length], [-width, 0], [-width, -k * length], [-k * width, -length], [0, -length]];
  const rectangle = [[-width, -length], [-width / 3, -length], [width / 3, -length], [width, -length],
    [width, -length / 3], [width, length / 3], [width, length], [width / 3, length],
    [-width / 3, length], [-width, length], [-width, length / 3], [-width, -length / 3], [-width, -length]];
  const coords = rounded.map((point, i) => at(...lerp(rectangle[i], point, shape)));
  return `M${coords[0].map(num).join(' ')}` + [1, 4, 7, 10].map((i) => ' C' + coords.slice(i, i + 3).flat().map(num).join(' ')).join('') + ' Z';
}

function geometry(s) {
  const parts = [];
  const sphere = (name, centre, radius, ry = radius) => parts.push({ name, type: 'ellipse', cx: xy(centre)[0], cy: xy(centre)[1], rx: radius, ry });
  const bone = (name, a, b, ra, rb) => cylinder(a, b, ra, rb).forEach((face, i) => parts.push({ name: `${name}-${i}`, type: 'polygon', ...face }));
  const limb = (name, chain, radii, joints) => {
    bone(`${name}-upper`, chain[0], chain[1], radii[0], radii[1]);
    sphere(`${name}-middle`, chain[1], joints[1]);
    bone(`${name}-lower`, chain[1], chain[2], radii[1], radii[2]);
    sphere(`${name}-root`, chain[0], joints[0]);
    sphere(`${name}-end`, chain[2], joints[2]);
  };
  const foot = (name, ankle) => bone(name, add(ankle, [0, 0, -.4]), add(ankle, add(mul(s.forward, 4.3), [0, 0, -.8])), 1.5, 1.2);
  foot('foot-far', s.ankleFar);
  limb('leg-far', s.legFar, [2.1, 1.6, 1.05], [2.3, 1.8, 1.25]);
  limb('arm-far', s.armFar, [1.65, 1.35, .9], [1.9, 1.6, 1.25]);
  sphere('pelvis', s.pelvis, 4.3, 3.5);
  bone('torso', add(s.pelvis, [0, 0, 3.3]), add(s.chest, [0, 0, -1.3]), 3.7, 5.2);
  bone('neck', s.chest, s.neck, 1.8, 1.55);
  sphere('head', s.head, 4.1, 4.65);
  foot('foot-near', s.ankleNear);
  limb('leg-near', s.legNear, [2.3, 1.7, 1.1], [2.4, 1.9, 1.3]);
  const headStart = sub(s.face, mul(unit(sub(s.face, s.wristNear)), s.toolLength));
  parts.push({ name: 'handle', type: 'path', d: pathLine(s.wristNear, headStart), fill: 0 });
  parts.push({ name: 'tool', type: 'path', d: toolHead(s), fill: s.toolFill });
  limb('arm-near', s.armNear, [1.85, 1.45, 1], [2.05, 1.7, 1.35]);
  return parts;
}

// Remove redundant samples within 0.1 SVG units. Native interpolation remains
// smooth while the standalone vector file stays small enough for the hero.
function simplify(entries, tolerance = .1) {
  if (entries.length < 3) return entries;
  const vector = (value) => typeof value === 'number' ? [value] : (String(value).match(/-?\d*\.?\d+(?:e[-+]?\d+)?/g) || []).map(Number);
  const values = entries.map(([, value]) => vector(value));
  const keep = new Set([0, entries.length - 1]);
  const visit = (start, end) => {
    let worst = tolerance;
    let split = -1;
    for (let i = start + 1; i < end; i++) {
      const t = (entries[i][0] - entries[start][0]) / (entries[end][0] - entries[start][0]);
      const error = Math.max(...values[i].map((v, axis) => Math.abs(v - (values[start][axis] + (values[end][axis] - values[start][axis]) * t))));
      if (error > worst) { worst = error; split = i; }
    }
    if (split !== -1) { keep.add(split); visit(start, split); visit(split, end); }
  };
  visit(0, entries.length - 1);
  return entries.filter((_, i) => keep.has(i));
}

function mannequinSVG(scenes, animate) {
  const times = new Set([0, 10]);
  for (let chapter = 0; chapter < 4; chapter++) {
    const offset = chapter * 2.5;
    for (let i = 0; i <= 26; i++) times.add(Number((offset + 1.9 * i / 26).toFixed(6)));
    for (let i = 1; i <= 12; i++) times.add(Number((offset + 1.9 + .6 * i / 12).toFixed(6)));
    for (const player of scenes[chapter].players) {
      for (const event of player.events) for (const delta of [-.12, 0, .15, .34]) times.add(offset + Math.max(0, Math.min(1.9, event + delta)));
    }
  }
  const timeline = [...times].sort((a, b) => a - b);
  const frames = [[], []];
  for (const time of timeline) {
    const chapter = Math.min(3, Math.floor(time / 2.5));
    const local = time - chapter * 2.5;
    for (let player = 0; player < 2; player++) {
      let state;
      if (local <= 1.9) state = stateAt(scenes[chapter], scenes[chapter].players[player], local);
      else {
        const next = (chapter + 1) % 4;
        const t = morphEase((local - 1.9) / .6);
        state = blendStates(stateAt(scenes[chapter], scenes[chapter].players[player], 1.9), stateAt(scenes[next], scenes[next].players[player], 0), t);
      }
      try { frames[player].push({ time, skeleton: skeleton(state) }); }
      catch (error) { throw new Error(`${scenes[chapter].name} player ${player + 1} at ${local.toFixed(3)}: ${error.message}`); }
    }
  }
  const colours = ['#94b58c', '#cdd6c8'];
  let svg = '<defs>';
  colours.forEach((colour, index) => {
    svg += `<radialGradient id="athlete-${index}" cx="30%" cy="24%" r="76%"><stop stop-color="${shade(colour, 1.18)}"/><stop offset=".48" stop-color="${colour}"/><stop offset="1" stop-color="${shade(colour, .69)}"/></radialGradient>`;
  });
  svg += '</defs>';
  frames.forEach((track, player) => {
    const shapes = track.map(({ skeleton: rig }) => geometry(rig));
    svg += `<g data-athlete="${player + 1}" stroke-linejoin="round">`;
    // Small contact shadows, with no filled court or background rectangle.
    for (const ankle of ['ankleFar', 'ankleNear']) {
      const shadow = track.map(({ time, skeleton: rig }) => [time, xy([rig[ankle][0], rig[ankle][1], 0])]);
      svg += `<ellipse cx="${num(shadow[0][1][0])}" cy="${num(shadow[0][1][1])}" rx="5" ry="1.7" fill="#475244" opacity=".1">${animate('cx', simplify(shadow.map(([t, value]) => [t, value[0]])))}${animate('cy', simplify(shadow.map(([t, value]) => [t, value[1]])))}</ellipse>`;
    }
    shapes[0].forEach((first, part) => {
      const entries = (attribute, tolerance) => simplify(track.map(({ time }, frame) => [time, shapes[frame][part][attribute]]), tolerance);
      if (first.type === 'ellipse') {
        svg += `<ellipse cx="${num(first.cx)}" cy="${num(first.cy)}" rx="${num(first.rx)}" ry="${num(first.ry)}" fill="url(#athlete-${player})">${animate('cx', entries('cx'))}${animate('cy', entries('cy'))}</ellipse>`;
      } else if (first.type === 'polygon') {
        const coloursAtTime = track.map(({ time }, frame) => [time, shade(colours[player], shapes[frame][part].light)]);
        const colourKeys = coloursAtTime.filter((entry, index) => index === 0 || index === coloursAtTime.length - 1 || entry[1] !== coloursAtTime[index - 1][1] || entry[1] !== coloursAtTime[index + 1][1]);
        svg += `<polygon points="${first.points}" fill="${shade(colours[player], first.light)}">${animate('points', entries('points'))}${animate('fill', colourKeys)}</polygon>`;
      } else {
        svg += `<path d="${first.d}" stroke="#596252" stroke-width="1.15" fill="#596252" fill-opacity="${first.fill}">${animate('d', entries('d'))}${animate('fill-opacity', entries('fill', .01))}</path>`;
      }
    });
    svg += '</g>';
  });
  return { svg, frames };
}

export { mannequinSVG, twoBone, stateAt, skeleton, blendStates, morphEase, worldPoint, xy, UPPER_ARM, FOREARM, THIGH, SHIN };
