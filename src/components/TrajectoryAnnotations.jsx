import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { layoutTrajectoryEvents, normalizeTrajectoryEvents } from '../lib/trajectoryEvents';

const DEFAULT_BOUNDS = { x: 18, y: 18, width: 684, height: 464 };
const NO_OBSTACLES = [];

export default function TrajectoryAnnotations({ pathRef, pathData, events, bounds = DEFAULT_BOUNDS, obstacles = NO_OBSTACLES, markerRadius = 10 }) {
  const root = useRef(null);
  const normalized = useMemo(() => normalizeTrajectoryEvents(events), [events]);
  const [layout, setLayout] = useState([]);

  useLayoutEffect(() => {
    const path = pathRef.current;
    const svg = root.current.ownerSVGElement;
    if (!path || !normalized.length) return undefined;
    let mounted = true;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const arrange = () => {
      if (!mounted) return;
      const size = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      const scale = Math.min(size.width / viewBox.width, size.height / viewBox.height) || 1;
      const fontSize = Math.max(18, Math.min(28, 12 / scale));
      const family = getComputedStyle(root.current).fontFamily;
      if (context) context.font = `500 ${fontSize}px ${family}`;
      const length = path.getTotalLength();
      const pointAtProgress = (progress) => {
        const point = path.getPointAtLength(length * progress);
        return { x: point.x, y: point.y };
      };
      setLayout(layoutTrajectoryEvents(normalized, {
        pointAtProgress,
        measureText: (text) => context ? context.measureText(text).width : text.length * fontSize * 0.6,
        bounds,
        obstacles,
        markerRadius,
        pathSamples: Array.from({ length: 161 }, (_, index) => pointAtProgress(index / 160)),
        fontSize,
      }));
    };
    arrange();
    const observer = new ResizeObserver(arrange);
    observer.observe(svg);
    document.fonts.ready.then(arrange);
    document.fonts.addEventListener('loadingdone', arrange);
    return () => { mounted = false; observer.disconnect(); document.fonts.removeEventListener('loadingdone', arrange); };
  }, [pathRef, pathData, normalized, bounds, obstacles, markerRadius]);

  return <g className="trajectory-annotations" ref={root} aria-hidden="true">
    {normalized.map((event) => {
      const item = layout.find((position) => position.key === event.key);
      const point = item?.point ?? { x: 0, y: 0 };
      const box = item?.box ?? { x: 0, y: 0, width: 0, height: 0 };
      return <g className="trajectory-event" key={event.key} data-event-id={event.key} data-progress={event.progress} data-label={event.label} data-player={event.player} data-event-kind={event.kind ?? 'shot'} visibility={item ? 'visible' : 'hidden'}>
        <g className="shot-marker">
          <circle className="shot-ring" cx={point.x} cy={point.y} r="7" />
          <circle className="shot-dot" cx={point.x} cy={point.y} r="2.5" />
        </g>
        <g className="shot-callout">
          {item && <>
            <path className="shot-leader" d={`M${point.x} ${point.y} L${item.anchor.x} ${item.anchor.y}`} />
            <rect className="shot-bubble" x={box.x} y={box.y} width={box.width} height={box.height} rx="5" />
            <text className="shot-label" x={box.x + item.paddingX} y={box.y + item.paddingY + item.fontSize * 0.9} fontSize={item.fontSize}>
              {item.lines.map((line, index) => <tspan key={index} x={box.x + item.paddingX} dy={index ? item.lineHeight : 0}>{line}</tspan>)}
            </text>
          </>}
        </g>
      </g>;
    })}
  </g>;
}
