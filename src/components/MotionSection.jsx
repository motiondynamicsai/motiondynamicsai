export function MotionSection({ activeChapter, chapters, keepPlayerClear, motionProgress, progress, percent }) {
  return (
    <section className={keepPlayerClear ? 'scene scene-motion player-clear' : 'scene scene-motion'} id="motion">
      <div className="progress-rail" aria-label={`Video progress ${percent}%`}>
        <span style={{ transform: `scaleY(${Math.max(progress, 0.025)})` }} />
      </div>

      <div className="chapter-stack" style={{ '--motion-progress': motionProgress }}>
        {chapters.map((chapter, index) => (
          <article className={index === activeChapter ? 'chapter active' : 'chapter'} key={chapter.title}>
            <small>{chapter.eyebrow}</small>
            <h2>{chapter.title}</h2>
            <p>{chapter.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
