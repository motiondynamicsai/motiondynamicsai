import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from '../style';
import { videoAnalysis, phone, PhoneAnalysis2 } from '../assets';
import { Helmet } from 'react-helmet';
import secondVideo from '../assets/1025.mp4';

const REVEAL_VIEWPORT = { once: true, margin: '-20%' } as const;
const REVEAL_TRANSITION = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
const REVEAL_INITIAL = { opacity: 0, y: 24 } as const;
const REVEAL_WHILE_IN_VIEW = { opacity: 1, y: 0 } as const;

const DemoExperience = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGetInTouchClick = () => {
    navigate('/#contact');
  };

  return (
    <div className="bg-primary w-full min-h-screen flex items-center justify-center">
      <div className={`w-full max-w-5xl p-4 ${styles.paddingX} ${styles.paddingY} flex flex-col`}>
        <Helmet>
          <title>Experience Our Motion Capture Technology - Demo | Motion Dynamics</title>
          <meta
            name="description"
            content="Explore our demo experience and witness the power of our motion capture technology in sports performance analysis. Watch live demos, view detailed analytics, and understand how our solutions can elevate your game."
          />
          <meta
            name="keywords"
            content="motion capture demo, sports performance analysis, real-time hand tracking, Motion Dynamics demo, squash performance analysis, tennis motion capture"
          />
          <link rel="canonical" href="https://motiondynamics.ai/demoexperience" />
        </Helmet>

        {/* Header Section */}
        <motion.header
          className="text-center mb-12"
          initial={REVEAL_INITIAL}
          whileInView={REVEAL_WHILE_IN_VIEW}
          viewport={REVEAL_VIEWPORT}
          transition={REVEAL_TRANSITION}
        >
          <h1 className={styles.heading2}>
            Welcome to Our Demo Experience
          </h1>
          <p className={styles.paragraph}>
            Dive into our demos to experience our advanced motion capture technology and analytics in action.
          </p>
        </motion.header>

        {/* Main Content */}
        <section className="flex flex-col lg:flex-row items-center lg:justify-between mb-12">
          <motion.div
            className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0"
            initial={REVEAL_INITIAL}
            whileInView={REVEAL_WHILE_IN_VIEW}
            viewport={REVEAL_VIEWPORT}
            transition={REVEAL_TRANSITION}
          >
            <img
              src={phone}
              alt="Motion Capture Demo on Mobile"
              className="w-[300px] max-w-[300px] md:max-w-[500px] h-auto rounded-lg shadow-lg"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-start p-4"
            initial={REVEAL_INITIAL}
            whileInView={REVEAL_WHILE_IN_VIEW}
            viewport={REVEAL_VIEWPORT}
            transition={REVEAL_TRANSITION}
          >
            <div className="w-[300px] max-w-[300px] md:max-w-[500px] h-auto rounded-lg shadow-lg">
              <img
                src={PhoneAnalysis2}
                alt="Phone Analysis"
                className="w-full max-w-[200px] md:max-w-[350px] h-auto rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </section>

        {/* Video Analysis Sections */}
        <section className="text-center mb-12">
          <motion.h2
            className={styles.heading3}
            initial={REVEAL_INITIAL}
            whileInView={REVEAL_WHILE_IN_VIEW}
            viewport={REVEAL_VIEWPORT}
            transition={REVEAL_TRANSITION}
          >
            Real-Time Hand Tracking Speed
          </motion.h2>
          <motion.p
            className={`${styles.paragraph} mb-8`}
            initial={REVEAL_INITIAL}
            whileInView={REVEAL_WHILE_IN_VIEW}
            viewport={REVEAL_VIEWPORT}
            transition={REVEAL_TRANSITION}
          >
            Watch our video to see how our real-time hand tracking technology performs in action.
          </motion.p>
          <motion.div
            className="flex justify-center mb-12"
            initial={REVEAL_INITIAL}
            whileInView={REVEAL_WHILE_IN_VIEW}
            viewport={REVEAL_VIEWPORT}
            transition={REVEAL_TRANSITION}
          >
            <video controls className="w-full max-w-[600px] h-auto rounded-lg shadow-lg">
              <source src={videoAnalysis} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>

          <motion.h2
            className={styles.heading3}
            initial={REVEAL_INITIAL}
            whileInView={REVEAL_WHILE_IN_VIEW}
            viewport={REVEAL_VIEWPORT}
            transition={REVEAL_TRANSITION}
          >
            Full 3D Motion Analysis Demo
          </motion.h2>
          <motion.p
            className={`${styles.paragraph} mb-8`}
            initial={REVEAL_INITIAL}
            whileInView={REVEAL_WHILE_IN_VIEW}
            viewport={REVEAL_VIEWPORT}
            transition={REVEAL_TRANSITION}
          >
            Our real motion analysis technology in professional Squash.
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={REVEAL_INITIAL}
            whileInView={REVEAL_WHILE_IN_VIEW}
            viewport={REVEAL_VIEWPORT}
            transition={REVEAL_TRANSITION}
          >
            <video controls className="w-full max-w-[600px] h-auto rounded-lg shadow-lg">
              <source src={secondVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </section>

        {/* Call to Action Section */}
        <motion.section
          className="text-center"
          initial={REVEAL_INITIAL}
          whileInView={REVEAL_WHILE_IN_VIEW}
          viewport={REVEAL_VIEWPORT}
          transition={REVEAL_TRANSITION}
        >
          <h2 className={styles.heading3}>
            Ready to Explore Our Technology?
          </h2>
          <p className={`${styles.paragraph} mb-9`}>
            Contact us to schedule a personalized demo and discover how we can transform your sports performance with our motion capture solutions.
          </p>
          <button
            onClick={handleGetInTouchClick}
            className="inline-block bg-blue-gradient text-black font-poppins font-medium text-[14px] md:text-[16px] py-3 px-6 rounded-lg shadow-[0_18px_50px_-42px_rgb(var(--md-secondary)_/_0.28)] hover:opacity-95 transition-opacity">
            Get in Touch
          </button>
        </motion.section>
      </div>
    </div>
  );
};

export { DemoExperience };
export default DemoExperience;
