import { useEffect, useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';
import CricketHeading from './CricketHeading';
import './CricketSection.css';

const media = '/media/cricket/';

export default function CricketSection() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const wantsPlayback = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let visible = false;
    wantsPlayback.current = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sync = () => {
      if (visible && wantsPlayback.current && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .15 });

    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, []);

  const playDemo = () => {
    wantsPlayback.current = true;
    videoRef.current?.play().catch(() => {});
  };

  const pauseDemo = () => {
    wantsPlayback.current = false;
    videoRef.current?.pause();
  };

  return <section className="cricket-section section-space" id="cricket" aria-labelledby="cricket-title">
    <div className="container">
      <div className="cricket-heading enter">
        <div className="cricket-title-block">
          <p className="kicker cricket-section-label">Real environments</p>
          <CricketHeading />
        </div>
        <p className="cricket-intro">A bowler’s release. A batter’s timing. Moments worth a closer look. Explore how video and motion analysis can bring more detail to the next coaching conversation.</p>
      </div>

      <div className="cricket-showcase">
        <div className="cricket-insights">
          <article className="cricket-insight cricket-insight-movement enter">
            <div className="cricket-insight-visual">
              <img className="cricket-insight-media" src={`${media}cricket-at-the-crease.webp`}
                alt="A batter playing a shot with a wicketkeeper behind the stumps on a grass cricket pitch" width="1200" height="1600" loading="lazy" decoding="async" />
            </div>
            <span className="cricket-insight-index" aria-hidden="true">01</span>
            <div className="cricket-insight-copy">
              <h3>Follow the movement.</h3>
              <p>Look at the ball, the body and the key moments within a delivery.</p>
            </div>
          </article>
          <article className="cricket-insight cricket-insight-pattern enter">
            <div className="cricket-insight-visual">
              <video ref={videoRef} className="cricket-insight-media" src={`${media}cricket-delivery.mp4`} poster={`${media}cricket-delivery-poster.webp`}
                muted loop playsInline preload="metadata" aria-label="A cricket player practising a delivery at the nets"
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
            </div>
            <span className="cricket-insight-index" aria-hidden="true">02</span>
            <div className="cricket-insight-copy">
              <h3>Build the bigger picture.</h3>
              <p>Connect individual deliveries to patterns across spells, sessions and matches.</p>
              <button className="cricket-insight-action" type="button" onClick={playing ? pauseDemo : () => playDemo()} aria-label={playing ? 'Pause the cricket demo' : 'Play the cricket demo'}>
                {playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>;
}
