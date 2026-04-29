import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate as motionAnimate,
  type Variants,
} from 'framer-motion';
import processedVideo from '../assets/processed_video.mp4';
import tennisReconstruction from '../assets/3d_tennis_reconstruction.mp4';

const EASE = [0.22, 1, 0.36, 1] as const;

const TITLE_WORDS = [
  'Physics-Informed',
  'Neural',
  'Networks',
  'make',
  'the',
  'difference.',
] as const;

const SLIDER_INITIAL_PERCENT = 50;
const SLIDER_TARGET_PERCENT = 30;
const SLIDER_MIN_PERCENT = 10;
const SLIDER_MAX_PERCENT = 90;
const COUNT_DURATION_SECONDS = 1.4;
const AUTO_SLIDE_DURATION_SECONDS = 2;

interface WordRevealProps {
  words: readonly string[];
  reduced: boolean;
  className?: string;
}

const titleContainerVariants = (reduced: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: reduced
      ? { staggerChildren: 0, delayChildren: 0 }
      : { staggerChildren: 0.08, delayChildren: 0 },
  },
});

const titleWordVariants: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

const TitleReveal = ({ words, reduced, className }: WordRevealProps) => (
  <motion.span
    className={className}
    initial={reduced ? 'visible' : 'hidden'}
    whileInView="visible"
    viewport={{ once: true, margin: '-15%' }}
    variants={titleContainerVariants(reduced)}
  >
    {words.map((word, index) => (
      <span
        key={`${word}-${index}`}
        className="relative inline-block overflow-hidden align-baseline pb-[0.12em] mr-[0.25em] last:mr-0"
      >
        <motion.span
          className="inline-block will-change-transform"
          variants={titleWordVariants}
        >
          {word}
        </motion.span>
      </span>
    ))}
  </motion.span>
);

interface StatCardProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  inView: boolean;
  reduced: boolean;
  formatter?: (value: number) => string;
}

const StatCard = ({
  value,
  prefix = '',
  suffix = '',
  label,
  inView,
  reduced,
  formatter,
}: StatCardProps) => {
  const motionValue = useMotionValue(reduced ? value : 0);
  const display = useTransform(motionValue, (latest: number) => {
    const rounded = Math.round(latest);
    return formatter ? formatter(rounded) : `${rounded}`;
  });

  useEffect(() => {
    if (reduced) {
      motionValue.set(value);
      return;
    }
    if (!inView) {
      return;
    }
    const controls = motionAnimate(motionValue, value, {
      duration: COUNT_DURATION_SECONDS,
      ease: EASE,
    });
    return () => controls.stop();
  }, [inView, motionValue, reduced, value]);

  return (
    <div
      className="rounded-md p-6 md:p-8 flex flex-col gap-2"
      style={{
        backgroundColor: 'var(--color-md-surface)',
        border: '1px solid color-mix(in oklab, var(--color-md-text-mid) 10%, transparent)',
      }}
    >
      <div
        className="text-4xl md:text-5xl font-semibold tabular-nums tracking-tight leading-none"
        style={{ color: 'var(--color-md-text-hi)' }}
      >
        {prefix}
        <motion.span>{display}</motion.span>
        {suffix}
      </div>
      <div
        className="text-sm md:text-base leading-relaxed"
        style={{ color: 'var(--color-md-text-mid)' }}
      >
        {label}
      </div>
    </div>
  );
};

const clampPercent = (value: number): number => {
  if (value < SLIDER_MIN_PERCENT) return SLIDER_MIN_PERCENT;
  if (value > SLIDER_MAX_PERCENT) return SLIDER_MAX_PERCENT;
  return value;
};

export const Accuracy = () => {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const autoAnimatedRef = useRef(false);

  const [sliderPercent, setSliderPercent] = useState<number>(SLIDER_INITIAL_PERCENT);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-15%' });
  const statsRef = useRef<HTMLDivElement | null>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-15%' });

  // Auto slider animation on entering view
  useEffect(() => {
    if (reduced) {
      setSliderPercent(SLIDER_INITIAL_PERCENT);
      return;
    }
    if (!sectionInView || autoAnimatedRef.current) {
      return;
    }
    autoAnimatedRef.current = true;
    const motionValue = { current: SLIDER_INITIAL_PERCENT };
    const controls = motionAnimate(SLIDER_INITIAL_PERCENT, SLIDER_TARGET_PERCENT, {
      duration: AUTO_SLIDE_DURATION_SECONDS,
      ease: EASE,
      onUpdate: (latest: number) => {
        motionValue.current = latest;
        if (!draggingRef.current) {
          setSliderPercent(latest);
        }
      },
    });
    return () => controls.stop();
  }, [reduced, sectionInView]);

  const updateFromClientX = (clientX: number) => {
    const node = containerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setSliderPercent(clampPercent(ratio));
  };

  useEffect(() => {
    if (reduced) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!draggingRef.current) return;
      updateFromClientX(event.clientX);
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (!draggingRef.current) return;
      const touch = event.touches[0];
      if (!touch) return;
      updateFromClientX(touch.clientX);
    };
    const stopDragging = () => {
      draggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', stopDragging);
    window.addEventListener('touchcancel', stopDragging);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
      window.removeEventListener('touchcancel', stopDragging);
    };
  }, [reduced]);

  const handlePointerDown = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (reduced) return;
    draggingRef.current = true;
    autoAnimatedRef.current = true;
    if ('touches' in event) {
      const touch = event.touches[0];
      if (touch) updateFromClientX(touch.clientX);
    } else {
      updateFromClientX(event.clientX);
    }
  };

  const rightInsetPercent = 100 - sliderPercent;

  return (
    <section
      ref={sectionRef}
      id="accuracy-section"
      aria-labelledby="accuracy-heading"
      className="w-full"
    >
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2
            id="accuracy-heading"
            className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
            style={{ color: 'var(--color-md-text-hi)' }}
          >
            <TitleReveal
              words={TITLE_WORDS}
              reduced={reduced}
              className="flex flex-wrap justify-center"
            />
          </h2>
          <p
            className="mt-6 text-base md:text-lg leading-relaxed mx-auto max-w-2xl tabular-nums"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            95% accuracy. Physics-validated. Suitable for medical, defence, and elite sport.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-md select-none"
            style={{
              aspectRatio: '16 / 9',
              backgroundColor: 'var(--color-md-surface)',
              touchAction: 'pan-y',
            }}
          >
            <video
              src={processedVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              aria-label="Raw pose estimation"
            />

            <div
              className="absolute inset-0 will-change-[clip-path]"
              style={{
                clipPath: `inset(0 ${rightInsetPercent}% 0 0)`,
              }}
              aria-hidden="false"
            >
              <video
                src={tennisReconstruction}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
                aria-label="Motion Dynamics with PINNs"
              />
            </div>

            <div
              className="pointer-events-none absolute top-3 left-3 px-3 py-1.5 rounded-sm text-xs md:text-sm font-medium tracking-tight"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-md-bg) 70%, transparent)',
                color: 'var(--color-md-text-hi)',
                backdropFilter: 'blur(6px)',
              }}
            >
              Raw pose estimation
            </div>
            <div
              className="pointer-events-none absolute top-3 right-3 px-3 py-1.5 rounded-sm text-xs md:text-sm font-medium tracking-tight"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-md-bg) 70%, transparent)',
                color: 'var(--color-md-accent)',
                backdropFilter: 'blur(6px)',
              }}
            >
              Motion Dynamics with PINNs
            </div>

            <div
              className="absolute top-0 bottom-0"
              style={{
                left: `${sliderPercent}%`,
                transform: 'translateX(-50%)',
                width: '1px',
                backgroundColor: 'var(--color-md-accent)',
                cursor: reduced ? 'default' : 'ew-resize',
              }}
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              role="slider"
              aria-label="Comparison slider"
              aria-valuemin={SLIDER_MIN_PERCENT}
              aria-valuemax={SLIDER_MAX_PERCENT}
              aria-valuenow={Math.round(sliderPercent)}
              tabIndex={0}
            >
              <div
                className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full"
                style={{
                  width: '32px',
                  height: '32px',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'var(--color-md-bg)',
                  border: '1px solid var(--color-md-accent)',
                  boxShadow: '0 4px 18px color-mix(in oklab, var(--color-md-accent) 40%, transparent)',
                  cursor: reduced ? 'default' : 'grab',
                }}
              >
                <span
                  aria-hidden="true"
                  className="block leading-none text-[10px] tracking-widest font-semibold"
                  style={{ color: 'var(--color-md-accent)' }}
                >
                  &#x2039;&#x203A;
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ color: 'var(--color-md-text-mid)' }}
            >
              <span
                className="font-medium"
                style={{ color: 'var(--color-md-text-hi)' }}
              >
                Raw pose estimation —
              </span>{' '}
              Generic AI tracking. Fast, but physically inconsistent — joints can bend the wrong way.
            </p>
            <p
              className="text-sm md:text-base leading-relaxed md:text-right"
              style={{ color: 'var(--color-md-text-mid)' }}
            >
              <span
                className="font-medium"
                style={{ color: 'var(--color-md-accent)' }}
              >
                Motion Dynamics with PINNs —
              </span>{' '}
              Physics-validated. Suitable for medical, defence, and elite sport.
            </p>
          </div>
        </div>

        <div
          ref={statsRef}
          className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          <StatCard
            value={95}
            suffix="%"
            label="Markerless tracking accuracy"
            inView={statsInView}
            reduced={reduced}
          />
          <StatCard
            value={13}
            prefix="<"
            suffix="s"
            label="Target processing time on edge cloud (StonesThrow)"
            inView={statsInView}
            reduced={reduced}
          />
          <StatCard
            value={100}
            prefix="£"
            suffix="k+"
            label="Lab equipment used to validate every model release"
            inView={statsInView}
            reduced={reduced}
          />
        </div>
      </div>
    </section>
  );
};

export default Accuracy;
