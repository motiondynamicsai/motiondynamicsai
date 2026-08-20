import { useEffect, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';

const team = [
  {
    id: 'diar-karim',
    name: 'Diar Karim',
    title: 'Post-doctoral Research Fellow',
    subtitle: 'Founder and leader',
    image: '/media/team/diar.png',
    content:
      'Diar Karim is a postdoctoral research scientist at the University of Birmingham currently working on immersive augmented and virtual reality technologies. He brings research, software development, motion capture, and psychophysics together to create scientific experiences from first principles.',
  },
  {
    id: 'stuart-macgregor',
    name: 'Stuart MacGregor',
    title: 'MSc Computer Science graduate',
    subtitle: 'Founder and leader',
    image: '/media/team/stuart.jpg',
    content:
      "Stuart MacGregor is a professional squash player and research assistant at the University of Birmingham. With a BSc in Human Biology and a Masters in Computer Science, Stuart's interests lie in artificial intelligence, motion capture, and their applications in enhancing sports experiences.",
  },
  {
    id: 'jonathan-tate',
    name: 'Jonathan Tate',
    title: 'University of Birmingham Head Squash Coach',
    subtitle: 'Director',
    image: '/media/team/jonathan.jpg',
    content:
      'Jonathan Tate is the Head Squash Coach at the University of Birmingham and a director at Motion Dynamics, connecting high-performance coaching with the practical needs of athletes and teams.',
  },
  {
    id: 'max-di-luca',
    name: 'Max Di Luca',
    title: 'Associate Professor',
    subtitle: 'Co-founder',
    image: '/media/team/max.jpg',
    content:
      'Max Di Luca is an Associate Professor at the University of Birmingham in the CNCR research centre. Using psychophysical methods and computational models, he investigates how the human brain processes multisensory information for perception and action. He earned the Laurea in Psychology from the Universita di Trieste and a PhD in Cognitive Science from Brown University, and has worked with the Max Planck Institute, Oculus Research, and Facebook Reality Labs.',
  },
  {
    id: 'genia-penksik',
    name: 'Genia Penksik',
    title: 'Research assistant',
    subtitle: 'Co-founder',
    image: '/media/team/genia.png',
    content:
      'Genia Penksik is a research assistant and co-founder, supporting the team as it turns motion data into useful tools for athletes, coaches, and broadcast partners.',
  },
];

const asset = (name) => `/media/${name}`;

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
          <li><a href={sectionLink('case')} onClick={close}>Squash Open 2026</a></li>
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

function Viewport({ image, poster, video, alt = '', className = '', children }) {
  return (
    <div className={`viewport ${className}`}>
      {video ? <video src={video} poster={poster} autoPlay muted loop playsInline aria-label={alt} /> : image ? <img src={image} alt={alt} /> : null}
      <span className="corner" />
      {children}
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
              <h1>Live video in.<br /><span className="dim">Live intelligence out.</span></h1>
              <p className="lede">Bespoke tracking pipelines for the world&apos;s fastest sports. Real-time. Broadcast-grade. Built around you.</p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#case">See it live</a>
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
              <div className="stat"><div className="n"><em>0%</em> downtime</div><div className="l">Seven days live</div></div>
              <div className="stat"><div className="n"><em>100%</em> real-time</div><div className="l">Zero-delay intelligence</div></div>
              <div className="stat"><div className="n"><em>120</em>FPS+</div><div className="l">Ingest rate, minimum</div></div>
              <div className="stat"><div className="n"><em>100%</em> coverage</div><div className="l">Every match, both draws</div></div>
            </div>
            <div className="logo-row reveal" aria-label="Partners">
              <div className="logo-chip"><img src={asset('template/assets/PSA_LOGO.png')} alt="PSA" /></div>
              <div className="logo-chip"><img src={asset('template/assets/squashtv_logo.png')} alt="SquashTV" /></div>
              <div className="logo-chip"><img src={asset('template/assets/Teknik_logo.png')} alt="Teknik" /></div>
              <div className="logo-chip text-chip">MOTION DATA<br />PARTNERS</div>
            </div>
          </div>
        </section>

        <section className="case" id="case">
          <div className="wrap">
            <Eyebrow className="reveal">Proven live · Squash Open 2026 × PSA</Eyebrow>
            <h2 className="reveal">Seven days. Every match.<br />Zero downtime.</h2>
            <p className="sub reveal">The world&apos;s premier squash tournament. 40,000+ live viewers on SquashTV. No second takes.</p>
            <div className="case-grid">
              <div className="media-stack reveal">
                <Viewport video={asset('template/assets/squash-open-2026-womens.mp4')} poster={asset('template/assets/squash-open-2026-womens-poster.jpg')} alt="Squash Open 2026 live match footage">
                  <Hud position="tl">MATCH 47 · FINAL</Hud>
                  <Hud position="tr"><span className="rec" />ON AIR</Hud>
                </Viewport>
                <div className="media-row">
                  <Viewport className="square" image={asset('event/squash-open-audience.jpg')} alt="Audience at Squash Open 2026"><Hud position="br">AUDIENCE</Hud></Viewport>
                  <Viewport className="square" image={asset('event/squash-open-court.jpg')} alt="Squash court at Squash Open 2026"><Hud position="br">COURT FEED</Hud></Viewport>
                </div>
                <Viewport className="gallery-wide" image={asset('event/squash-open-control-room.jpg')} alt="Squash Open production control room"><Hud position="br">PRODUCTION</Hud></Viewport>
              </div>
              <div className="case-copy">
                <div className="fact reveal"><h3>The challenge</h3><p>One of the fastest sports on earth. Live to a global audience. Any failure happens on air.</p></div>
                <div className="fact reveal"><h3>What we built</h3><p>A full video-to-intelligence pipeline feeding SquashTV&apos;s live broadcast. Data, visuals, and stories — as the rally happens.</p></div>
                <div className="fact result reveal"><h3>The result</h3><p>Every match tracked. Men&apos;s and women&apos;s. Day 1 to day 7. Nothing missed, nothing dropped.</p></div>
                <div className="reveal"><a className="btn btn-ghost btn-sm" href="#contact">Build your live pipeline →</a></div>
              </div>
            </div>
          </div>
        </section>

        <section className="pipeline" id="pipeline">
          <div className="wrap">
            <Eyebrow className="reveal">What we do</Eyebrow>
            <h2 className="reveal">One pipeline.<br />Video to intelligence.</h2>
            <p className="sub reveal">We don&apos;t sell software off the shelf. We build the pipeline your sport actually needs.</p>
            <div className="pipe-grid">
              <div className="pipe-card reveal"><div className="step">Ingest</div><h3>Any camera. Any feed.</h3><p>120FPS+ video ingest from broadcast, venue, or training footage.</p></div>
              <div className="pipe-card reveal"><div className="step">Intelligence</div><h3>Tracked in real time.</h3><p>Players, ball, and movement — extracted live, with frame-level detail.</p></div>
              <div className="pipe-card reveal"><div className="step">Impact</div><h3>Stories, instantly.</h3><p>Broadcast graphics, coaching insights, scouting data. Ready the moment it happens.</p></div>
            </div>
            <div className="bespoke reveal"><p>No one else covers broadcast, development, and scouting in one package. <em>That&apos;s why the best in the world work with us.</em></p><a className="btn btn-primary btn-sm" href="#contact">Talk to us</a></div>
          </div>
        </section>

        <section className="uses" id="uses">
          <div className="wrap">
            <Eyebrow className="reveal">Who it&apos;s for</Eyebrow>
            <h2 className="reveal">One pipeline. Four ways to win.</h2>
            <div className="use-grid">
              <UseCard image={asset('event/broadcast-crowd.png')} title="Broadcast" text="Live graphics that make every rally a story." />
              <UseCard image={asset('event/player-development.png')} title="Player development" text="Frame-level detail coaches can act on." />
              <UseCard image={asset('event/performance-analytics.png')} title="Recruiting & scouting" text="See talent the way data sees it." />
              <UseCard image={asset('template/teknik-analysis.png')} title="Training analysis" text="Every session, measured and comparable." />
            </div>
          </div>
        </section>

        <section className="scale">
          <div className="wrap scale-grid">
            <div>
              <Eyebrow className="reveal">Every scale</Eyebrow>
              <h2 className="reveal">World tours.<br />And world-class startups.</h2>
              <p className="reveal">The same quality we deliver to the PSA powers Teknik — the world&apos;s leading tennis serve analysis startup. Elite isn&apos;t a company size. It&apos;s a standard.</p>
              <blockquote className="reveal">“Motion Dynamics turns complex movement into clear, useful feedback for every serve.”<cite>Teknik · tennis serve analysis</cite></blockquote>
            </div>
            <Viewport className="tall reveal" image={asset('template/teknik-analysis.png')} alt="Tennis motion analysis visualization">
              <Hud position="tl">SERVE_04 · 194 KM/H</Hud>
              <img className="teknik-mark" src={asset('template/assets/Teknik_logo.png')} alt="Teknik" />
            </Viewport>
          </div>
        </section>

        <section className="next">
          <div className="wrap next-grid">
            <div>
              <Eyebrow className="reveal">What&apos;s next</Eyebrow>
              <h2 className="reveal">Next up: cricket.</h2>
              <p className="reveal">Bowling action. Batting performance. Training intelligence for one of the world&apos;s biggest sports — and more to come.</p>
              <div className="sport-tags reveal"><span className="tag on">Squash</span><span className="tag on">Tennis</span><span className="tag">Cricket · 2026</span><span className="tag">Your sport?</span></div>
            </div>
            <Viewport className="reveal" image={asset('template/assets/reconstruction-3d-poster.jpg')} alt="3D movement reconstruction preview"><Hud position="tl">BOWL_ACTION · ANALYSIS</Hud></Viewport>
          </div>
        </section>

        <section className="cta" id="contact">
          <div className="wrap"><h2 className="reveal">Your sport. Your data.<br />Your story.</h2><p className="reveal">Told in real time. Let&apos;s build your pipeline.</p><div className="cta-row reveal"><a className="btn btn-primary" href="mailto:hello@motiondynamics.ai">Book a demo</a><a className="btn btn-ghost" href="mailto:hello@motiondynamics.ai">hello@motiondynamics.ai</a></div></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function UseCard({ image, title, text }) {
  return <div className="use-card reveal"><Viewport image={image} alt={title} /><div className="txt"><h3>{title}</h3><p>{text}</p></div></div>;
}

function TeamPage() {
  useReveal();
  return (
    <>
      <Navigation teamPage />
      <main>
        <header className="page-head"><div className="wrap"><Eyebrow>The people behind the pipeline</Eyebrow><h1>Built by a team<br /><span className="dim">obsessed with motion.</span></h1><p className="lede">Engineers, computer-vision researchers, and sports specialists — the crew that keeps every frame tracked and every broadcast live.</p></div></header>
        <section className="team"><div className="wrap"><div className="team-grid">{team.map((member) => <Link className="member reveal" to={`/team/${member.id}`} key={member.id}><div className="photo"><img src={member.image} alt={member.name} /></div><div className="txt"><h3>{member.name}</h3><div className="role">{member.title}</div><p className="bio">{member.subtitle}</p></div></Link>)}</div></div></section>
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
