import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import MotionMark from '../assets/motion-dynamics-mark.png';

export function MdMark() {
  return <svg viewBox="22.25 22.33 825.54 824.55" aria-hidden="true"><use href="/media/squash/md-mark.svg#md-mark" /></svg>;
}

export function BroadcastBanner({ className = '', ...props }) {
  return <span className={`sq-gx ${className}`.trim()} {...props}><span className="gx gx-live"><i aria-hidden="true" />LIVE</span><span className="gx gx-event">U.S. OPEN</span><span className="gx gx-rest"><b>NOV 1–7</b><i aria-hidden="true" /><span>PHILADELPHIA</span></span></span>;
}

/* every page opens with the home page's header, the banner over the gold mark and white wordmark */
function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="sq sq-chrome">
    <header className={`sq-bar solid-base${solid ? ' solid' : ''}${open ? ' open' : ''}`}>
      <div className="sq-notice"><BroadcastBanner /></div>
      <nav aria-label="Main">
        <Link className="sq-brand" to="/" aria-label="Motion Dynamics home"><MdMark /><span><b>motion</b> <i>dynamics</i></span></Link>
        <div className="sq-links"><a href="/#insights">What you get</a><a href="/#proof">On the PSA tour</a><Link to="/team">Our team</Link><a className="cta" href="/#register">Register interest</a><button className="sq-menu-btn" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="sq-menu-page" onClick={() => setOpen(!open)}>{open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}</button></div>
      </nav>
      <div className="sq-menu" id="sq-menu-page" hidden={!open}>
        <a href="/#insights">What you get</a>
        <a href="/#proof">On the PSA World Tour</a>
        <Link to="/team" onClick={() => setOpen(false)}>Our team</Link>
        <a className="cta" href="/#register">Register interest</a>
      </div>
    </header>
  </div>;
}

export function Brand() {
  return <Link className="brand" to="/" aria-label="Motion Dynamics home"><img src={MotionMark} width="46" height="46" alt="" /><span>motion<span>dynamics</span></span></Link>;
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
  </>;
}

/* the home page's footer, on phones on every page */
export function PageFooter() {
  return <footer className="sq-footer">
    <Link className="sq-brand" to="/" aria-label="Motion Dynamics home"><MdMark /><span><b>motion</b> <i>dynamics</i></span></Link>
    <div><Link to="/team">Our team</Link><a href="mailto:contact@motiondynamics.ai">contact@motiondynamics.ai</a><small>© {new Date().getFullYear()} Motion Dynamics</small></div>
  </footer>;
}

export function SiteFooter() {
  return <div className="sq sq-chrome"><PageFooter /></div>;
}

export function RouteScroll() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
  return null;
}
