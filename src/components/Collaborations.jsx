import React from "react";
import { clients } from "../constants";
import styles from "../style";
import LogoLoop from "./Design/LogoLoop";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";

// 1) Build an image-based array for LogoLoop from your `clients` constant
// Expecting each client as { id, logo, name?, href? }
const imageLogos = clients.map((c, i) => ({
  src: c.logo,
  alt: c.name || `Client ${i + 1}`,
  href: c.href || undefined,
}));

// 2) Optional: a node-based array (icons) for a second loop
const techLogos = [
  { node: <SiReact />,      title: "React",       href: "https://react.dev" },
  { node: <SiNextdotjs />,  title: "Next.js",     href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript",  href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />,title: "Tailwind",    href: "https://tailwindcss.com" },
];

const Collaborations = () => {
  return (
    <section id="collaborations" className="py-20 bg-primary relative overflow-hidden">
      {/* Subtle grid overlay (optional, matches your Services style) */}
      <div className="absolute inset-0 bg-grid-white/[0.02] z-0 pointer-events-none" />

      <div className={`relative z-10 ${styles.paddingX}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
              Collaborations & Partners
            </span>
          </h2>
          <p className="text-dimWhite mt-3">
            We team up with leading organizations across sport, media, and research.
          </p>
        </div>

        {/* Row 1: Partners (image logos, marquee-style) */}
        <div className="relative h-[100px] sm:h-[120px] mb-10">
          <LogoLoop
            logos={imageLogos}
            speed={120}            // pixels per second
            direction="left"       // 'left' | 'right' | 'up' | 'down'
            logoHeight={100}        // target logo height (px)
            gap={60}               // gap between items (px)
            hoverSpeed={20}         // pause on hover
            scaleOnHover           // gentle scale-up
            fadeOut                // gradient edge fade
            fadeOutColor="transparent" // or a brand bg color if you prefer
            ariaLabel="Our partners and collaborators"
          />
        </div>
      </div>
    </section>
  );
};

export default Collaborations;
