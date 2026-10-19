// Metres, measured between the finished playing surfaces. WSF singles court:
// https://squash.hu/wp-content/uploads/2017/07/161214_Court_Specifications_Small.pdf
export const SQUASH_COURT = {
  width: 6.4,
  length: 9.75,
  line: 0.05,
  frontOut: 4.57,
  backOut: 2.13,
  service: 1.78,
  tin: 0.48,
  shortLineBack: 9.75 - 4.26,
  serviceBox: 1.6,
};

const { width, length, line, shortLineBack, serviceBox } = SQUASH_COURT;
const shortLineCentre = shortLineBack - line / 2;
const boxBackCentre = shortLineBack + serviceBox + line / 2;

// Both views use these same floor markings, including the 50 mm line widths.
export const COURT_FLOOR_LINES = [
  [[0, shortLineCentre], [width, shortLineCentre]],
  [[width / 2, shortLineCentre], [width / 2, length]],
  [[serviceBox + line / 2, shortLineBack], [serviceBox + line / 2, boxBackCentre], [0, boxBackCentre]],
  [[width - serviceBox - line / 2, shortLineBack], [width - serviceBox - line / 2, boxBackCentre], [width, boxBackCentre]],
];

// Project both the court and rally samples from one camera behind the back wall.
const camera = { x: width / 2, y: 18, z: 6 };
const pitch = Math.atan2(camera.z - 1.2, camera.y - 4);
export function projectCourt(x, y, z = 0) {
  const dy = y - camera.y;
  const dz = z - camera.z;
  const depth = -dy * Math.cos(pitch) - dz * Math.sin(pitch);
  const up = -dy * Math.sin(pitch) + dz * Math.cos(pitch);
  return { x: 380 + 620 * (x - camera.x) / depth, y: 235 - 620 * up / depth };
}

export const COURT_VIEWBOX = '145 45 470 420';
export const COURT_PLAN_SCALE = 30;
export function projectCourtPlan(x, y) {
  return { x: 355 + (x - width / 2) * COURT_PLAN_SCALE, y: 90 + y * COURT_PLAN_SCALE };
}
export const COURT_T = projectCourtPlan(width / 2, shortLineCentre);

export function courtPath(points, projection = projectCourt, closed = false) {
  return points.map((point, index) => {
    const p = projection(...point);
    return `${index ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }).join(' ') + (closed ? ' Z' : '');
}

// Polygon strips preserve the real line width under perspective.
export function floorMarkingPath(points) {
  return points.slice(1).map((point, index) => {
    const start = points[index];
    const dx = point[0] - start[0];
    const dy = point[1] - start[1];
    const distance = Math.hypot(dx, dy);
    const nx = -dy / distance * line / 2;
    const ny = dx / distance * line / 2;
    return courtPath([
      [start[0] + nx, start[1] + ny], [point[0] + nx, point[1] + ny],
      [point[0] - nx, point[1] - ny], [start[0] - nx, start[1] - ny],
    ], projectCourt, true);
  }).join(' ');
}
