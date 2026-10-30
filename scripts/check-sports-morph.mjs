import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scenes } from './generate-sports-morph.mjs';
import { stateAt, skeleton, blendStates, morphEase, worldPoint,
  UPPER_ARM, FOREARM, THIGH, SHIN } from './sports-mannequin.mjs';

const subtract = (a, b) => a.map((v, i) => v - b[i]);
const distance = (a, b) => Math.hypot(...subtract(a, b));
const previous = [null, null];
const first = [null, null];
let maxBoneError = 0;
let maxElbowSpeed = 0;
let elbowContext;
let minimumReach = Infinity;

// Sample more densely than display frames: a branch flip between the SVG's
// keyframes must be caught, even when both sampled endpoints look plausible.
for (let sample = 0; sample <= 5000; sample++) {
  const time = sample / 500;
  const chapter = Math.min(3, Math.floor(time / 2.5));
  const local = time - chapter * 2.5;
  for (let player = 0; player < 2; player++) {
    let state = stateAt(scenes[chapter], scenes[chapter].players[player], Math.min(local, 1.9));
    if (local > 1.9) state = blendStates(state,
      stateAt(scenes[(chapter + 1) % 4], scenes[(chapter + 1) % 4].players[player], 0),
      morphEase((local - 1.9) / .6));
    const rig = skeleton(state);
    first[player] ||= rig;
    for (const name of ['armNear', 'armFar', 'legNear', 'legFar']) {
      const chain = rig[name];
      const lengths = name.startsWith('arm') ? [UPPER_ARM, FOREARM] : [THIGH, SHIN];
      for (let bone = 0; bone < 2; bone++) maxBoneError = Math.max(maxBoneError,
        Math.abs(distance(chain[bone], chain[bone + 1]) - lengths[bone]));
      if (name.startsWith('arm')) {
        minimumReach = Math.min(minimumReach, distance(chain[0], chain[2]));
        if (previous[player]) {
          const speed = distance(subtract(chain[1], chain[0]), subtract(previous[player][name][1], previous[player][name][0])) / .002;
          if (speed > maxElbowSpeed) { maxElbowSpeed = speed; elbowContext = `${time}s / athlete ${player + 1} / ${name}`; }
        }
      }
      if (sample === 5000) chain.forEach((joint, index) => assert(distance(joint, first[player][name][index]) < 1e-6, 'Skeleton loop seam'));
    }
    previous[player] = rig;
  }
}
assert(maxBoneError < 1e-7, 'A bone changed length');
assert(minimumReach > 8, 'An arm folded into its shoulder');
assert(maxElbowSpeed < 500, `Elbow branch flip: ${maxElbowSpeed} at ${elbowContext}`);

for (const scene of scenes) {
  for (const player of scene.players) player.events.forEach((event, index) => {
    const state = stateAt(scene, player, event);
    const ball = worldPoint(scene, player.contacts?.[index] || player.contact);
    assert(distance(state.face, ball) < 1e-8, `${scene.name}: missed ball contact`);
  });
  for (let sample = 0; sample <= 200; sample++) assert(scene.flight.at(scene.flight.duration * sample / 200)[2] > -1e-7, `${scene.name}: ball below floor`);
}

const putt = scenes[3].flight;
const start = putt.at(0);
const end = putt.at(putt.duration);
const middle = putt.at(putt.duration / 2);
const cross = (end[0] - start[0]) * (middle[1] - start[1]) - (end[1] - start[1]) * (middle[0] - start[0]);
assert(Math.abs(cross) > 1, 'Golf putt lost its curved break');
assert(distance(putt.at(.1), start) > distance(end, putt.at(putt.duration - .1)), 'Putt must decelerate');

const svg = readFileSync(new URL('../src/assets/sports-morph.svg', import.meta.url), 'utf8');
let tracks = 0;
for (const [, text] of svg.matchAll(/<animate\b([^>]+)\/>/g)) {
  const attributes = Object.fromEntries([...text.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]));
  const keys = attributes.keyTimes.split(';').map(Number);
  const values = attributes.values.split(';');
  assert(keys.length === values.length);
  assert(keys[0] === 0 && keys.at(-1) === 1);
  assert(keys.every((key, index) => !index || key > keys[index - 1]), 'Duplicate animation clock key');
  assert(values[0] === values.at(-1), `${attributes.attributeName}: visible loop seam`);
  if (['d', 'points'].includes(attributes.attributeName)) {
    const topology = values.map((value) => value.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/g, '#'));
    assert(new Set(topology).size === 1, 'Incompatible morph geometry');
  }
  tracks++;
}
assert(!/<rect\b/.test(svg), 'A background rectangle was introduced');
assert((svg.match(/data-athlete=/g) || []).length === 2, 'Athletes must persist between sports');
console.log(`Verified 10,002 skeleton poses, fixed bones, continuous elbows, exact contacts, curved putt, and ${tracks} closed SVG tracks.`);
console.log(`Maximum bone error: ${maxBoneError.toExponential(2)}; maximum relative elbow speed: ${maxElbowSpeed.toFixed(1)} units/s.`);
