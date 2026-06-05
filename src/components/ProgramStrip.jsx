export function ProgramStrip({
  columns = 3,
  className = 'scene-programs',
  intro,
  items,
  label = 'Solution',
  sectionId = 'programs',
  stripClassName = '',
}) {
  return (
    <section className={`scene ${className}`} id={sectionId}>
      {intro ? (
        <div className="section-intro">
          <h2>{intro.title}</h2>
          <p>{intro.text}</p>
        </div>
      ) : null}

      <div className={`program-strip ${stripClassName}`} style={{ '--strip-columns': columns }}>
        {items.map((item) => (
          <article key={item.id}>
            <small>{item.subtitle || label}</small>
            <h2>{item.title || item.name}</h2>
            <p>{item.content || item.role || item.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
