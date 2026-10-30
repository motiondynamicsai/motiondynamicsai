export const BAT_PIVOT = { x: 48, y: 21 };
export const BAT_FACE = { x: 48, y: 95 };
export const BAT_REST_ANGLE = 36;

export function rotatePoint(point, origin, angle) {
  const radians = angle * Math.PI / 180;
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  return {
    x: origin.x + x * Math.cos(radians) - y * Math.sin(radians),
    y: origin.y + x * Math.sin(radians) + y * Math.cos(radians),
  };
}

export function transformPoint(matrix, point) {
  return { x: matrix.a * point.x + matrix.c * point.y + matrix.e, y: matrix.b * point.x + matrix.d * point.y + matrix.f };
}

function inversePoint(matrix, point) {
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  return {
    x: (matrix.d * (point.x - matrix.e) - matrix.c * (point.y - matrix.f)) / determinant,
    y: (-matrix.b * (point.x - matrix.e) + matrix.a * (point.y - matrix.f)) / determinant,
  };
}

export function cubicPoint(points, progress) {
  const [a, b, c, d] = points;
  const q = 1 - progress;
  return {
    x: q ** 3 * a.x + 3 * q ** 2 * progress * b.x + 3 * q * progress ** 2 * c.x + progress ** 3 * d.x,
    y: q ** 3 * a.y + 3 * q ** 2 * progress * b.y + 3 * q * progress ** 2 * c.y + progress ** 3 * d.y,
  };
}

const batBounds = [{ x: 39, y: 10 }, { x: 57, y: 10 }, { x: 39, y: 95 }, { x: 57, y: 95 }];

export function batLeftEdge(pose, matrix) {
  return Math.min(...batBounds.map(point => {
    const rotated = rotatePoint(point, BAT_PIVOT, pose.angle);
    return transformPoint(matrix, { x: rotated.x + pose.x, y: rotated.y + pose.y }).x;
  })) - .9 * Math.hypot(matrix.a, matrix.b);
}

// Guard the entire swept outline, including its stroke, against the text edge.
export function keepBatRight(pose, geometry) {
  const { batMatrix: matrix, safeLeft } = geometry;
  const shift = Math.max(0, safeLeft - batLeftEdge(pose, matrix));
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  return { ...pose, x: pose.x + matrix.d * shift / determinant, y: pose.y - matrix.b * shift / determinant };
}

// Screen measurements are relative to the title row. Contact uses the actual
// SVG matrix, so resizing the font or bat cannot separate the bat from the dot.
export function cricketHeadingGeometry({ dot, radius, fontSize, width, batMatrix }) {
  const reach = Math.min(Math.max(1, width - dot.x - fontSize * .18) * .9, fontSize * .55);
  const rise = Math.min(Math.max(0, dot.y - fontSize * .12), fontSize * .38);
  const points = [dot,
    { x: dot.x + reach * .18, y: dot.y - rise * .72 },
    { x: dot.x + reach * .66, y: dot.y - rise * 1.12 },
    { x: dot.x + reach, y: dot.y - rise * .88 },
  ];
  const tangent = { x: points[1].x - dot.x, y: points[1].y - dot.y };
  const length = Math.hypot(tangent.x, tangent.y);
  const normal = { x: tangent.x / length, y: tangent.y / length };
  const impactAngle = 90;
  const strokeRadius = .9 * Math.hypot(batMatrix.a, batMatrix.b);
  const contact = { x: dot.x - normal.x * (radius + strokeRadius), y: dot.y - normal.y * (radius + strokeRadius) };
  const poseAt = (target, angle, point = BAT_FACE) => {
    const local = inversePoint(batMatrix, target);
    const rotated = rotatePoint(point, BAT_PIVOT, angle);
    return { x: local.x - rotated.x, y: local.y - rotated.y, angle };
  };
  const impact = poseAt(contact, impactAngle);
  return {
    points, contact, normal, impact, batMatrix, safeLeft: dot.x - radius,
    rest: poseAt({ x: dot.x + fontSize * .52, y: dot.y - fontSize * .04 }, BAT_REST_ANGLE, { x: 48, y: 68 }),
    prepare: poseAt({ x: contact.x + fontSize * .22, y: contact.y + fontSize * .02 }, 58),
    followThrough: poseAt({ x: contact.x + fontSize * .10, y: contact.y - fontSize * .20 }, 108),
  };
}
