import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import GSAP from 'gsap/dist/gsap.js';
import { addTrajectoryEventAnimations, layoutTrajectoryEvents, normalizeTrajectoryEvents, rectanglesOverlap } from './trajectoryEvents.js';
import { COURT_TRAJECTORY } from '../data/courtTrajectory.js';

const { gsap } = GSAP;
const timing = { start: 1.1, duration: 3.6 };
const bounds = { x: 18, y: 18, width: 684, height: 464 };
after(() => gsap.ticker.sleep());

function fixture(progresses) {
  const drawn = { progress: 0 };
  const entries = progresses.map((progress) => ({ progress, marker: { opacity: 0 }, callout: { opacity: 0 } }));
  const timeline = gsap.timeline({ paused: true });
  timeline.fromTo(drawn, { progress: 0 }, { progress: 1, duration: timing.duration, ease: 'none' }, timing.start);
  addTrajectoryEventAnimations(timeline, entries, timing);
  timeline.pause(0);
  return { timeline, entries, drawn };
}

test('one hit appears only when the drawing reaches its progress', () => {
  const { timeline, entries, drawn } = fixture([0.4]);
  const at = timing.start + timing.duration * 0.4;
  timeline.time(at - 0.001);
  assert.ok(drawn.progress < 0.4);
  assert.equal(entries[0].marker.opacity, 0);
  assert.equal(entries[0].callout.opacity, 0);
  timeline.time(at);
  assert.equal(entries[0].marker.opacity, 1);
  assert.equal(entries[0].callout.opacity, 0);
  timeline.time(at + 0.23);
  assert.equal(entries[0].callout.opacity, 1);
  timeline.time(timeline.duration());
  assert.equal(entries[0].callout.opacity, 1);
  timeline.kill();
});

test('multiple hits appear in sequence and remain visible', () => {
  const { timeline, entries } = fixture([0.1, 0.5, 0.9]);
  entries.forEach((entry, index) => {
    timeline.time(timing.start + timing.duration * entry.progress + 0.23);
    entries.forEach((other, otherIndex) => {
      assert.equal(other.marker.opacity, otherIndex <= index ? 1 : 0);
      assert.equal(other.callout.opacity, otherIndex <= index ? 1 : 0);
    });
  });
  timeline.kill();
});

test('closely spaced and simultaneous hits each use their own threshold', () => {
  const { timeline, entries } = fixture([0.5, 0.5, 0.501]);
  timeline.time(timing.start + timing.duration * 0.5);
  assert.deepEqual(entries.map((entry) => entry.marker.opacity), [1, 1, 0]);
  timeline.time(timing.start + timing.duration * 0.501);
  assert.deepEqual(entries.map((entry) => entry.marker.opacity), [1, 1, 1]);
  timeline.time(timeline.duration());
  assert.ok(entries.every((entry) => entry.callout.opacity === 1));
  timeline.kill();
});

test('hits at and near the start wait for the trajectory, not page load', () => {
  const { timeline, entries } = fixture([0, 0.001]);
  timeline.time(timing.start - 0.001);
  assert.ok(entries.every((entry) => entry.marker.opacity === 0 && entry.callout.opacity === 0));
  timeline.time(timing.start);
  assert.equal(entries[0].marker.opacity, 1);
  assert.equal(entries[1].marker.opacity, 0);
  timeline.time(timing.start + timing.duration * 0.001);
  assert.equal(entries[1].marker.opacity, 1);
  timeline.kill();
});

test('hits at and near the end reveal before the timeline finishes', () => {
  const { timeline, entries, drawn } = fixture([0.999, 1]);
  timeline.time(timing.start + timing.duration * 0.998);
  assert.ok(entries.every((entry) => entry.marker.opacity === 0));
  timeline.time(timing.start + timing.duration * 0.999);
  assert.equal(entries[0].marker.opacity, 1);
  assert.equal(entries[1].marker.opacity, 0);
  timeline.time(timing.start + timing.duration);
  assert.equal(drawn.progress, 1);
  assert.equal(entries[1].marker.opacity, 1);
  timeline.time(timeline.duration());
  assert.ok(entries.every((entry) => entry.callout.opacity === 1));
  timeline.kill();
});

test('replay/reset hides every annotation and repeats the original timings', () => {
  const { timeline, entries } = fixture([0, 0.45, 1]);
  for (let replay = 0; replay < 3; replay += 1) {
    timeline.time(timeline.duration());
    assert.ok(entries.every((entry) => entry.callout.opacity === 1));
    timeline.restart().pause();
    assert.ok(entries.every((entry) => entry.marker.opacity === 0 && entry.callout.opacity === 0));
    timeline.time(timing.start + 0.23);
    assert.equal(entries[0].callout.opacity, 1);
    assert.equal(entries[1].marker.opacity, 0);
    assert.equal(entries[2].marker.opacity, 0);
  }
  timeline.kill();
});

test('backward seeking removes annotations that have not yet been reached', () => {
  const { timeline, entries } = fixture([0.1, 0.6]);
  timeline.time(timeline.duration());
  timeline.time(timing.start + timing.duration * 0.4);
  assert.equal(entries[0].callout.opacity, 1);
  assert.equal(entries[1].marker.opacity, 0);
  assert.equal(entries[1].callout.opacity, 0);
  timeline.kill();
});

test('no events leaves the drawing and its duration unchanged', () => {
  const { timeline, entries, drawn } = fixture([]);
  assert.equal(entries.length, 0);
  assert.equal(timeline.duration(), timing.start + timing.duration);
  timeline.time(timeline.duration());
  assert.equal(drawn.progress, 1);
  assert.deepEqual(normalizeTrajectoryEvents(), []);
  assert.deepEqual(layoutTrajectoryEvents([], { bounds, measureText: () => 0, pointAtProgress: () => ({ x: 0, y: 0 }) }), []);
  timeline.kill();
});

test('unknown event types, custom labels, timestamps, and metadata are supported', () => {
  const metadata = { player: 'A', confidence: 0.9 };
  const events = normalizeTrajectoryEvents([
    { id: 'custom', progress: 0.8, type: 'New shot type', timestamp: 42, metadata },
    { id: 'custom', progress: 0.2, type: 'internal-id', label: 'Custom display label' },
    null, { progress: -0.1, type: 'invalid' }, { progress: 2, type: 'invalid' },
    { progress: NaN, type: 'invalid' }, { progress: 0.5, label: '' },
  ]);
  assert.equal(events.length, 2);
  assert.equal(events[0].label, 'Custom display label');
  assert.equal(events[1].label, 'New shot type');
  assert.equal(events[1].timestamp, 42);
  assert.equal(events[1].metadata, metadata);
  assert.notEqual(events[0].key, events[1].key);
});

function layout(events, overrides = {}) {
  return layoutTrajectoryEvents(normalizeTrajectoryEvents(events), {
    bounds,
    fontSize: 24,
    measureText: (text) => text.length * 12,
    pointAtProgress: (progress) => ({ x: 120 + progress * 480, y: 270 }),
    pathSamples: Array.from({ length: 161 }, (_, i) => ({ x: 120 + i * 3, y: 270 })),
    ...overrides,
  });
}

function assertUnobstructed(items, obstacles = []) {
  items.forEach((item, index) => {
    assert.ok(item.box.x >= bounds.x && item.box.y >= bounds.y);
    assert.ok(item.box.x + item.box.width <= bounds.x + bounds.width + 0.01);
    assert.ok(item.box.y + item.box.height <= bounds.y + bounds.height + 0.01);
    items.slice(index + 1).forEach((other) => assert.equal(rectanglesOverlap(item.box, other.box, 6), false, `${item.label} overlaps ${other.label}`));
    obstacles.forEach((obstacle) => assert.equal(rectanglesOverlap(item.box, obstacle), false));
    items.forEach((other) => assert.equal(rectanglesOverlap(item.box, { x: other.point.x - 7, y: other.point.y - 7, width: 14, height: 14 }), false));
    assert.ok(item.anchor.x === item.box.x || item.anchor.x === item.box.x + item.box.width || item.anchor.y === item.box.y || item.anchor.y === item.box.y + item.box.height);
  });
}

test('one label is anchored to the exact sampled location', () => {
  const [item] = layout([{ progress: 0.3, type: 'Volley' }]);
  assert.deepEqual(item.point, { x: 264, y: 270 });
  assertUnobstructed([item]);
});

test('clustered and coincident hits receive separate readable bubbles', () => {
  const items = layout(['Forehand', 'Backhand', 'Volley', 'Smash', 'Lob'].map((type, index) => ({ progress: 0.5 + (index % 3) * 0.001, type })));
  assertUnobstructed(items);
});

test('dense labels at mobile font size avoid the court players and captions', () => {
  const obstacles = [
    { x: 337, y: 280, width: 100, height: 87 },
    { x: 422, y: 320, width: 88, height: 81 },
    { x: 235, y: 43, width: 120, height: 20 },
    { x: 300, y: 452, width: 340, height: 25 },
  ];
  const items = layout(['Forehand', 'Backhand', 'Volley', 'Serve', 'Smash'].map((type, index) => ({ progress: 0.5 + index * 0.001, type })), {
    fontSize: 28,
    measureText: (text) => text.length * 14,
    pointAtProgress: (progress) => ({ x: 387 + (progress - 0.5) * 100, y: 389 }),
    obstacles,
  });
  assertUnobstructed(items, obstacles);
});

test('labels avoid player markers and stay inside the drawing near its edges', () => {
  const obstacles = [{ x: 290, y: 220, width: 100, height: 100 }];
  const items = layout([0, 0.001, 0.5, 0.999, 1].map((progress) => ({ progress, type: 'Hit' })), {
    obstacles,
    pointAtProgress: (progress) => ({ x: 22 + progress * 676, y: 30 + progress * 444 }),
  });
  assertUnobstructed(items, obstacles);
});

test('long labels wrap without losing their content', () => {
  const label = 'Cross court attacking forehand';
  const [item] = layout([{ progress: 0.5, label }]);
  assert.ok(item.lines.length > 1);
  assert.equal(item.lines.join(' '), label);
  assertUnobstructed([item]);
});

test('the default trajectory geometry is preserved and metadata is separate', () => {
  assert.equal(COURT_TRAJECTORY.path, 'M310 361 L524 147 L610 280 L387 389 L280 165 L204 320 L335 158 L514 344 L590 178');
  assert.equal(normalizeTrajectoryEvents(COURT_TRAJECTORY.events).length, 5);
});
