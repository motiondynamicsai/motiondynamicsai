import { useRef, useState } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';
import { ANALYSIS_SEQUENCE, applicationPoints, pathFromPoints } from '../data/analysisSequence';
import useReducedMotion from '../lib/useReducedMotion';
import { CourtPlan } from './CourtGeometry';
import { COURT_T } from '../lib/squashCourt';

gsap.registerPlugin(DrawSVGPlugin, useGSAP);

const modes = [
  { id: 'coaching', title: 'Coaching', heading: 'Find the next coaching cue.', metric: 'Recovery', value: ANALYSIS_SEQUENCE.metrics.recovery, unit: 's', caption: 'Shot position → recovery to the centre.' },
  { id: 'development', title: 'Development', heading: 'See the effort within the rally.', metric: 'Peak speed', value: Math.max(...ANALYSIS_SEQUENCE.points.map((point) => point.speed)), unit: 'm/s', caption: 'The same movement, seen through speed and time.' },
  { id: 'broadcast', title: 'Broadcast', heading: 'Give the rally a story.', metric: 'Distance', value: ANALYSIS_SEQUENCE.metrics.distance, unit: 'm', caption: 'Pick a shot. Bring its movement into focus.' },
];
const initialPoints = applicationPoints('coaching');
const initialPath = pathFromPoints(initialPoints);

export default function ApplicationDemo() {
  const root = useRef(null);
  const animation = useRef(null);
  const previousMode = useRef(null);
  const [mode, setMode] = useState(0);
  const [focus, setFocus] = useState(0);
  const reduced = useReducedMotion();
  const current = modes[mode];
  const event = ANALYSIS_SEQUENCE.events[focus];

  useGSAP(() => {
    animation.current?.kill();
    const nodes = root.current.querySelectorAll('.application-node');
    const points = applicationPoints(current.id);
    const selected = points[event.pointIndex];
    const segment = points.slice(Math.max(0, event.pointIndex - 1), Math.min(points.length, event.pointIndex + 2));
    const labelX = Math.min(selected.x + 25, 540);
    const labelY = selected.y - 46;
    const timeline = gsap.timeline({ defaults: { duration: reduced ? 0 : 0.8, ease: 'power3.inOut', overwrite: 'auto' } });
    timeline.to('.application-svg', { attr: { viewBox: current.id === 'development' ? '40 70 660 350' : '205 60 380 350' } }, 0)
      .to('.application-path', { attr: { d: pathFromPoints(points) } }, 0)
      .to('.application-court', { opacity: current.id === 'development' ? 0 : 0.65 }, 0)
      .to('.application-axis', { opacity: current.id === 'development' ? 1 : 0 }, 0)
      .to('.application-recovery', { opacity: current.id === 'coaching' ? 1 : 0 }, 0)
      .to('.application-recovery-path', { attr: { d: `M${selected.x} ${selected.y} L${COURT_T.x} ${COURT_T.y}` } }, 0)
      .to('.application-focus', { attr: { cx: selected.x, cy: selected.y, r: current.id === 'broadcast' ? 30 : 23 } }, 0)
      .to('.application-highlight', { attr: { d: pathFromPoints(segment) } }, 0)
      .fromTo('.application-highlight', { drawSVG: '0%' }, { drawSVG: '100%', duration: reduced ? 0 : 1.1 }, reduced ? 0 : 0.2)
      .to('.application-callout', { x: labelX, y: labelY }, 0)
      .to('.application-leader', { attr: { d: `M${selected.x} ${selected.y} L${labelX} ${labelY + 18}` } }, 0)
      .fromTo('.application-context', { opacity: reduced ? 1 : 0 }, { opacity: 1, duration: reduced ? 0 : 0.5 }, 0);
    if (previousMode.current !== mode) timeline.fromTo('.application-metric-value', { textContent: reduced ? current.value : 0 }, { textContent: current.value, snap: { textContent: 0.1 } }, 0);
    else timeline.set('.application-metric-value', { textContent: current.value }, 0);
    previousMode.current = mode;
    nodes.forEach((node, index) => timeline.to(node, { attr: { cx: points[index].x, cy: points[index].y }, fill: index === event.pointIndex ? 'var(--red)' : 'var(--paper)' }, 0));
    animation.current = timeline;
  }, { scope: root, dependencies: [mode, focus, reduced] });

  return <div className="process-graphic insights-graphic analysis-demo application-demo" ref={root} data-ui>
    <div className="demo-header"><span>One rally / Three perspectives</span><span className="demo-state is-tracking"><i />{current.title}</span></div>
    <div className="application-heading"><p className="application-context">{current.heading}</p><div className="application-metric"><span>{current.metric}</span><strong><span className="application-metric-value">1.2</span><small> {current.unit}</small></strong></div></div>
    <svg className="application-svg" viewBox="205 60 380 350" role="img" aria-label={`Illustrative ${current.title.toLowerCase()} view. ${event.label} at ${event.timestamp} seconds. ${current.caption}`}>
      <CourtPlan />
      <g className="application-axis" fill="#626b5a" stroke="#a8b29f" strokeWidth="1"><path d="M82 105V345H638 M82 225H638" fill="none" /><g stroke="none" fontSize="13"><text x="82" y="372">0 s</text><text x="605" y="372">4.4 s</text><text x="92" y="114">5 m/s</text><text x="294" y="402">Time in rally</text></g></g>
      <path className="application-path" d={initialPath} fill="none" stroke="#8c9b81" strokeWidth="2.5" strokeLinejoin="round" />
      <g className="application-recovery" fill="none" stroke="#6b805e" strokeWidth="1.5"><path className="application-recovery-path" d={`M${initialPoints[4].x} ${initialPoints[4].y}L${COURT_T.x} ${COURT_T.y}`} strokeDasharray="4 5" /><circle cx={COURT_T.x} cy={COURT_T.y} r="15" /><circle cx={COURT_T.x} cy={COURT_T.y} r="3" fill="#6b805e" /></g>
      <path className="application-highlight" d={initialPath} fill="none" stroke="var(--red)" strokeWidth="3" strokeLinejoin="round" />
      <circle className="application-focus" cx={initialPoints[4].x} cy={initialPoints[4].y} r="23" fill="var(--red)" fillOpacity=".06" stroke="var(--red)" strokeOpacity=".35" />
      {initialPoints.map((point, index) => <circle key={index} className="application-node" cx={point.x} cy={point.y} r={ANALYSIS_SEQUENCE.events.some((shot) => shot.pointIndex === index) ? 6 : 3.5} fill="var(--paper)" stroke="var(--red)" strokeWidth="1.5" />)}
      <path className="application-leader shot-leader" d="M0 0" />
      <g className="application-callout"><rect className="shot-bubble" width="112" height="36" rx="4" /><text className="shot-label" x="12" y="24" fontSize="19">{event.label}</text></g>
    </svg>
    <div className="demo-controls" role="group" aria-label="Insight application">{modes.map((item, index) => <button type="button" key={item.id} aria-pressed={mode === index} onClick={() => setMode(index)}><span>0{index + 1}</span>{item.title}</button>)}</div>
    <p className="demo-description" aria-live="polite">{current.caption}</p>
    <div className="application-shots" role="group" aria-label="Focus a shot"><span>Explore a shot</span>{ANALYSIS_SEQUENCE.events.map((shot, index) => <button type="button" key={shot.id} onClick={() => setFocus(index)} aria-pressed={focus === index}>{shot.label}<span>{shot.timestamp.toFixed(1)} s</span></button>)}</div>
    <span className="application-disclaimer">Illustrative sequence · same underlying data</span>
  </div>;
}
