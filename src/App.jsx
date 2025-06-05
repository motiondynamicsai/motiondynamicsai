import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styles from "./style";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Contact,
  Footer,
  Hero,
  Services,
  Team,
  Info,
  Navbar,
  Stats,
} from "./components";
import Collaborations from "./components/Collaborations";
import TeamMemberDetail from "./components/TeamMemberDetail";
import DemoExperience from "./components/DemoExperience";
import Storyboard from "./components/Partners";

import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
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

                <div id="home" className={`bg-primary ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Hero />
                  </div>
                </div>

                <div id="stats" className={`bg-primary ${styles.paddingX} ${styles.flexStart}`} data-aos="fade-up">
                  <div className={`${styles.boxWidth}`}>
                    <Stats />
                  </div>
                </div>

                <div id="services" className={`bg-primary ${styles.paddingX} ${styles.flexStart}`} data-aos="fade-up">
                  <div className={`${styles.boxWidth}`}>
                    <Services />
                  </div>
                </div>

                <div id="info" className={`bg-primary ${styles.paddingX} ${styles.flexStart}`} data-aos="fade-up">
                  <div className={`${styles.boxWidth}`}>
                    <Info />
                  </div>
                </div>

                <div id="collaborations" className={`bg-primary ${styles.paddingX} ${styles.flexStart}`} data-aos="fade-up">
                  <div className={`${styles.boxWidth}`}>
                    <Collaborations />
                  </div>
                </div>

                <div id="team" className={`bg-primary ${styles.paddingX} ${styles.flexStart}`} data-aos="fade-up">
                  <div className={`${styles.boxWidth}`}>
                    <Team />
                  </div>
                </div>

                <div id="contact" className={`bg-primary ${styles.paddingX} ${styles.flexStart}`} data-aos="fade-up">
                  <div className={`${styles.boxWidth}`}>
                    <Contact />
                  </div>
                </div>

                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Footer />
                  </div>
                </div>
              </>
            }
          />
          <Route path="/demo-experience" element={<DemoExperience />} />
          <Route path="/team/:id" element={<TeamMemberDetail />} />
          <Route path="/storyboard" element={<Storyboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
