import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const sentences = [
  { before: 'A camera sees ', highlight: 'movement', after: '.' },
  { before: 'We turn it into ', highlight: 'understanding', after: '.' },
  { before: 'For the coach finding an ', highlight: 'edge', after: '.' },
  { before: 'The team building ', highlight: 'consistency', after: '.' },
  { before: 'And everyone taking ', highlight: 'sport', after: ' further.' },
];

// A complete step, including its rotation, takes 1.5 seconds.
const interval = 1.5;
const rotation = 0.35;
const hold = interval - rotation;
const centered = { yPercent: 0, rotationX: 0, z: 0, autoAlpha: 1 };
const below = { yPercent: 100, rotationX: -75, z: -24, autoAlpha: 0.75 };
const above = { yPercent: -100, rotationX: 75, z: -24, autoAlpha: 0.75 };

export default function ManifestoSequence() {
  const root = useRef(null);
  const [current, setCurrent] = useState(0);

  useGSAP(() => {
    const section = root.current;
    const words = [...section.querySelectorAll('.manifesto-sentence')];
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      section.dataset.revolver = 'true';
      setCurrent(0);
      gsap.set(words, { ...below, autoAlpha: 0 });
      gsap.set(words[0], { ...centered });

      // Play once from the first sentence, leaving the final sentence in place.
      const drum = gsap.timeline({ paused: true });
      words.slice(0, -1).forEach((word, index) => {
        const nextIndex = index + 1;
        const start = hold + index * interval;
        drum.fromTo(word, { ...centered }, {
          ...above, duration: rotation, ease: 'power2.inOut', immediateRender: false,
        }, start)
          .fromTo(words[nextIndex], { ...below }, {
            ...centered, duration: rotation, ease: 'power2.inOut', immediateRender: false,
          }, start)
          .set(word, { autoAlpha: 0 }, start + rotation)
          .call(() => setCurrent(nextIndex), [], start + rotation);
      });

      let visible = false;
      const sync = () => drum.paused(!visible || document.hidden);
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        sync();
      }, { threshold: 0.5 });
      observer.observe(section);
      document.addEventListener('visibilitychange', sync);
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);
        drum.kill();
        delete section.dataset.revolver;
      };
    });
    return () => media.revert();
  }, { scope: root });

  return <section className="manifesto section-space" ref={root} aria-label="Built for a deeper understanding">
    <div className="container">
      <p className="kicker">Built for a deeper understanding</p>
      <p className="sr-only">{sentences.map(({ before, highlight, after }) => before + highlight + after).join(' ')}</p>
      <div className="manifesto-text" aria-hidden="true">
        {sentences.map(({ before, highlight, after }) => <p className="manifesto-sentence" key={highlight}>
          {before}<span className="manifesto-highlight">{highlight}</span>{after}
        </p>)}
      </div>
      <p className="manifesto-progress" aria-hidden="true">{String(current + 1).padStart(2, '0')} / 05</p>
    </div>
  </section>;
}
