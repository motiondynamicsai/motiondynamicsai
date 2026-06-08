export function VideoBackground({ endingVideoRef, isEndingLoop, isReverseActive, reverseVideoRef, videoRef }) {
  return (
    <>
      <video
        ref={videoRef}
        className={isEndingLoop || isReverseActive ? 'scroll-video is-hidden' : 'scroll-video'}
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        muted
        playsInline
        preload="auto"
        aria-label="Scroll-synced golf video background"
      >
        <source src="/assets/video/golf-video-scroll.mp4" type="video/mp4" />
      </video>

      <video
        ref={reverseVideoRef}
        className={isEndingLoop || !isReverseActive ? 'scroll-video reverse-video is-hidden' : 'scroll-video reverse-video'}
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        muted
        playsInline
        preload="auto"
        aria-label="Reverse scroll-synced golf video background"
      >
        <source src="/assets/video/golf-video-scroll-reverse.mp4" type="video/mp4" />
      </video>

      <video
        ref={endingVideoRef}
        className={isEndingLoop ? 'scroll-video ending-video is-active is-breathing' : 'scroll-video ending-video'}
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        muted
        playsInline
        loop
        preload="auto"
        aria-label="Looping ending video background"
      >
        <source src="/assets/video/EndingVideo.mp4" type="video/mp4" />
      </video>
    </>
  );
}
