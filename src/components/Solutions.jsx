import React from "react";
import { motion } from "framer-motion";

// --- Inline SVG icons to avoid extra deps ---
const IconMotion = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M3 12h4m2 0h4m2 0h6" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="12" r="2" strokeWidth="2"/>
    <circle cx="19" cy="12" r="2" strokeWidth="2"/>
  </svg>
);

const IconLLM = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M4 5h16v10H5l-1 4V5z" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M8 9h8M8 12h6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconRehab = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M12 21s7-4.35 7-10A7 7 0 1 0 5 11c0 5.65 7 10 7 10z" strokeWidth="2"/>
    <path d="M9.5 11l2 2 3-4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconClub = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const IconBroadcast = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="3" strokeWidth="2"/>
    <path d="M5 12a7 7 0 0 1 7-7M19 12a7 7 0 0 0-7 7" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 12a10 10 0 0 1 10-10M22 12A10 10 0 0 0 12 22" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconClinic = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M12 2l7 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7l7-5z" strokeWidth="2"/>
    <path d="M12 8v8M8 12h8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconUniversity = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M2 10l10-6 10 6-10 6-10-6z" strokeWidth="2"/>
    <path d="M6 12v5l6 3 6-3v-5" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

// --- Card component styled to match your Services snippet ---
const FeatureCard = ({ icon, title, content, index }) => {
  const isComponent = typeof icon === "function";
  return (
    <motion.div
      className="relative bg-dark/40 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-secondary/30 hover:bg-dark/50 transition-all duration-300 group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-secondary/60 to-accent/40 opacity-80" />

      <div className="w-14 h-14 bg-black/20 border border-white/10 rounded-md flex items-center justify-center mb-5 group-hover:bg-secondary/10 group-hover:border-secondary/20 transition-all">
        {isComponent ? (
          React.createElement(icon, { className: "w-7 h-7 text-white" })
        ) : (
          <img src={icon} alt={title} className="w-7 h-7" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-dimWhite">{content}</p>
    </motion.div>
  );
};

const Solutions = () => {
  const solutionCards = [
    {
      id: "sol-motion",
      icon: IconMotion,
      title: "Sports Analytics (AI + Motion)",
      content:
        "Real-time movement tracking, pose estimation, and event detection for training and broadcasting. Elevate player development and fan engagement with live data overlays and highlights.",
    },
    {
      id: "sol-llm",
      icon: IconLLM,
      title: "AI Coaching & Insights (LLMs)",
      content:
        "Large language models convert biomechanics into natural feedback: session summaries, player-specific reports, and goal-led plans coaches and athletes can act on instantly.",
    },
    {
      id: "sol-rehab",
      icon: IconRehab,
      title: "Rehabilitation & Research (B2B)",
      content:
        "Secure data pipelines, custom dashboards, and integrations with hospitals and universities. License datasets, evaluate interventions, and accelerate research with explainable metrics.",
    },
  ];

  const industries = [
    {
      id: "ind-clubs",
      icon: IconClub,
      title: "Sports Clubs",
      content: "Player monitoring, skills tracking, and talent ID.",
    },
    {
      id: "ind-broadcast",
      icon: IconBroadcast,
      title: "Broadcasters",
      content: "Real-time graphics, highlights, and automated storytelling.",
    },
    {
      id: "ind-clinics",
      icon: IconClinic,
      title: "Rehab Clinics",
      content: "Progress tracking and personalized recovery insights.",
    },
    {
      id: "ind-universities",
      icon: IconUniversity,
      title: "Universities",
      content: "Research integrations, data access, and validation.",
    },
  ];

  return (
    <>
      {/* Solutions Section */}
      <section id="solutions" className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] z-0 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.32em] text-dimWhite">
              <span className="h-px w-10 bg-secondary/60" />
              Solutions
              <span className="h-px w-10 bg-accent/40" />
            </div>
            <h2 className="mt-6 text-3xl md:text-5xl font-extrabold text-white">
              Built for <span className="text-secondary">impact</span>
            </h2>
            <p className="mt-4 text-dimWhite text-lg">
              We combine computer vision and large language models to transform raw movement into insight, coaching, and measurable impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {solutionCards.map((f, idx) => (
              <FeatureCard key={f.id} index={idx} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section id="industries" className="py-20 bg-primary/95 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] z-0 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Industries We <span className="text-secondary">Serve</span>
            </h3>
            <p className="text-dimWhite">
              Purpose‑built for organizations across sport, media, and healthcare.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {industries.map((f, idx) => (
              <FeatureCard key={f.id} index={idx} {...f} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Solutions;
