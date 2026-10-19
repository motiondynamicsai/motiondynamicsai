/**
 * Events accept { id?, progress, kind?, type?, label?, player?, timestamp?, metadata? }.
 * Labels fall back to type, so the renderer has no vocabulary of shot types.
 * Invalid locations are omitted rather than silently moved to another point.
 */
export function normalizeTrajectoryEvents(events = []) {
  if (!Array.isArray(events)) return [];
  return events.flatMap((event, index) => {
    if (!event || !Number.isFinite(event.progress) || event.progress < 0 || event.progress > 1) return [];
    const label = typeof event.label === 'string' && event.label.trim() ? event.label.trim() : event.type;
    if (typeof label !== 'string' || !label.trim()) return [];
    return [{ ...event, label: label.trim(), key: `${event.id ?? 'event'}-${index}` }];
  }).sort((a, b) => a.progress - b.progress);
}

export function rectanglesOverlap(a, b, gap = 0) {
  return a.x < b.x + b.width + gap && a.x + a.width + gap > b.x
    && a.y < b.y + b.height + gap && a.y + a.height + gap > b.y;
}

function wrapLabel(label, measureText, maxWidth) {
  const lines = [];
  let line = '';
  for (const word of label.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (measureText(next) <= maxWidth) { line = next; continue; }
    if (line) { lines.push(line); line = ''; }
    for (const character of word) {
      if (line && measureText(line + character) > maxWidth) { lines.push(line); line = ''; }
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function connector(point, box) {
  const x = clamp(point.x, box.x, box.x + box.width);
  const y = clamp(point.y, box.y, box.y + box.height);
  return { x, y };
}

/**
 * Lay out in SVG coordinates. Prefer a nearby cardinal/diagonal position;
 * move outward when labels or markers are crowded. The grid fallback uses
 * remaining court space. Path crossings are penalized, while label/marker
 * collisions take priority. Truly overfull scenes use the least overlap.
 */
export function layoutTrajectoryEvents(events, {
  pointAtProgress,
  measureText,
  bounds,
  obstacles = [],
  pathSamples = [],
  fontSize = 20,
  markerRadius = 10,
}) {
  const paddingX = fontSize * 0.55;
  const paddingY = fontSize * 0.32;
  const lineHeight = fontSize * 1.15;
  const separation = 8;
  const points = events.map((event) => pointAtProgress(event.progress));
  const hitBounds = points.map((point) => ({ x: point.x - markerRadius, y: point.y - markerRadius, width: markerRadius * 2, height: markerRadius * 2 }));
  const protectedAreas = [...obstacles, ...hitBounds];
  const placed = [];

  events.forEach((event, index) => {
    const point = points[index];
    const lines = wrapLabel(event.label, measureText, Math.min(220, bounds.width - paddingX * 2));
    const width = Math.min(bounds.width, Math.max(...lines.map(measureText)) + paddingX * 2);
    const height = lines.length * lineHeight + paddingY * 2;
    const candidates = [];
    const add = (x, y) => candidates.push({
      x: clamp(x, bounds.x, bounds.x + bounds.width - width),
      y: clamp(y, bounds.y, bounds.y + bounds.height - height),
      width,
      height,
    });
    for (let layer = 0; layer < 7; layer += 1) {
      const offset = Math.max(18, markerRadius + separation) + layer * (height + separation);
      add(point.x - width / 2, point.y - offset - height);
      add(point.x - width / 2, point.y + offset);
      add(point.x + offset, point.y - height / 2);
      add(point.x - offset - width, point.y - height / 2);
      add(point.x + offset, point.y - offset - height);
      add(point.x - offset - width, point.y - offset - height);
      add(point.x + offset, point.y + offset);
      add(point.x - offset - width, point.y + offset);
    }
    for (let y = bounds.y; y <= bounds.y + bounds.height - height; y += height + separation) {
      for (let x = bounds.x; x <= bounds.x + bounds.width - width; x += width + separation) add(x, y);
    }
    const score = (box) => {
      const labelCollisions = placed.filter((item) => rectanglesOverlap(box, item.box, separation)).length;
      const markerCollisions = protectedAreas.filter((area) => rectanglesOverlap(box, area, 4)).length;
      const crossings = pathSamples.filter((p) => p.x >= box.x - 3 && p.x <= box.x + width + 3 && p.y >= box.y - 3 && p.y <= box.y + height + 3).length;
      const anchor = connector(point, box);
      return labelCollisions * 1e7 + markerCollisions * 1e6 + crossings * 250 + Math.hypot(anchor.x - point.x, anchor.y - point.y);
    };
    const box = candidates.reduce((best, candidate) => score(candidate) < score(best) ? candidate : best);
    placed.push({ ...event, point, box, anchor: connector(point, box), lines, fontSize, lineHeight, paddingX, paddingY });
  });
  return placed;
}

/**
 * Use the same start/duration as the linear DrawSVG tween. Putting the events
 * on its parent timeline also handles seeking, pausing, and replay/reset.
 * Targets only need an opacity property, making this testable without a DOM.
 */
export function addTrajectoryEventAnimations(timeline, entries, { start, duration }) {
  if (!entries.length) return;
  timeline.set(entries.flatMap(({ marker, callout }) => [marker, callout]), { opacity: 0 }, 0);
  entries.forEach(({ progress, marker, callout }) => {
    const reachedAt = start + duration * progress;
    timeline.set(marker, { opacity: 1 }, reachedAt);
    timeline.fromTo(callout, { opacity: 0 }, {
      opacity: 1, duration: 0.18, ease: 'power2.out', immediateRender: false,
    }, reachedAt + 0.04);
  });
}
