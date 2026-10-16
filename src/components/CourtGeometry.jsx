// Shared geometry from the original hero court; animation remains owned by each scene.
export default function CourtGeometry() {
  return <g className="court-geometry">
        <path d="M100 430 L240 220 L590 220 L660 430 Z" fill="#ede5d9" />
        <path d="M240 220 L240 78 L590 78 L590 220 Z" fill="#e6bfb1" />
        <path d="M100 430 L100 204 L240 78 L240 220 Z" fill="#f0d7cb" />
        <path d="M590 78 L660 204 L660 430 L590 220 Z" fill="#ead2c6" opacity=".5" />
        <g fill="none" stroke="#55594f" strokeWidth="1.25" strokeLinejoin="round">
          <path className="court-outline" d="M100 430 L240 220 L590 220 L660 430 Z" />
          <path className="court-outline" d="M100 430 V204 L240 78 H590 L660 204 V430" />
          <path className="court-outline" d="M240 78 V220 M590 78 V220" />
          <path className="court-outline" d="M170 326 H626 M398 326 L380 430 M170 326 L155 349 H227 L239 326 M561 326 L567 349 H633" />
        </g>
        <g stroke="#b4423c" strokeWidth="2" fill="none">
          <path className="court-outline" d="M100 241 L240 120 H590 L660 241" />
          <path className="court-outline" d="M240 190 H590 M240 208 H590" />
        </g>
        <g stroke="#a29e91" strokeWidth=".6" opacity=".4">
          <path d="M205 273 H608 M133 380 H643 M310 220 L265 430 M490 220 L519 430" />
        </g>
  </g>;
}
