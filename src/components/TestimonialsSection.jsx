export function TestimonialsSection({ intro, testimonials }) {
  return (
    <section className="scene testimonials-section" id="testimonials">
      <div className="section-intro testimonials-intro">
        <p className="kicker">Testimonials</p>
        <h2>{intro.title}</h2>
        <p>{intro.text}</p>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <article className={index === 0 ? 'testimonial-card featured' : 'testimonial-card'} key={item.id}>
            {item.image ? (
              <div className="testimonial-person">
                <img src={item.image} alt={`${item.author} from ${item.company}`} />
              </div>
            ) : null}
            <div className="testimonial-card-top">
              <small>{item.eyebrow}</small>
              <span>{item.metric}</span>
            </div>
            <h3>{item.title}</h3>
            <blockquote>{item.quote}</blockquote>
            <footer>
              <strong>{item.author}</strong>
              <span>{item.company}</span>
            </footer>
            <p className="testimonial-metric">{item.metricLabel}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
