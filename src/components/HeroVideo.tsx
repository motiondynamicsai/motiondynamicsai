import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { HeroFallbackVideo } from './hero/HeroFallbackVideo';
import { HeroOverlay } from './hero/HeroOverlay';
import { useIsMobile } from '../hooks/useIsMobile';

const HeroScene = lazy(() => import('./hero/HeroScene'));

const REVEAL_VIEWPORT = { once: true, margin: '-20%' } as const;
const REVEAL_TRANSITION = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
const REVEAL_INITIAL = { opacity: 0, y: 24 } as const;
const REVEAL_WHILE_IN_VIEW = { opacity: 1, y: 0 } as const;

export const HeroVideo = () => {
  const isMobile = useIsMobile();

  return (
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

    {/* 3D layer (desktop) or skeleton-overlay video fallback (mobile or during load) */}
    <div className="absolute inset-0">
      {isMobile ? (
        <HeroFallbackVideo />
      ) : (
        <Suspense fallback={<HeroFallbackVideo />}>
          <HeroScene />
        </Suspense>
      )}

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
    </div>

    {/* Content overlay — kinetic typography (Phase 4) */}
    <HeroOverlay />

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
};

export default HeroVideo;
