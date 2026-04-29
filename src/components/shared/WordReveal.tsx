import { motion, type Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const DEFAULT_STAGGER_SECONDS = 0.08;

interface WordRevealProps {
  words: readonly string[];
  className?: string;
  reduced?: boolean;
  staggerSeconds?: number;
  delaySeconds?: number;
  once?: boolean;
}

const buildContainerVariants = (
  reduced: boolean,
  staggerSeconds: number,
  delaySeconds: number,
): Variants => ({
  hidden: {},
  visible: {
    transition: reduced
      ? { staggerChildren: 0, delayChildren: 0 }
      : { staggerChildren: staggerSeconds, delayChildren: delaySeconds },
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

export const WordReveal = ({
  words,
  className,
  reduced = false,
  staggerSeconds = DEFAULT_STAGGER_SECONDS,
  delaySeconds = 0,
  once = true,
}: WordRevealProps) => (
  <motion.span
    className={className}
    initial={reduced ? 'visible' : 'hidden'}
    whileInView="visible"
    viewport={{ once, margin: '-15%' }}
    variants={buildContainerVariants(reduced, staggerSeconds, delaySeconds)}
  >
    {words.map((word, index) => (
      <span
        key={`${word}-${index}`}
        className="relative inline-block overflow-hidden align-baseline pb-[0.12em] mr-[0.25em] last:mr-0"
      >
        <motion.span
          className="inline-block will-change-transform"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      </span>
    ))}
  </motion.span>
);

export default WordReveal;
