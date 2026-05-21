export function ClubhouseSection({ stats }) {
  return (
    <section className="scene scene-clubhouse" id="clubhouse">
      <div className="side-panel right-panel">
        <p className="kicker">Precision Sports Analytics</p>
        <h2>{stats.map((item) => `${item.value} ${item.title}`).join('. ')}.</h2>
        <p>
          Delivering simple, scalable AI-powered motion capture 
          and biomechanical analytics that integrate seamlessly 
          into your workflow—driving measurable ROI for sports 
          teams, training centers, and institutions worldwide.
        </p>
        <a className="button" href="#contact">
          Contact
        </a>
      </div>
    </section>
  );
}
