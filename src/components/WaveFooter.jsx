import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Brand } from './SiteChrome';
import ContactBackdrop from './ContactBackdrop';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function WaveFooter() {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 90%', once: true } })
        .from('.wave-footer-content > *', { opacity: 0, y: 12, duration: .65, stagger: .09, ease: 'power2.out' })
        .from('.footer-wave-curves', { opacity: 0, y: 18, duration: .9, ease: 'power2.out' }, .1);

    });
    return () => mm.revert();
  }, { scope: root });

  return <footer className="wave-footer" ref={root}>
    <div className="container">
      <div className="wave-footer-content">
        <Brand />
        <p className="wave-footer-statement">Movement is everywhere.<br />Understanding it changes everything.</p>
        <nav className="wave-footer-nav" aria-label="Footer navigation">
          <Link to="/team">Our team</Link><a href="/#impact">Our work</a><a href="/#top">Back to top ↑</a>
        </nav>
        <div className="wave-footer-meta"><small>© {new Date().getFullYear()} Motion Dynamics</small><span>Built around movement.</span></div>
      </div>
    </div>
    <ContactBackdrop />
  </footer>;
}
