import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { clients } from '../constants';
import { WordReveal } from './shared/WordReveal';

const ROTATE_INTERVAL_MS = 4000;
const ACTIVE_HOLD_MS = 2000;
const HEADLINE_WORDS = ['Collaborations', '&', 'partners.'] as const;

interface ClientLogo {
  id: string;
  logo: string;
  alt: string;
  href?: string;
}

const Collaborations = () => {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const logos: ClientLogo[] = clients.map((client, index) => {
    const named = client as { name?: string; href?: string };
    return {
      id: client.id,
      logo: client.logo,
      alt: named.name ?? `Partner ${index + 1}`,
      href: named.href,
    };
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (reduced || logos.length === 0) {
      setActiveIndex(null);
      return;
    }

    let holdTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      const next = Math.floor(Math.random() * logos.length);
      setActiveIndex(next);
      if (holdTimeout) clearTimeout(holdTimeout);
      holdTimeout = setTimeout(() => {
        setActiveIndex(null);
      }, ACTIVE_HOLD_MS);
    }, ROTATE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (holdTimeout) clearTimeout(holdTimeout);
    };
  }, [logos.length, reduced]);

  return (
    <section
      id="collaborations"
      aria-labelledby="collaborations-heading"
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--color-md-bg)' }}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            <span
              className="h-px w-10"
              style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-accent) 60%, transparent)' }}
            />
            Collaborations
            <span
              className="h-px w-10"
              style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-accent-soft) 35%, transparent)' }}
            />
          </div>
          <h2
            id="collaborations-heading"
            className="mt-6 text-2xl md:text-4xl font-semibold tracking-tight"
            style={{ color: 'var(--color-md-text-hi)' }}
          >
            <WordReveal
              words={HEADLINE_WORDS}
              reduced={reduced}
              className="flex flex-wrap justify-center"
            />
          </h2>
          <p
            className="mt-4"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            We team up with leading organisations across sport, media, and research.
          </p>
        </div>

        {/* Logo wall */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-10 items-center justify-items-center">
          {logos.map((logo, index) => {
            const isActive = activeIndex === index || hoverIndex === index;
            const Wrapper = logo.href ? 'a' : 'div';
            return (
              <Wrapper
                key={logo.id}
                {...(logo.href
                  ? {
                      href: logo.href,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    }
                  : {})}
                className="flex items-center justify-center w-full h-20 md:h-24"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(index)}
                onBlur={() => setHoverIndex(null)}
                aria-label={logo.alt}
              >
                <img
                  src={logo.logo}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                  style={{
                    filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)',
                    opacity: isActive ? 1 : 0.7,
                    transition:
                      'filter 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { Collaborations };
export default Collaborations;
