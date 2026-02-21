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
  Solutions,
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
      className="relative w-full overflow-hidden bg-gradient-to-b from-primary to-dark min-h-[600px] lg:min-h-[700px]" 
      data-aos="fade-up"
      style={{ marginTop: '80px' }} // Ensures video stays below navbar
    >
      {/* Premium gradient background while video loads */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-primary to-secondary/5" />
      
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
            <div className="h-1 w-12 bg-secondary/70 rounded-[2px]" />
            <div className="h-1 w-8 bg-accent/35 rounded-[2px] ml-2" />
          </div>
          
          {/* Main heading with professional typography */}
          <h1 className="text-white tracking-tight opacity-0 animate-slideInLeft animation-delay-200">
            <span className="block text-5xl md:text-6xl lg:text-7xl mb-2 font-medium">Motion</span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-extrabold text-secondary">
              Dynamics
            </span>
          </h1>
          
          {/* Refined description */}
          <p className="mt-6 text-lg md:text-xl text-dimWhite leading-relaxed max-w-2xl opacity-0 animate-slideInLeft animation-delay-400">
            AI-Powered Motion Intelligence for Sports and Human Performance
            For organizations committed to improving athletic performance and rehabilitation outcomes, our platform delivers actionable insights into movement, efficiency, and recovery—helping businesses enhance results, engagement, and client success.          </p>
          
          {/* Professional CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-slideInLeft animation-delay-600">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-black bg-secondary/90 rounded-md transform hover:scale-[1.02] transition-all duration-300 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.85)] hover:shadow-[0_24px_60px_-34px_rgb(var(--md-secondary)_/_0.35)]"
            >
              Get in touch
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#services"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border-2 border-white/10 bg-black/10 backdrop-blur-sm rounded-md hover:bg-black/20 hover:border-secondary/30 transform hover:scale-[1.02] transition-all duration-300"
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
      duration: 1200,
      once: false,
      easing: 'ease-out-cubic',
      offset: 50,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });
  }, []);

  return (
    <Router>
      <div className="bg-primary w-full overflow-hidden">
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
            
            /* Smooth section transitions with overlapping gradients */
            .section-transition {
              position: relative;
              isolation: isolate;
            }
            
            .section-transition::before {
              content: '';
              position: absolute;
              top: -50px;
              left: 0;
              right: 0;
              height: 100px;
              background: linear-gradient(to bottom, transparent, rgb(var(--md-primary) / 0.55), transparent);
              pointer-events: none;
              z-index: 1;
            }
            
            /* Minimal section spacing for tighter layout */
            .section-padding {
              padding-top: 2rem;
              padding-bottom: 2rem;
              position: relative;
            }
            
            @media (min-width: 768px) {
              .section-padding {
                padding-top: 3rem;
                padding-bottom: 3rem;
              }
            }
            
            @media (min-width: 1024px) {
              .section-padding {
                padding-top: 4rem;
                padding-bottom: 4rem;
              }
            }
            
            /* Smooth scroll behavior with offset */
            html {
              scroll-behavior: smooth;
              scroll-padding-top: 80px;
            }
            
            /* Premium glass effect for components */
            .glass-effect {
              background: rgb(var(--md-white) / 0.03);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgb(var(--md-white) / 0.06);
            }
            
            /* Professional hover transitions */
            .hover-lift {
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .hover-lift:hover {
              transform: translateY(-6px);
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            }
            
            /* Seamless background flow between sections */
            .bg-flow-dark {
              background: linear-gradient(180deg, 
                rgb(var(--md-primary) / 0) 0%,
                rgb(var(--md-primary) / 0.55) 20%,
                rgb(var(--md-primary) / 0.88) 50%,
                rgb(var(--md-primary) / 0.55) 80%,
                rgb(var(--md-primary) / 0) 100%
              );
            }
            
            .bg-flow-light {
              background: linear-gradient(180deg,
                rgb(var(--md-dark) / 0) 0%,
                rgb(var(--md-dark) / 0.40) 20%,
                rgb(var(--md-dark) / 0.60) 50%,
                rgb(var(--md-dark) / 0.40) 80%,
                rgb(var(--md-dark) / 0) 100%
              );
            }
            
            /* Subtle section dividers */
            .section-divider {
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              height: 1px;
              background: linear-gradient(90deg,
                transparent 0%,
                rgb(var(--md-secondary) / 0.10) 20%,
                rgb(var(--md-accent) / 0.16) 50%,
                rgb(var(--md-secondary) / 0.10) 80%,
                transparent 100%
              );
            }
            
            /* Floating gradient orbs for ambient effect */
            @keyframes float {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -30px) scale(1.05); }
              66% { transform: translate(-20px, 20px) scale(0.95); }
            }
            
            .floating-gradient {
              position: absolute;
              border-radius: 50%;
              filter: blur(80px);
              opacity: 0.08;
              animation: float 20s infinite ease-in-out;
              pointer-events: none;
            }
            
            .gradient-orb-1 {
              width: 600px;
              height: 600px;
              background: radial-gradient(circle, rgb(var(--md-secondary) / 0.18) 0%, transparent 70%);
              top: -300px;
              left: -300px;
            }
            
            .gradient-orb-2 {
              width: 800px;
              height: 800px;
              background: radial-gradient(circle, rgb(var(--md-accent) / 0.14) 0%, transparent 70%);
              bottom: -400px;
              right: -400px;
              animation-delay: -10s;
            }
            
            /* Content fade-in on scroll */
            .content-reveal {
              opacity: 0;
              transform: translateY(20px);
              transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .content-reveal.aos-animate {
              opacity: 1;
              transform: translateY(0);
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

                {/* Hero Video Section - Seamlessly flows into next section */}
                <div id="home" className={`${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <HeroVideo />
                    <Hero />
                  </div>
                </div>

                {/* Stats Section with smooth transition */}
                <div
                  id="stats"
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-16 md:-mt-20 lg:-mt-24`}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <div className="floating-gradient gradient-orb-1"></div>
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Stats />
                  </div>
                  <div className="section-divider"></div>
                </div>

                {/* Solutions Section with gradient flow */}
                <div
                  id="solutions"
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(to bottom, rgb(var(--md-primary) / 0.12), rgb(var(--md-dark) / 0.52), rgb(var(--md-primary) / 0.12))',
                  }}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Solutions />
                  </div>
                  <div className="section-divider"></div>
                </div>

                {/* Services Section with elegant background blend */}
                <div 
                  id="services" 
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(135deg, rgb(var(--md-primary) / 0.96) 0%, rgb(var(--md-dark) / 0.92) 50%, rgb(var(--md-primary) / 0.96) 100%)',
                  }}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="50"
                >
                  <div className="floating-gradient gradient-orb-2"></div>
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Services />
                  </div>
                  <div className="section-divider"></div>
                </div>

                {/* Collaborations Section with subtle gradient */}
                <div 
                  id="collaborations" 
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(to bottom, rgb(var(--md-dark) / 0.40), rgb(var(--md-primary) / 0.78), rgb(var(--md-dark) / 0.40))',
                  }}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="50"
                >
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Collaborations />
                  </div>
                  <div className="section-divider"></div>
                </div>

                {/* Team Section with indigo accent gradient */}
                <div 
                  id="team" 
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(180deg, rgb(var(--md-primary) / 0.92) 0%, rgb(var(--md-secondary) / 0.05) 50%, rgb(var(--md-primary) / 0.92) 100%)',
                  }}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="50"
                >
                  <div className="floating-gradient gradient-orb-1"></div>
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Team />
                  </div>
                  <div className="section-divider"></div>
                </div>

                {/* Contact Section with premium gradient */}
                <div 
                  id="contact" 
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(to bottom, rgb(var(--md-primary) / 0.70), rgb(var(--md-dark) / 0.95))',
                  }}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="50"
                >
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Contact />
                  </div>
                </div>

                {/* Footer with smooth transition from contact */}
                <div className={`bg-dark border-t border-white/10 ${styles.paddingX} ${styles.flexStart}`}>
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
