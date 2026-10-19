import { useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const partners = [
  { name: 'PSA', file: 'PSA_LOGO.png' },
  { name: 'SquashTV', file: 'squashtv_logo.png' },
  { name: 'Obi Robotics', file: 'obi-robotics.png' },
  { name: 'Teknik', file: 'Teknik_logo.png' },
];

// A single set of logos wraps outside the viewport. No cloned images or links.
export default function PartnerStrip() {
  const root = useRef(null);
  const playback = useRef(null);
  const pausePreference = useRef(false);
  const [paused, setPaused] = useState(false);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const viewport = root.current.querySelector('.partner-window');
      const items = [...root.current.querySelectorAll('.partner-logo')];
      let animation;
      let visible = false;
      let hovered = false;
      let userPaused = pausePreference.current;
      const sync = () => animation?.paused(!visible || hovered || userPaused || document.hidden);
      const arrange = () => {
        animation?.kill();
        const width = viewport.clientWidth;
        const itemWidth = width < 480 ? 110 : 135;
        // Keep four real assets close, with only one offscreen item of space.
        const distance = width + itemWidth;
        gsap.set(items, { position: 'absolute', left: 0, top: 0, width: itemWidth, x: (i) => distance / items.length * i });
        animation = gsap.to(items, { x: `-=${distance}`, duration: distance / 72, repeat: -1, ease: 'none', modifiers: { x: gsap.utils.unitize(gsap.utils.wrap(-itemWidth, distance - itemWidth)) } });
        sync();
      };
      const enter = () => { hovered = true; sync(); };
      const leave = () => { hovered = false; sync(); };
      const resize = new ResizeObserver(arrange);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      arrange();
      resize.observe(viewport);
      observer.observe(viewport);
      viewport.addEventListener('pointerenter', enter);
      viewport.addEventListener('pointerleave', leave);
      document.addEventListener('visibilitychange', sync);
      playback.current = (value) => { userPaused = value; sync(); };
      return () => { animation?.kill(); resize.disconnect(); observer.disconnect(); viewport.removeEventListener('pointerenter', enter); viewport.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', sync); playback.current = null; gsap.set(items, { clearProps: 'all' }); };
    });
    return () => mm.revert();
  }, { scope: root });
  const toggle = () => { const next = !paused; pausePreference.current = next; setPaused(next); playback.current?.(next); };
  return <section className="container partner-strip" ref={root} aria-labelledby="partners-title"><div className="partner-heading"><h2 id="partners-title">Partners and collaborators</h2><button type="button" onClick={toggle} aria-label={paused ? 'Play partner animation' : 'Pause partner animation'} aria-pressed={paused}>{paused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}</button></div><div className="partner-window"><ul aria-label="Our partners and collaborators">{partners.map((partner) => <li className="partner-logo" key={partner.name}><img src={`/media/template/assets/${partner.file}`} alt={partner.name} loading="lazy" /></li>)}</ul></div></section>;
}
