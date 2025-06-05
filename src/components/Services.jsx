import React from 'react';
import { features } from '../constants';
import { motion } from 'framer-motion';

// Updated ServiceCard to handle both image strings and React component icons
const ServiceCard = ({ icon, title, content, index }) => {
  const isComponent = typeof icon === 'function';

  return (
    <motion.div
      className="bg-dark p-6 rounded-2xl border border-gray-700 hover:border-accent hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="w-14 h-14 bg-dimBlue rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-all">
        {isComponent ? (
          React.createElement(icon, { className: 'w-7 h-7 text-white' })
        ) : (
          <img src={icon} alt={title} className="w-7 h-7" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-dimWhite">{content}</p>
    </motion.div>
  );
};

const Services = () => (
  <section id="services" className="py-24 bg-primary relative overflow-hidden">
    <div className="absolute inset-0 bg-grid-white/[0.02] z-0 pointer-events-none" />
    <div className="container mx-auto px-6 relative z-10">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
            What We Offer
          </span>
        </h2>
        <p className="text-dimWhite text-lg">
          AI-powered tools and analytics that drive performance, decision-making, and player development.
        </p>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <ServiceCard key={feature.id} index={index} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

export default Services;
