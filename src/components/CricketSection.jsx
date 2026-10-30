import { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiPause, FiPlay } from 'react-icons/fi';
import CricketHeading from './CricketHeading';
import './CricketSection.css';

const media = '/media/cricket/';

export default function CricketSection() {
  const [view, setView] = useState('pitch');
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const wantsPlayback = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    let visible = false;
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
  }, [view]);

  const playDemo = (bringIntoView = false) => {
    wantsPlayback.current = true;
    if (view !== 'nets') {
      setPlaying(false);
      setView('nets');
    } else videoRef.current?.play().catch(() => {});
    if (bringIntoView) stageRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'center',
    });
  };

  const pauseDemo = () => {
    wantsPlayback.current = false;
    videoRef.current?.pause();
  };

  const chooseView = (nextView) => {
    if (nextView === view) return;
    wantsPlayback.current = nextView === 'nets';
    videoRef.current?.pause();
    setPlaying(false);
    setView(nextView);
  };

  const durationLabel = duration
    ? `${String(Math.floor(duration / 60)).padStart(2, '0')}:${String(Math.floor(duration % 60)).padStart(2, '0')}`
    : 'Demo film';

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
        <figure className={`cricket-feature-media enter${playing ? ' is-playing' : ''}`} id="cricket-view" ref={stageRef}>
          {view === 'nets'
            ? <video ref={videoRef} src={`${media}cricket-delivery.mp4`} poster={`${media}cricket-delivery-poster.webp`}
              muted loop playsInline preload="metadata" aria-label="A delivery at our cricket demo"
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
            : <img className="cricket-pitch-photo" src={`${media}cricket-at-the-crease.webp`}
              alt="A batter playing a shot with a wicketkeeper behind the stumps on a grass cricket pitch" width="1200" height="1600" />}
          <div className="cricket-media-scrim" aria-hidden="true" />
          <span className="cricket-media-label" aria-live="polite">{view === 'nets' ? 'In the nets' : 'At the crease'}</span>
          {view === 'nets' && <button className="cricket-media-toggle" type="button" onClick={playing ? pauseDemo : () => playDemo()} aria-label={playing ? 'Pause cricket demo' : 'Resume cricket demo'}>{playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}</button>}
          <figcaption className="cricket-media-caption">
            <h3>A closer<br />perspective.</h3>
            <p>See how a different angle can reveal the detail behind performance.</p>
          </figcaption>
          {view === 'nets' && <span className="cricket-duration" aria-label={`Film duration ${durationLabel}`}>{durationLabel}</span>}
        </figure>

        <div className="cricket-insights">
          <article className="cricket-insight cricket-insight-movement enter">
            <img className="cricket-insight-photo" src={`${media}cricket-analysis-detail.webp`} alt="Cricket analysis on a laptop beside the practice nets" width="479" height="586" loading="lazy" decoding="async" />
            <span className="cricket-insight-index" aria-hidden="true">01</span>
            <div className="cricket-insight-copy">
              <h3>Follow the movement.</h3>
              <p>Look at the ball, the body and the key moments within a delivery.</p>
              <button className="cricket-insight-action" type="button" onClick={() => playDemo(true)} aria-label="Watch the cricket demo"><FiArrowUpRight aria-hidden="true" /></button>
            </div>
          </article>
          <article className="cricket-insight cricket-insight-pattern enter">
            <img className="cricket-insight-photo" src={`${media}cricket-camera-detail.webp`} alt="A camera mounted beside the cricket practice nets" width="623" height="833" loading="lazy" decoding="async" />
            <span className="cricket-insight-index" aria-hidden="true">02</span>
            <div className="cricket-insight-copy">
              <h3>Build the bigger picture.</h3>
              <p>Connect individual deliveries to patterns across spells, sessions and matches.</p>
            </div>
          </article>
        </div>

        <div className="cricket-views enter" role="group" aria-label="Choose a cricket view">
          <button type="button" aria-pressed={view === 'pitch'} aria-controls="cricket-view" onClick={() => chooseView('pitch')}><span aria-hidden="true">01</span>At the crease</button>
          <button type="button" aria-pressed={view === 'nets'} aria-controls="cricket-view" onClick={() => chooseView('nets')}><span aria-hidden="true">02</span>In the nets</button>
        </div>
      </div>
    </div>
  </section>;
}
