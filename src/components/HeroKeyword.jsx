import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const keywords = ['Meaning', 'Stats', 'Performance', 'Accuracy', 'Speed', 'Intelligence', 'Distance'];
const hold = 2;
const rotation = .6;
const centered = { y: 0, yPercent: 0, rotationX: 0, z: 0, autoAlpha: 1 };
const below = { y: 0, yPercent: 90, rotationX: -78, z: -28, autoAlpha: .72 };
const above = { y: 0, yPercent: -90, rotationX: 78, z: -28, autoAlpha: .72 };

export default function HeroKeyword() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const words = [...root.current.querySelectorAll('.hero-keyword-word')];
      gsap.set(words, { ...below, autoAlpha: 0 });
      gsap.set(words[0], { ...centered });

      // One repeating timeline owns both faces of each upward drum rotation.
      const drum = gsap.timeline({ repeat: -1, paused: true });
      words.forEach((word, index) => {
        const next = words[(index + 1) % words.length];
        const start = hold + index * (hold + rotation);
        drum.fromTo(word, { ...centered }, {
          ...above, duration: rotation, ease: 'power2.inOut', immediateRender: false,
        }, start)
          .fromTo(next, { ...below }, {
            ...centered, duration: rotation, ease: 'power2.inOut', immediateRender: false,
          }, start)
          .set(word, { autoAlpha: 0 }, start + rotation);
      });

      let visible = false;
      const sync = () => drum.paused(document.hidden || !visible);
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      observer.observe(root.current);
      document.addEventListener('visibilitychange', sync);
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);
      };
    });
    return () => mm.revert();
  }, { scope: root });

  // Every face occupies the same in-flow grid cell. The widest word reserves
  // the slot, and the text needs no absolute-position or font-dependent offset.
  return <em className="hero-keyword" ref={root} aria-hidden="true">
    <span className="hero-keyword-mask">
      {keywords.map((word) => <span className="hero-keyword-word" key={word}>{word}</span>)}
    </span>
    <span className="hero-keyword-period">.</span>
  </em>;
}
