// Coordinates are in the existing wave artwork's SVG space.
export const FOOTER_BALL = { x: 950, y: 91, radius: 18 };

export const FOOTER_BALL_VARIANTS = {
  brand: { fill: '#f0444f', stroke: '#f0444f', strokeOpacity: 0 },
  cricket: { fill: '#b52c37', stroke: '#88232b', strokeOpacity: .35 },
  squash: { fill: '#242723', stroke: '#eeece3', strokeOpacity: .85 },
  tennis: { fill: '#c2c86b', stroke: '#8e9454', strokeOpacity: .45 },
  golf: { fill: '#f1efe5', stroke: '#999d92', strokeOpacity: .85 },
};

export const FOOTER_SPORTS = [
  { id: 'cricket', name: 'Cricket', implement: 'cricket bat', pivot: '-28 62', windup: .12, swing: .23, follow: .24, flight: .92, height: 104, endY: 44, scale: 1.48 },
  { id: 'squash', name: 'Squash', implement: 'squash racket', pivot: '-32 62', windup: .08, swing: .14, follow: .18, flight: .62, height: 48, endY: 12, scale: 1.32 },
  { id: 'tennis', name: 'Tennis', implement: 'tennis racket', pivot: '-36 64', windup: .1, swing: .2, follow: .22, flight: .82, height: 76, endY: 28, scale: 1.42 },
  {
    id: 'golf', name: 'Golf', implement: 'golf club', pivot: '-78 -70',
    windup: .18, swing: .25, follow: .26, flight: 1.32, height: 138, endY: 10, scale: 1.38, apex: .48,
    swingPose: {
      start: { x: -8, y: 12, rotation: 28 },
      approach: { x: 0, y: 0, rotation: 68 },
      finish: { x: 0, y: 0, rotation: -62 },
    },
  },
];

// Shared by the original entrance and every completed strike. The original
// heights, timings, eases and impact squash are intentionally unchanged.
export function appendFooterBallDrop(timeline, ball, { position, onPhase } = {}) {
  timeline.addLabel('drop', position)
    .set(ball, { x: 0, y: -180, opacity: 0, scaleX: 1, scaleY: 1 }, 'drop')
    .call(() => onPhase?.('dropReset'), [], 'drop')
    .to(ball, { opacity: 1, duration: .1 }, 'drop')
    .to(ball, { y: 0, duration: .58, ease: 'power1.in' }, 'drop')
    .to(ball, { scaleX: .985, scaleY: 1.025, duration: .18, ease: 'power1.in' }, 'drop+=.4')
    .call(() => onPhase?.('bounce'), [], 'drop+=.58');

  [
    { height: 52, flight: .31, squash: .07 },
    { height: 15, flight: .166, squash: .04 },
    { height: 4, flight: .086, squash: .015 },
  ].forEach(({ height, flight, squash }) => {
    timeline
      .to(ball, { scaleX: 1 + squash, scaleY: 1 - squash, duration: .045, ease: 'power1.out' })
      .to(ball, { y: -height, duration: flight, ease: 'power1.out' })
      .to(ball, { scaleX: 1, scaleY: 1, duration: .065, ease: 'power1.out' }, '<')
      .to(ball, { y: 0, duration: flight, ease: 'power1.in' });
  });
  return timeline.to(ball, { y: 0, scaleX: 1, scaleY: 1, duration: .08, ease: 'power1.out' });
}
