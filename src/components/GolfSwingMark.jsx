import { useRef } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, useGSAP);

// Three connected strokes let the backswing gather, accelerate into contact,
// and ease through the finish while keeping the original headline footprint.
const phases = [
  { path: 'M55 40 C35 42 17 26 23 10', duration: .7, ease: 'power2.inOut' },
  { path: 'M23 10 C13 29 32 43 55 40', duration: .6, ease: 'power2.in' },
  { path: 'M55 40 C77 37 92 22 98 7', duration: .65, ease: 'power2.out' },
];

export default function GolfSwingMark() {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const paths = [...root.current.querySelectorAll('.golf-arc')];
      const club = root.current.querySelector('.golf-club');
      const ball = root.current.querySelector('.golf-ball');
      const impact = root.current.querySelector('.golf-impact');
      const moveClub = ({ x, y }) => {
        // The shaft always points toward the same virtual grip area. The head
        // sits exactly on the arc, without the bounding-box offset of an icon.
        const angle = Math.atan2(52 - x, y - 10) * 180 / Math.PI;
        club.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`);
      };
      const swing = gsap.timeline({
        repeat: -1, repeatDelay: 3.8,
        scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'bottom top', toggleActions: 'play pause resume pause' },
      });
      swing.set(paths, { drawSVG: '0%' }, 0)
        .set(ball, { attr: { cx: 60, cy: 40 }, opacity: 1 }, 0)
        .set(impact, { attr: { r: 3 }, opacity: 0 }, 0)
        .call(() => moveClub({ x: 55, y: 40 }), [], 0);
      let start = 0;
      paths.forEach((path, index) => {
        const length = path.getTotalLength();
        const progress = { value: 0 };
        const { duration, ease } = phases[index];
        swing.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration, ease, immediateRender: false }, start)
          .fromTo(progress, { value: 0 }, {
            value: 1, duration, ease, immediateRender: false,
            onUpdate: () => moveClub(path.getPointAtLength(length * progress.value)),
          }, start);
        start += duration;
      });
      const contact = phases[0].duration + phases[1].duration;
      swing.to(ball, { attr: { cx: 69, cy: 35 }, opacity: 0, duration: .3, ease: 'power2.out' }, contact)
        .fromTo(impact, { attr: { r: 3 }, opacity: .45 }, { attr: { r: 7 }, opacity: 0, duration: .28, ease: 'power2.out', immediateRender: false }, contact);
      return () => club.setAttribute('transform', 'translate(55 40) rotate(-5.7)');
    });
    return () => mm.revert();
  }, { scope: root });

  return <svg className="inline-motion golf-swing-mark" ref={root} viewBox="0 0 110 50" aria-hidden="true" focusable="false">
    {phases.map((phase, index) => <path key={phase.path} className="golf-arc" d={phase.path} opacity={index === 0 ? .45 : 1} />)}
    <circle className="golf-ball" cx="60" cy="40" r="1.6" />
    <circle className="golf-impact" cx="60" cy="40" r="3" opacity="0" />
    <g className="golf-club" transform="translate(55 40) rotate(-5.7)">
      <path className="golf-shaft" d="M0 -25 V-1" />
      <path className="golf-head" d="M-4 -1 H5 L4 2 H-4 Z" />
    </g>
  </svg>;
}
