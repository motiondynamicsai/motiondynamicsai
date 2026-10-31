import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';
import { Navigation, SiteFooter } from './SiteChrome';
import VideoAnalysisDemo from './VideoAnalysisDemo';
import ApplicationDemo from './ApplicationDemo';
import TeamPhoto from '../assets/squash-team-court.jpg';

export default function SquashPage() {
  return <>
    <Navigation />
    <main id="main" className="squash-page">
      <section className="squash-hero" id="top">
        <div className="container squash-hero-grid">
          <div className="squash-hero-copy">
            <p className="kicker">Motion intelligence · Squash</p>
            <h1>See the rally<br /><em>between points.</em></h1>
            <p>Squash moves too quickly to catch every detail live. We turn match footage into clear movement insight for coaches, players, and broadcast teams.</p>
            <a className="squash-hero-link" href="#capture">Explore the analysis <FiArrowDownRight aria-hidden="true" /></a>
            <span className="squash-hero-index">01 — A closer view of squash</span>
          </div>
          <figure className="squash-hero-image"><img src={TeamPhoto} alt="Motion Dynamics team on the London Squash Classic court" /><figcaption><span>London Squash Classic</span><span>On court, with the game</span></figcaption></figure>
        </div>
        <div className="squash-hero-rule" aria-hidden="true"><span /><span /><span /></div>
      </section>

      <section className="squash-intro container">
        <p className="kicker">One court. Every perspective.</p>
        <p>From the camera feed to the coaching conversation, follow the movement that shapes each rally.</p>
        <a href="#apply" aria-label="Jump to how squash analysis is applied"><FiArrowDownRight aria-hidden="true" /></a>
      </section>

      <section className="squash-workflow" aria-label="Squash analysis workflow">
        <div className="container squash-workflow-head"><p className="kicker">The squash analysis workflow</p><h2>Video in.<br /><em>Useful insight out.</em></h2></div>
        <div className="container process-stack squash-process">
          <article className="process-panel squash-capture" id="capture"><div className="process-inner"><div className="process-copy"><span className="kicker">Capture · 01</span><h3>It starts<br />with your video.</h3><p>Bring us your squash broadcast, event, or training footage. We shape a video pipeline around the court, the cameras, and the movement you want to understand.</p><span className="process-foot">Squash footage → Player &amp; ball tracking</span></div><VideoAnalysisDemo /></div></article>
          <article className="process-panel process-apply squash-apply" id="apply"><div className="process-inner"><div className="process-copy"><span className="kicker">Apply · 02</span><h3>Insight for<br />the next rally.</h3><p>Take movement analysis into squash coaching, player development, and broadcast storytelling. Give each person a view that helps them make the next decision.</p><span className="process-foot">Rally analysis → Coaching &amp; coverage</span></div><ApplicationDemo /></div></article>
        </div>
      </section>

      <section className="squash-contact container" id="contact">
        <div><p className="kicker">For squash coaches, teams &amp; event partners</p><h2>Let’s look closer.</h2><p>Tell us about your court, your footage, and the questions you want to answer.</p></div>
        <a className="button button-red" href="mailto:contact@motiondynamics.ai?subject=Squash%20analysis%20enquiry">Talk squash with us <FiArrowUpRight aria-hidden="true" /></a>
      </section>
    </main>
    <SiteFooter />
  </>;
}
