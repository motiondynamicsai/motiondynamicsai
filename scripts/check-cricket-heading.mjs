import assert from 'node:assert/strict';
import { BAT_FACE, BAT_PIVOT, batLeftEdge, cricketHeadingGeometry, cubicPoint, keepBatRight, rotatePoint, transformPoint } from '../src/components/cricketHeadingGeometry.js';

let cases = 0;
for (const fontSize of [52, 60, 68, 84]) {
  for (const room of [64, 100, 220, 480]) {
    const dot = { x: fontSize * 3.07, y: fontSize * 1.67 };
    const radius = fontSize * .065;
    const scale = (fontSize <= 60 ? 52 : 64) / 96;
    const batMatrix = { a: scale, b: 0, c: 0, d: scale, e: dot.x + 18, f: 12 };
    const width = dot.x + room;
    const geometry = cricketHeadingGeometry({ dot, radius, fontSize, width, batMatrix });
    const place = (point, pose) => {
      const rotated = rotatePoint(point, BAT_PIVOT, pose.angle);
      return transformPoint(batMatrix, { x: rotated.x + pose.x, y: rotated.y + pose.y });
    };
    const face = place(BAT_FACE, geometry.impact);
    assert.ok(Math.hypot(face.x - geometry.contact.x, face.y - geometry.contact.y) < 1e-8, 'bat face must land exactly on contact');
    assert.ok(Math.abs(Math.hypot(face.x - dot.x, face.y - dot.y) - radius - .9 * scale) < 1e-8, 'outline must touch the ball circumference');
    assert.ok(face.y > dot.y, 'strike must come from underneath');
    const rested = place({ x: 48, y: 68 }, geometry.rest);
    assert.ok(Math.abs(rested.y - (dot.y - fontSize * .04)) < 1e-8, 'resting blade must sit beside the punctuation');
    assert.ok(Math.abs(rested.x - (dot.x + fontSize * .52)) < 1e-8, 'resting blade must keep its responsive gap');
    const poses = [geometry.rest, geometry.prepare, geometry.impact, geometry.followThrough, geometry.rest];
    for (let index = 1; index < poses.length; index++) {
      for (let step = 0; step <= 100; step++) {
        const t = step / 100;
        const pose = Object.fromEntries(['x', 'y', 'angle'].map(key => [key, poses[index - 1][key] + (poses[index][key] - poses[index - 1][key]) * t]));
        assert.ok(batLeftEdge(keepBatRight(pose, geometry), batMatrix) >= geometry.safeLeft - 1e-8, 'the entire swing must stay to the right of the letters');
      }
    }
    for (let step = 0; step <= 100; step++) {
      const point = cubicPoint(geometry.points, step / 100);
      assert.ok(point.x >= dot.x - 1e-8 && point.x < width, 'trajectory must stay to the right of the text and inside the heading');
      assert.ok(point.y >= 0 && point.y <= dot.y + 1e-8, 'trajectory must stay in the heading airspace');
      assert.ok(point.x - dot.x <= fontSize * .55 + 1e-8, 'ball must stay within a small hop of the punctuation');
      assert.ok(dot.y - point.y <= fontSize * .4 + 1e-8, 'ball must not fly high above the heading');
    }
    assert.deepEqual(cubicPoint(geometry.points, 0), dot);
    cases++;
  }
}
console.log(`Cricket heading: ${cases} responsive collision, resting-position and trajectory cases passed.`);
