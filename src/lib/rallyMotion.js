import { normalizeTrajectoryEvents } from './trajectoryEvents';

export const DEFAULT_PLAYERS = {
  red: { x: 454, y: 369 },
  black: { x: 405, y: 311 },
};

const playerIds = Object.keys(DEFAULT_PLAYERS);

/** Shot ownership is metadata, independent of the shot vocabulary. */
export function resolveRallyEvents(events) {
  let shotIndex = 0;
  return normalizeTrajectoryEvents(events).map((event) => {
    const kind = event.kind ?? 'shot';
    // Wall impacts and future non-player events must never advance ownership
    // or pull a player away from the floor toward the ball's wall position.
    if (kind !== 'shot') return { ...event, kind, player: null };
    const player = playerIds.includes(event.player) ? event.player : playerIds[shotIndex % playerIds.length];
    shotIndex += 1;
    return { ...event, kind, player };
  });
}

/**
 * Sample the actual SVG path once per hit. Each player's waypoints use the
 * same normalized distance as the ball, so a hit is an exact shared endpoint.
 * These are movement keyframes only; they never produce visible player paths.
 */
export function createPlayerTracks(events, pointAtProgress, initialPositions = DEFAULT_PLAYERS) {
  return Object.fromEntries(playerIds.map((player) => {
    const initial = initialPositions[player] ?? DEFAULT_PLAYERS[player];
    const shots = events.filter((event) => (event.kind ?? 'shot') === 'shot' && event.player === player).map((event) => {
      const point = pointAtProgress(event.progress);
      return { progress: event.progress, x: point.x, y: point.y };
    });
    // A serve at progress zero starts with the serving player already in place.
    const frames = shots[0]?.progress === 0 ? [] : [{ progress: 0, ...initial }];
    frames.push(...shots);
    const last = frames[frames.length - 1];
    if (shots.length && last.progress < 1) {
      // A small recovery toward the player's starting area keeps the off-ball
      // player alive without inventing an elaborate route or another timer.
      frames.push({ progress: 1, x: last.x + (initial.x - last.x) * .2, y: last.y + (initial.y - last.y) * .2 });
    }
    return [player, frames];
  }));
}

export function playerPositionAtProgress(frames, progress) {
  if (progress <= frames[0].progress) return frames[0];
  const nextIndex = frames.findIndex((frame) => frame.progress >= progress);
  if (nextIndex < 0) return frames[frames.length - 1];
  const start = frames[nextIndex - 1];
  const end = frames[nextIndex];
  const fraction = (progress - start.progress) / (end.progress - start.progress);
  const eased = fraction * fraction * (3 - 2 * fraction);
  return { x: start.x + (end.x - start.x) * eased, y: start.y + (end.y - start.y) * eased };
}
