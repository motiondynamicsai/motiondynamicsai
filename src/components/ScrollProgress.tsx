import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Sticky 1px scroll-progress bar, bottom-left → bottom-right.
 * Hidden on mobile (touch). Colour: --color-md-accent.
 */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.5 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed bottom-0 left-0 right-0 z-50 hidden md:block pointer-events-none"
      style={{
        height: '1px',
        background: 'var(--color-md-accent)',
        transformOrigin: '0 50%',
        scaleX,
      }}
    />
  );
};

export default ScrollProgress;
