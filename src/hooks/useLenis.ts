import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

/**
 * Mount-once smooth-scroll controller. Subsequent calls are no-ops, so
 * placing this in App.tsx (which renders once at the routing root) is safe.
 *
 * Honours `prefers-reduced-motion: reduce` — when the user has expressed
 * that preference, we skip Lenis entirely and the browser's native scroll
 * is used unaltered. Disposing on unmount keeps Vite HMR clean.
 *
 * Exposes the live instance via `getLenis()` so GSAP ScrollTrigger can
 * sync its scroller to Lenis without us threading the instance through
 * React context.
 */
export const useLenis = (): void => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (lenisInstance) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number): number => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisInstance = lenis;

    let rafId = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
};

export const getLenis = (): Lenis | null => lenisInstance;
