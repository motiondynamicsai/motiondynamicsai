import { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate as motionAnimate,
} from 'framer-motion';
import { stats } from '../constants';
import { WordReveal } from './shared/WordReveal';

const EASE = [0.22, 1, 0.36, 1] as const;
const COUNT_DURATION_SECONDS = 1.4;

const HEADLINE_WORDS = [
  'Trusted',
  'by',
  'athletes,',
  'coaches,',
  'and',
  'organisations.',
] as const;

interface ParsedStat {
  prefix: string;
  numeric: number | null;
  suffix: string;
  raw: string;
}

const parseStatValue = (value: string): ParsedStat => {
  const match = value.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: '', numeric: null, suffix: '', raw: value };
  }
  const numeric = Number(match[2]);
  if (!Number.isFinite(numeric)) {
    return { prefix: '', numeric: null, suffix: '', raw: value };
  }
  return {
    prefix: match[1] ?? '',
    numeric,
    suffix: match[3] ?? '',
    raw: value,
  };
};

interface StatItemProps {
  parsed: ParsedStat;
  title: string;
  inView: boolean;
  reduced: boolean;
}

const StatItem = ({ parsed, title, inView, reduced }: StatItemProps) => {
  const target = parsed.numeric ?? 0;
  const motionValue = useMotionValue(reduced || parsed.numeric === null ? target : 0);
  const display = useTransform(motionValue, (latest: number) => `${Math.round(latest)}`);

  useEffect(() => {
    if (parsed.numeric === null) return;
    if (reduced) {
      motionValue.set(target);
      return;
    }
    if (!inView) return;
    const controls = motionAnimate(motionValue, target, {
      duration: COUNT_DURATION_SECONDS,
      ease: EASE,
    });
    return () => controls.stop();
  }, [inView, motionValue, parsed.numeric, reduced, target]);

  return (
    <div className="flex flex-col items-center min-w-[150px]">
      <h4
        className="text-4xl md:text-5xl font-semibold tabular-nums tracking-tight leading-none mb-2"
        style={{ color: 'var(--color-md-accent)' }}
      >
        {parsed.numeric === null ? (
          <span>{parsed.raw}</span>
        ) : (
          <>
            {parsed.prefix}
            <motion.span>{display}</motion.span>
            {parsed.suffix}
          </>
        )}
      </h4>
      <p
        className="text-sm md:text-base uppercase tracking-wide font-medium tabular-nums"
        style={{ color: 'var(--color-md-text-mid)' }}
      >
        {title}
      </p>
    </div>
  );
};

const Stats = () => {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-15%' });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stats-heading"
      className="w-full py-12"
      style={{ backgroundColor: 'var(--color-md-bg)' }}
    >
      <div className="flex flex-col items-center text-center">
        <h2
          id="stats-heading"
          className="text-3xl md:text-4xl font-semibold tracking-tight mb-8"
          style={{ color: 'var(--color-md-text-hi)' }}
        >
          <WordReveal
            words={HEADLINE_WORDS}
            reduced={reduced}
            className="flex flex-wrap justify-center"
          />
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {stats.map((stat) => (
            <StatItem
              key={stat.id}
              parsed={parseStatValue(stat.value)}
              title={stat.title}
              inView={inView}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Stats };
export default Stats;
