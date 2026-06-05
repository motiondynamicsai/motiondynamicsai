import { useEffect, useMemo, useRef, useState } from 'react';

export function DemoSection({ intro, metrics }) {
  const [activeMetric, setActiveMetric] = useState(metrics[0]);
  const modelViewerRef = useRef(null);
  const graph = useMemo(() => buildGraph(activeMetric, metrics), [activeMetric, metrics]);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    function speedUpModel() {
      viewer.timeScale = 4;
      if (viewer.availableAnimations?.length && !viewer.animationName) {
        viewer.animationName = viewer.availableAnimations[0];
      }
      viewer.play?.();
    }

    speedUpModel();
    viewer.addEventListener('load', speedUpModel);
    return () => viewer.removeEventListener('load', speedUpModel);
  }, []);

  return (
    <section className="scene demo-section" id="demo">
      <div className="section-intro demo-intro">
        <p className="kicker">Demo</p>
        <h2>{intro.title}</h2>
        <p>{intro.text}</p>
      </div>

      <div className="demo-board">
        <div className="mannequin-panel">
          <div className="mannequin-heading">
            <small>3D model</small>
            <h3>The mannequin</h3>
          </div>
          <div className="mannequin-frame-wrap">
            <model-viewer
              alt="Interactive 3D motion figure"
              ar
              autoplay
              auto-rotate
              camera-controls
              camera-orbit="0deg 78deg 3.6m"
              exposure="0.95"
              interaction-prompt="none"
              ref={modelViewerRef}
              shadow-intensity="0.35"
              src="/assets/3D figure/multiview_pose_2_rig.glb"
            />
          </div>
        </div>

        <div className="metric-table" aria-label="Data metrics">
          {metrics.map((metric) => (
            <button
              className={metric.id === activeMetric.id ? 'metric-row active' : 'metric-row'}
              key={metric.id}
              onClick={() => setActiveMetric(metric)}
              type="button"
            >
              <span>{metric.name}</span>
              <strong>
                {metric.value}
                <small>{metric.unit}</small>
              </strong>
            </button>
          ))}
        </div>

        <div className="graph-panel">
          <div className="graph-heading">
            <small>Selected metric</small>
            <h3>{activeMetric.name}</h3>
          </div>
          <svg role="img" viewBox="0 0 620 320" aria-label={`${activeMetric.name} trend graph`}>
            <defs>
              <linearGradient id="graphFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#810B38" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#810B38" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {Array.from({ length: 6 }).map((_, index) => (
              <line className="grid-line" key={`h-${index}`} x1="32" x2="596" y1={40 + index * 46} y2={40 + index * 46} />
            ))}
            {Array.from({ length: 9 }).map((_, index) => (
              <line className="grid-line" key={`v-${index}`} x1={32 + index * 70.5} x2={32 + index * 70.5} y1="34" y2="278" />
            ))}
            <path className="graph-area" d={`${graph.area} L 596 278 L 32 278 Z`} />
            <path className="graph-line primary" d={graph.primary} />
            <path className="graph-line secondary" d={graph.secondary} />
            {graph.points.map((point) => (
              <circle className="graph-point" cx={point.x} cy={point.y} key={`${point.x}-${point.y}`} r="4" />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

function buildGraph(activeMetric, metrics) {
  const seed = metrics.findIndex((metric) => metric.id === activeMetric.id) + 1;
  const points = Array.from({ length: 9 }).map((_, index) => {
    const wave = Math.sin((index + 1) * (seed + 1) * 0.72) * 38;
    const climb = index * (7 + (seed % 5));
    const y = 236 - wave - climb + (seed % 3) * 9;
    return { x: 32 + index * 70.5, y: Math.max(44, Math.min(258, y)) };
  });
  const secondaryPoints = points.map((point, index) => ({
    x: point.x,
    y: Math.max(52, Math.min(264, point.y + Math.cos((index + seed) * 0.9) * 34)),
  }));
  const toPath = (items) => items.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return {
    area: toPath(points),
    points,
    primary: toPath(points),
    secondary: toPath(secondaryPoints),
  };
}
