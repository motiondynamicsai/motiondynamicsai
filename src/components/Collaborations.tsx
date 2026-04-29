import { clients } from '../constants';
import styles from '../style';
import LogoLoop from './Design/LogoLoop';

interface ImageLogo {
  src: string;
  alt: string;
  href?: string;
}

// Build an image-based array for LogoLoop from your `clients` constant.
// Each client may optionally include `name` and `href`.
const imageLogos: ImageLogo[] = clients.map((c, i) => {
  const maybeNamed = c as { name?: string; href?: string };
  return {
    src: c.logo,
    alt: maybeNamed.name ?? `Client ${i + 1}`,
    href: maybeNamed.href ?? undefined,
  };
});

const Collaborations = () => {
  return (
    <section id="collaborations" className="py-20 bg-primary relative overflow-hidden">
      {/* Subtle grid overlay (optional, matches your Services style) */}
      <div className="absolute inset-0 bg-grid-white/[0.02] z-0 pointer-events-none" />

      <div className={`relative z-10 ${styles.paddingX}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.32em] text-dimWhite">
            <span className="h-px w-10 bg-secondary/60" />
            Collaborations
            <span className="h-px w-10 bg-accent/40" />
          </div>
          <h2 className="mt-6 text-2xl md:text-4xl font-extrabold text-white">
            Collaborations & <span className="text-secondary">Partners</span>
          </h2>
          <p className="mt-4 text-dimWhite">
            We team up with leading organizations across sport, media, and research.
          </p>
        </div>

        {/* Row 1: Partners (image logos, marquee-style) */}
        <div className="relative h-[100px] sm:h-[120px] mb-10">
          <LogoLoop
            logos={imageLogos}
            speed={120}
            direction="left"
            logoHeight={100}
            gap={60}
            hoverSpeed={20}
            scaleOnHover
            fadeOut
            fadeOutColor="transparent"
            ariaLabel="Our partners and collaborators"
          />
        </div>
      </div>
    </section>
  );
};

export { Collaborations };
export default Collaborations;
