import React, { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import styles from '../style'; 
import {  videoAnalysis, phone, PhoneAnalysis2 } from '../assets';
import { Helmet } from 'react-helmet';
import secondVideo from '../assets/1025.mp4';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { d_reconstruction, skeleton_overlay_squash, skeleton_overlay_tennis } from '../assets';


const DemoExperience = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on component mount
    AOS.init({ duration: 2000 }); // Initialize AOS with a duration of 2000ms
  }, []);

  const handleGetInTouchClick = () => {
    navigate('/#contact'); // Navigate to the contact section on the main page
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
        <header className="text-center mb-12" data-aos="fade-up">
          <h1 className={styles.heading2}>
            Welcome to Our Demo Experience
          </h1>
          <p className={styles.paragraph}>
            Dive into our demos to experience our advanced motion capture technology and analytics in action.
          </p>
        </header>

        {/* Main Content */}
        <section className="flex flex-col lg:flex-row items-center lg:justify-between mb-12">
          <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0" data-aos="fade-right">
            <img 
              src={phone} 
              alt="Motion Capture Demo on Mobile" 
              className="w-[300px] max-w-[300px] md:max-w-[500px] h-auto rounded-lg shadow-lg"
              loading="lazy"  
            />
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start p-4" data-aos="fade-left">
            <div className="w-[300px] max-w-[300px] md:max-w-[500px] h-auto rounded-lg shadow-lg">
              <img 
                src={PhoneAnalysis2} 
                alt="Phone Analysis" 
                className="w-full max-w-[200px] md:max-w-[350px] h-auto rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </section>

        {/* Video Analysis Sections */}
        <section className="text-center mb-12">
          <h2 className={styles.heading3} data-aos="fade-up">
            Real-Time Hand Tracking Speed
          </h2>
          <p className={`${styles.paragraph} mb-8`} data-aos="fade-up">
            Watch our video to see how our real-time hand tracking technology performs in action.
          </p>
          <div className="flex justify-center mb-12" data-aos="zoom-in">
            <video controls className="w-full max-w-[600px] h-auto rounded-lg shadow-lg">
              <source src={videoAnalysis} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <h2 className={styles.heading3} data-aos="fade-up">
            Full 3D Motion Analysis Demo
          </h2>
          <p className={`${styles.paragraph} mb-8`} data-aos="fade-up">
            Our real motion analysis technology in professional Squash.
          </p>
          <div className="flex justify-center" data-aos="zoom-in">
            <video controls className="w-full max-w-[600px] h-auto rounded-lg shadow-lg">
              <source src={secondVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center" data-aos="fade-up">
          <h2 className={styles.heading3}>
            Ready to Explore Our Technology?
          </h2>
          <p className={`${styles.paragraph} mb-9`}>
            Contact us to schedule a personalized demo and discover how we can transform your sports performance with our motion capture solutions.
          </p>
          <button 
            onClick={handleGetInTouchClick} 
            className="inline-block bg-blue-gradient text-white font-poppins font-medium text-[14px] md:text-[16px] py-3 px-6 rounded-lg shadow-lg">
            Get in Touch
          </button>
        </section>
      </div>
    </div>
  );
};

export default DemoExperience;
