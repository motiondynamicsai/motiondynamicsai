import { useEffect, useMemo, useRef, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import Logo2 from '../assets/Logo2.png';
import Logo_light from '../assets/Motion_Dynamics_Logo_Light.svg'
import Logo_Dark from '../assets/Motion_Dynamics_Logo_Dark.svg'
import { navLinks } from '../constants';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current) setTheme(current);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!themeMenuRef.current) return;
      if (themeMenuRef.current.contains(event.target)) return;
      setThemeMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const applyTheme = (nextTheme) => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('md-theme', nextTheme);
    } catch {
      // ignore storage errors
    }
  };

  const themeLabel = useMemo(() => {
    if (theme === 'light') return 'Light';
    if (theme === 'contrast') return 'High contrast';
    return 'Dark';
  }, [theme]);


  return (
    <nav className={`w-full z-50 fixed top-0 left-0 bg-primary/75 backdrop-blur-md border-b border-white/5 transition-all ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center">
          {document.documentElement.dataset.theme == 'dark' ? (
            <img src={Logo_light} alt="Logo" className="h-12 sm:h-16 md:h-20" />
          ) : (
            <img src={Logo_Dark} alt="Logo" className="h-12 sm:h-16 md:h-20" />
          )}
          

        </div>

       {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-10 items-center text-sm uppercase tracking-[0.18em]">
          {navLinks.map((link) => (
            <HashLink
              key={link.id}
              smooth
              to={link.link}
              className="text-dimWhite/80 hover:text-white transition-colors font-semibold"
            >
              {link.title}
            </HashLink>
          ))}
          <Link
            to="/storyboard"
            className="text-dimWhite/80 hover:text-white transition-colors font-semibold"
          >
            Partnerships
          </Link>
        </div>


        <div className="flex items-center gap-3">
          {/* Theme dropdown (hover to reveal options) */}
          <div ref={themeMenuRef} className="relative hidden sm:block group">
            <button
              type="button"
              onClick={() => setThemeMenuOpen((open) => !open)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setThemeMenuOpen(false);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-dark/20 text-xs font-semibold text-dimWhite hover:text-white transition-colors"
              aria-haspopup="menu"
              aria-expanded={themeMenuOpen}
            >
              <span className="text-white">{themeLabel}</span>
              <svg className="h-4 w-4 text-dimWhite/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div
              className={`absolute right-0 mt-2 w-44 rounded-md border border-white/10 bg-dark/90 backdrop-blur-md shadow-[0_18px_50px_-30px_rgba(0,0,0,0.75)] p-1 ${themeMenuOpen ? 'block' : 'hidden'} group-hover:block group-focus-within:block`}
              role="menu"
              aria-label="Theme options"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  applyTheme('dark');
                  setThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${theme === 'dark' ? 'bg-white/10 text-white' : 'text-dimWhite hover:text-white hover:bg-white/5'}`}
              >
                Dark
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  applyTheme('light');
                  setThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${theme === 'light' ? 'bg-white/10 text-white' : 'text-dimWhite hover:text-white hover:bg-white/5'}`}
              >
                Light
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  applyTheme('contrast');
                  setThemeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${theme === 'contrast' ? 'bg-white/10 text-white' : 'text-dimWhite hover:text-white hover:bg-white/5'}`}
              >
                High contrast
              </button>
            </div>
          </div>

          {/* Contact Button (hide on xs; available in mobile menu) */}
          <HashLink smooth to="/#contact" className="hidden sm:block">
            <button className="px-5 py-2 rounded-md bg-secondary/85 text-black font-semibold hover:bg-secondary transition-all shadow-[0_14px_40px_-28px_rgb(var(--md-secondary)_/_0.35)]">
              Contact
            </button>
          </HashLink>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/10 bg-dark/20 text-white/90 hover:text-white transition-colors"
            onClick={() => setToggle((open) => !open)}
            aria-label={toggle ? 'Close menu' : 'Open menu'}
            aria-expanded={toggle}
          >
            {toggle ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {toggle && (
        <div className="md:hidden absolute inset-x-0 top-full border-b border-white/5 bg-primary/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            <div className="text-[11px] uppercase tracking-[0.32em] text-dimWhite/80 px-2 pt-1">
              Navigation
            </div>

            <div className="grid gap-1">
              {navLinks.map((link) => (
                <HashLink
                  key={link.id}
                  smooth
                  to={link.link}
                  onClick={() => setToggle(false)}
                  className="px-3 py-2 rounded-md text-sm font-semibold text-white/90 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.title}
                </HashLink>
              ))}
              <Link
                to="/storyboard"
                onClick={() => setToggle(false)}
                className="px-3 py-2 rounded-md text-sm font-semibold text-white/90 hover:text-white hover:bg-white/5 transition-colors"
              >
                Partnerships
              </Link>
            </div>

            <div className="pt-3 mt-3 border-t border-white/10">
              <div className="text-[11px] uppercase tracking-[0.32em] text-dimWhite/80 px-2">
                Theme
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyTheme('dark')}
                  className={`px-3 py-2 rounded-md text-sm font-semibold border transition-colors ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-dark/20 border-white/10 text-dimWhite hover:text-white hover:border-secondary/25'}`}
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => applyTheme('light')}
                  className={`px-3 py-2 rounded-md text-sm font-semibold border transition-colors ${theme === 'light' ? 'bg-white/10 border-white/20 text-white' : 'bg-dark/20 border-white/10 text-dimWhite hover:text-white hover:border-secondary/25'}`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => applyTheme('contrast')}
                  className={`px-3 py-2 rounded-md text-sm font-semibold border transition-colors ${theme === 'contrast' ? 'bg-white/10 border-white/20 text-white' : 'bg-dark/20 border-white/10 text-dimWhite hover:text-white hover:border-secondary/25'}`}
                >
                  HC
                </button>
              </div>
            </div>

            <HashLink smooth to="/#contact" onClick={() => setToggle(false)} className="block pt-4">
              <button className="w-full px-5 py-3 rounded-md bg-secondary/90 text-black font-semibold hover:bg-secondary transition-all shadow-[0_14px_40px_-28px_rgb(var(--md-secondary)_/_0.35)]">
                Contact
              </button>
            </HashLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
