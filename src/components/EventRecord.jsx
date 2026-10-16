import { useRef } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const events = [
  { name: 'Birmingham Open', country: 'United Kingdom' },
  { name: 'London Classic', country: 'United Kingdom' },
  { name: 'QTerminals Qatar Classic', country: 'Qatar' },
  { name: 'Swedish Open', country: 'Sweden' },
  { name: 'CIB Egyptian Squash Open 2026', country: 'Egypt' },
];

export default function EventRecord() {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%', once: true }, defaults: { ease: 'power3.out' } });
      timeline.from('.record-digit', { yPercent: 100, scale: 0.92, duration: 1.1 })
        .from('.record-arrow', { x: -12, y: 12, opacity: 0, duration: 0.7 }, 0.25)
        .from('.record-heading-line > span', { yPercent: 110, duration: 0.8, stagger: 0.1 }, 0.18)
        .from('.record-context', { y: 10, opacity: 0, duration: 0.65 }, 0.4)
        .from('.event-row-content', { y: 16, opacity: 0, duration: 0.65, stagger: 0.085 }, 0.25)
        .from('.event-rule', { scaleX: 0, transformOrigin: 'left', duration: 0.85, stagger: 0.085 }, 0.3);
    });
    return () => mm.revert();
  }, { scope: root });

  return <section className="event-record" ref={root} aria-labelledby="record-title">
    <div className="container record-layout">
      <div className="record-intro">
        <div className="record-tally" aria-label="5 major PSA events"><span className="record-number" aria-hidden="true"><span className="record-digit">5</span></span><FiArrowUpRight className="record-arrow" aria-hidden="true" /></div>
        <h2 id="record-title"><span className="record-heading-line"><span>Major PSA events.</span></span><span className="record-heading-line"><span>Real-world experience.</span></span></h2>
        <p className="record-context"><span aria-hidden="true" />Analytical technology for PSA</p>
      </div>
      <div className="record-events">
        <div className="event-ledger-heading" aria-hidden="true"><span>On the world stage</span><span>Location</span></div>
        <ol className="event-ledger">{events.map((event, index) => <li key={event.name}>
          <div className="event-row-content"><span className="event-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className="event-name">{event.name}</span><small>{event.country}</small><FiArrowUpRight className="event-row-arrow" aria-hidden="true" /></div>
          <span className="event-rule" aria-hidden="true" />
        </li>)}</ol>
      </div>
    </div>
  </section>;
}
