import React, { useRef, type ComponentType, type SVGProps } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { WordReveal } from './shared/WordReveal';

const EASE = [0.22, 1, 0.36, 1] as const;

type FeatureIcon = string | ComponentType<{ className?: string }>;

interface FeatureCardProps {
  icon: FeatureIcon;
  title: string;
  content: string;
  index: number;
  reduced: boolean;
}

// --- Inline SVG icons to avoid extra deps ---
const IconMotion = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M3 12h4m2 0h4m2 0h6" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="12" r="2" strokeWidth="2" />
    <circle cx="19" cy="12" r="2" strokeWidth="2" />
  </svg>
);

const IconLLM = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M4 5h16v10H5l-1 4V5z" strokeWidth="2" strokeLinejoin="round" />
    <path d="M8 9h8M8 12h6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconRehab = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M12 21s7-4.35 7-10A7 7 0 1 0 5 11c0 5.65 7 10 7 10z" strokeWidth="2" />
    <path d="M9.5 11l2 2 3-4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconClub = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const IconBroadcast = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="3" strokeWidth="2" />
    <path d="M5 12a7 7 0 0 1 7-7M19 12a7 7 0 0 0-7 7" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12a10 10 0 0 1 10-10M22 12A10 10 0 0 0 12 22" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconClinic = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M12 2l7 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7l7-5z" strokeWidth="2" />
    <path d="M12 8v8M8 12h8" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconUniversity = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M2 10l10-6 10 6-10 6-10-6z" strokeWidth="2" />
    <path d="M6 12v5l6 3 6-3v-5" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const FeatureCard = ({ icon, title, content, index, reduced }: FeatureCardProps) => {
  const isComponent = typeof icon === 'function';

  return (
    <motion.div
      className="group relative rounded-md p-6 backdrop-blur-sm"
      style={{
        backgroundColor: 'color-mix(in oklab, var(--color-md-surface) 80%, transparent)',
        border: '1px solid color-mix(in oklab, var(--color-md-text-mid) 12%, transparent)',
        transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onMouseEnter={(event) => {
        const node = event.currentTarget;
        node.style.transform = 'translateY(-8px)';
        node.style.boxShadow = '0 12px 40px -16px color-mix(in oklab, var(--color-md-accent) 30%, transparent)';
        node.style.borderColor = 'color-mix(in oklab, var(--color-md-accent) 30%, transparent)';
      }}
      onMouseLeave={(event) => {
        const node = event.currentTarget;
        node.style.transform = '';
        node.style.boxShadow = '';
        node.style.borderColor = 'color-mix(in oklab, var(--color-md-text-mid) 12%, transparent)';
      }}
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        delay: reduced ? 0 : index * 0.08,
        duration: reduced ? 0 : 0.6,
        ease: EASE,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, color-mix(in oklab, var(--color-md-accent) 60%, transparent), color-mix(in oklab, var(--color-md-accent-soft) 35%, transparent))',
          opacity: 0.7,
        }}
      />

      <div
        className="w-14 h-14 rounded-md flex items-center justify-center mb-5"
        style={{
          backgroundColor: 'color-mix(in oklab, var(--color-md-bg) 60%, transparent)',
          border: '1px solid color-mix(in oklab, var(--color-md-text-mid) 12%, transparent)',
          color: 'var(--color-md-accent)',
        }}
      >
        {isComponent ? (
          React.createElement(icon as ComponentType<{ className?: string }>, { className: 'w-7 h-7' })
        ) : (
          <img src={icon as string} alt={title} className="w-7 h-7" />
        )}
      </div>
      <h3
        className="text-lg font-semibold mb-2 tracking-tight"
        style={{ color: 'var(--color-md-text-hi)' }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--color-md-text-mid)' }}
      >
        {content}
      </p>
    </motion.div>
  );
};

const SOLUTIONS_HEADLINE = ['Built', 'for', 'impact.'] as const;
const INDUSTRIES_HEADLINE = ['Industries', 'we', 'serve.'] as const;

const Solutions = () => {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const solutionsSectionRef = useRef<HTMLElement | null>(null);
  const industriesSectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: solutionsProgress } = useScroll({
    target: solutionsSectionRef,
    offset: ['start end', 'end start'],
  });
  const solutionsBgY = useTransform(solutionsProgress, [0, 1], ['-15%', '15%']);

  const { scrollYProgress: industriesProgress } = useScroll({
    target: industriesSectionRef,
    offset: ['start end', 'end start'],
  });
  const industriesBgY = useTransform(industriesProgress, [0, 1], ['-15%', '15%']);

  const solutionCards = [
    {
      id: 'sol-motion',
      icon: IconMotion,
      title: 'Sports analytics (AI + motion)',
      content:
        'Real-time movement tracking, pose estimation, and event detection for training and broadcasting. Elevate player development and fan engagement with live data overlays and highlights.',
    },
    {
      id: 'sol-llm',
      icon: IconLLM,
      title: 'AI coaching & insights (LLMs)',
      content:
        'Large language models convert biomechanics into natural feedback: session summaries, player-specific reports, and goal-led plans coaches and athletes can act on instantly.',
    },
    {
      id: 'sol-rehab',
      icon: IconRehab,
      title: 'Rehabilitation & research (B2B)',
      content:
        'Secure data pipelines, custom dashboards, and integrations with hospitals and universities. License datasets, evaluate interventions, and accelerate research with explainable metrics.',
    },
  ];

  const industries = [
    {
      id: 'ind-clubs',
      icon: IconClub,
      title: 'Sports clubs',
      content: 'Player monitoring, skills tracking, and talent ID.',
    },
    {
      id: 'ind-broadcast',
      icon: IconBroadcast,
      title: 'Broadcasters',
      content: 'Real-time graphics, highlights, and automated storytelling.',
    },
    {
      id: 'ind-clinics',
      icon: IconClinic,
      title: 'Rehab clinics',
      content: 'Progress tracking and personalised recovery insights.',
    },
    {
      id: 'ind-universities',
      icon: IconUniversity,
      title: 'Universities',
      content: 'Research integrations, data access, and validation.',
    },
  ];

  return (
    <>
      {/* Solutions Section */}
      <section
        ref={solutionsSectionRef}
        id="solutions"
        aria-labelledby="solutions-heading"
        className="relative py-24 overflow-hidden"
        style={{ backgroundColor: 'var(--color-md-bg)' }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            y: reduced ? 0 : solutionsBgY,
            background:
              'radial-gradient(60% 50% at 50% 30%, color-mix(in oklab, var(--color-md-surface) 80%, transparent), transparent 70%)',
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div
              className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.32em]"
              style={{ color: 'var(--color-md-text-mid)' }}
            >
              <span
                className="h-px w-10"
                style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-accent) 60%, transparent)' }}
              />
              Solutions
              <span
                className="h-px w-10"
                style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-accent-soft) 35%, transparent)' }}
              />
            </div>
            <h2
              id="solutions-heading"
              className="mt-6 text-3xl md:text-5xl font-semibold tracking-tight"
              style={{ color: 'var(--color-md-text-hi)' }}
            >
              <WordReveal
                words={SOLUTIONS_HEADLINE}
                reduced={reduced}
                className="flex flex-wrap justify-center"
              />
            </h2>
            <p
              className="mt-4 text-lg leading-relaxed"
              style={{ color: 'var(--color-md-text-mid)' }}
            >
              We combine computer vision and large language models to transform raw movement into insight, coaching, and measurable impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {solutionCards.map((f, idx) => (
              <FeatureCard
                key={f.id}
                index={idx}
                icon={f.icon}
                title={f.title}
                content={f.content}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section
        ref={industriesSectionRef}
        id="industries"
        aria-labelledby="industries-heading"
        className="relative py-20 overflow-hidden"
        style={{ backgroundColor: 'var(--color-md-bg)' }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            y: reduced ? 0 : industriesBgY,
            background:
              'radial-gradient(60% 50% at 50% 70%, color-mix(in oklab, var(--color-md-surface) 80%, transparent), transparent 70%)',
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <h3
              id="industries-heading"
              className="text-2xl md:text-4xl font-semibold tracking-tight mb-3"
              style={{ color: 'var(--color-md-text-hi)' }}
            >
              <WordReveal
                words={INDUSTRIES_HEADLINE}
                reduced={reduced}
                className="flex flex-wrap justify-center"
              />
            </h3>
            <p style={{ color: 'var(--color-md-text-mid)' }}>
              Purpose-built for organisations across sport, media, and healthcare.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {industries.map((f, idx) => (
              <FeatureCard
                key={f.id}
                index={idx}
                icon={f.icon}
                title={f.title}
                content={f.content}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export { Solutions };
export default Solutions;
