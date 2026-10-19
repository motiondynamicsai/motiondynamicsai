import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiChevronLeft, FiChevronRight, FiPause, FiPlay, FiPlus } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';
import { Navigation } from './SiteChrome';
import { AudienceGlyph } from './MotionGraphics';
import EventRecord from './EventRecord';
import VideoAnalysisDemo from './VideoAnalysisDemo';
import ApplicationDemo from './ApplicationDemo';
import PartnerStrip from './PartnerStrip';
import WaveFooter from './WaveFooter';
import FieldStatistics from './FieldStatistics';
import GolfSwingMark from './GolfSwingMark';
import HeroKeyword from './HeroKeyword';
import TeknikPhone from './TeknikPhone';
import ManifestoSequence from './ManifestoSequence';
import TeamPhoto from '../assets/squash-team-court.jpg';
import ControlRoom from '../assets/squash-control-room.jpg';
import WideControlRoom from '../assets/squash-control-room-wide.jpg';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

const media = '/media/template/assets/';
const fieldStories = [
  { image: TeamPhoto, alt: 'Motion Dynamics team on court at the London Squash Classic', title: 'Where the game happens.', description: 'Our team on court at the London Classic. Bringing research and engineering into the environment where performance matters.', caption: 'London Classic · Motion Dynamics team' },
  { image: ControlRoom, alt: 'Motion Dynamics working at the squash broadcast control desk', title: 'Behind the broadcast.', description: 'Working alongside the production team to turn match footage into analytical insight for PSA’s coverage.', caption: 'On-site analytical technology' },
  { image: WideControlRoom, alt: 'View of the live production desk and squash venue', title: 'Built for the real world.', description: 'From the control room to the court, every event gives us a practical setting to put motion intelligence to work.', caption: 'From camera feed to useful insight' },
];
const audiences = [
  { title: 'Coaches & teams', subtitle: 'A closer look at performance.', copy: 'Understand movement, revisit key moments, and bring a clearer picture into your next coaching conversation. Explore analysis built around your sport and your workflow.', action: 'Book a demo', actionCaption: 'See the technology', subject: 'Coaching and team demo', graphic: 'coaching' },
  { title: 'Event & broadcast teams', subtitle: 'More insight in every rally.', copy: 'Bring tracking and analytics into your coverage. We work with your camera feeds and production needs to make performance easier to see and explain.', action: 'Discuss an event', actionCaption: 'Bring insight to your coverage', subject: 'Event and broadcast analytics', graphic: 'broadcast' },
  { title: 'Partners & investors', subtitle: 'Help move the technology forward.', copy: 'Explore a company combining sports expertise, research, and practical deployment. Squash is our strongest proof; applications across sports are the next conversation.', action: 'Partner or invest', actionCaption: 'Build what comes next', subject: 'Partnership and investment enquiry', graphic: 'growth' },
];
const emailFor = (subject) => `mailto:contact@motiondynamics.ai?subject=${encodeURIComponent(subject)}`;

function MotionVideo({ src, poster, label, className = '' }) {
  const videoRef = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      if (visible && !preference.matches && !userPaused.current && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.15 });
    observer.observe(video);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); preference.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); video.pause(); };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (video.paused) { userPaused.current = false; video.play().catch(() => {}); }
    else { userPaused.current = true; video.pause(); }
  };

  return <div className={`motion-video ${className}`}>
    <video ref={videoRef} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button className="video-control" type="button" onClick={togglePlayback} aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}>{playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}<span>{playing ? 'Pause' : 'Play'} film</span></button>
  </div>;
}

function FieldCarousel() {
  const root = useRef(null);
  const [current, setCurrent] = useState(0);
  const story = fieldStories[current];
  const move = (direction) => setCurrent((value) => (value + direction + fieldStories.length) % fieldStories.length);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.field-photo img', { opacity: 0, scale: 1.06, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: root.current, start: 'top 90%', once: true } });
      gsap.from('.field-story [aria-live]', { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: root.current, start: 'top 90%', once: true } });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [current], revertOnUpdate: true });
  return <div className="field-carousel" ref={root}>
    <div className="field-photo"><img src={story.image} alt={story.alt} loading="lazy" key={story.image} /></div>
    <div className="field-story">
      <p className="kicker">From the court</p>
      <div aria-live="polite" aria-atomic="true"><h3>{story.title}</h3><p>{story.description}</p><span className="image-caption">{story.caption}</span></div>
      <div className="carousel-controls"><span>{String(current + 1).padStart(2, '0')} / 03</span><button type="button" onClick={() => move(-1)} aria-label="Previous event story"><FiChevronLeft /></button><button type="button" onClick={() => move(1)} aria-label="Next event story"><FiChevronRight /></button></div>
    </div>
  </div>;
}

function AudienceAccordion() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const sequence = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } });
      sequence.from('.is-active .glyph-path', { drawSVG: '0%', duration: 1, ease: 'power2.inOut' })
        .from('.is-active .audience-content', { opacity: 0, y: 14, duration: 0.55, ease: 'power2.out' }, 0.1);
      gsap.delayedCall(0.65, () => ScrollTrigger.refresh());
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, { scope: root, dependencies: [active], revertOnUpdate: true });
  return <div className="audience-accordion" ref={root}>{audiences.map((audience, index) => <article className={`audience-panel ${active === index ? 'is-active' : ''}`} key={audience.title} onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches && !root.current.contains(document.activeElement)) setActive(index); }}>
    <h3><button type="button" onClick={() => setActive(index)} aria-expanded={active === index} aria-controls={`audience-content-${index}`} id={`audience-trigger-${index}`}><span>{audience.title}</span><FiPlus aria-hidden="true" /></button></h3>
    <AudienceGlyph type={audience.graphic} />
    <p className="audience-preview" hidden={active === index} aria-hidden="true">{audience.subtitle}</p>
    <div className="audience-content" id={`audience-content-${index}`} role="region" aria-labelledby={`audience-trigger-${index}`} hidden={active !== index}>
      <h4>{audience.subtitle}</h4><p>{audience.copy}</p>
    </div>
  </article>)}</div>;
}

export default function LandingPage() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-title .title-line', { y: 46, opacity: 0, duration: 1.1, stagger: 0.13, ease: 'power3.out' });
      gsap.utils.toArray('.enter').forEach((element) => {
        gsap.from(element, { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
      });
      gsap.fromTo('.reading-progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true } });
      gsap.from('.path-symbol path', { drawSVG: '0%', duration: 1.5, ease: 'power2.inOut', scrollTrigger: { trigger: '.benefit-grid', start: 'top 90%', once: true } });
      gsap.utils.toArray('.process-panel').forEach((panel) => {
        gsap.from(panel, { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: panel, start: 'top 92%', once: true } });
      });
      gsap.from('.line-symbol i', { scaleY: 0.2, stagger: 0.1, duration: 0.65, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.benefit-grid', start: 'top 85%', once: true } });
    });
    let mounted = true;
    const refresh = () => { if (mounted) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => { mounted = false; mm.revert(); window.removeEventListener('load', refresh); };
  }, { scope: root });


  return <>
    <Navigation />
    <main id="main" className="home-page" ref={root}>
      <div className="reading-progress" aria-hidden="true" />
      <a className="event-announcement" href="#us-open"><span className="announcement-dot" aria-hidden="true" /><span>U.S. Open Championships <strong>1–7 November 2026 · Philadelphia</strong></span><span className="announcement-role">Analytical technology for PSA <FiArrowUpRight aria-hidden="true" /></span></a>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="container">
          <p className="kicker hero-kicker">A clearer view of performance</p>
          <h1 className="hero-title" id="hero-title" aria-label="Every move. More meaning."><span className="title-line">Every move.</span><span className="title-line hero-title-dynamic"><span>More</span><HeroKeyword /></span></h1>
          <div className="hero-composition">
            <div className="hero-copy enter"><p>Turn sports video into a deeper understanding of performance. Real-time motion intelligence for coaches, teams, and the people moving sport forward.</p><div className="hero-actions"><a className="button button-red" href="#contact">Explore a demo <FiArrowUpRight aria-hidden="true" /></a><a className="text-link" href="#impact">See it in action <FiArrowRight aria-hidden="true" /></a></div><span className="hero-note">Built around your sport. Proven on court.</span></div>
          </div>
        </div>
      </section>

      <EventRecord />

      <section className="understanding section-space" id="performance"><div className="container"><div className="section-heading enter"><p className="kicker">From footage to feedback</p><h2>Make every frame<br />work <GolfSwingMark /> for you.</h2><p>See the patterns behind the performance. Bring movement, decisions, and development into focus.</p></div>
        <div className="benefit-grid">
          <article className="benefit-feature enter"><img src="/media/event/player-development.png" alt="Player movement analysis for coaching" loading="lazy" /><div className="benefit-feature-copy"><span className="kicker">For coaches & teams</span><h3>Better questions.<br />Clearer feedback.</h3><p>Go back to the moments that matter. Use movement analysis to inform training and make coaching conversations more concrete.</p><a className="circle-link" href={emailFor('Coaching and team demo')} aria-label="Discuss coaching analytics"><FiArrowUpRight /></a></div></article>
          <article className="benefit-detail enter"><span className="line-symbol" aria-hidden="true"><i /><i /><i /><i /><i /></span><div><h3>Follow the movement.</h3><p>Track players, the ball, and how play unfolds. Find useful detail within the speed of the game.</p></div></article>
          <article className="benefit-detail benefit-red enter"><span className="path-symbol" aria-hidden="true"><svg viewBox="0 0 160 50"><path d="M0 40 C30 40 25 5 55 5 S85 45 110 30 S140 5 160 5" /><circle cx="151" cy="8" r="5" /></svg></span><div><h3>Build the bigger picture.</h3><p>Connect individual moments to patterns across rallies, sessions, and matches.</p></div></article>
        </div>
      </div></section>

      <section className="field-section section-space" id="impact"><div className="container"><div className="field-heading enter"><div><p className="kicker">Our strongest proof is in play</p><h2>Squash moves fast.<br /><em>We keep up.</em></h2></div><p>Five major PSA events covered. Motion Dynamics provides analytical technology to PSA, helping turn elite squash footage into useful insight for its coverage.</p></div>
        <div className="broadcast-feature enter"><MotionVideo src={`${media}squash-open-2026-womens.mp4`} poster={`${media}squash-open-2026-womens-poster.jpg`} label="PSA match analysis footage" /><div className="broadcast-caption"><span>Player tracking. Ball tracking. A new view of the rally.</span><span>Technology by Motion Dynamics</span></div></div>
        <FieldStatistics />
        <FieldCarousel />
        <article className="us-open-panel enter" id="us-open"><div><p className="kicker">Next on court · Philadelphia, USA</p><h3>U.S. Open<br />Championships 2026</h3></div><div className="us-open-details"><p className="event-dates"><time dateTime="2026-11-01">1</time>–<time dateTime="2026-11-07">7 November</time><span>2026 · Arlen Specter US Squash Center</span></p><p>PSA covers and broadcasts the competition. Motion Dynamics supplies the analytical technology behind the insights.</p><a className="text-link" href="https://usopensquash.com/tickets/" target="_blank" rel="noopener noreferrer">Official event & schedule <FiArrowUpRight aria-hidden="true" /></a></div></article>
      </div></section>

      <ManifestoSequence />

      <section className="technology section-space" id="pipeline"><div className="container"><div className="section-heading enter"><p className="kicker">The technology, made useful</p><h2>From camera.<br />To clarity.</h2><p>A connected process, built around the sport, the setting, and the decisions you need to make.</p></div><div className="process-stack">
        <article className="process-panel"><div className="process-inner"><div className="process-copy"><span className="kicker">Capture</span><h3>It starts<br />with your video.</h3><p>Bring us your broadcast, venue, or training footage. We build a video pipeline around your environment and the movements you want to understand.</p><span className="process-foot">Camera feeds → Video pipeline</span></div><VideoAnalysisDemo /></div></article>
        <article className="process-panel process-understand"><div className="process-inner"><div className="process-copy"><span className="kicker">Understand</span><h3>Movement becomes<br />meaningful data.</h3><p>Computer vision follows the action. Player and ball tracking, motion analysis, and 3D reconstruction reveal detail that is difficult to see at full speed.</p><span className="process-foot">Tracking → Motion intelligence</span></div><MotionVideo src={`${media}torkey_3d_dive.mp4`} poster={`${media}torkey_3d_dive-poster.jpg`} label="3D movement reconstruction" /></div></article>
        <article className="process-panel process-apply"><div className="process-inner"><div className="process-copy"><span className="kicker">Apply</span><h3>Insight that<br />fits your world.</h3><p>Bring analysis into coaching, player development, or broadcast storytelling. The output is designed for the people who will actually use it.</p><span className="process-foot">Analysis → Coaching & coverage</span></div><ApplicationDemo /></div></article>
      </div></div></section>

      <section className="beyond-squash section-space" id="teknik"><div className="container beyond-grid"><div className="beyond-copy enter"><p className="kicker">Proven in squash. Built to go further.</p><h2>Different sports.<br /><em>Same curiosity.</em></h2><p>Our work with Teknik brings motion analysis into tennis. The same approach—video, movement, understanding—opens conversations across sports.</p><p>For partners and investors, this is the opportunity: help develop technology with real experience on court and room to grow.</p><a className="text-link" href={emailFor('Multi-sport partnership enquiry')}>Explore what we could build <FiArrowUpRight aria-hidden="true" /></a></div><TeknikPhone /></div><PartnerStrip /></section>

      <section className="audiences section-space" id="uses">
        <div className="container" id="contact">
          <div className="section-heading enter">
            <p className="kicker">A shared interest in better performance</p>
            <h2>What could you<br />see differently?</h2>
            <p>See the technology, talk through your event, or explore where we could go together.</p>
          </div>
          <AudienceAccordion />
          <div className="contact-options" role="group" aria-label="Start a conversation">
            {audiences.map((audience) => <a key={audience.title} href={emailFor(audience.subject)}>
              <span>{audience.actionCaption}</span>
              <strong>{audience.action}<FiArrowUpRight aria-hidden="true" /></strong>
            </a>)}
          </div>
          <div className="contact-bottom audience-contact">
            <a href="mailto:contact@motiondynamics.ai">contact@motiondynamics.ai</a>
            <Link to="/team">Meet the people behind it <FiArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
    <WaveFooter />
  </>;
}
