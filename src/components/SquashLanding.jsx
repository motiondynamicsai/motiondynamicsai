import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiRotateCw, FiX } from 'react-icons/fi';
import { mountSquashStage } from '../lib/squashStage';
import { mountCourtStack } from '../lib/squashStack';
import RegisterInterest from './RegisterInterest';
import { BroadcastBanner, MdMark, PageFooter } from './SiteChrome';
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
  { title: 'Shot maps & heatmaps' },
  { title: 'Movement tracking' },
  { title: 'What to work on next' },
  { title: 'Build your profile over time' },
];


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
  const [beat, setBeat] = useState({ title: '', cta: false, index: 0 });
  const [solid, setSolid] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [menu, setMenu] = useState(false);
  const bar = useRef(null);
  const menuEl = useRef(null);
  const menuBtn = useRef(null);

  useEffect(() => {
    stage.current = mountSquashStage(root.current, { onBeat: setBeat, onPlaying: setPlaying });
    return () => stage.current.destroy();
  }, []);
  useEffect(() => {
    stack.current = mountCourtStack(stackCanvas.current);
    return () => stack.current.destroy();
  }, []);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!playing && !menu) return undefined;
    const onKey = (event) => {
      if (event.key === 'Tab' && menu) { // keep focus inside the open menu
        const items = [menuBtn.current, ...menuEl.current.querySelectorAll('a')];
        const at = items.indexOf(document.activeElement);
        const next = event.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : (at === items.length - 1 ? 0 : at + 1);
        event.preventDefault();
        items[next].focus();
        return;
      }
      if (event.key !== 'Escape') return;
      if (menu) { setMenu(false); menuBtn.current?.focus(); }
      if (playing) stage.current.stop();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing, menu]);
  useEffect(() => { // Play hides the button that had focus: hand focus to Close so keyboard and VoiceOver users aren't dropped
    if (playing) root.current.querySelector('.sq-close')?.focus({ preventScroll: true });
  }, [playing]);
  useLayoutEffect(() => { // the menu sits under the bar and covers the page; the page behind does not scroll
    if (!menu) return undefined;
    menuEl.current.style.paddingTop = `${bar.current.getBoundingClientRect().height}px`;
    menuEl.current.querySelector('a')?.focus({ preventScroll: true });
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => { html.style.overflow = ''; document.body.style.overflow = ''; };
  }, [menu]);
  useEffect(() => { if (playing) setMenu(false); }, [playing]);
  const closeMenu = () => { setMenu(false); menuBtn.current?.focus({ preventScroll: true }); };
  const goTo = (id) => (event) => { // close the menu first so the page is free to scroll, then land the section below the bar
    event.preventDefault();
    setMenu(false);
    window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  };
  const play = () => { // on short screens Play can sit below the fold: bring the whole stage into view first
    window.scrollTo({ top: 0 });
    stage.current.play();
  };
  const playStack = () => {
    const courts = stackCanvas.current;
    if (!window.matchMedia('(min-width:720px),(max-height:500px) and (orientation:landscape)').matches) { // phones: all three courts, centred in the screen under the bar
      const box = courts.getBoundingClientRect(), bar = root.current.querySelector('.sq-bar').getBoundingClientRect().bottom;
      window.scrollTo({ top: window.scrollY + box.top - bar - Math.max(0, (window.innerHeight - bar - box.height) / 2) });
    } else courts.scrollIntoView({ block: 'center' });
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
    <header ref={bar} className={`sq-bar${solid ? ' solid' : ''}${playing ? ' live' : ''}${menu ? ' open' : ''}`}>
      <div className="sq-notice"><BroadcastBanner /></div>
      <nav aria-label="Main">
        <Link className="sq-brand" to="/" aria-label="Motion Dynamics home"><MdMark /><span><b>motion</b> <i>dynamics</i></span></Link>
        <div className="sq-links"><a href="#insights">What you get</a><a href="#proof">On the PSA tour</a><Link to="/team">Our team</Link><a className="cta" href="#register" onClick={scrollToRegister}>Register interest</a><button ref={menuBtn} className="sq-menu-btn" type="button" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="sq-menu" onClick={() => (menu ? closeMenu() : setMenu(true))}>{menu ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}</button></div>
      </nav>
      <div className="sq-menu" id="sq-menu" ref={menuEl} hidden={!menu} onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}>
        <a href="#insights" onClick={goTo('insights')}>What you get</a>
        <a href="#proof" onClick={goTo('proof')}>On the PSA World Tour</a>
        <Link to="/team" onClick={() => setMenu(false)}>Our team</Link>
        <a className="cta" href="#register" onClick={(event) => { setMenu(false); scrollToRegister(event); }}>Register interest</a>
      </div>
    </header>

    <div className="sq-track">
      <section className="sq-stage" aria-label="A real pro rally, tracked by Motion Dynamics">
        <picture><source media="(max-width: 720px)" srcSet="/media/squash/squash-2560.jpg" /><img className="sq-plate" src="/media/squash/squash.jpg" alt="" width="3840" height="2143" fetchpriority="high" /></picture>
        <canvas className="sq-overlay" aria-hidden="true" />
        <div className="sq-scrim" />

        <div className="sq-hero">
          <h1><span className="sq-h-pro">Pro-level</span> <span className="sq-h-sq">squash analytics</span> <span className="sq-h-aud">Now for juniors, parents, and coaches</span></h1>
          <div className="sq-offer"><span className="sq-tag">Founding offer</span><span className="sq-deal"><span><b>Free</b>one match analyzed</span><span><b>50%</b>off when we launch</span></span></div>
          <RegisterInterest variant="hero" source="hero" />
          <div className="sq-slot"><button className="sq-play" type="button" onClick={play}><span className="ic" aria-hidden="true"><svg viewBox="0 0 12 14"><path d="M1 1.2v11.6L11 7z" /></svg></span>Watch a pro rally, tracked</button></div>
        </div>
        {playing && <button className="sq-close" type="button" onClick={stop} aria-label="Close the rally and go back"><FiX aria-hidden="true" /></button>}

        <div className="sq-cap" aria-live="polite">
          <div className="sq-cap-in">
            <div className="num"><em className="sq-cap-tag">Track it like the pros</em><i /></div>
            <h2>{beat.title}{beat.index === 0 && <span className="sq-cap-2">Every shot, analyzed.</span>}</h2>
            {beat.cta && <div className="sq-cap-ctas">
              <a className="sq-btn solid" href="#register" onClick={(event) => { stop(); scrollToRegister(event); }}>Register interest</a>
              <button className="sq-btn" type="button" onClick={play}><FiRotateCw aria-hidden="true" /> Replay</button>
            </div>}
          </div>
        </div>

        <aside className="sq-box" aria-hidden="true">
          <div className="names"><span className="nm" style={{ '--c': 'rgb(143,184,255)' }}>Mueller</span><span className="sq-ctx">Men’s pros<br />Rally 38</span><span className="nm r" style={{ '--c': 'rgb(240,194,75)' }}>El Hammamy</span></div>
          <div className="sq-event">&nbsp;</div>
          <div className="sq-rows" />
        </aside>
      </section>
    </div>

    <main id="main">
      <section className="sq-stack" aria-labelledby="stack-title">
        <div className="sq-wrap sq-stack-grid">
          <div>
            <div className="kick">Game by game</div>
            <h2 id="stack-title">Stack the games and the pattern shows.</h2>
            <div className="sq-legend"><span style={{ '--c': 'rgb(143,184,255)' }}>Mueller</span><span style={{ '--c': 'rgb(240,194,75)' }}>El Hammamy</span></div>
            <div className="sq-key"><span><b>Dot</b> where a drive bounced</span><span><b>%</b> drives past the short line</span></div>
            <button className="sq-play" type="button" onClick={playStack}><span className="ic" aria-hidden="true"><svg viewBox="0 0 12 14"><path d="M1 1.2v11.6L11 7z" /></svg></span>Play the stack</button>
          </div>
          <canvas ref={stackCanvas} role="img" aria-label="Three squash courts stacked, one per game, with a dot where each drive bounced" />
        </div>
      </section>

      <section className="sq-after" id="insights">
        <div className="sq-wrap">
          <div className="kick">What you get</div>
          <h2>See what the pros see. <em>On your own matches.</em></h2>
          <div className="sq-insights">{insights.map((item) => <article key={item.title}><h3>{item.title}</h3></article>)}</div>
          <div className="sq-audience"><span>For</span><b>Junior players</b><b>Parents</b><b>Coaches & academies</b></div>
        </div>
      </section>

      <section className="sq-after sq-proof" id="proof">
        <div className="sq-wrap">
          <div className="kick">On the PSA World Tour</div>
          <h2>The tracking behind PSA coverage.</h2>
          <div className="sq-events">{events.map((event) => <div key={event.name} className={event.live ? 'live' : ''}><b>{event.name}</b>{event.live && <i aria-hidden="true" />}<span>{event.note}</span>{event.live && <BroadcastBanner className="sq-ev-gx" aria-hidden="true" />}</div>)}</div>
        </div>
      </section>

      <section className="sq-register" id="register" aria-labelledby="register-title">
        <div className="sq-wrap sq-register-grid">
          <div>
            <div className="kick">Founding offer</div>
            <h2 id="register-title">Register your interest.</h2>
            <div className="sq-deal sq-deal-reg"><span><b>Free</b>one match analyzed</span><span><b>50%</b>off when we launch</span></div>
            <ul className="sq-perks">
              <li><b>Just your name and email.</b><span className="sq-perk-rest"> Nothing to pay.</span></li>
            </ul>
          </div>
          <RegisterInterest variant="panel" source="register-section" />
        </div>
      </section>
    </main>

    <PageFooter />
  </div>;
}
