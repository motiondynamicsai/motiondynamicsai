import { useMemo, useRef } from 'react';
import { FiRotateCcw } from 'react-icons/fi';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TrajectoryAnnotations from './TrajectoryAnnotations';
import CourtGeometry from './CourtGeometry';
import { COURT_TRAJECTORY } from '../data/courtTrajectory';
import { addTrajectoryEventAnimations } from '../lib/trajectoryEvents';
import { createPlayerTracks, DEFAULT_PLAYERS, playerPositionAtProgress, resolveRallyEvents } from '../lib/rallyMotion';

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, useGSAP);

const FLIGHT_TIMING = { start: 1.1, duration: 3.6 };
// Player clearance is handled around each hit by the annotation layout.
const COURT_ANNOTATION_OBSTACLES = [
  { x: 235, y: 43, width: 120, height: 20 },
  { x: 300, y: 452, width: 340, height: 25 },
];

export function CourtScene({ trajectory = COURT_TRAJECTORY }) {
  const root = useRef(null);
  const pathRef = useRef(null);
  const sequence = useRef(null);
  const events = useMemo(() => resolveRallyEvents(trajectory.events), [trajectory.events]);

  useGSAP(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();
    const timing = { ...FLIGHT_TIMING, duration: trajectory.duration ?? FLIGHT_TIMING.duration };
    const pointAtProgress = (progress) => path.getPointAtLength(length * progress);
    const ball = root.current.querySelector('.court-ball');
    const tracks = createPlayerTracks(events, pointAtProgress, trajectory.players);
    const players = Object.entries(tracks).map(([player, frames]) => ({
      node: root.current.querySelector(`[data-rally-player="${player}"]`), frames,
    }));
    // One linear distance value drives the stroke, ball and both players.
    // Shot reveals use that same start/duration on the same GSAP timeline.
    const render = (progress) => {
      const point = pointAtProgress(progress);
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = length * (1 - progress);
      ball.setAttribute('cx', point.x);
      ball.setAttribute('cy', point.y);
      players.forEach(({ node, frames }) => {
        const position = playerPositionAtProgress(frames, progress);
        node.setAttribute('transform', `translate(${position.x} ${position.y})`);
      });
    };
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const rally = { progress: 0 };
      render(0);
      const line = gsap.timeline({ paused: true });
      line.from('.court-outline', { drawSVG: '0%', duration: 1.2, stagger: 0.08, ease: 'power2.inOut' })
        .from('.court-label, .court-player', { opacity: 0, duration: 0.45, stagger: 0.1 }, 0.6)
        .fromTo(ball, { opacity: 0 }, { opacity: 1, duration: 0.1 }, timing.start)
        .fromTo(rally, { progress: 0 }, {
          progress: 1, duration: timing.duration, ease: 'none',
          onUpdate: () => render(rally.progress),
        }, timing.start);
      const entries = [...root.current.querySelectorAll('.trajectory-event')].map((node) => ({
        progress: Number(node.dataset.progress),
        marker: node.querySelector('.shot-marker'),
        callout: node.querySelector('.shot-callout'),
      }));
      addTrajectoryEventAnimations(line, entries, timing);
      sequence.current = { restart: () => { render(0); line.restart(); } };
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: 'top 92%',
        end: 'bottom top',
        onEnter: () => line.play(),
        onEnterBack: () => { if (line.progress() < 1) line.play(); },
        onLeave: () => line.pause(),
        onLeaveBack: () => line.pause(),
      });
      return () => { trigger.kill(); sequence.current = null; };
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      render(1);
      const targets = root.current.querySelectorAll('.shot-marker, .shot-callout');
      if (targets.length) gsap.set(targets, { opacity: 1 });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [trajectory, events], revertOnUpdate: true });

  return <div className="court-scene" ref={root}>
    <div className="court-scene-top"><span className="court-players-key"><span><i /> Player A</span><span><i /> Player B</span></span><span className="court-scene-key"><i /> Ball trajectory</span></div>
    <svg className="court-svg" viewBox="0 0 720 500" role="img" aria-label={`Squash rally with red Player A and black Player B moving to their shots in time with the ball${events.length ? `. Rally events: ${events.map((event) => event.player ? `${event.label}, Player ${event.player === 'red' ? 'A' : 'B'}` : `${event.label}, wall impact`).join('; ')}` : ''}`}>
      <g className="court-architecture">
        <CourtGeometry />
        <path className="ball-flight" ref={pathRef} d={trajectory.path} fill="none" stroke="#c93638" strokeWidth="2.4" strokeLinejoin="round" />
        {['red', 'black'].map((player, index) => {
          const initial = trajectory.players?.[player] ?? DEFAULT_PLAYERS[player];
          const color = player === 'red' ? '#c93638' : '#292f27';
          return <g key={player} data-rally-player={player} transform={`translate(${initial.x} ${initial.y})`}>
            <g className={`court-player court-player-${index === 0 ? 'a' : 'b'}`}>
              <ellipse cy="15" rx="23" ry="8" fill={color} opacity=".1" />
              <circle r="9" fill={color} /><circle r="20" fill="none" stroke={color} strokeWidth="1" />
              <path d="M-30 0H-24 M24 0H30 M0-30V-24 M0 24V30" stroke={color} />
            </g>
          </g>;
        })}
        <TrajectoryAnnotations pathRef={pathRef} pathData={trajectory.path} events={events} obstacles={COURT_ANNOTATION_OBSTACLES} markerRadius={32} />
        <circle className="court-ball" cx="204" cy="320" r="6" fill="#c93638" stroke="#f7f6f2" strokeWidth="2" />
        <g className="court-label" fill="#656660" fontSize="10" letterSpacing="1.5"><text x="240" y="57">FRONT WALL</text><text x="315" y="469">POSITION → PATTERN → INSIGHT</text></g>
      </g>
    </svg>
    <div className="court-scene-bottom"><span>Illustrative tracking sequence</span><button className="replay-control" type="button" onClick={() => sequence.current?.restart()}><FiRotateCcw aria-hidden="true" /> Replay movement</button></div>
  </div>;
}

export function AudienceGlyph({ type }) {
  return <svg className={`audience-glyph audience-glyph-${type}`} viewBox="0 0 260 165" aria-hidden="true" focusable="false">
    {type === 'coaching' && <g fill="none" strokeWidth="1.3"><path d="M62 29 H198 V137 H62 Z M62 88 H198 M130 88 V137 M62 88 H93 V111 H62 M198 88 H167 V111 H198" stroke="#adaf9f" /><path className="glyph-path" d="M86 118 Q163 97 127 52 Q102 29 176 74" stroke="#c93638" strokeWidth="2" /><circle cx="86" cy="118" r="5" fill="#c93638" stroke="none" /><circle cx="176" cy="74" r="7" stroke="#c93638" /></g>}
    {type === 'broadcast' && <g fill="none" stroke="#c93638" strokeWidth="1.7"><rect x="83" y="54" width="73" height="54" rx="4" /><path d="M156 68 L181 58 V104 L156 94 M110 108 V128 M91 128 H151" /><path className="glyph-path" d="M64 55 Q42 81 64 108 M49 39 Q14 81 49 124 M204 55 Q226 81 204 108 M218 39 Q253 81 218 124" stroke="#9ba08f" /><circle cx="120" cy="81" r="13" /><circle cx="120" cy="81" r="4" fill="#c93638" stroke="none" /></g>}
    {type === 'growth' && <g fill="none" strokeWidth="1.6"><path className="glyph-path" d="M46 126 L103 92 L157 108 L214 36" stroke="#c93638" /><path d="M46 126 V146 M103 92 V146 M157 108 V146 M214 36 V146 M31 146 H230" stroke="#b2b6a8" /><path d="M194 36 H214 V56" stroke="#c93638" />{[[46,126],[103,92],[157,108],[214,36]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="6" fill="#f7f6f2" stroke="#c93638" />)}</g>}
  </svg>;
}
