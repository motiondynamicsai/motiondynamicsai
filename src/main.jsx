import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  collaborationsIntro,
  contactContent,
  demoIntro,
  demoMetrics,
  features,
  footerLinks,
  industries,
  industriesIntro,
  navLinks,
  partnerLogos,
  socialMedia,
  solutionIntro,
  stats,
  team,
  teamIntro,
  testimonials,
  testimonialsIntro,
} from '../assets/Consts';
import {
  CollaborationSection,
  ClubhouseSection,
  ContactSection,
  DemoSection,
  Footer,
  Header,
  HeroSection,
  MotionSection,
  ProgramStrip,
  TeamSection,
  TestimonialsSection,
  VideoBackground,
} from './Components';
import './styles.css';

const chapters = features.slice(0, 3).map((feature, index) => ({
  eyebrow: `Service 0${index + 1}`,
  title: feature.title,
  body: feature.content,
  range: index === 0 ? [0, 33] : index === 1 ? [34, 66] : [67, 100],
}));

const FULL_VIDEO_SCROLL_END = 0.5;
const PLAYER_CLEAR_SECONDS = 11;
const AUTO_SCROLL_DURATION_MS = 3000;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function useScrollVideo(videoRef, endingVideoRef) {
  const [progress, setProgress] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEndingLoop, setIsEndingLoop] = useState(false);
  const frame = useRef(null);
  const lastFrameAt = useRef(0);
  const lastSeekAt = useRef(0);
  const lastStateAt = useRef(0);
  const targetTime = useRef(0);
  const smoothTime = useRef(0);
  const ready = useRef(false);
  const endingMode = useRef(false);
  const nativePlaying = useRef(false);
  const scrollDirection = useRef(1);
  const seeking = useRef(false);
  const endingStartPending = useRef(false);
  const seekUnlockTimer = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function pageProgress() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      return maxScroll <= 0 ? 0 : clamp(window.scrollY / maxScroll, 0, 1);
    }

    function seek(time, force = false) {
      const safeTime = clamp(time, 0, video.duration || 0);
      if ((!force && seeking.current) || Math.abs(video.currentTime - safeTime) < 0.01) return false;
      seeking.current = true;
      window.clearTimeout(seekUnlockTimer.current);
      seekUnlockTimer.current = window.setTimeout(() => {
        seeking.current = false;
      }, 140);
      video.currentTime = safeTime;
      return true;
    }

    function pauseNativePlayback() {
      if (!nativePlaying.current) return;
      video.pause();
      nativePlaying.current = false;
    }

    function prepareEndingVideo() {
      const endingVideo = endingVideoRef.current;
      if (!endingVideo) return;
      endingVideo.muted = true;
      endingVideo.playsInline = true;
      endingVideo.loop = true;
      endingVideo.load();
    }

    function showEndingVideo() {
      const endingVideo = endingVideoRef.current;
      if (!endingVideo || endingStartPending.current) return;

      endingStartPending.current = true;
      endingVideo.muted = true;
      endingVideo.playsInline = true;
      endingVideo.loop = true;

      if (endingVideo.readyState >= 1) {
        endingVideo.currentTime = 0;
      }

      endingVideo.play()
        .then(() => {
          requestAnimationFrame(() => {
            endingMode.current = true;
            endingStartPending.current = false;
            setIsEndingLoop(true);
          });
        })
        .catch(() => {
          endingMode.current = true;
          endingStartPending.current = false;
          setIsEndingLoop(true);
        });
    }

    function playTowardTarget(distance) {
      video.playbackRate = clamp(distance * 3.4, 0.35, 2.4);
      if (nativePlaying.current) return;
      video.play()
        .then(() => {
          nativePlaying.current = true;
        })
        .catch(() => {
          nativePlaying.current = false;
        });
    }

    function render(now = performance.now()) {
      const delta = Math.min(now - (lastFrameAt.current || now), 64);
      const actualTime = video.currentTime || smoothTime.current;
      const distance = targetTime.current - actualTime;
      const movingBackward = scrollDirection.current < 0 || distance < -0.01;
      const ease = 1 - Math.exp(-delta / (movingBackward ? 190 : 135));
      const seekGap = movingBackward ? 24 : 42;
      const minStep = movingBackward ? 0.012 : 0.012;
      const settleDistance = movingBackward ? 0.018 : 0.018;
      const shouldSeek = now - lastSeekAt.current > seekGap;

      if (movingBackward) {
        pauseNativePlayback();
        smoothTime.current = targetTime.current;

        if (shouldSeek && Math.abs(video.currentTime - smoothTime.current) > minStep) {
          if (seek(smoothTime.current, true)) {
            lastSeekAt.current = now;
          }
        }
      } else if (distance > 0.055 && distance < 1.25) {
        playTowardTarget(distance);
        smoothTime.current = actualTime;
      } else {
        pauseNativePlayback();
        smoothTime.current += (targetTime.current - smoothTime.current) * ease;

        if (shouldSeek && Math.abs(video.currentTime - smoothTime.current) > minStep) {
          if (seek(smoothTime.current)) {
            lastSeekAt.current = now;
          }
        }
      }

      if (now - lastStateAt.current > 90 && video.duration) {
        const nextTime = video.currentTime || smoothTime.current;
        setProgress(clamp(nextTime / video.duration, 0, 1));
        setVideoTime(nextTime);
        lastStateAt.current = now;
      }

      lastFrameAt.current = now;

      if (Math.abs(distance) > settleDistance) {
        frame.current = requestAnimationFrame(render);
      } else {
        pauseNativePlayback();
        smoothTime.current = targetTime.current;
        seek(smoothTime.current, movingBackward);
        setProgress(video.duration ? clamp(smoothTime.current / video.duration, 0, 1) : 0);
        setVideoTime(smoothTime.current);
        frame.current = null;
      }
    }

    function update() {
      if (!ready.current || reducedMotion || !video.duration) return;
      const nextProgress = pageProgress();
      const endingVideo = endingVideoRef.current;

      if (nextProgress >= FULL_VIDEO_SCROLL_END) {
        pauseNativePlayback();
        targetTime.current = video.duration;
        smoothTime.current = video.duration;
        seek(video.duration, true);
        setVideoTime(video.duration);
        setProgress(1);

        if (!endingMode.current && !endingStartPending.current) {
          showEndingVideo();
        }

        return;
      }

      if (endingMode.current || endingStartPending.current) {
        endingStartPending.current = false;
        endingMode.current = false;
        setIsEndingLoop(false);
        if (endingVideo) {
          endingVideo.pause();
          endingVideo.currentTime = 0;
        }
        pauseNativePlayback();
        smoothTime.current = clamp(
          (nextProgress / FULL_VIDEO_SCROLL_END) * video.duration,
          0,
          video.duration,
        );
        targetTime.current = smoothTime.current;
        scrollDirection.current = -1;
        seek(smoothTime.current, true);
      }

      const mappedProgress = nextProgress / FULL_VIDEO_SCROLL_END;
      const nextTime = clamp(mappedProgress * video.duration, 0, video.duration);
      scrollDirection.current = nextTime >= targetTime.current ? 1 : -1;
      targetTime.current = nextTime;
      if (scrollDirection.current < 0) {
        pauseNativePlayback();
      }
      if (!frame.current) frame.current = requestAnimationFrame(render);
    }

    async function unlockPlayback() {
      try {
        video.muted = true;
        video.playsInline = true;
        await video.play();
        video.pause();
        seek(0.001);
        update();
      } catch (_) {
        video.controls = false;
      }
    }

    function onMetadata() {
      ready.current = true;
      endingMode.current = false;
      setIsEndingLoop(false);
      prepareEndingVideo();
      smoothTime.current = 0;
      targetTime.current = 0;
      setDuration(video.duration || 0);
      lastFrameAt.current = performance.now();
      lastSeekAt.current = 0;
      lastStateAt.current = 0;
      unlockPlayback();
    }

    function onSeeked() {
      window.clearTimeout(seekUnlockTimer.current);
      seeking.current = false;
    }

    if (video.readyState >= 1) onMetadata();
    else video.addEventListener('loadedmetadata', onMetadata, { once: true });

    video.addEventListener('seeked', onSeeked);

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('seeked', onSeeked);
      window.clearTimeout(seekUnlockTimer.current);
      if (frame.current) cancelAnimationFrame(frame.current);
      pauseNativePlayback();
      if (endingVideoRef.current) endingVideoRef.current.pause();
    };
  }, [endingVideoRef, videoRef]);

  return { duration, isEndingLoop, progress, videoTime };
}

function useMotionSectionState(sectionId, chapterCount) {
  const [sectionProgress, setSectionProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function update() {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const viewportMiddle = window.innerHeight / 2;
      const slotHeight = section.offsetHeight / chapterCount;
      const nextProgress = clamp(-rect.top / travel, 0, 1);

      let nextActiveIndex = 0;
      let shortestDistance = Number.POSITIVE_INFINITY;

      for (let index = 0; index < chapterCount; index += 1) {
        const slotMiddle = rect.top + slotHeight * (index + 0.5);
        const distance = Math.abs(slotMiddle - viewportMiddle);

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nextActiveIndex = index;
        }
      }

      setSectionProgress(nextProgress);
      setActiveIndex(nextActiveIndex);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [chapterCount, sectionId]);

  return { activeIndex, sectionProgress };
}

function useMotionPanelVisibility() {
  const [panelState, setPanelState] = useState({ bottom: 0, visibility: 0 });

  useEffect(() => {
    function update() {
      const serviceStack = document.querySelector('#motion .chapter-stack');
      const contactButton = document.querySelector('#clubhouse .button');
      const panel = document.querySelector('.motion-video-panel');
      if (!serviceStack || !contactButton || !panel) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const stackRect = serviceStack.getBoundingClientRect();
      const stackBottom = stackRect.bottom + scrollY;
      const fullyVisiblePoint = stackBottom - viewportHeight;
      const fadeIn = clamp((scrollY - fullyVisiblePoint) / 140, 0, 1);
      const contactBottom = contactButton.getBoundingClientRect().bottom;
      const fadeOut = clamp(contactBottom / (viewportHeight * 0.18), 0, 1);
      const panelHeight = panel.getBoundingClientRect().height;
      const restingBottom = Math.max((viewportHeight - panelHeight) / 2, 24);
      const restingBottomLine = viewportHeight - restingBottom;
      const panelBottom = contactBottom < restingBottomLine ? viewportHeight - contactBottom : restingBottom;

      setPanelState({ bottom: panelBottom, visibility: fadeIn * fadeOut });
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return panelState;
}

function App() {
  const videoRef = useRef(null);
  const endingVideoRef = useRef(null);
  const motionPanelVideoRef = useRef(null);
  const autoScrollTimer = useRef(null);
  const [isMotionPanelPlaying, setIsMotionPanelPlaying] = useState(true);
  const { duration, isEndingLoop, progress, videoTime } = useScrollVideo(videoRef, endingVideoRef);
  const { activeIndex: activeChapter, sectionProgress: motionProgress } = useMotionSectionState('motion', chapters.length);
  const motionPanel = useMotionPanelVisibility();
  const percent = Math.round(progress * 100);
  const keepPlayerClear = !duration || videoTime < PLAYER_CLEAR_SECONDS;
  const programItems = features.slice(2, 5);

  function handleStartMotion(event) {
    event.preventDefault();
    const target = document.getElementById('motion');
    if (!target) return;

    const startY = window.scrollY;
    const endY = target.getBoundingClientRect().top + window.scrollY;
    const distance = endY - startY;
    const startAt = performance.now();

    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }

    function easeInOutSine(value) {
      return -(Math.cos(Math.PI * value) - 1) / 2;
    }

    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    function tick() {
      const now = performance.now();
      const elapsed = now - startAt;
      const progressValue = clamp(elapsed / AUTO_SCROLL_DURATION_MS, 0, 1);
      const easedProgress = easeInOutSine(progressValue);
      window.scrollTo({ top: startY + distance * easedProgress, behavior: 'auto' });

      if (progressValue < 1) {
        autoScrollTimer.current = window.setTimeout(tick, 16);
      } else {
        autoScrollTimer.current = null;
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        window.history.replaceState(null, '', '#motion');
      }
    }

    tick();
  }

  function handleMotionPanelPlayback() {
    const panelVideo = motionPanelVideoRef.current;
    if (!panelVideo) return;

    if (panelVideo.paused) {
      panelVideo.play().then(() => setIsMotionPanelPlaying(true)).catch(() => setIsMotionPanelPlaying(false));
      return;
    }

    panelVideo.pause();
    setIsMotionPanelPlaying(false);
  }

  return (
    <>
      <VideoBackground endingVideoRef={endingVideoRef} isEndingLoop={isEndingLoop} videoRef={videoRef} />
      <Header navLinks={navLinks} />
      <div className="motion-video-panel" style={{ '--panel-bottom': `${motionPanel.bottom}px`, '--panel-visibility': motionPanel.visibility }}>
        <video ref={motionPanelVideoRef} autoPlay controls={false} controlsList="nodownload nofullscreen noremoteplayback" loop muted playsInline src="/assets/Box Video/videoplayback.mp4" />
        <button
          aria-label={isMotionPanelPlaying ? 'Pause box video' : 'Play box video'}
          className="motion-video-toggle"
          onClick={handleMotionPanelPlayback}
          type="button"
        >
          <span aria-hidden="true">{isMotionPanelPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      <main>
        <HeroSection onStartMotion={handleStartMotion} />
        <MotionSection
          activeChapter={activeChapter}
          chapters={chapters}
          keepPlayerClear={keepPlayerClear}
          motionProgress={motionProgress}
          percent={percent}
          progress={progress}
        />
        <ClubhouseSection stats={stats} />
        <ProgramStrip intro={solutionIntro} items={programItems} />
        <ProgramStrip
          className="scene-industries"
          columns={4}
          intro={industriesIntro}
          items={industries}
          label="Industry"
          sectionId="industries"
          stripClassName="industry-strip"
        />
        <TestimonialsSection intro={testimonialsIntro} testimonials={testimonials} />
        <DemoSection intro={demoIntro} metrics={demoMetrics} />
        <CollaborationSection intro={collaborationsIntro} partnerLogos={partnerLogos} />
        <TeamSection intro={teamIntro} members={team} />
        <ContactSection content={contactContent} />
      </main>
      <Footer footerLinks={footerLinks} socialMedia={socialMedia} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
