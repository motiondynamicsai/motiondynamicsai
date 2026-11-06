import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { Navigation, SiteFooter } from '../components/SiteChrome';
import AngelStaff from '../assets/Staff images/Angel-cutout.webp';
import DiarStaff from '../assets/Staff images/Diar-NoBG.webp';
import ErfanStaff from '../assets/Staff images/Erfan-NoBG.webp';
import GeniaStaff from '../assets/Staff images/Genia-NoBG.webp';
import JonCookStaff from '../assets/Staff images/JonCook-NoBG.webp';
import JonStaff from '../assets/Staff images/Jon-NoBG.webp';
import MaxStaff from '../assets/Staff images/Max-NoBG.webp';
import MaxWardStaff from '../assets/Staff images/MaxWard-NoBG.webp';
import MelikaStaff from '../assets/Staff images/Melika-NoBG.webp';
import StuStaff from '../assets/Staff images/Stu-NoBG.webp';

const team = [
  {
    id: 'diar-karim',
    name: 'Diar Karim',
    title: 'Post-doctoral Research Fellow',
    subtitle: 'Founder and leader',
    group: 'Core team',
    image: DiarStaff,
    content:
      'Diar Karim is a postdoctoral research scientist at the University of Birmingham currently working on immersive augmented and virtual reality technologies. He brings research, software development, motion capture, and psychophysics together to create scientific experiences from first principles.',
  },
  {
    id: 'stuart-macgregor',
    name: 'Stuart MacGregor',
    title: 'MSc Computer Science graduate',
    subtitle: 'Founder and leader',
    group: 'Core team',
    image: StuStaff,
    content:
      "Stuart MacGregor is a professional squash player and research assistant at the University of Birmingham. With a BSc in Human Biology and a Masters in Computer Science, Stuart's interests lie in artificial intelligence, motion capture, and their applications in enhancing sports experiences.",
  },
  {
    id: 'jonathan-tate',
    name: 'Jonathan Tate',
    title: 'University of Birmingham Head Squash Coach',
    subtitle: 'Director',
    group: 'Collaborators',
    image: JonStaff,
    content:
      'Jonathan Tate is the Head Squash Coach at the University of Birmingham and a director at Motion Dynamics, connecting high-performance coaching with the practical needs of athletes and teams.',
  },
  {
    id: 'max-di-luca',
    name: 'Max Di Luca',
    title: 'Associate Professor',
    subtitle: 'Co-founder',
    group: 'Business support',
    image: MaxStaff,
    summary:
      'Associate Professor exploring how the brain combines sensory information for perception and action.',
    content:
      'Max Di Luca is an Associate Professor at the University of Birmingham in the CNCR research centre. Using psychophysical methods and computational models, he investigates how the human brain processes multisensory information for perception and action. He earned the Laurea in Psychology from the Universita di Trieste and a PhD in Cognitive Science from Brown University, and has worked with the Max Planck Institute, Oculus Research, and Facebook Reality Labs.',
  },
  {
    id: 'genia-penksik',
    name: 'Genia Penksik',
    title: 'Technical Consultant',
    subtitle: 'Co-founder',
    group: 'Technical team',
    image: GeniaStaff,
    content:
      'Genia Penksik is a research assistant and co-founder, supporting the team as it turns motion data into useful tools for athletes, coaches, and broadcast partners.',
  },
  {
    id: 'john-cook',
    name: 'John Cook',
    title: 'Business Advisor',
    subtitle: 'Advisor',
    group: 'Business support',
    image: JonCookStaff,
    content: 'John Cook supports Motion Dynamics with experience, perspective, and practical guidance as the company grows across sport, technology, and media.',
  },
  {
    id: 'max-ward',
    name: 'Max Ward',
    title: 'Business Advisor',
    subtitle: 'Advisor',
    group: 'Business support',
    image: MaxWardStaff,
    content: 'Max Ward brings business and commercial insight to the team, helping turn motion intelligence into useful partnerships and products.',
  },
  {
    id: 'angel',
    name: 'Angel',
    title: 'Machine Learning Engineer',
    subtitle: 'Motion intelligence',
    group: 'Technical team',
    image: AngelStaff,
    content: 'Angel contributes to the technical work behind Motion Dynamics, helping make movement data clear, useful, and ready for real-world applications.',
  },
  {
    id: 'melika',
    name: 'Melika',
    title: 'Full stack developer',
    subtitle: 'Motion intelligence',
    group: 'Technical team',
    image: MelikaStaff,
    content: 'Melika contributes to the research and product thinking that turns computer vision into better tools for athletes, coaches, and partners.',
  },
  {
    id: 'erfan',
    name: 'Erfan',
    title: 'Full stack developer',
    subtitle: 'Motion intelligence',
    group: 'Technical team',
    image: ErfanStaff,
    content: 'Erfan helps build the systems that transform live video and movement into actionable intelligence.',
  },
];

const teamSections = [
  { number: '01', title: 'Core team', ids: ['diar-karim', 'stuart-macgregor'] },
  { number: '02', title: 'Business support', ids: ['max-di-luca', 'john-cook', 'max-ward'] },
  { number: '03', title: 'Technical team', ids: ['angel', 'genia-penksik', 'melika', 'erfan'] },
  { number: '04', title: 'Collaborators', ids: ['jonathan-tate'] },
];


export function TeamPage() {
  return <><Navigation /><main id="main" className="team-page">
    <header className="page-heading container" id="top"><p className="kicker"><span className="sq-desk-only">Research. Engineering. A love of sport.</span><span className="sq-phone-only">Our team</span></p><h1><span className="sq-desk-only">Good people.<br /><em>Better questions.</em></span><span className="sq-phone-only">The people behind the tracking.</span></h1><p>Meet the researchers, engineers, and sports specialists turning movement into understanding.</p></header>
    <div className="container team-groups">{teamSections.map((section) => <section className="team-group" key={section.title}><h2>{section.title}</h2><div className={`team-grid team-grid-${section.ids.length}`}>{section.ids.map((id) => { const member = team.find((person) => person.id === id); return <Link className="member" key={member.id} to={`/team/${member.id}`} aria-label={`View profile for ${member.name}`}><div className="member-photo"><img src={member.image} alt={member.name} loading="lazy" /><span><FiArrowUpRight aria-hidden="true" /></span></div><div className="member-copy"><h3>{member.name}</h3><p>{member.title}</p><span>{member.subtitle}</span></div></Link>; })}</div></section>)}</div>
    <section className="team-contact container"><h2>Let’s build on<br /><em>what moves us.</em></h2><a className="button button-red" href="mailto:contact@motiondynamics.ai">Get in touch <FiArrowUpRight aria-hidden="true" /></a></section>
  </main><SiteFooter /></>;
}

export function TeamMemberPage() {
  const { id } = useParams();
  const member = team.find((person) => person.id === id);
  if (!member) return <NotFound />;
  return <><Navigation /><main id="main" className="member-detail container"><Link className="text-link" to="/team"><FiArrowLeft aria-hidden="true" /> Back to our team</Link><div className="member-detail-grid"><div><p className="kicker">{member.group}</p><h1>{member.name}</h1><p className="detail-role">{member.title}</p><span>{member.subtitle}</span><p className="detail-copy">{member.content}</p><a className="button button-red" href="mailto:contact@motiondynamics.ai"><span className="sq-desk-only">Start a conversation </span><span className="sq-phone-only">Get in touch</span><FiArrowUpRight aria-hidden="true" /></a></div><img src={member.image} alt={member.name} /></div></main><SiteFooter /></>;
}

export function NotFound() {
  return <><Navigation /><main id="main" className="not-found container"><p className="kicker"><span className="sq-desk-only">A different direction</span><span className="sq-phone-only">Page not found</span></p><h1>This page is<br />out of play.</h1><Link className="button button-red" to="/">Back to the homepage <FiArrowUpRight aria-hidden="true" /></Link></main><SiteFooter /></>;
}

