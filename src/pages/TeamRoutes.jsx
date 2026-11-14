import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
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
import SeanStaff from '../assets/Staff images/Sean-NoBG.webp';
import StuStaff from '../assets/Staff images/Stu-NoBG.webp';

const team = [
  {
    id: 'diar-abdlkarim',
    name: 'Diar Abdlkarim',
    title: 'Postdoctoral Research Fellow',
    subtitle: 'Founder and leader',
    group: 'Core team',
    image: DiarStaff,
    content:
      'Diar Abdlkarim is a postdoctoral research fellow at the University of Birmingham, currently working on immersive augmented and virtual reality technologies. He brings research, software development, motion capture, and psychophysics together to create scientific experiences from first principles.',
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
    id: 'sean-wilkinson',
    name: 'Sean Wilkinson',
    title: 'Head Squash Coach, Princeton University',
    subtitle: 'Head of North America',
    group: 'Core team',
    image: SeanStaff,
    content:
      'Sean Wilkinson is the Head Squash Coach at Princeton University and leads Motion Dynamics in North America. He shapes the company’s US strategy, advises the founders, and has opened doors right across American squash, from college programs to the junior game.',
  },
  {
    id: 'jonathan-tate',
    name: 'Jonathan Tate',
    title: 'Head Squash Coach, University of Birmingham',
    subtitle: 'Director, Squash Partnerships',
    group: 'Core team',
    image: JonStaff,
    content:
      'Jonathan Tate is the Head Squash Coach at the University of Birmingham and a director at Motion Dynamics, where he leads squash partnerships. One of the best-connected people in the game, he has introduced the team to most of the coaches, clubs, and players it works with in squash.',
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
      'Max Di Luca is an Associate Professor at the University of Birmingham in the CNCR research centre. Using psychophysical methods and computational models, he investigates how the human brain processes multisensory information for perception and action. He earned the Laurea in Psychology from the Università di Trieste and a PhD in Cognitive Science from Brown University, and has worked with the Max Planck Institute, Oculus Research, and Facebook Reality Labs.',
  },
  {
    id: 'genia-penksik',
    name: 'Genia Penksik',
    title: 'Technical Consultant',
    subtitle: 'Co-founder',
    group: 'Technical team',
    image: GeniaStaff,
    content:
      'Genia Penksik is a co-founder and technical consultant, supporting the team as it turns motion data into useful tools for athletes, coaches, and broadcast partners.',
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
    id: 'angel-yao',
    name: 'Angel Yao',
    title: 'Machine Learning Engineer',
    subtitle: 'Motion intelligence',
    group: 'Technical team',
    image: AngelStaff,
    content: 'Angel Yao contributes to the technical work behind Motion Dynamics, helping make movement data clear, useful, and ready for real-world applications.',
  },
  {
    id: 'melika-hashemi',
    name: 'Melika Hashemi',
    title: 'Full Stack Developer',
    subtitle: 'Motion intelligence',
    group: 'Technical team',
    image: MelikaStaff,
    content: 'Melika Hashemi contributes to the research and product thinking that turns computer vision into better tools for athletes, coaches, and partners.',
  },
  {
    id: 'erfan-echresh',
    name: 'Erfan Echresh',
    title: 'Full Stack Developer',
    subtitle: 'Motion intelligence',
    group: 'Technical team',
    image: ErfanStaff,
    content: 'Erfan Echresh helps build the systems that transform live video and movement into actionable intelligence.',
  },
];

const teamSections = [
  { number: '01', title: 'Core team', ids: ['diar-abdlkarim', 'stuart-macgregor', 'sean-wilkinson', 'jonathan-tate'] },
  { number: '02', title: 'Business support', ids: ['max-di-luca', 'john-cook', 'max-ward'] },
  { number: '03', title: 'Technical team', ids: ['angel-yao', 'genia-penksik', 'melika-hashemi', 'erfan-echresh'] },
];


// profile addresses from before a name was corrected or completed
const movedProfiles = { 'diar-karim': 'diar-abdlkarim', angel: 'angel-yao', melika: 'melika-hashemi', erfan: 'erfan-echresh' };

// each page names itself in the browser tab; the landing sets its own title when it mounts
function usePageTitle(title) {
  useEffect(() => { document.title = title; }, [title]);
}

export function TeamPage() {
  usePageTitle('Our team · Motion Dynamics');
  return <><Navigation /><main id="main" className="team-page">
    <header className="page-heading container" id="top"><p className="kicker">Our team</p><h1>The people behind the tracking.</h1><p>Meet the researchers, engineers, and sports specialists turning movement into understanding.</p></header>
    <div className="container team-groups">{teamSections.map((section) => <section className="team-group" key={section.title}><h2>{section.title}</h2><div className={`team-grid team-grid-${section.ids.length}`}>{section.ids.map((id) => { const member = team.find((person) => person.id === id); return <Link className="member" key={member.id} to={`/team/${member.id}`} aria-label={`View profile for ${member.name}`}><div className="member-photo"><img src={member.image} alt={member.name} loading="lazy" /></div><div className="member-copy"><h3>{member.name}</h3><p>{member.title}</p><span>{member.subtitle}</span></div></Link>; })}</div></section>)}</div>
    <section className="team-contact container"><h2>Let’s build on what moves us.</h2><a className="button button-red" href="mailto:contact@motiondynamics.ai">Get in touch</a></section>
  </main><SiteFooter /></>;
}

export function TeamMemberPage() {
  const { id } = useParams();
  const member = team.find((person) => person.id === id);
  usePageTitle(member ? `${member.name} · Motion Dynamics` : 'Page not found · Motion Dynamics');
  if (movedProfiles[id]) return <Navigate to={`/team/${movedProfiles[id]}`} replace />;
  if (!member) return <NotFound />;
  return <><Navigation /><main id="main" className="member-detail container"><Link className="text-link" to="/team"><FiArrowLeft aria-hidden="true" /> Back to our team</Link><div className="member-detail-grid"><div><p className="kicker">{member.group}</p><h1>{member.name}</h1><p className="detail-role">{member.title}</p><span>{member.subtitle}</span><p className="detail-copy">{member.content}</p><a className="button button-red" href="mailto:contact@motiondynamics.ai">Get in touch</a></div><img src={member.image} alt={member.name} /></div></main><SiteFooter /></>;
}

export function NotFound() {
  usePageTitle('Page not found · Motion Dynamics');
  return <><Navigation /><main id="main" className="not-found container"><p className="kicker">Page not found</p><h1>This page is<br />out of play.</h1><Link className="button button-red" to="/">Back to the homepage</Link></main><SiteFooter /></>;
}

