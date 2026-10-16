import { useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiCheck, FiChevronRight, FiPlay, FiRotateCcw, FiWifi } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TennisVideo from '../assets/skeleton_overlay_tennis_v2.mp4';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const techniques = [
  { name: 'Stance', score: 85, time: '00:02', tone: 'strong' },
  { name: 'Toss', score: 54, time: '00:03', tone: 'developing' },
  { name: 'Forward swing', score: 57, time: '00:03', tone: 'developing' },
  { name: 'Follow through', score: 27, time: '00:04', tone: 'focus' },
];

// The layered phone takes its 3D approach from Hover.dev's Floating Phone.
// Clipping stays on the screen, so the outer assembly preserves its depth.
export default function TeknikPhone() {
  const root = useRef(null);
  const orientation = useRef(null);
  const setView = useRef(null);
  const freezeView = useRef(null);
  const [straight, setStraight] = useState(false);
  const [selected, setSelected] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const highlightsButton = useRef(null);
  const backButton = useRef(null);
  const wasVideoOpen = useRef(false);

  useEffect(() => {
    if (videoOpen) backButton.current?.focus({ preventScroll: true });
    else if (wasVideoOpen.current) highlightsButton.current?.focus({ preventScroll: true });
    wasVideoOpen.current = videoOpen;
  }, [videoOpen]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const phone = root.current.querySelector('.phone-body');
      gsap.from(phone, { z: -35, y: 30, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } });
      gsap.fromTo('.phone-float', { y: 14 }, { y: -14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      const isStraight = orientation.current.classList.contains('is-straight');
      gsap.set(orientation.current, { rotationX: isStraight ? 0 : 3, rotationY: isStraight ? 0 : -7, rotation: isStraight ? 0 : 2 });
      const rotateX = gsap.quickTo(orientation.current, 'rotationX', { duration: 0.7, ease: 'power3.out' });
      const rotateY = gsap.quickTo(orientation.current, 'rotationY', { duration: 0.7, ease: 'power3.out' });
      const rotateZ = gsap.quickTo(orientation.current, 'rotation', { duration: 0.7, ease: 'power3.out' });
      freezeView.current = () => { rotateX.tween.pause(); rotateY.tween.pause(); rotateZ.tween.pause(); };
      setView.current = (flat, x = 0, y = 0) => {
        rotateX(flat ? 0 : 3 - y * 3);
        rotateY(flat ? 0 : -7 + x * 6);
        rotateZ(flat ? 0 : 2 + x);
      };
      return () => { setView.current = null; freezeView.current = null; };
    });
    return () => mm.revert();
  }, { scope: root });

  const move = (event) => {
    if (straight || event.pointerType !== 'mouse') return;
    if (event.target.closest('.phone-face')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setView.current?.(false, (event.clientX - rect.left) / rect.width - 0.5, (event.clientY - rect.top) / rect.height - 0.5);
  };
  const toggleView = () => {
    const next = !straight;
    setStraight(next);
    setView.current?.(next);
  };

  return <figure className="teknik-showcase" ref={root}>
    <div className="phone-stage" onPointerMove={move} onPointerLeave={() => setView.current?.(straight)}>
      <div className="phone-floor" aria-hidden="true" />
      <div className="phone-float">
        <div className={`phone-orientation ${straight ? 'is-straight' : ''}`} ref={orientation}>
          <div className="phone-body">
            <div className="phone-back" aria-hidden="true" />
            <span className="phone-button phone-button-volume" aria-hidden="true" />
            <span className="phone-button phone-button-power" aria-hidden="true" />
            <div className="phone-face" onPointerEnter={() => freezeView.current?.()} onFocusCapture={() => freezeView.current?.()}>
              <div className="phone-screen" data-ui>
                <div className="teknik-app">
                  <div className="app-status" aria-hidden="true"><span>9:41</span><span><FiWifi /><i /></span></div>
                  <header className="app-brand-header"><img src="/media/template/assets/Teknik_logo.png" alt="Teknik" width="338" height="150" loading="lazy" /><span>Tennis<br />serve analysis</span></header>
                  {videoOpen ? <div className="app-video-view"><button ref={backButton} type="button" onClick={() => setVideoOpen(false)}><FiArrowLeft aria-hidden="true" />Technique breakdown</button><h3>Video highlights</h3><video src={TennisVideo} controls muted playsInline preload="metadata" aria-label="Illustrative tennis footage with movement tracking" /><p>Tennis tracking · illustrative footage</p></div> : <>
                    <div className="app-title"><span>Your serve, in detail</span><h3>Technique<br />Breakdown</h3></div>
                    <button className="app-highlights" ref={highlightsButton} type="button" onClick={() => setVideoOpen(true)}><FiPlay aria-hidden="true" />Video highlights<FiChevronRight aria-hidden="true" /></button>
                    <div className="app-techniques" role="group" aria-label="Tennis technique breakdown">{techniques.map((technique, index) => <button type="button" key={technique.name} className={`app-technique ${selected === index ? 'is-selected' : ''}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
                      <span className={`technique-score ${technique.tone}`}>{technique.score}</span><span className="technique-name">{technique.name}<small><FiCheck aria-hidden="true" />{selected === index ? 'Selected for review' : 'Technique analysis'}</small></span><FiChevronRight aria-hidden="true" /><span className="technique-time">View {technique.time}</span><span className="technique-detail">{selected === index ? 'Reviewing' : 'Show details'}</span>
                    </button>)}</div>
                    <p className="app-selection" aria-live="polite">{techniques[selected].name} · Score {techniques[selected].score}/100</p>
                  </>}
                </div>
                <span className="phone-camera" aria-hidden="true"><i /></span>
                <span className="phone-home-indicator" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <figcaption><span>Explore the technique breakdown</span><button className="phone-view-control" type="button" onClick={toggleView} aria-pressed={straight}><FiRotateCcw aria-hidden="true" />{straight ? 'Restore angle' : 'View straight on'}</button></figcaption>
  </figure>;
}
