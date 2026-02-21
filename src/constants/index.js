import { 
  Stu, Max, Diar, Genia, Jon, Maria, John, Angel, Vishwanath, MaxWard, 
  facebook, instagram, linkedin, twitter, 
  ObiRoboticslogo, UOB, PSA, squashTV, WSF, RalleyForm, SquashPerformance, PGA, Teknik, MOD,
  send, shield, star, } from "../assets";
import video1 from '../assets/Muted solo.mp4';
import gif1 from '../assets/Squash motionbuilder GIF.gif';
import video2 from '../assets/RalleySkeleton.mp4';
import gif2 from '../assets/Marked person to capture the motion.gif';
import video3 from '../assets/Qualysis.mp4'
import { FcComboChart, FcScatterPlot } from "react-icons/fc";


export const navLinks = [
  {
    id: "home",
    title: "Home",
    link: "/#home",
  },
  {
    id: "services",
    title: "Services",
    link: "/#services",
  },
  {
    id: "demos",
    title: "Demos",
    link: "/#demos", // demos section
  },
  {
    id: "solutions",
    title: "Solutions",
    link: "/#solutions"
  },
  {
    id: "team",
    title: "Team",
    link: "/#team",
  },
];



export const features = [
  {
    id: "feature-1",
    icon: star,
    title: "Scalable Data Collection",
    content:
      "Train models using existing match footage and open datasets. Seamlessly build strategic and biomechanical insight pipelines.",
  },
  {
    id: "feature-2",
    icon: shield,
    title: "Real-Time Tactical Feedback",
    content:
      "Deliver live biomechanical and strategic insights to coaches, analysts, and officials—improving decision-making during both training and competition.",
  },
  {
    id: "feature-3",
    icon: send,
    title: "Automated Performance Insights",
    content:
      "Generate tailored reports, training recommendations, and tactical replays—automatically. Designed for fast ROI and easy integration into existing workflows.",
  },
  {
    id: "feature-data-extraction",
    icon: FcComboChart, //icon: <FcComboChart className="w-8 h-8" />, 
    title: "High-Fidelity Data Extraction",
    content:
      "Extract structured, frame-level data from raw sports footage—including player positions, biomechanics, and movement events—ready for analysis, modeling, or integration into proprietary systems.",
  },
  {
    id: "feature-statistical-match-analysis",
    icon: FcScatterPlot, //icon: <FcComboChart className="w-8 h-8" />, 
    title: "Statistical Match Analysis",
    content:
      "Our data collection pipeline can interface with predictive match models, to estimate likely point-by-point match outcomes"
  }
]


export const demos = [
  {
    src: video1,
    alt: 'Feature Video 1',
    type: 'video',
  },
  {
    src: video3,
    alt: 'Feature Video 1',
    type: 'video',
  },
  {
    src: gif1,
    alt: 'Feature GIF 1',
    type: 'gif',
  },
  {
    src: video2,
    alt: 'Feature Video 2',
    type: 'video',
  },
  {
    src: gif2,
    alt: 'Feature GIF 2',
    type: 'gif',
  },
];


export const team = [
  {
    id: "Diar Karim",
    content:
      "Diar Karim is a postdoctoral research scientist at the University of Birmingham (UK) currently working on  immersive augmented and virtual reality technologies training ensemble musicians with virtual players in real-time. I use my skills in research-or software development, expertise in motion capture and psychophysics to create scientific exper from first principles.",
    name: "Diar Karim",
    title: "Post-doctoral Research Fellow",
    subtitle: "Founder and leader",
    img: Diar,
  },
  {
    id: "Stuart Macgregor",
    content:
      "Stuart MacGregor is a professional Squash Player and research assistant at the University of Birmingham. With a BSc in Human Biology and a Masters in Computer Science, Stuart's interests lie in artificial intelligence, motion capture, and their applications in enhancing sports experiences.",
    name: "Stuart MacGregor",
    title: "MSc Computer Science graduate",
    subtitle: "Founder and leader",
    img: Stu,
  },
  {
    id: "Jonathan Tate",
    content:
      "",
    name: "Jonathan Tate",
    title: "University of Birmingham Head Squash Coach",
    subtitle: "",
    img: Jon,
  },
  {
    id: "Max Di Luca",
    content:
      "Max Di Luca is Associate Professor at the University of Birmingham in the CNCR research centre. Using psychophysical methods and computational models, he investigates how the human brain processes multisensory information for perception and action. He earned the Laurea in Psychology from the Università di Trieste in 2000 and the PhD in Cognitive Science from Brown University in 2006. During his career, Dr Di Luca has been Scientist at the Max Planck Institute for Biological Cybernetics in Tübingen, Visiting Scientist at Oculus Research and Research Scientist at Facebook Reality Labs.",
    name: "Max Di Luca",
    title: "Associate Professor",
    subtitle: "Co-founder",
    img: Max,
  },
  {
    id: "Maria Kononova",
    content:
      "",
    name: "Maria Kononova",
    title: "Marketing",
    subtitle: "",
    img: Maria,
  },
  {
    id: "Vishwanath",
    content:
      "",
    name: "Vishwanath",
    title: "Machine Learning Engineer",
    subtitle: "",
    img: Vishwanath,
  },
  {
    id: "John Cook",
    content:
      "",
    name: "John Cook",
    title: "Buisiness Advisor",
    subtitle: "",
    img: John,
  },
  {
    id: "Max Ward",
    content:
      "",
    name: "Max Ward",
    title: "Buisiness Advisor",
    subtitle: "",
    img: MaxWard,
  },
  {
    id: "Angel Yao",
    content:
      "",
    name: "Angel Yao",
    title: "Machine Learning Engineer",
    subtitle: "",
    img: Angel,
  },
];

export const teamGroups = [
  {
    title: "Core team",
    memberIds: ["Diar Karim", "Stuart Macgregor"],
  },
  {
    title: "Business Supports",
    memberIds: ["Max Di Luca", "John Cook", "Max Ward"],
  },
  {
    title: "Technical Team",
    memberIds: ["Vishwanath", "Angel Yao"],
  },
  {
    title: "Marketing Team",
    memeberIds: ["Maria Kononova",]
  },
  {
    title: "Collaborators",
    memberIds: ["Jonathan Tate",],
  },
];


export const stats = [
  {
    id: "stats-1",
    title: "Sport applications",
    value: "Multi",
  },
  {
    id: "stats-2",
    title: "Tracking",
    value: "Markerless",
  },
  {
    id: "stats-3",
    title: "Accuaracy",
    value: "95%",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "",
      },
      {
        name: "How it Works",
        link: "#services",
      },
      {
        name: "Create",
        link: "",
      },
      {
        name: "Explore",
        link: "",
      },
      {
        name: "Terms & Services",
        link: "",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "",
      },
      {
        name: "Partners",
        link: "#collaborations",
      },
      {
        name: "Suggestions",
        link: "",
      },
      {
        name: "Blog",
        link: "",
      },
      {
        name: "Newsletters",
        link: "",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partners",
        link: "#collaborations", // Update link to scroll to collaborations section
      },
      {
        name: "Become a Partner",
        link: "#contact", // Update link to scroll to collaborations section
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/motiondynamics_ai/",
  },
  // {
  //   id: "social-media-2",
  //   icon: facebook,
  //   link: "",
  // },
  // {
  //   id: "social-media-3",
  //   icon: twitter,
  //   link: "",
  // },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/company/motion-dynamics-software/",
  },
];

export const clients = [
  {
    id: "client-1",
    logo: squashTV,
  },
  {
    id: "client-2",
    logo: PSA,
  },
  {
    id: "client-3",
    logo: ObiRoboticslogo,
  },
  {
    id: "client-4",
    logo: UOB,
  },
  {
    id: "client-5",
    logo: WSF,
  },
  {
    id: "client-6",
    logo: RalleyForm,
  },
  {
    id: "client-7",
    logo: SquashPerformance,
  },
  {
    id: "client-8",
    logo: MOD,
  },
  {
    id: "client-9",
    logo: PGA,
  },
  {
    id: "client-10",
    logo: Teknik,
  },
];

