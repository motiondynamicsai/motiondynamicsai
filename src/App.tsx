import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import styles from './style';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import ScrollProgress from './components/ScrollProgress';
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
import { HeroVideo } from './components/HeroVideo';
import Accuracy from './components/Accuracy';

const REVEAL_VIEWPORT = { once: true, margin: '-20%' } as const;
const REVEAL_TRANSITION = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
const REVEAL_INITIAL = { opacity: 0, y: 24 } as const;
const REVEAL_WHILE_IN_VIEW = { opacity: 1, y: 0 } as const;

const App = () => {
  useLenis();
  return (
    <Router>
      <ScrollProgress />
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

                {/* Accuracy / PINNs side-by-side */}
                <motion.div
                  id="accuracy"
                  className={`section-padding section-transition ${styles.paddingX} ${styles.flexStart} relative overflow-hidden -mt-8 md:-mt-10 lg:-mt-12`}
                  initial={REVEAL_INITIAL}
                  whileInView={REVEAL_WHILE_IN_VIEW}
                  viewport={REVEAL_VIEWPORT}
                  transition={REVEAL_TRANSITION}
                >
                  <div className={`${styles.boxWidth} relative z-10`}>
                    <Accuracy />
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
