import { FOOTER_BALL, FOOTER_BALL_VARIANTS } from '../lib/footerBallMotion';

const { x, y, radius } = FOOTER_BALL;
const brand = FOOTER_BALL_VARIANTS.brand;

// One shared surface: sport variants only recolour it and reveal internal
// details. The whole group travels together through impact, flight and reset.
export default function FooterBallMark() {
  return <g className="footer-ball-motion" data-variant="brand" aria-hidden="true">
    <circle className="footer-wave-dot" cx={x} cy={y} r={radius} fill={brand.fill} stroke={brand.stroke} strokeOpacity="0" strokeWidth=".9" />
    <g transform={`translate(${x} ${y})`} fill="none" strokeLinecap="round">
      <g className="footer-ball-detail" data-ball-detail="cricket" opacity="0" stroke="#f0d9c8">
        <path d="M-6 -16 C7 -8 7 8 -6 16" strokeWidth=".7" opacity=".65" />
        <path d="M-9 -14 C3 -7 3 7 -9 14 M-3 -17 C11 -8 11 8 -3 17" strokeWidth="1.1" strokeDasharray="1.2 2.5" />
      </g>
      <g className="footer-ball-detail" data-ball-detail="squash" opacity="0" fill="#c6bd71">
        <circle cx="-4" cy="-7" r="1.1" />
        <circle cx="0" cy="-9" r="1.1" />
      </g>
      <g className="footer-ball-detail" data-ball-detail="tennis" opacity="0" stroke="#f6f3dc" strokeWidth="1.35">
        <path d="M-12 -13 C-2 -9 -2 9 -12 13 M12 -13 C2 -9 2 9 12 13" />
      </g>
      <g className="footer-ball-detail" data-ball-detail="golf" opacity="0" stroke="#a7ab9e" strokeWidth=".65">
        {[[0, -12], [-8, -7], [0, -5], [8, -7], [-12, 0], [-5, 2], [5, 2], [12, 0], [-8, 9], [0, 10], [8, 9]].map(([cx, cy]) =>
          <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="1.5" />
        )}
      </g>
    </g>
  </g>;
}
