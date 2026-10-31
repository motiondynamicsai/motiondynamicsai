const shotPaths = [
  'M160 440 C310 340 420 250 560 185 C680 130 770 130 900 70',
  'M930 105 C810 280 630 175 500 335 S240 420 95 255',
  'M100 365 C300 430 470 325 565 230 S760 190 895 270',
];

const ballPositions = [[900, 70], [95, 255], [895, 270]];

export default function TennisCourtMotion({ moment }) {
  return <div className="tennis-court-world" aria-hidden="true">
    <div className="tennis-court-plane" />
    <svg className="tennis-court-art" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
      <g className="tennis-court-lines">
        <path d="M-40 600 180 275 820 275 1040 600M70 600 250 335 750 335 930 600M500 335V600M250 420H750" />
        <path d="M250 335 218 275M750 335 782 275M218 275H782" />
      </g>
      {shotPaths.map((path, index) => <path key={path} className={`tennis-flight-path ${moment === index ? 'is-active' : ''}`} d={path} />)}
      <g className="tennis-flight-ball" transform={`translate(${ballPositions[moment][0]} ${ballPositions[moment][1]})`}>
        <circle r="17" />
        <path d="M-8-14 C7-8 7 8 8 14M8-14 C-7-8-7 8-8 14" />
      </g>
    </svg>
    <span className="tennis-court-label">Tennis · Movement in focus</span>
  </div>;
}
