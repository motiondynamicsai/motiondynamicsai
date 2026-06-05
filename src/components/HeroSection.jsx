export function HeroSection({ onStartMotion }) {
  return (
    <section className="scene scene-hero" id="top">
      <div className="side-panel left-panel">
        <p className="kicker">Markerless sports intelligence</p>
        <h1>Motion Dynamics</h1>
        <p>
          AI-Powered Motion Intelligence for Sports and Human Performance 
          For organizations committed to improving athletic performance and 
          rehabilitation outcomes, our platform delivers actionable insights into 
          movement, efficiency, and recovery—helping businesses enhance 
          results, engagement, and client success.
        </p>
        <a className="button" href="#motion" onClick={onStartMotion}>
          Start motion
        </a>
      </div>
    </section>
  );
}
