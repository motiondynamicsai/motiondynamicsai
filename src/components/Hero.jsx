import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../style';
import tennisVideo from '../assets/tennis_strobe.mov';
import golfVideo from '../assets/golf_strobe.mov';

const SCROLL_SPAN_PX = 800; // How many pixels of scroll to scrub the entire video
const LERP_ALPHA = 0.18; // 0..1 — higher = snappier, lower = smoother

const Hero = () => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('tennis');

  const targetTimeRef = useRef(0);
  const rafIdRef = useRef(null);

  // Smoothly ease currentTime toward targetTime
  const startRaf = () => {
    const tick = () => {
      const video = videoRef.current;
      if (!video || !isVideoLoaded || !video.duration) {
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }
      const target = targetTimeRef.current;
      const current = video.currentTime;
      const next = current + (target - current) * LERP_ALPHA;

      if (Math.abs(next - current) > 0.002) {
        try {
          video.currentTime = next;
        } catch {
          // ignore seek errors
        }
      }

      setVideoProgress(video.duration ? video.currentTime / video.duration : 0);
      rafIdRef.current = requestAnimationFrame(tick);
    };
    if (rafIdRef.current == null) {
      rafIdRef.current = requestAnimationFrame(tick);
    }
  };

  const stopRaf = () => {
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const handleLoadedMetadata = () => {
      setIsVideoLoaded(true);
      video.pause();
      video.currentTime = 0;
      targetTimeRef.current = 0;
      setVideoProgress(0);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    const onScroll = () => {
      if (!isVideoLoaded || !video.duration) return;

      const sectionTop = section.offsetTop;
      const viewY = window.scrollY + window.innerHeight * 0.5; // center of viewport
      const delta = viewY - sectionTop;
      const progress = Math.max(0, Math.min(1, delta / SCROLL_SPAN_PX));

      const targetTime = progress * video.duration;
      targetTimeRef.current = targetTime;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    startRaf();

    return () => {
      window.removeEventListener('scroll', onScroll);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      stopRaf();
    };
  }, [isVideoLoaded, currentVideo]);

  const toggleVideo = () => {
    setCurrentVideo(prev => (prev === 'tennis' ? 'golf' : 'tennis'));
    setIsVideoLoaded(false);
    targetTimeRef.current = 0;
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-gradient-to-b from-primary to-dark pt-[96px]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-dark/90 z-0" />
      <div className="absolute inset-0 bg-grid-white/[0.02] z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Precision <span className="text-secondary">Sports</span> Analytics
            </h1>
            <p className="text-lg md:text-xl text-dimWhite mb-8 max-w-xl leading-relaxed">
              Delivering simple, scalable AI-powered motion capture and biomechanical analytics that integrate seamlessly into your workflow—driving measurable ROI for sports teams, training centers, and institutions worldwide.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <a
                href="/#contact"
                aria-label="Book a demo"
                className="px-8 py-3.5 rounded-md bg-secondary/90 text-black font-semibold hover:bg-secondary transform hover:scale-[1.02] transition-all duration-300 shadow-[0_18px_50px_-34px_rgb(var(--md-secondary)_/_0.35)]"
              >
                Book a Demo
              </a>
              <a
                href="/#services"
                aria-label="Learn more"
                className="px-8 py-3.5 rounded-md border-2 border-white/10 text-dimWhite font-semibold hover:bg-black/10 hover:border-secondary/30 hover:text-white backdrop-blur-sm transition-all duration-300"
              >
                Learn More
              </a>
            </div>

            <button
              onClick={toggleVideo}
              className="text-sm text-dimWhite/70 hover:text-secondary transition-colors duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Switch to {currentVideo === 'tennis' ? 'Golf' : 'Tennis'} Analysis
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-dark">
              <video
                ref={videoRef}
                src={currentVideo === 'tennis' ? tennisVideo : golfVideo}
                className="w-full h-auto max-w-2xl mx-auto"
                muted
                playsInline
                preload="auto"
              />

              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-dimWhite/70">Loading video...</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                  className="h-full bg-secondary/80 transition-[width] duration-150"
                  style={{ width: `${videoProgress * 100}%` }}
                />
              </div>

              {isVideoLoaded && videoProgress < 0.1 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2 animate-pulse">
                    <svg
                      className="w-5 h-5 text-white animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    <span className="text-white text-sm font-medium">Scroll to play</span>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute -z-10 w-full h-full bg-secondary/10 blur-3xl rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          {['AI-Powered', 'Real-time Analysis', '3D Motion Capture', 'Biomechanics'].map(
            (feature, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-secondary/70 rounded-full" />
                <span className="text-sm text-dimWhite">{feature}</span>
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
