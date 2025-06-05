import React from 'react';
import { Helmet } from 'react-helmet';
import styles from '../style';
import { TennisImage } from '../assets';
import { motion } from 'framer-motion';

const Hero = () => (
  <section className="relative min-h-screen flex items-center bg-primary pt-[96px]">
    {/* Background overlays */}
    <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-dark/90 z-0" />
    <div className="absolute inset-0 bg-grid-white/[0.02] z-0" />

    {/* Content container */}
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12">
        
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
              Precision Sports Analytics
            </span>
          </h1>
          <p className="text-lg md:text-xl text-dimWhite mb-8 max-w-xl leading-relaxed">
            Delivering simple, scalable AI-powered motion capture and biomechanical analytics that integrate seamlessly into your workflow—driving measurable ROI for sports teams, training centers, and institutions worldwide.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/#contact"
              aria-label="Book a demo"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-semibold hover:shadow-xl transition-all"
            >
              Book a Demo
            </a>
            <a
              href="/#services"
              aria-label="Learn more"
              className="px-6 py-3 rounded-lg border-2 border-accent text-accent font-semibold hover:bg-accent/10 transition-all"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Image content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <img
            src={TennisImage}
            alt="Tennis player tracked with motion capture"
            className="w-full max-w-2xl mx-auto rounded-2xl shadow-xl border border-gray-700"
          />
          <div className="absolute -z-10 w-full h-full bg-accent/10 blur-3xl rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
