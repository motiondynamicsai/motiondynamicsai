// Geometry stays separate from event metadata. Deriving distance progress from
// the vertices keeps existing hits anchored when the rally is extended.
const points = [
  [310, 361], [524, 147], [610, 280], [387, 389], [280, 165], [204, 320],
  [335, 158], // Front-wall return from the red player's previous Backhand.
  [514, 344], // Black player's final Backhand, on the court floor.
  [590, 178], // Visible front/right wall boundary: x=590, y=78…220.
];
const distances = [0];
points.slice(1).forEach(([x, y], index) => {
  const [previousX, previousY] = points[index];
  distances.push(distances[index] + Math.hypot(x - previousX, y - previousY));
});
const totalDistance = distances[distances.length - 1];
const progressAt = (vertex) => distances[vertex] / totalDistance;

export const COURT_TRAJECTORY = {
  path: points.map(([x, y], index) => `${index ? 'L' : 'M'}${x} ${y}`).join(' '),
  // Preserve the previous rally's ball speed and shot times; the ending gets
  // additional time on the same master timeline instead of speeding up play.
  duration: 3.6 * totalDistance / distances[5],
  players: {
    red: { x: 310, y: 361 },
    black: { x: 405, y: 311 },
  },
  events: [
    { id: 'opening-shot', progress: 0, type: 'serve', label: 'Serve', player: 'red' },
    { id: 'return-shot', progress: progressAt(3), type: 'forehand', label: 'Forehand', player: 'black' },
    { id: 'third-shot', progress: progressAt(5), type: 'backhand', label: 'Backhand', player: 'red' },
    { id: 'final-shot', progress: progressAt(7), type: 'backhand', label: 'Backhand', player: 'black' },
    { id: 'expected-wall-impact', progress: 1, kind: 'wall-impact', type: 'expected-position', label: 'EXPECTED POSITION', player: null },
  ],
};
