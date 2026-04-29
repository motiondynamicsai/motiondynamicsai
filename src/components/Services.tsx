import React, { useRef, type ComponentType } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { features } from '../constants';
import { WordReveal } from './shared/WordReveal';

const EASE = [0.22, 1, 0.36, 1] as const;

type ServiceIcon = string | ComponentType<{ className?: string }>;

const HEADLINE_WORDS = ['What', 'we', 'offer.'] as const;

interface ServiceCardProps {
  icon: ServiceIcon;
  title: string;
  content: string;
  index: number;
  reduced: boolean;
}

const ServiceCard = ({ icon, title, content, index, reduced }: ServiceCardProps) => {
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
          background:
            'linear-gradient(90deg, color-mix(in oklab, var(--color-md-accent) 60%, transparent), color-mix(in oklab, var(--color-md-accent-soft) 35%, transparent))',
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

const Services = () => {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--color-md-bg)' }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          y: reduced ? 0 : bgY,
          background:
            'radial-gradient(60% 50% at 50% 30%, color-mix(in oklab, var(--color-md-surface) 80%, transparent), transparent 70%)',
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div
            className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            <span
              className="h-px w-10"
              style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-accent) 60%, transparent)' }}
            />
            Services
            <span
              className="h-px w-10"
              style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-accent-soft) 35%, transparent)' }}
            />
          </div>
          <h2
            id="services-heading"
            className="mt-6 text-3xl md:text-5xl font-semibold tracking-tight"
            style={{ color: 'var(--color-md-text-hi)' }}
          >
            <WordReveal
              words={HEADLINE_WORDS}
              reduced={reduced}
              className="flex flex-wrap justify-center"
            />
          </h2>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            AI-powered tools and analytics that drive performance, decision-making, and player development.
          </p>
        </div>

        {/* Grid of Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <ServiceCard
              key={feature.id}
              index={index}
              icon={feature.icon as ServiceIcon}
              title={feature.title}
              content={feature.content}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Services };
export default Services;
