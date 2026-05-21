export function VideoBackground({ endingVideoRef, isEndingLoop, videoRef }) {
  return (
    <>
      <video
        ref={videoRef}
        className={isEndingLoop ? 'scroll-video is-hidden' : 'scroll-video'}
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        muted
        playsInline
        preload="auto"
        poster="/assets/video/poster.svg"
        aria-label="Scroll-synced golf video background"
      >
        <source src="/assets/video/golf-video-scroll.mp4" type="video/mp4" />
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
