import { useEffect, useRef } from 'react';

const MEDIA = '/media/squash/';
const metrics = ['Time in front: Wilhelmi 51.0%, ElShorbagy 49.0%', 'Distance: Wilhelmi 2716 m, ElShorbagy 2936 m', 'Good length: Wilhelmi 65.0%, ElShorbagy 64.2%'];

// The coach platform's film room: the screen recording loops in a window, the metric panels and the match timeline sit over its lower edge.
export default function FilmRoom() {
  const root = useRef(null);
  const video = useRef(null);
  useEffect(() => {
    const el = root.current, v = video.current;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData; // the poster alone: no motion, no megabytes
    const near = new IntersectionObserver(([entry]) => { // fetch the recording only as the section comes up
      if (!entry.isIntersecting) return;
      near.disconnect();
      if (!still) { v.muted = true; v.src = `${MEDIA}film-room.mp4`; }
    }, { rootMargin: '600px 0px' });
    const seen = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('in'); if (v.src) v.play().catch(() => {}); } // a refused autoplay leaves the poster
      else v.pause();
    }, { threshold: 0.2 });
    near.observe(el); seen.observe(el);
    return () => { near.disconnect(); seen.disconnect(); v.pause(); };
  }, []);

  return <figure className="sq-film" ref={root} role="img" aria-label="The film room: a coach filters a match to one player's unforced errors and plays each clip, with time in front, distance and good length compared for both players">
    <div className="sq-film-win">
      <div className="sq-film-bar" aria-hidden="true"><i /><i /><i /><span>Film room</span></div>
      <video ref={video} poster={`${MEDIA}film-room-poster.webp`} width="1280" height="620" loop playsInline autoPlay preload="none" disablePictureInPicture aria-hidden="true" tabIndex={-1} />
    </div>
    <div className="sq-film-card sq-film-metrics" aria-hidden="true">{metrics.map((alt, i) => <img key={alt} src={`${MEDIA}film-metric-${i + 1}.webp`} alt="" width="1000" height="360" loading="lazy" decoding="async" />)}</div>
    <div className="sq-film-card sq-film-events" aria-hidden="true"><img src={`${MEDIA}film-events.webp`} alt="" width="760" height="318" loading="lazy" decoding="async" /></div>
  </figure>;
}
