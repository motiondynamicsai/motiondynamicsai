import { useEffect, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';

import AngelStaff from './assets/Staff images/Angel-NoBG.png';
import DiarStaff from './assets/Staff images/Diar-NoBG.png';
import ErfanStaff from './assets/Staff images/Erfan-NoBG.png';
import GeniaStaff from './assets/Staff images/Genia-NoBG.png';
import JonCookStaff from './assets/Staff images/JonCook-NoBG.png';
import JonStaff from './assets/Staff images/Jon-NoBG.png';
import MaxStaff from './assets/Staff images/Max-NoBG.png';
import MaxWardStaff from './assets/Staff images/MaxWard-NoBG.png';
import MelikaStaff from './assets/Staff images/Melika-NoBG.png';
import StuStaff from './assets/Staff images/Stu-NoBG.png';
import ScreenshotImage from './assets/Screenshot.jpg';
import SquashControlRoomPhoto from './assets/squash-control-room.jpg';
import SquashControlRoomWidePhoto from './assets/squash-control-room-wide.jpg';
import SquashTeamPhoto from './assets/squash-team-court.jpg';
import TreeImage from './assets/Tree.jpg';
import ModelVideo from './assets/3D-Model/WhatsApp Video 2026-09-07 at 17.19.12.mp4';

const team = [
  {
    id: 'diar-karim',
    name: 'Diar Karim',
    title: 'Post-doctoral Research Fellow',
    subtitle: 'Founder and leader',
    group: 'Core team',
    image: DiarStaff,
    content:
      'Diar Karim is a postdoctoral research scientist at the University of Birmingham currently working on immersive augmented and virtual reality technologies. He brings research, software development, motion capture, and psychophysics together to create scientific experiences from first principles.',
  },
  {
    id: 'stuart-macgregor',
    name: 'Stuart MacGregor',
    title: 'MSc Computer Science graduate',
    subtitle: 'Founder and leader',
    group: 'Core team',
    image: StuStaff,
    content:
      "Stuart MacGregor is a professional squash player and research assistant at the University of Birmingham. With a BSc in Human Biology and a Masters in Computer Science, Stuart's interests lie in artificial intelligence, motion capture, and their applications in enhancing sports experiences.",
  },
  {
    id: 'jonathan-tate',
    name: 'Jonathan Tate',
    title: 'University of Birmingham Head Squash Coach',
    subtitle: 'Director',
    group: 'Collaborators',
    image: JonStaff,
    content:
      'Jonathan Tate is the Head Squash Coach at the University of Birmingham and a director at Motion Dynamics, connecting high-performance coaching with the practical needs of athletes and teams.',
  },
  {
    id: 'max-di-luca',
    name: 'Max Di Luca',
    title: 'Associate Professor',
    subtitle: 'Co-founder',
    group: 'Business support',
    image: MaxStaff,
    summary:
      'Associate Professor exploring how the brain combines sensory information for perception and action.',
    content:
      'Max Di Luca is an Associate Professor at the University of Birmingham in the CNCR research centre. Using psychophysical methods and computational models, he investigates how the human brain processes multisensory information for perception and action. He earned the Laurea in Psychology from the Universita di Trieste and a PhD in Cognitive Science from Brown University, and has worked with the Max Planck Institute, Oculus Research, and Facebook Reality Labs.',
  },
  {
    id: 'genia-penksik',
    name: 'Genia Penksik',
    title: 'Technical Consultant',
    subtitle: 'Co-founder',
    group: 'Technical team',
    image: GeniaStaff,
    content:
      'Genia Penksik is a research assistant and co-founder, supporting the team as it turns motion data into useful tools for athletes, coaches, and broadcast partners.',
  },
  {
    id: 'john-cook',
    name: 'John Cook',
    title: 'Business Advisor',
    subtitle: 'Advisor',
    group: 'Business support',
    image: JonCookStaff,
    content: 'John Cook supports Motion Dynamics with experience, perspective, and practical guidance as the company grows across sport, technology, and media.',
  },
  {
    id: 'max-ward',
    name: 'Max Ward',
    title: 'Business Advisor',
    subtitle: 'Advisor',
    group: 'Business support',
    image: MaxWardStaff,
    content: 'Max Ward brings business and commercial insight to the team, helping turn motion intelligence into useful partnerships and products.',
  },
  {
    id: 'angel',
    name: 'Angel',
    title: 'Machine Learning Engineer',
    subtitle: 'Motion intelligence',
    group: 'Technical team',
    image: AngelStaff,
    content: 'Angel contributes to the technical work behind Motion Dynamics, helping make movement data clear, useful, and ready for real-world applications.',
  },
  {
    id: 'melika',
    name: 'Melika',
    title: 'Full stack developer',
    subtitle: 'Motion intelligence',
    group: 'Technical team',
    image: MelikaStaff,
    content: 'Melika contributes to the research and product thinking that turns computer vision into better tools for athletes, coaches, and partners.',
  },
  {
    id: 'erfan',
    name: 'Erfan',
    title: 'Full stack developer',
    subtitle: 'Motion intelligence',
    group: 'Technical team',
    image: ErfanStaff,
    content: 'Erfan helps build the systems that transform live video and movement into actionable intelligence.',
  },
];

const teamSections = [
  { number: '01', title: 'Core team', ids: ['diar-karim', 'stuart-macgregor'] },
  { number: '02', title: 'Business support', ids: ['max-di-luca', 'john-cook', 'max-ward'] },
  { number: '03', title: 'Technical team', ids: ['angel', 'genia-penksik', 'melika', 'erfan'] },
  { number: '04', title: 'Collaborators', ids: ['jonathan-tate'] },
];

const asset = (name) => `/media/${name}`;

const casePhotos = [
  { image: asset('event/squash-open-audience.jpg'), alt: 'Audience at Squash Open 2026' },
  { image: SquashTeamPhoto, alt: 'Motion Dynamics team on a squash court' },
  { image: SquashControlRoomPhoto, alt: 'Motion Dynamics team operating the live production system' },
  { image: SquashControlRoomWidePhoto, alt: 'Squash Open control room from the audience' },
];

const partnerLogos = [
  { image: asset('template/assets/PSA_LOGO.png'), alt: 'PSA' },
  { image: asset('template/assets/squashtv_logo.png'), alt: 'SquashTV' },
  { image: asset('template/assets/obi-robotics.png'), alt: 'Obi Robotics' },
  { image: asset('template/assets/Teknik_logo.png'), alt: 'Teknik' },
];

function useReveal() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('in'));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [location.pathname]);
}

function Navigation({ teamPage = false }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const sectionLink = (id) => `/#${id}`;

  return (
    <nav className="site-nav">
      <div className="nav-in">
        <Link className="logo" to="/" onClick={close}>MOTION<b>DYNAMICS</b></Link>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span /><span />
        </button>
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          <li><NavLink className={teamPage ? 'active' : ''} to="/team" onClick={close}>Team</NavLink></li>
          <li><a href={sectionLink('impact')} onClick={close}>Impact</a></li>
          <li><a href={sectionLink('pipeline')} onClick={close}>Pipeline</a></li>
          <li><a href={sectionLink('uses')} onClick={close}>Use cases</a></li>
          <li><a className="btn btn-primary btn-sm" href={sectionLink('contact')} onClick={close}>Book a demo</a></li>
        </ul>
      </div>
    </nav>
  );
}

function Eyebrow({ children, className = '' }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

const heroWords = ['Intelligence', 'Stats', 'Performance', 'Accuracy', 'Speed', 'Distance'];

function HeroRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % heroWords.length), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return <span className="hero-rotator"><span className="hero-rotator-sizer" aria-hidden="true">{heroWords.map((word) => <span key={word}>{word}</span>)}</span><span className="hero-rotator-word" key={heroWords[index]}>{heroWords[index]}</span></span>;
}

function Viewport({ image, poster, video, alt = '', className = '', children }) {
  return (
    <div className={`viewport ${className}`}>
      {video ? <video src={video} poster={poster} autoPlay muted loop playsInline aria-label={alt} /> : image ? <img src={image} alt={alt} /> : null}
      <span className="corner" />
      {children}
    </div>
  );
}

function CasePhotoGallery({ photos }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || photos.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActiveIndex((value) => (value + 1) % photos.length), 3200);
    return () => window.clearInterval(timer);
  }, [paused, photos.length]);

  return (
    <div className="case-photo-gallery reveal" aria-label="Squash Open event photos" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="case-gallery-stage" aria-live="polite">
        {photos.map((photo, index) => <img className={index === activeIndex ? 'is-active' : ''} key={photo.alt} src={photo.image} alt={photo.alt} />)}
        <span className="corner" />
        <span className="case-gallery-counter">{String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
      </div>
      <div className="case-gallery-thumbs" role="tablist" aria-label="Choose event photo">
        {photos.map((photo, index) => <button className={index === activeIndex ? 'is-active' : ''} key={`thumb-${photo.alt}`} type="button" role="tab" aria-label={`Show ${photo.alt}`} aria-selected={index === activeIndex} onClick={() => setActiveIndex(index)}><img src={photo.image} alt="" /></button>)}
      </div>
    </div>
  );
}

function Hud({ position, children }) {
  return <span className={`hud ${position}`}>{children}</span>;
}

function SiteFooter() {
  return (
    <footer>
      <div className="wrap foot">
        <Link className="logo" to="/">MOTION<b>DYNAMICS</b></Link>
        <span className="mono">MOTIONDYNAMICS.AI · EST. FIELD-PROVEN</span>
        <small>© 2026 Motion Dynamics. All rights reserved.</small>
      </div>
    </footer>
  );
}

function HomePage() {
  useReveal();
  return (
    <>
      <Navigation />
      <main>
        <header className="hero" id="top">
          <div className="wrap">
            <div>
              <Eyebrow>Video-to-intelligence pipelines</Eyebrow>
              <h1 aria-label="Live video in. Live Intelligence out."><span aria-hidden="true">Live video in.<br /><span className="dim">Live <HeroRotator /> out.</span></span></h1>
              <p className="lede">Bespoke tracking pipelines for the world&apos;s fastest sports. Real-time. Broadcast-grade. Built around you.</p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#impact">See it live</a>
                <a className="btn btn-ghost" href="#contact">Book a demo</a>
              </div>
            </div>
            <Viewport className="hero-viewport reveal" video={asset('template/assets/hero.mp4')} poster={asset('template/assets/hero-poster.jpg')} alt="Live motion tracking footage">
              <Hud position="tl">CAM_01 · 120FPS</Hud>
              <Hud position="tr"><span className="rec" />LIVE</Hud>
              <Hud position="br">LATENCY 0.00s</Hud>
            </Viewport>
          </div>
        </header>

        <section className="proof" style={{ paddingTop: 0 }}>
          <div className="wrap">
              <div className="stat-bar reveal">
                <div className="stat"><div className="stat-list"><span>Real time</span><span><em>120</em> FPS+</span></div></div>
                <div className="stat"><div className="stat-list"><span>Low latency</span><span>High ingest rate</span></div></div>
                <div className="stat"><div className="stat-list"><span><em>33</em> Matches</span><span><em>788</em> Rallies</span></div></div>
                <div className="stat"><div className="stat-list"><span><em>8M+</em> Data points</span><span><em>13</em> Days running</span></div></div>
              </div>
            <div className="partner-block reveal">
              <h2>Partners and Collaborators</h2>
              <div className="logo-marquee" aria-label="Partners and Collaborators">
                <div className="logo-track">
                  <PartnerLogoSet />
                  <PartnerLogoSet duplicate />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="case" id="impact">
          <div className="wrap">
            <Eyebrow className="reveal">Proven live · Squash Open 2026 × PSA</Eyebrow>
            <h2 className="reveal">100% in-play coverage.</h2>
            <p className="sub reveal">The world&apos;s premier squash tournament. 40,000+ live viewers on SquashTV. No second takes.</p>
            <div className="case-grid">
              <div className="media-stack reveal">
                <Viewport video={asset('template/assets/squash-open-2026-womens.mp4')} poster={asset('template/assets/squash-open-2026-womens-poster.jpg')} alt="Squash Open 2026 live match footage">
                  <Hud position="tl">MATCH 47 · FINAL</Hud>
                  <Hud position="tr"><span className="rec" />ON AIR</Hud>
                </Viewport>
                <CasePhotoGallery photos={casePhotos} />
              </div>
              <div className="case-copy">
                <div className="fact reveal"><h3>The challenge</h3><p>One of the fastest sports on earth. Live to a global audience. Any failure happens on air.</p></div>
                <div className="fact reveal"><h3>What we built</h3><p>A full video-to-intelligence pipeline feeding SquashTV&apos;s live broadcast. Data, visuals, and stories — as the rally happens.</p></div>
                <div className="fact result reveal"><h3>The result</h3><p>Every match tracked. Men&apos;s and women&apos;s. Day 1 to day 7. Nothing missed, nothing dropped.</p></div>
                <div className="reveal"><a className="btn btn-ghost btn-sm" href="#contact">Build your live pipeline →</a></div>
                <Viewport className="square case-model reveal" video={ModelVideo} alt="3D motion model visualization" />
              </div>
            </div>
          </div>
        </section>

        <section className="pipeline" id="pipeline">
          <div className="wrap">
            <Eyebrow className="reveal">What we do</Eyebrow>
            <h2 className="reveal">One pipeline.<br />Any sport. Any movement.</h2>
            <p className="sub reveal">A portable video-to-intelligence pipeline that adapts to the problem in front of you — from live entertainment to player development, recruiting, and competitive analysis.</p>
            <div className="pipe-grid">
              <div className="pipe-card reveal"><div className="step">Ingest</div><h3>Any camera. Any feed.</h3><p>120FPS+ video ingest from broadcast, venue, or training footage.</p></div>
              <div className="pipe-card reveal"><div className="step">Intelligence</div><h3>Tracked in real time.</h3><p>Players, ball, and movement — extracted live, with frame-level detail.</p></div>
              <div className="pipe-card reveal"><div className="step">Impact</div><h3>Stories, instantly.</h3><p>Broadcast graphics, coaching insights, scouting data. Ready the moment it happens.</p></div>
            </div>
            <div className="bespoke reveal"><p>Portable across every use case. <em>Built around the problem you need to solve.</em></p><a className="btn btn-primary btn-sm" href="#contact">Talk to us</a></div>
          </div>
        </section>

        <section className="uses" id="uses">
          <div className="wrap">
            <Eyebrow className="reveal">Who it&apos;s for</Eyebrow>
            <h2 className="reveal">One pipeline. Four ways to win.</h2>
            <div className="use-grid">
              <UseCard image={asset('event/broadcast-crowd.png')} title="Entertainment" text="Live graphics that turn every rally into a story." />
              <UseCard image={asset('event/player-development.png')} title="Player development" text="Frame-level detail coaches can act on." />
              <UseCard image={TreeImage} title="Recruiting & scouting" text="See talent the way data sees it." />
              <UseCard image={asset('template/teknik-analysis.png')} title="Competitive analysis" text="Compare movement, decisions, and outcomes across sessions or matches." />
            </div>
          </div>
        </section>

        <section className="scale">
          <div className="wrap scale-grid">
            <div>
              <Eyebrow className="reveal">Every scale</Eyebrow>
              <h2 className="reveal">World tours.<br />And world-class business.</h2>
              <p className="reveal">The same quality we deliver to the PSA powers Teknik — the world&apos;s leading tennis serve analysis startup. Elite isn&apos;t a company size. It&apos;s a standard.</p>
              <blockquote className="reveal">“Motion Dynamics turns complex movement into clear, useful feedback for every serve.”<cite>Teknik · tennis serve analysis</cite></blockquote>
            </div>
            <Viewport className="tall reveal" image={ScreenshotImage} alt="Tennis motion analysis visualization">
              <Hud position="tl">SERVE_04 · 194 KM/H</Hud>
              <img className="teknik-mark" src={asset('template/assets/Teknik_logo.png')} alt="Teknik" />
            </Viewport>
          </div>
        </section>

        <section className="cta" id="contact">
          <div className="wrap"><h2 className="reveal">Your sport. Your data.<br />Your story.</h2><p className="reveal">Told in real time. Let&apos;s build your pipeline.</p><div className="cta-row reveal"><a className="btn btn-primary" href="mailto:contact@motiondynamics.ai">Book a demo</a><a className="btn btn-ghost" href="mailto:contact@motiondynamics.ai">contact@motiondynamics.ai</a></div></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function UseCard({ image, title, text }) {
  return <div className="use-card reveal"><Viewport image={image} alt={title} /><div className="txt"><h3>{title}</h3><p>{text}</p></div></div>;
}

function PartnerLogoSet({ duplicate = false }) {
  return <div className={`logo-set ${duplicate ? 'logo-set-duplicate' : ''}`} aria-hidden={duplicate || undefined}>{partnerLogos.map((logo) => <div className={`logo-chip ${logo.alt === 'SquashTV' ? 'logo-chip-squashtv' : ''}`} key={logo.alt}><img src={logo.image} alt={duplicate ? '' : logo.alt} /></div>)}</div>;
}

function TeamCard({ member }) {
  return (
    <Link className="member member-flip reveal" to={`/team/${member.id}`} aria-label={`View profile for ${member.name}`}>
      <div className="member-card-inner">
        <div className="member-face member-front">
          <div className="member-photo"><img src={member.image} alt={member.name} /></div>
          <div className="member-front-copy"><h3>{member.name}</h3><div className="role">{member.title}</div><p className="bio">{member.subtitle}</p></div>
        </div>
        <div className="member-face member-back">
          <span className="member-photo-label">Profile</span><h3>{member.name}</h3><div className="role">{member.title}</div><p>{member.summary || member.content}</p><span className="member-more">View full profile <span aria-hidden="true">↗</span></span>
        </div>
      </div>
    </Link>
  );
}

function TeamPage() {
  useReveal();
  return (
    <>
      <Navigation teamPage />
      <main className="team-page">
        <header className="page-head team-hero"><div className="wrap"><Eyebrow>The people behind the pipeline</Eyebrow><h1>Built by a team<br /><span className="dim">obsessed with motion.</span></h1><p className="lede">Researchers, engineers, advisors, and sports specialists — the people turning every frame into useful intelligence.</p></div></header>
        <section className="team"><div className="wrap"><div className="team-intro"><span className="team-intro-line" /><p>Meet the people behind Motion Dynamics</p></div>{teamSections.map((section) => <div className={`team-group team-group-${section.title.toLowerCase().replace(/\s+/g, '-')}`} key={section.title}><div className="team-section-heading"><span className="team-index">{section.number}</span><div><Eyebrow>{section.title}</Eyebrow><h2>{section.title}</h2></div></div><div className={`team-grid team-grid-${section.ids.length}`}>{section.ids.map((id) => { const member = team.find((person) => person.id === id); return member ? <TeamCard member={member} key={member.id} /> : null; })}</div></div>)}</div></section>
        <section className="cta"><div className="wrap"><h2 className="reveal">Want to build with us?</h2><p className="reveal">We&apos;re always looking for people obsessed with sport, video, and real-time intelligence.</p><div className="cta-row reveal"><a className="btn btn-primary" href="mailto:contact@motiondynamics.ai">Get in touch</a><a className="btn btn-ghost" href="mailto:contact@motiondynamics.ai">contact@motiondynamics.ai</a></div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}

function TeamMemberPage() {
  useReveal();
  const { id } = useParams();
  const member = team.find((person) => person.id === id);
  if (!member) return <><Navigation teamPage /><main className="not-found"><h1>Team member not found.</h1><Link className="btn btn-primary" to="/team">Back to Team</Link></main></>;
  return <><Navigation teamPage /><main className="member-detail"><div className="wrap"><Link className="back-link" to="/team">← Back to Team</Link><div className="member-detail-grid"><div><Eyebrow>Motion Dynamics team</Eyebrow><h1>{member.name}</h1><p className="detail-role">{member.title} · {member.subtitle}</p></div><img src={member.image} alt={member.name} /></div><p className="detail-copy">{member.content}</p></div></main><SiteFooter /></>;
}

function App() {
  return <BrowserRouter><Routes><Route path="/" element={<HomePage />} /><Route path="/team" element={<TeamPage />} /><Route path="/team/:id" element={<TeamMemberPage />} /></Routes></BrowserRouter>;
}

export default App;
