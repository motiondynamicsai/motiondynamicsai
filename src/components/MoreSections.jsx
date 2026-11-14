// Sections after the squash story: the performance lab, then cricket and golf (placeholders until their material is in)
const lab = [
  { img: '/media/lab/lab-projected-lines.webp', title: 'Projected test zones', text: 'Ceiling projectors draw each test zone, and any sport’s lines, to official size.', alt: 'A test boundary projected from the truss around six force plates' },
  { img: '/media/lab/lab-3d-coaching.webp', title: '3D coaching', text: 'Turn the athlete in 3D and see the force under each foot.', alt: 'A coach and athlete reviewing a 3D tennis forehand on a screen' },
  { img: '/media/lab/lab-booth.webp', title: 'Live analysis booth', text: 'Joint angles, speeds, and force traces as each rep lands.', alt: 'Analysts in a booth reviewing a 3D forehand while a player hits in the hall' },
  { img: '/media/lab/lab-body-scan.webp', title: 'Athlete body scans', text: 'An opt-in 3D body scan for every athlete, as a later step.', alt: 'An athlete standing in a ring of scanning cameras' },
];
const labFacts = [
  { value: 'Markerless', label: 'Video capture from a ceiling truss, with markers only when a test needs them.' },
  { value: 'In-ground', label: 'Force plates flush with the floor under the capture zone.' },
  { value: 'Every team', label: 'One room, with every athlete baselined each season.' },
];

export function LabSection() {
  return <section className="sq-after sq-lab" id="lab" aria-labelledby="lab-title">
    <div className="sq-wrap">
      <div className="kick">Performance lab</div>
      <h2 id="lab-title">A high-performance motion capture lab. <em>Built around the athlete.</em></h2>
      <div className="sq-lab-facts">{labFacts.map((fact) => <div key={fact.value}><b>{fact.value}</b><span>{fact.label}</span></div>)}</div>
      <div className="sq-lab-grid">{lab.map((item) => <article key={item.title}><img src={item.img} alt={item.alt} loading="lazy" decoding="async" /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      <p className="sq-lab-note">Images are concept renders. <a href="mailto:contact@motiondynamics.ai?subject=Performance%20lab">Talk to us about a lab</a></p>
    </div>
  </section>;
}

const cricket = [
  { img: '/media/cricket/cricket-head-balance.webp', title: 'Head and balance', text: 'Pose tracking reads stance, stride, and contact, so the coach sees the moment the head falls away.', alt: 'A batter in the nets with a pose skeleton drawn over the body' },
  { img: '/media/cricket/cricket-ball-tracking.webp', title: 'Side-on ball tracking', text: 'The ball is followed from the bowler to the bat, with the line it took and where it met the bat.', alt: 'A net session filmed side-on with the ball circled and its path traced down the pitch' },
];

export function CricketSection() {
  return <section className="sq-after sq-soon sq-cricket" id="cricket" aria-labelledby="cricket-title">
    <div className="sq-wrap">
      <div className="kick">Cricket</div>
      <h2 id="cricket-title">Cricket, in real time. <em>Feedback on every ball in the nets.</em></h2>
      <figure className="sq-cricket-main">
        <img src="/media/cricket/cricket-live-session.webp" alt="The live batting dashboard from a net session, with scores for each delivery, a pose overlay and a phase strip" loading="lazy" decoding="async" />
        <figcaption><b>Batting, scored as it happens.</b> Every delivery is logged as it is faced, with head and balance, control, and bat speed on screen for the coach before the next ball.</figcaption>
      </figure>
      <div className="sq-lab-grid sq-cricket-grid">{cricket.map((item) => <article key={item.title}><img src={item.img} alt={item.alt} loading="lazy" decoding="async" /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      <div className="sq-soon-grid sq-cricket-soon"><SoonTile tile={{ title: 'Bowling', text: 'Run-up, action, and release, live in the nets.', img: '/media/cricket/cricket-bowling.webp', alt: 'A bowler in delivery stride at a stumps setup outside the stands at Edgbaston' }} /></div>
    </div>
  </section>;
}

function SoonTile({ tile }) {
  if (typeof tile === 'string') tile = { title: tile };
  return <div className={tile.img ? 'has-img' : undefined}>
    {tile.img && <img src={tile.img} alt={tile.alt} loading="lazy" decoding="async" />}
    <span>{tile.title}</span>
    <small>{tile.text ? `${tile.text} ` : ''}Coming soon</small>
  </div>;
}

export function SportPlaceholder({ id, sport, title, tiles }) {
  return <section className="sq-after sq-soon" id={id} aria-labelledby={`${id}-title`}>
    <div className="sq-wrap">
      <div className="kick">{sport}</div>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className="sq-soon-grid">{tiles.map((tile) => <SoonTile key={tile.title || tile} tile={tile} />)}</div>
    </div>
  </section>;
}
