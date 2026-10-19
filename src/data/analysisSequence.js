// One illustrative rally powers both technical demos. Coordinates are normalised
// court positions, so presentation modes can project the same samples differently.
export const ANALYSIS_SEQUENCE = {
  points: [
    { x: 0.36, y: 0.82, time: 0, speed: 0.8 },
    { x: 0.48, y: 0.44, time: 0.8, speed: 3.1 },
    { x: 0.73, y: 0.25, time: 1.5, speed: 4.8 },
    { x: 0.53, y: 0.74, time: 2.2, speed: 2.4 },
    { x: 0.78, y: 0.85, time: 2.9, speed: 4.1 },
    { x: 0.57, y: 0.38, time: 3.6, speed: 3.6 },
    { x: 0.35, y: 0.70, time: 4.4, speed: 1.2 },
  ],
  events: [
    { id: 'forehand', pointIndex: 4, type: 'forehand', label: 'Forehand', timestamp: 2.9 },
    { id: 'backhand', pointIndex: 6, type: 'backhand', label: 'Backhand', timestamp: 4.4 },
  ],
  metrics: { recovery: 1.2, distance: 12.4 },
};

export const pathFromPoints = (points) => points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');

export function projectCourtPoint(point) {
  const y = 225 + point.y * 180;
  const left = 240 - point.y * 120;
  const width = 350 + point.y * 180;
  return { x: left + point.x * width, y };
}

export function trajectoryFromSamples(points, events) {
  const lengths = points.map((point, i) => i ? Math.hypot(point.x - points[i - 1].x, point.y - points[i - 1].y) : 0);
  const total = lengths.reduce((sum, length) => sum + length, 0);
  return {
    path: pathFromPoints(points),
    events: events.map((event) => ({ ...event, progress: total ? lengths.slice(0, event.pointIndex + 1).reduce((sum, length) => sum + length, 0) / total : 0 })),
  };
}

export const VIDEO_TRAJECTORY = trajectoryFromSamples(ANALYSIS_SEQUENCE.points.map(projectCourtPoint), ANALYSIS_SEQUENCE.events);

export function applicationPoints(mode) {
  return ANALYSIS_SEQUENCE.points.map((point) => {
    if (mode === 'development') return { x: 82 + point.time / 4.4 * 556, y: 345 - point.speed / 5 * 230 };
    return { x: 110 + point.x * 490, y: 100 + point.y * 280 };
  });
}
