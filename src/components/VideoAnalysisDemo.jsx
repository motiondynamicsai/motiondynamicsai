import { useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CourtGeometry from './CourtGeometry';
import TrajectoryAnnotations from './TrajectoryAnnotations';
import { addTrajectoryEventAnimations } from '../lib/trajectoryEvents';
import { VIDEO_TRAJECTORY, ANALYSIS_SEQUENCE } from '../data/analysisSequence';
import useReducedMotion from '../lib/useReducedMotion';

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, useGSAP);

const BOUNDS = { x: 108, y: 215, width: 540, height: 230 };
const OBSTACLES = [{ x: 345, y: 324, width: 50, height: 65 }];
const stages = ['Video', 'Track', 'Insight'];
const descriptions = [
  'A camera feed. The movement is already there.',
  'Follow the player. Every position becomes a data point.',
  'Connect movement to shot events and performance.',
];

export default function VideoAnalysisDemo() {
  const root = useRef(null);
  const pathRef = useRef(null);
  const controls = useRef(null);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  useGSAP((context, contextSafe) => {
    let animation;
    let visible = false;
    let userPaused = false;
    const path = pathRef.current;
    const player = root.current.querySelector('.demo-player');
    const tracking = root.current.querySelector('.demo-tracking');
    const metric = root.current.querySelector('.demo-metric');
    const length = path.getTotalLength();
    const cursor = { progress: 0 };
    const placePlayer = () => {
      const position = path.getPointAtLength(length * cursor.progress);
      gsap.set(player, { x: position.x, y: position.y });
    };
    const entries = [...root.current.querySelectorAll('.trajectory-event')].map((node) => ({
      progress: Number(node.dataset.progress), marker: node.querySelector('.shot-marker'), callout: node.querySelector('.shot-callout'),
    }));
    const annotations = entries.flatMap(({ marker, callout }) => [marker, callout]);
    const syncVisibility = () => {
      if (!animation) return;
      if (visible && !document.hidden && !userPaused) animation.play();
      else animation.pause();
    };

    const show = contextSafe((next, autoplay = false) => {
      animation?.kill();
      userPaused = false;
      setStage(next);
      setPlaying(autoplay && !reduced);
      gsap.set(annotations, { opacity: 0 });
      gsap.set(metric, { opacity: 0 });
      if (reduced) {
        const finalStage = autoplay ? 2 : next;
        setStage(finalStage);
        cursor.progress = finalStage === 0 ? 0.1 : 1;
        placePlayer();
        gsap.set(path, { drawSVG: finalStage ? '100%' : '0%' });
        gsap.set(tracking, { opacity: finalStage ? 1 : 0 });
        gsap.set([...annotations, metric], { opacity: finalStage === 2 ? 1 : 0 });
        return;
      }

      animation = gsap.timeline({ paused: true, onComplete: () => setPlaying(false) });
      const start = autoplay ? 0.9 : 0.1;
      const duration = 4;
      cursor.progress = 0;
      placePlayer();
      gsap.set(path, { drawSVG: '0%' });
      gsap.set(tracking, { opacity: next > 0 ? 1 : 0 });

      if (next === 0 && !autoplay) {
        animation.to(cursor, { progress: 0.12, duration: 1.8, ease: 'power1.inOut', onUpdate: placePlayer });
      } else {
        if (autoplay) {
          animation.call(() => setStage(1), [], start)
            .to(tracking, { opacity: 1, duration: 0.3 }, start)
            .call(() => setStage(2), [], 2.4);
        }
        animation.to(path, { drawSVG: '100%', duration, ease: 'none' }, start)
          .to(cursor, { progress: 1, duration, ease: 'none', onUpdate: placePlayer }, start);
        if (next === 2 || autoplay) {
          addTrajectoryEventAnimations(animation, entries, { start, duration });
          animation.to(metric, { opacity: 1, duration: 0.5 }, autoplay ? 2.5 : 0.4);
        }
      }
      syncVisibility();
    });

    controls.current = {
      select: (index) => show(index),
      play: () => show(0, true),
      pause: () => { userPaused = true; animation?.pause(); setPlaying(false); },
    };
    show(0);
    const trigger = ScrollTrigger.create({
      trigger: root.current, start: 'top 95%', end: 'bottom top',
      onToggle: (self) => { visible = self.isActive; syncVisibility(); },
    });
    visible = trigger.isActive;
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    return () => { animation?.kill(); trigger.kill(); controls.current = null; document.removeEventListener('visibilitychange', syncVisibility); };
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  return <div className="process-graphic capture-graphic analysis-demo video-analysis" ref={root} data-ui>
    <div className="demo-header"><span>Input / Camera 01</span><span className={`demo-state ${stage ? 'is-tracking' : ''}`}><i />{['Video feed', 'Player identified', 'Analysis ready'][stage]}</span></div>
    <div className="demo-viewport">
      <svg className="analysis-court" viewBox="70 50 620 425" role="img" aria-label={`${stages[stage]}: ${descriptions[stage]}${stage === 2 ? ' Illustrative Forehand and Backhand events. Peak speed 4.8 metres per second.' : ''}`}>
        <CourtGeometry />
        <path className="demo-movement" ref={pathRef} d={VIDEO_TRAJECTORY.path} fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinejoin="round" />
        <TrajectoryAnnotations pathRef={pathRef} pathData={VIDEO_TRAJECTORY.path} events={VIDEO_TRAJECTORY.events} bounds={BOUNDS} obstacles={OBSTACLES} />
        <g className="demo-player">
          <ellipse cy="13" rx="17" ry="6" fill="var(--ink)" opacity=".12" />
          <circle r="9" fill="var(--ink)" /><path d="M-7 10 Q0 6 7 10" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
          <g className="demo-tracking" fill="none" stroke="var(--red)" strokeWidth="1.8"><path d="M-23-12V-22H-13 M13-22H23V-12 M23 13V23H13 M-13 23H-23V13" /><circle r="16" opacity=".4" /></g>
        </g>
      </svg>
      <div className="demo-metric" aria-hidden={stage !== 2}><span>Peak speed</span><strong>{Math.max(...ANALYSIS_SEQUENCE.points.map((point) => point.speed)).toFixed(1)}<small> m/s</small></strong></div>
    </div>
    <div className="demo-controls" role="group" aria-label="Analysis stage">{stages.map((name, index) => <button type="button" key={name} aria-pressed={stage === index} onClick={() => controls.current?.select(index)}><span>0{index + 1}</span>{name}</button>)}</div>
    <p className="demo-description" aria-live="polite">{descriptions[stage]}</p>
    <div className="demo-footer"><span>Illustrative sequence</span><button type="button" onClick={() => playing ? controls.current?.pause() : controls.current?.play()}>{playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}{reduced ? 'Show analysis' : playing ? 'Pause analysis' : 'Play analysis'}</button></div>
  </div>;
}
