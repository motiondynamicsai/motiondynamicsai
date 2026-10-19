import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi';
import MotionMark from '../assets/motion-dynamics-mark.png';

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
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <Brand />
        <button type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={open}>{open ? <FiX /> : <FiMenu />}</button>
        <div className={`nav-links ${open ? 'is-open' : ''}`} id="main-navigation" onClick={() => setOpen(false)}>
          <a href="/#impact">In the field</a><a href="/#pipeline">Technology</a><a href="/#uses">For you</a><NavLink to="/team">Our team</NavLink>
          <a className="button button-dark nav-contact" href="/#contact">Let’s talk <FiArrowUpRight aria-hidden="true" /></a>
        </div>
      </nav>
    </header>
  </>;
}

export function SiteFooter({ embedded = false }) {
  return <footer className={`site-footer${embedded ? ' footer-in-contact' : ''}`}><div className={`${embedded ? '' : 'container '}footer-top`}><Brand /><p>Movement is everywhere.<br />Understanding it changes everything.</p>{!embedded && <a className="text-link" href="mailto:contact@motiondynamics.ai">contact@motiondynamics.ai <FiArrowUpRight aria-hidden="true" /></a>}</div><div className={`${embedded ? '' : 'container '}footer-bottom`}><small>© {new Date().getFullYear()} Motion Dynamics</small><div><Link to="/team">Our team</Link><a href="/#impact">Our work</a><a href="/#top">Back to top ↑</a></div><span>Built around movement.</span></div></footer>;
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
