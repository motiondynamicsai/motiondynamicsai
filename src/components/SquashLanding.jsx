import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { mountSquashStage } from '../lib/squashStage';
import { mountCourtStack } from '../lib/squashStack';
import RegisterInterest from './RegisterInterest';
import './SquashLanding.css';

const events = [
  { name: 'U.S. Open 2026', note: 'Philadelphia · live now', live: true },
  { name: 'CIB Egyptian Open', note: 'PSA' },
  { name: 'Qatar Classic', note: 'PSA' },
  { name: 'London Classic', note: 'PSA' },
  { name: 'Swedish Open', note: 'PSA' },
  { name: 'Birmingham Open', note: 'PSA' },
];
const insights = [
  { title: 'Shot maps & heatmaps', copy: 'Every shot’s flight, wall height and bounce. See where your length lands, game by game, and where it drifts under pressure.' },
  { title: 'Movement tracking', copy: 'How far you run, how quickly you recover to the T and how you cover each corner of the court, measured frame by frame.' },
  { title: 'Clear next steps', copy: 'Plain-English insights a player, parent or coach can act on in the next session, not just a wall of numbers.' },
];

function Mark() {
  return <svg viewBox="22.25 22.33 825.54 824.55" aria-hidden="true"><use href="/media/squash/md-mark.svg#md-mark" /></svg>;
}

const scrollToRegister = (event) => {
  event.preventDefault();
  document.getElementById('register')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  window.setTimeout(() => document.querySelector('#register input')?.focus({ preventScroll: true }), 700);
};

export default function SquashLanding() {
  const root = useRef(null);
  const stage = useRef(null);
  const stackCanvas = useRef(null);
  const stack = useRef(null);
  const [beat, setBeat] = useState({ title: '', body: '', cta: false, index: 0 });
  const [solid, setSolid] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pcts, setPcts] = useState(null);

  useEffect(() => {
    stage.current = mountSquashStage(root.current, { onBeat: setBeat, onPlaying: setPlaying });
    return () => stage.current.destroy();
  }, []);
  useEffect(() => {
    stack.current = mountCourtStack(stackCanvas.current, { onPct: setPcts });
    return () => stack.current.destroy();
  }, []);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!playing) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') stage.current.stop(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing]);
  const play = () => { // on short screens Play can sit below the fold: bring the whole stage into view first
    window.scrollTo({ top: 0 });
    stage.current.play();
  };
  const playStack = () => {
    stackCanvas.current.scrollIntoView({ block: 'center' });
    stack.current.play();
  };
  const stop = () => stage.current.stop();
  useEffect(() => {
    const previous = document.title;
    document.title = 'Motion Dynamics · Pro-level squash analytics for juniors';
    return () => { document.title = previous; };
  }, []);

  return <div className="sq" ref={root}>
    <a className="sq-skip" href="#register">Skip to register</a>
    <header className={`sq-bar${solid ? ' solid' : ''}`}>
      <div className="sq-notice"><span className="dot" aria-hidden="true" /><span><b>U.S. Open</b> · 1–7 November 2026 · Philadelphia<span className="sq-notice-extra"> · our analytics are on court</span></span></div>
      <nav aria-label="Main">
        <Link className="sq-brand" to="/" aria-label="Motion Dynamics home"><Mark /><span><b>motion</b> <i>dynamics</i></span></Link>
        <div className="sq-links"><a href="#insights">What you get</a><a href="#proof">On the PSA tour</a><Link to="/team">Our team</Link><a className="cta" href="#register" onClick={scrollToRegister}>Register interest</a></div>
      </nav>
    </header>

    <div className="sq-track">
      <section className="sq-stage" aria-label="A real pro rally, tracked by Motion Dynamics">
        <picture><source media="(max-width: 720px)" srcSet="/media/squash/squash-1920.jpg" /><img className="sq-plate" src="/media/squash/squash.jpg" alt="" width="3840" height="2143" fetchpriority="high" /></picture>
        <canvas className="sq-overlay" aria-hidden="true" />
        <div className="sq-scrim" />

        <div className="sq-hero">
          <div className="sq-kicker">Squash analytics · Juniors, parents & coaches</div>
          <h1><span className="l"><span>Pro-level analytics.</span></span><span className="l"><span>Supercharge your game.</span></span></h1>
          <p className="sq-lede">The real-time tracking behind PSA coverage at the U.S. Open, now for junior players.<span className="sq-desk"> See every shot, every movement and exactly what to work on next.</span></p>
          <div className="sq-offer"><span className="sq-tag">Founding offer</span><span className="sq-desk">Register now:</span> <b>one match analysed free</b> + <b>50% off</b></div>
          <RegisterInterest variant="hero" source="hero" />
          <button className="sq-play" type="button" onClick={play}><span className="ic" aria-hidden="true"><svg viewBox="0 0 12 14"><path d="M1 1.2v11.6L11 7z" /></svg></span>Watch a pro rally, tracked</button>
        </div>
        {playing && <button className="sq-close" type="button" onClick={stop} aria-label="Close the rally and go back">✕ <span>Close</span></button>}

        <div className="sq-cap" aria-live="polite">
          <div className="sq-cap-in">
            <div className="num"><b>Rally 38</b><span>Real PSA tracking</span><i /></div>
            <h2>{beat.title}</h2>
            <p>{beat.body}</p>
            {beat.cta && <div className="sq-cap-ctas">
              <a className="sq-btn solid" href="#register" onClick={(event) => { stop(); scrollToRegister(event); }}>Register your interest <span className="ar">→</span></a>
              <button className="sq-btn" type="button" onClick={play}>↻ Replay</button>
            </div>}
          </div>
        </div>

        <aside className="sq-box" aria-hidden="true">
          <div className="names"><span className="nm" style={{ '--c': 'rgb(143,184,255)' }}>Mueller</span><span className="sq-ctx">Men’s pros<br />Rally 38</span><span className="nm r" style={{ '--c': 'rgb(240,194,75)' }}>El Hammamy</span></div>
          <div className="sq-event">&nbsp;</div>
          <div className="sq-rows" />
          <div className="sq-note" />
        </aside>
      </section>
    </div>

    <main id="main">
      <section className="sq-stack" aria-labelledby="stack-title">
        <div className="sq-wrap sq-stack-grid">
          <div>
            <div className="kick">One match, three games</div>
            <h2 id="stack-title">Stack the games. <em>See the pattern.</em></h2>
            <p>One court per game, every drive’s bounce marked.{pcts && ` Mueller found more length each game: ${pcts[0]}%, then ${pcts[1]}%, then ${pcts[2]}% behind the short line.`}</p>
            <div className="sq-legend"><span style={{ '--c': 'rgb(143,184,255)' }}>Mueller</span><span style={{ '--c': 'rgb(240,194,75)' }}>El Hammamy</span></div>
            <button className="sq-play" type="button" onClick={playStack}><span className="ic" aria-hidden="true"><svg viewBox="0 0 12 14"><path d="M1 1.2v11.6L11 7z" /></svg></span>Play the stack</button>
          </div>
          <canvas ref={stackCanvas} role="img" aria-label="Three squash courts stacked, one per game, with a dot where each drive bounced" />
        </div>
      </section>

      <section className="sq-after" id="insights">
        <div className="sq-wrap">
          <div className="kick">What you get</div>
          <h2>The insight the pros get. <em>Built for the player you’re becoming.</em></h2>
          <div className="sq-insights">{insights.map((item, i) => <article key={item.title}><span>0{i + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
          <div className="sq-audience"><span>For</span><b>Junior players</b><b>Parents</b><b>Coaches & academies</b></div>
        </div>
      </section>

      <section className="sq-after sq-proof" id="proof">
        <div className="sq-wrap">
          <div className="kick">On the PSA World Tour</div>
          <h2>Powering analytics at the top of the game. <em>Live at the U.S. Open this week.</em></h2>
          <div className="sq-events">{events.map((event) => <div key={event.name} className={event.live ? 'live' : ''}><b>{event.name}</b>{event.live && <i aria-hidden="true" />}{event.note}</div>)}</div>
        </div>
      </section>

      <section className="sq-register" id="register" aria-labelledby="register-title">
        <div className="sq-wrap sq-register-grid">
          <div>
            <div className="kick">Founding members</div>
            <h2 id="register-title">Register your interest.</h2>
            <ul className="sq-perks">
              <li><b>One match analysed free.</b> Send us a match, get the full breakdown.</li>
              <li><b>50% off</b> when we launch, locked in as a founding member.</li>
              <li><b>Just your name and email.</b> No payment, no commitment.</li>
            </ul>
          </div>
          <RegisterInterest variant="panel" source="register-section" />
        </div>
      </section>
    </main>

    <footer className="sq-footer">
      <Link className="sq-brand" to="/" aria-label="Motion Dynamics home"><Mark /><span><b>motion</b> <i>dynamics</i></span></Link>
      <div><Link to="/team">Our team</Link><a href="mailto:contact@motiondynamics.ai">contact@motiondynamics.ai</a><small>© {new Date().getFullYear()} Motion Dynamics</small></div>
    </footer>
  </div>;
}
