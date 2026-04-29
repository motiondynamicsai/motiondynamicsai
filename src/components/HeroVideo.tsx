import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { HeroFallbackVideo } from './hero/HeroFallbackVideo';

const HeroScene = lazy(() => import('./hero/HeroScene'));

const REVEAL_VIEWPORT = { once: true, margin: '-20%' } as const;
const REVEAL_TRANSITION = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
const REVEAL_INITIAL = { opacity: 0, y: 24 } as const;
const REVEAL_WHILE_IN_VIEW = { opacity: 1, y: 0 } as const;

export const HeroVideo = () => (
  <motion.section
    id="hero-video"
    className="relative w-full overflow-hidden bg-gradient-to-b from-primary to-dark min-h-[600px] lg:min-h-[700px]"
    initial={REVEAL_INITIAL}
    whileInView={REVEAL_WHILE_IN_VIEW}
    viewport={REVEAL_VIEWPORT}
    transition={REVEAL_TRANSITION}
    style={{ marginTop: '80px' }}
  >
    {/* Atmospheric backdrop while the 3D scene boots */}
    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-primary to-secondary/5" />

    {/* 3D layer with skeleton-overlay video fallback during load */}
    <div className="absolute inset-0">
      <Suspense fallback={<HeroFallbackVideo />}>
        <HeroScene />
      </Suspense>

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
    </div>

    {/* Content overlay */}
    <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 py-32 md:py-40 lg:py-48">
      <div className="max-w-3xl">
        <div className="flex items-center mb-6 opacity-0 animate-slideInLeft">
          <div className="h-1 w-12 bg-secondary/70 rounded-[2px]" />
          <div className="h-1 w-8 bg-accent/35 rounded-[2px] ml-2" />
        </div>

        <h1 className="text-white tracking-tight opacity-0 animate-slideInLeft animation-delay-200">
          <span className="block text-5xl md:text-6xl lg:text-7xl mb-2 font-medium">Motion</span>
          <span className="block text-5xl md:text-6xl lg:text-7xl font-extrabold text-secondary">
            Dynamics
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-dimWhite leading-relaxed max-w-2xl opacity-0 animate-slideInLeft animation-delay-400">
          AI-Powered Motion Intelligence for Sports and Human Performance.
          For organisations committed to improving athletic performance and rehabilitation outcomes,
          our platform delivers actionable insights into movement, efficiency, and recovery — helping
          businesses enhance results, engagement, and client success.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-slideInLeft animation-delay-600">
          <a
            href="#contact"
            className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-black bg-secondary/90 rounded-md transform hover:scale-[1.02] transition-all duration-300 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.85)] hover:shadow-[0_24px_60px_-34px_rgb(var(--md-secondary)_/_0.35)]"
          >
            Get in touch
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#services"
            className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border-2 border-white/10 bg-black/10 backdrop-blur-sm rounded-md hover:bg-black/20 hover:border-secondary/30 transform hover:scale-[1.02] transition-all duration-300"
          >
            Explore services
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-fadeIn animation-delay-800">
      <div className="flex flex-col items-center text-white/60 hover:text-white/80 transition-colors cursor-pointer">
        <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </div>
  </motion.section>
);

export default HeroVideo;
