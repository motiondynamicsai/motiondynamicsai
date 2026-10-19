import { COURT_FLOOR_LINES, COURT_PLAN_SCALE, COURT_T, SQUASH_COURT, courtPath, floorMarkingPath, projectCourtPlan } from '../lib/squashCourt';

const { width: w, length: l, line, frontOut, backOut, service, tin } = SQUASH_COURT;
const floor = [[0, 0], [w, 0], [w, l], [0, l]];
const frontTop = frontOut + 0.35;
const backTop = backOut + 0.35;
const wallStripe = (bottom, top) => courtPath([[0, 0, bottom], [w, 0, bottom], [w, 0, top], [0, 0, top]], undefined, true);

export default function CourtGeometry() {
  return <g className="court-geometry">
    <path d={courtPath(floor, undefined, true)} fill="#ede5d9" />
    <path d={wallStripe(0, frontTop)} fill="#e6bfb1" />
    <path d={courtPath([[0, l], [0, 0], [0, 0, frontTop], [0, l, backTop]], undefined, true)} fill="#f0d7cb" />
    <path d={courtPath([[w, l], [w, 0], [w, 0, frontTop], [w, l, backTop]], undefined, true)} fill="#ead2c6" />
    <path d={wallStripe(0, tin)} fill="#b3b4aa" fillOpacity=".3" />
    <g fill="none" stroke="#55594f" strokeWidth="1" strokeLinejoin="round">
      <path d={courtPath(floor, undefined, true)} />
      <path d={courtPath([[0, l], [0, l, backTop], [0, 0, frontTop], [w, 0, frontTop], [w, l, backTop], [w, l]])} />
      <path d={courtPath([[0, 0], [0, 0, frontTop]]) + courtPath([[w, 0], [w, 0, frontTop]])} />
    </g>
    <g fill="#686c61">{COURT_FLOOR_LINES.map((points, index) => <path key={index} d={floorMarkingPath(points)} />)}</g>
    <g fill="#b4423c">
      <path d={wallStripe(frontOut, frontOut + line)} />
      <path d={wallStripe(service, service + line)} />
      <path d={wallStripe(tin - line, tin)} />
      {[0, w].map((x) => <path key={x} d={courtPath([[x, 0, frontOut], [x, l, backOut], [x, l, backOut + line], [x, 0, frontOut + line]], undefined, true)} />)}
    </g>
  </g>;
}

export function CourtPlan() {
  return <g className="application-court" fill="none" stroke="#89967f" strokeWidth={line * COURT_PLAN_SCALE}>
    <path d={courtPath(floor, projectCourtPlan, true)} />
    {COURT_FLOOR_LINES.map((points, index) => <path key={index} d={courtPath(points, projectCourtPlan)} />)}
    <text x="355" y="79" textAnchor="middle">Front wall</text>
    <path d={`M${COURT_T.x - 7} ${COURT_T.y}h14 M${COURT_T.x} ${COURT_T.y - 7}v14`} stroke="var(--red)" />
  </g>;
}
