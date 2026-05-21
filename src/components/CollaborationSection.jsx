export function CollaborationSection({ intro, partnerLogos }) {
  const marqueeLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section className="scene collaboration-section" id="collaboration">
      <div className="section-intro">
        <p className="kicker">Collaborations</p>
        <h2>{intro.title}</h2>
        <p>{intro.text}</p>
      </div>

      <div className="partner-marquee" aria-label="Our partners and collaborators">
        <div className="partner-track">
          {marqueeLogos.map((logo, index) => (
            <div className="partner-logo" key={`${logo.id}-${index}`}>
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
