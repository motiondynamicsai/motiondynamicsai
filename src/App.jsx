import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styles from "./style";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Contact,
  Footer,
  Hero,
  Services,
  Team,
  Navbar,
  Stats,
} from "./components";
import Collaborations from "./components/Collaborations";
import TeamMemberDetail from "./components/TeamMemberDetail";
import Storyboard from "./components/Partners";
import advertVideo from "./assets/advert_h264.mp4";

import AOS from 'aos';
import 'aos/dist/aos.css';

const HeroVideo = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section 
      id="hero-video" 
      className="relative w-full overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 min-h-[600px] lg:min-h-[700px]" 
      data-aos="fade-up"
      style={{ marginTop: '80px' }} // Ensures video stays below navbar
    >
      {/* Premium gradient background while video loads */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-slate-900 to-purple-950/20" />
      
      {/* Video layer with smooth fade-in */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <video
          className="w-full h-full object-cover scale-105"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
        >
          {/* Safari-preferred HEVC */}
          <source src={advertVideo} type='video/mp4; codecs="hvc1"' />
          {/* Universal fallback */}
          <source src={advertVideo} type='video/mp4; codecs="avc1.640028, mp4a.40.2"' />
          Your browser does not support the video tag.
        </video>

        
        {/* Professional gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content overlay with refined typography */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 py-32 md:py-40 lg:py-48">
        <div className="max-w-3xl">
          {/* Animated accent line */}
          <div className="flex items-center mb-6 opacity-0 animate-slideInLeft">
            <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ml-2" />
          </div>
          
          {/* Main heading with professional typography */}
          <h1 className="text-white font-light tracking-tight opacity-0 animate-slideInLeft animation-delay-200">
            <span className="block text-5xl md:text-6xl lg:text-7xl mb-2">Motion</span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent">
              Dynamics
            </span>
          </h1>
          
          {/* Refined description */}
          <p className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl opacity-0 animate-slideInLeft animation-delay-400">
            AI-Powered Motion Intelligence for Sports and Human Performance
            For organizations committed to improving athletic performance and rehabilitation outcomes, our platform delivers actionable insights into movement, efficiency, and recovery—helping businesses enhance results, engagement, and client success.          </p>
          
          {/* Professional CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-slideInLeft animation-delay-600">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-900 bg-white rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Get in touch
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#services"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border-2 border-white/30 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300"
            >
              Explore services
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-fadeIn animation-delay-800">
        <div className="flex flex-col items-center text-white/60 hover:text-white/80 transition-colors cursor-pointer">
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  useEffect(() => {
    AOS.init({ 
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  return (
    <Router>
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 w-full overflow-hidden">
        <Helmet>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
          <title>Motion Dynamics | Motion Capture in Sports, Squash, Tennis</title>
          <meta
            name="description"
            content="Motion Dynamics offers advanced motion capture solutions for sports like squash and tennis. Improve your game with our cutting-edge technology."
          />
          <meta
            name="keywords"
            content="motion capture, sport motion capture, squash motion capture, tennis motion capture, sports performance analysis, Motion Dynamics"
          />
          
          {/* Add custom styles for animations */}
          <style>{`
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            .animate-slideInLeft {
              animation: slideInLeft 0.8s ease-out forwards;
            }
            
            .animate-fadeIn {
              animation: fadeIn 1s ease-out forwards;
            }
            
            .animation-delay-200 {
              animation-delay: 200ms;
            }
            
            .animation-delay-400 {
              animation-delay: 400ms;
            }
            
            .animation-delay-600 {
              animation-delay: 600ms;
            }
            
            .animation-delay-800 {
              animation-delay: 800ms;
            }
            
            /* Reduced section spacing for tighter layout */
            .section-padding {
              padding-top: 3rem;
              padding-bottom: 3rem;
            }
            
            @media (min-width: 768px) {
              .section-padding {
                padding-top: 4rem;
                padding-bottom: 4rem;
              }
            }
            
            @media (min-width: 1024px) {
              .section-padding {
                padding-top: 5rem;
                padding-bottom: 5rem;
              }
            }
            
            /* Smooth scroll behavior */
            html {
              scroll-behavior: smooth;
            }
            
            /* Premium glass effect for components */
            .glass-effect {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            /* Professional hover transitions */
            .hover-lift {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .hover-lift:hover {
              transform: translateY(-4px);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            }
          `}</style>
        </Helmet>

        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Helmet>
                  <title>Home - Motion Dynamics | Motion Capture in Sports</title>
                  <meta
                    name="description"
                    content="Welcome to Motion Dynamics, where we use advanced motion capture technology to enhance your squash or tennis game. Explore our services and expertise in sports performance analysis."
                  />
                  <meta
                    name="keywords"
                    content="motion capture, sport motion capture, squash motion capture, tennis motion capture, sports analysis"
                  />
                </Helmet>

                {/* Hero Video Section - Now properly positioned below navbar */}
                <div id="home" className={`${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <HeroVideo />
                    <Hero />
                  </div>
                </div>

                {/* Stats Section with refined styling */}
                <div 
                  id="stats" 
                  className={`section-padding bg-gradient-to-b from-slate-900 to-slate-950 ${styles.paddingX} ${styles.flexStart}`} 
                  data-aos="fade-up"
                >
                  <div className={`${styles.boxWidth}`}>
                    <Stats />
                  </div>
                </div>

                {/* Services Section with professional spacing */}
                <div 
                  id="services" 
                  className={`section-padding bg-gradient-to-b from-slate-950 to-slate-900 ${styles.paddingX} ${styles.flexStart}`} 
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className={`${styles.boxWidth}`}>
                    <Services />
                  </div>
                </div>

                {/* Collaborations Section */}
                <div 
                  id="collaborations" 
                  className={`section-padding bg-gradient-to-b from-slate-900 to-slate-950 ${styles.paddingX} ${styles.flexStart}`} 
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className={`${styles.boxWidth}`}>
                    <Collaborations />
                  </div>
                </div>

                {/* Team Section with elegant background */}
                <div 
                  id="team" 
                  className={`section-padding bg-gradient-to-b from-slate-950 via-indigo-950/10 to-slate-950 ${styles.paddingX} ${styles.flexStart}`} 
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className={`${styles.boxWidth}`}>
                    <Team />
                  </div>
                </div>

                {/* Contact Section with premium feel */}
                <div 
                  id="contact" 
                  className={`section-padding bg-gradient-to-b from-slate-950 to-slate-900 ${styles.paddingX} ${styles.flexStart}`} 
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className={`${styles.boxWidth}`}>
                    <Contact />
                  </div>
                </div>

                {/* Footer with subtle styling */}
                <div className={`bg-slate-950 border-t border-slate-800/50 ${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Footer />
                  </div>
                </div>
              </>
            }
          />

          <Route path="/team/:id" element={<TeamMemberDetail />} />
          <Route path="/storyboard" element={<Storyboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;