import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import styles from './style';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Contact,
  Footer,
  Hero,
  Services,
  Team,
  Navbar,
  Stats,
  Solutions,
} from './components';
import Collaborations from './components/Collaborations';
import TeamMemberDetail from './components/TeamMemberDetail';
import Storyboard from './components/Partners';
import advertVideo from './assets/advert_h264.mp4';

const REVEAL_VIEWPORT = { once: true, margin: '-20%' } as const;
const REVEAL_TRANSITION = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
const REVEAL_INITIAL = { opacity: 0, y: 24 } as const;
const REVEAL_WHILE_IN_VIEW = { opacity: 1, y: 0 } as const;

const HeroVideo = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <motion.section
      id="hero-video"
      className="relative w-full overflow-hidden bg-gradient-to-b from-primary to-dark min-h-[600px] lg:min-h-[700px]"
      initial={REVEAL_INITIAL}
      whileInView={REVEAL_WHILE_IN_VIEW}
      viewport={REVEAL_VIEWPORT}
      transition={REVEAL_TRANSITION}
      style={{ marginTop: '80px' }}
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
    </motion.section>
  );
};

const App = () => {
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
                <motion.div
                  id="stats"
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-16 md:-mt-20 lg:-mt-24`}
                  initial={REVEAL_INITIAL}
                  whileInView={REVEAL_WHILE_IN_VIEW}
                  viewport={REVEAL_VIEWPORT}
                  transition={REVEAL_TRANSITION}
                >
                  <div className="floating-gradient gradient-orb-1"></div>
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Stats />
                  </div>
                  <div className="section-divider"></div>
                </motion.div>

                {/* Solutions Section with gradient flow */}
                <motion.div
                  id="solutions"
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(to bottom, rgb(var(--md-primary) / 0.12), rgb(var(--md-dark) / 0.52), rgb(var(--md-primary) / 0.12))',
                  }}
                  initial={REVEAL_INITIAL}
                  whileInView={REVEAL_WHILE_IN_VIEW}
                  viewport={REVEAL_VIEWPORT}
                  transition={REVEAL_TRANSITION}
                >
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Solutions />
                  </div>
                  <div className="section-divider"></div>
                </motion.div>

                {/* Services Section with elegant background blend */}
                <motion.div
                  id="services"
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(135deg, rgb(var(--md-primary) / 0.96) 0%, rgb(var(--md-dark) / 0.92) 50%, rgb(var(--md-primary) / 0.96) 100%)',
                  }}
                  initial={REVEAL_INITIAL}
                  whileInView={REVEAL_WHILE_IN_VIEW}
                  viewport={REVEAL_VIEWPORT}
                  transition={REVEAL_TRANSITION}
                >
                  <div className="floating-gradient gradient-orb-2"></div>
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Services />
                  </div>
                  <div className="section-divider"></div>
                </motion.div>

                {/* Collaborations Section with subtle gradient */}
                <motion.div
                  id="collaborations"
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(to bottom, rgb(var(--md-dark) / 0.40), rgb(var(--md-primary) / 0.78), rgb(var(--md-dark) / 0.40))',
                  }}
                  initial={REVEAL_INITIAL}
                  whileInView={REVEAL_WHILE_IN_VIEW}
                  viewport={REVEAL_VIEWPORT}
                  transition={REVEAL_TRANSITION}
                >
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Collaborations />
                  </div>
                  <div className="section-divider"></div>
                </motion.div>

                {/* Team Section with indigo accent gradient */}
                <motion.div
                  id="team"
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(180deg, rgb(var(--md-primary) / 0.92) 0%, rgb(var(--md-secondary) / 0.05) 50%, rgb(var(--md-primary) / 0.92) 100%)',
                  }}
                  initial={REVEAL_INITIAL}
                  whileInView={REVEAL_WHILE_IN_VIEW}
                  viewport={REVEAL_VIEWPORT}
                  transition={REVEAL_TRANSITION}
                >
                  <div className="floating-gradient gradient-orb-1"></div>
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Team />
                  </div>
                  <div className="section-divider"></div>
                </motion.div>

                {/* Contact Section with premium gradient */}
                <motion.div
                  id="contact"
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  style={{
                    background: 'linear-gradient(to bottom, rgb(var(--md-primary) / 0.70), rgb(var(--md-dark) / 0.95))',
                  }}
                  initial={REVEAL_INITIAL}
                  whileInView={REVEAL_WHILE_IN_VIEW}
                  viewport={REVEAL_VIEWPORT}
                  transition={REVEAL_TRANSITION}
                >
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Contact />
                  </div>
                </motion.div>

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

export { App };
export default App;
