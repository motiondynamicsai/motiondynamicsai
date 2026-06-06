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
  solutionItems,
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
} from './components';
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

function useScrollVideo(videoRef, reverseVideoRef, endingVideoRef) {
  const [progress, setProgress] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEndingLoop, setIsEndingLoop] = useState(false);
  const [isReverseActive, setIsReverseActive] = useState(false);
  const frame = useRef(null);
  const lastFrameAt = useRef(0);
  const lastSeekAt = useRef(0);
  const lastStateAt = useRef(0);
  const targetTime = useRef(0);
  const smoothTime = useRef(0);
  const reverseActive = useRef(false);
  const reverseNativePlaying = useRef(false);
  const reversePlaybackRate = useRef(1);
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
    const prefersDirectScrub = window.matchMedia('(pointer: coarse), (max-width: 820px)').matches;

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

    function scrubTo(time) {
      const safeTime = clamp(time, 0, video.duration || 0);
      targetTime.current = safeTime;
      smoothTime.current = safeTime;
      pauseNativePlayback();
      pauseReversePlayback();
      setReverseVisibility(false);
      seek(safeTime, true);
      setProgress(video.duration ? clamp(safeTime / video.duration, 0, 1) : 0);
      setVideoTime(safeTime);
    }

    function syncReverseVideo(time, force = false) {
      const reverseVideo = reverseVideoRef.current;
      if (!reverseVideo || !video.duration) return;
      const reverseTime = reverseTimeFor(time);
      if (!force && Math.abs(reverseVideo.currentTime - reverseTime) < 0.01) return;
      reverseVideo.currentTime = reverseTime;
    }

    function reverseTimeFor(forwardTime) {
      const reverseVideo = reverseVideoRef.current;
      const reverseDuration = reverseVideo?.duration || video.duration || 0;
      if (!video.duration || !reverseDuration) return 0;
      return clamp(reverseDuration - (forwardTime / video.duration) * reverseDuration, 0, reverseDuration);
    }

    function setReverseVisibility(active) {
      if (reverseActive.current === active) return;
      reverseActive.current = active;
      setIsReverseActive(active);
    }

    function pauseNativePlayback() {
      if (!nativePlaying.current) return;
      video.pause();
      nativePlaying.current = false;
    }

    function pauseReversePlayback() {
      const reverseVideo = reverseVideoRef.current;
      if (!reverseVideo || !reverseNativePlaying.current) return;
      reverseVideo.pause();
      reverseNativePlaying.current = false;
    }

    function playReverseTowardTarget() {
      const reverseVideo = reverseVideoRef.current;
      if (!reverseVideo || !video.duration) return;

      const reverseTarget = reverseTimeFor(targetTime.current);
      const distance = reverseTarget - reverseVideo.currentTime;

      if (distance <= 0.02) {
        pauseReversePlayback();
        if (Math.abs(distance) > 0.08) {
          reverseVideo.currentTime = reverseTarget;
        }
        return;
      }

      const nextRate = clamp(distance * 3.1, 0.5, 2.35);
      reversePlaybackRate.current += (nextRate - reversePlaybackRate.current) * 0.28;
      reverseVideo.playbackRate = reversePlaybackRate.current;
      if (reverseNativePlaying.current) return;
      reverseVideo.play()
        .then(() => {
          reverseNativePlaying.current = true;
        })
        .catch(() => {
          reverseNativePlaying.current = false;
        });
    }

    function prepareReverseVideo() {
      const reverseVideo = reverseVideoRef.current;
      if (!reverseVideo) return;
      reverseVideo.muted = true;
      reverseVideo.playsInline = true;
      reverseVideo.load();
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
      const distance = targetTime.current - smoothTime.current;
      const movingBackward = scrollDirection.current < 0 || distance < -0.01;
      const ease = 1 - Math.exp(-delta / (movingBackward ? 155 : 135));
      const seekGap = movingBackward ? 30 : 42;
      const minStep = movingBackward ? 0.008 : 0.012;
      const settleDistance = movingBackward ? 0.012 : 0.018;
      const shouldSeek = now - lastSeekAt.current > seekGap;

      if (movingBackward) {
        pauseNativePlayback();
        setReverseVisibility(true);
        smoothTime.current += (targetTime.current - smoothTime.current) * ease;
        playReverseTowardTarget();
      } else if (distance > 0.055 && distance < 1.25) {
        setReverseVisibility(false);
        pauseReversePlayback();
        playTowardTarget(distance);
        smoothTime.current = actualTime;
      } else {
        setReverseVisibility(false);
        pauseReversePlayback();
        pauseNativePlayback();
        smoothTime.current += (targetTime.current - smoothTime.current) * ease;

        if (shouldSeek && Math.abs(video.currentTime - smoothTime.current) > minStep) {
          if (seek(smoothTime.current)) {
            lastSeekAt.current = now;
          }
        }
      }

      if (now - lastStateAt.current > 90 && video.duration) {
        const nextTime = movingBackward ? smoothTime.current : (video.currentTime || smoothTime.current);
        setProgress(clamp(nextTime / video.duration, 0, 1));
        setVideoTime(nextTime);
        lastStateAt.current = now;
      }

      lastFrameAt.current = now;

      if (Math.abs(distance) > settleDistance) {
        frame.current = requestAnimationFrame(render);
      } else {
        pauseNativePlayback();
        pauseReversePlayback();
        smoothTime.current = targetTime.current;
        seek(smoothTime.current, movingBackward);
        syncReverseVideo(smoothTime.current, true);
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
        pauseReversePlayback();
        setReverseVisibility(false);
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
        smoothTime.current = video.duration;
        targetTime.current = clamp(
          (nextProgress / FULL_VIDEO_SCROLL_END) * video.duration,
          0,
          video.duration,
        );
        scrollDirection.current = -1;
        seek(video.duration, true);
        syncReverseVideo(video.duration, true);
        setReverseVisibility(true);
      }

      const mappedProgress = nextProgress / FULL_VIDEO_SCROLL_END;
      const nextTime = clamp(mappedProgress * video.duration, 0, video.duration);

      if (prefersDirectScrub) {
        scrubTo(nextTime);
        return;
      }

      const previousDirection = scrollDirection.current;
      scrollDirection.current = nextTime >= targetTime.current ? 1 : -1;
      targetTime.current = nextTime;
      if (scrollDirection.current < 0) {
        pauseNativePlayback();
        if (previousDirection >= 0) {
          syncReverseVideo(smoothTime.current, true);
        }
        setReverseVisibility(true);
      } else {
        pauseReversePlayback();
        setReverseVisibility(false);
      }
      if (!frame.current) frame.current = requestAnimationFrame(render);
    }

    async function unlockPlayback() {
      try {
        video.muted = true;
        video.playsInline = true;
        prepareReverseVideo();
        await video.play();
        video.pause();
        const reverseVideo = reverseVideoRef.current;
        if (reverseVideo) {
          reverseVideo.muted = true;
          reverseVideo.playsInline = true;
          try {
            await reverseVideo.play();
            reverseVideo.pause();
            reverseNativePlaying.current = false;
            syncReverseVideo(0.001, true);
          } catch (_) {
            reverseNativePlaying.current = false;
          }
        }
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
      prepareReverseVideo();
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
      pauseReversePlayback();
      if (reverseVideoRef.current) reverseVideoRef.current.pause();
      if (endingVideoRef.current) endingVideoRef.current.pause();
    };
  }, [endingVideoRef, reverseVideoRef, videoRef]);

  return { duration, isEndingLoop, isReverseActive, progress, videoTime };
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
  const reverseVideoRef = useRef(null);
  const endingVideoRef = useRef(null);
  const motionPanelVideoRef = useRef(null);
  const autoScrollTimer = useRef(null);
  const [isMotionPanelPlaying, setIsMotionPanelPlaying] = useState(true);
  const { duration, isEndingLoop, isReverseActive, progress, videoTime } = useScrollVideo(videoRef, reverseVideoRef, endingVideoRef);
  const { activeIndex: activeChapter, sectionProgress: motionProgress } = useMotionSectionState('motion', chapters.length);
  const motionPanel = useMotionPanelVisibility();
  const percent = Math.round(progress * 100);
  const keepPlayerClear = !duration || videoTime < PLAYER_CLEAR_SECONDS;
  const programItems = solutionItems;

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
      <VideoBackground
        endingVideoRef={endingVideoRef}
        isEndingLoop={isEndingLoop}
        isReverseActive={isReverseActive}
        reverseVideoRef={reverseVideoRef}
        videoRef={videoRef}
      />
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
        <ClubhouseSection />
        <ProgramStrip intro={solutionIntro} items={programItems} label="SOLUTION" />
        <ProgramStrip
          className="scene-industries"
          columns={4}
          intro={industriesIntro}
          items={industries}
          label="INDUSTRY"
          sectionId="industries"
          stripClassName="industry-strip"
        />
        <DemoSection intro={demoIntro} metrics={demoMetrics} />
        <CollaborationSection intro={collaborationsIntro} partnerLogos={partnerLogos} />
        <TeamSection intro={teamIntro} members={team} />
        <TestimonialsSection intro={testimonialsIntro} testimonials={testimonials} />
        <ContactSection content={contactContent} />
      </main>
      <Footer footerLinks={footerLinks} socialMedia={socialMedia} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
