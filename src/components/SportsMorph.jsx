import { useEffect, useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';
import sportsMorph from '../assets/sports-morph.svg?raw';
import './SportsMorph.css';

export default function SportsMorph() {
  const root = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const svg = root.current.querySelector('svg');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;

    const sync = () => {
      if (preference.matches) svg.setCurrentTime(0);
      const shouldPause = preference.matches || paused || !visible || document.hidden;
      if (shouldPause) svg.pauseAnimations();
      else svg.unpauseAnimations();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.1 });

    svg.pauseAnimations();
    observer.observe(root.current);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      observer.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      svg.pauseAnimations();
    };
  }, [paused]);

  return <figure className="sports-morph" ref={root}>
    <div className="sports-morph__art" dangerouslySetInnerHTML={{ __html: sportsMorph }} />
    <button
      type="button"
      className="sports-morph__toggle"
      onClick={() => setPaused((value) => !value)}
      aria-label={`${paused ? 'Play' : 'Pause'} sport animation`}
      title={`${paused ? 'Play' : 'Pause'} animation`}
    >
      {paused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}
    </button>
  </figure>;
}
