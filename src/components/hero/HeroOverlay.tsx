import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const HEADLINE_WORDS = ['Movement', 'Intelligence', '—', 'from', 'any', 'video.'] as const;
const SUBHEAD_WORDS = [
  'Hardware-free',
  'pose,',
  'biomechanics,',
  'and',
  'physics-validated',
  'insight.',
] as const;

const HEADLINE_COLOR_HI = 'var(--color-md-text-hi)';
const HEADLINE_COLOR_ACCENT = 'var(--color-md-accent)';
const SUBHEAD_COLOR = 'var(--color-md-text-mid)';

interface WordRevealProps {
  words: readonly string[];
  delay: number;
  className: string;
  reduced: boolean;
  highlightIndex?: number;
}

const containerVariants = (delay: number, reduced: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: reduced
      ? { staggerChildren: 0, delayChildren: 0 }
      : { staggerChildren: 0.08, delayChildren: delay },
  },
});

const wordVariants: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

const WordReveal = ({ words, delay, className, reduced, highlightIndex }: WordRevealProps) => (
  <motion.span
    className={className}
    initial={reduced ? 'visible' : 'hidden'}
    animate="visible"
    variants={containerVariants(delay, reduced)}
  >
    {words.map((word, index) => {
      const isHighlight = highlightIndex === index;
      return (
        <span
          key={`${word}-${index}`}
          className="relative inline-block overflow-hidden align-baseline pb-[0.12em] mr-[0.25em] last:mr-0"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={wordVariants}
            style={
              isHighlight && !reduced
                ? { color: HEADLINE_COLOR_HI }
                : undefined
            }
            animate={
              isHighlight && !reduced
                ? {
                    color: [HEADLINE_COLOR_HI, HEADLINE_COLOR_ACCENT, HEADLINE_COLOR_HI],
                  }
                : undefined
            }
            transition={
              isHighlight && !reduced
                ? {
                    color: {
                      duration: 6,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'reverse',
                    },
                  }
                : undefined
            }
          >
            {word}
          </motion.span>
        </span>
      );
    })}
  </motion.span>
);

export const HeroOverlay = () => {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Beat 1: scroll-tied blur + lift on the headline. Scroll is measured
  // relative to the hero overlay block; the effect runs from start-of-view
  // (no blur) to the bottom leaving the viewport (12px blur, -60px lift).
  const { scrollYProgress } = useScroll({
    target: overlayRef,
    offset: ['start start', 'end start'],
  });
  const blurStrength = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const filter = useTransform(blurStrength, (b) => `blur(${b}px)`);
  const liftY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.7, 0]);

  const ctaInitial = reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };
  const ctaAnimate = { opacity: 1, y: 0 };

  return (
    <div ref={overlayRef} className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 py-32 md:py-40 lg:py-48">
      <motion.div
        className="max-w-3xl"
        style={reduced ? undefined : { filter, y: liftY, opacity: fadeOpacity }}
      >
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] tabular-nums"
          style={{ color: HEADLINE_COLOR_HI }}
        >
          <WordReveal
            words={HEADLINE_WORDS}
            delay={0}
            className="flex flex-wrap"
            reduced={reduced}
            highlightIndex={1}
          />
        </h1>

        <p
          className="mt-6 text-lg md:text-xl leading-relaxed max-w-2xl tabular-nums"
          style={{ color: SUBHEAD_COLOR }}
        >
          <WordReveal
            words={SUBHEAD_WORDS}
            delay={0.4}
            className="flex flex-wrap"
            reduced={reduced}
          />
        </p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4"
          initial={ctaInitial}
          animate={ctaAnimate}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.6, ease: EASE, delay: 0.6 }
          }
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-md transform hover:scale-[1.02] transition-transform duration-[250ms]"
            style={{
              backgroundColor: 'var(--color-md-accent)',
              color: 'var(--color-md-bg)',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            Book a demo
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-md border-2 bg-transparent transform hover:scale-[1.02] transition-transform duration-[250ms]"
            style={{
              borderColor: 'color-mix(in oklab, var(--color-md-text-hi) 15%, transparent)',
              color: 'var(--color-md-text-hi)',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            Explore services
          </a>
        </motion.div>

        <div className="mt-10 flex items-center" aria-hidden="true">
          <motion.div
            className="h-px w-12 origin-left"
            style={{
              backgroundColor: 'color-mix(in oklab, var(--color-md-accent) 70%, transparent)',
            }}
            initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.5, ease: EASE, delay: 1.0 }
            }
          />
          <motion.div
            className="h-px w-8 ml-2 origin-left"
            style={{
              backgroundColor: 'color-mix(in oklab, var(--color-md-accent-soft) 35%, transparent)',
            }}
            initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.5, ease: EASE, delay: 1.0 }
            }
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroOverlay;
