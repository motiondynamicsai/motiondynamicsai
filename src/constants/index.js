import { Stu, Max, Diar, Genia, Jon, facebook, instagram, linkedin, twitter, airbnb, binance, coinbase, dropbox, send, shield, star  } from "../assets";
import video1 from '../assets/Muted solo.mp4';
import gif1 from '../assets/Squash motionbuilder GIF.gif';
import video2 from '../assets/DualSkeleton.mp4';
import gif2 from '../assets/Marked person to capture the motion.gif';

export const navLinks = [
  { id: 'home', title: 'Home' },
  { id: 'services', title: 'Services' },
  { id: 'demos', title: 'Demos' },
  { id: 'team', title: 'Team' },
  { id: 'contact', title: 'Contact' }, // Ensure this is at the end
];


export const features = [
  {
    id: "feature-1",
    icon: star,
    title: "Data Collection",
    content:
      "Leveraging existing data from online sources, AI models can be trained to analyse training and match play, enhancing their understanding of motioncapture data",
  },
  {
    id: "feature-2",
    icon: shield,
    title: "Real time analysis",
    content: "Our technology empowers models to process live data, providing immediate insights for analysis, which can be used to improve training, comptetion, spectating and refereeing",
  },
  {
    id: "feature-3",
    icon: send,
    title: "Data analysis",
    content:
      "AI models can analyse gameplay, generating training programs, providing detailed analysis of your game, and automatically generate replays and highlights .",
  },
];

export const demos = [
  {
    src: video1,
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
    id: "Team-1",
    content:
      "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
    name: "Diar Karim",
    title: "Post-doctoral Research Fellow",
    subtitle: "Founder and leader",
    img: Diar,
  },
  {
    id: "Team-2",
    content:
      "Money makes your life easier. If you're lucky to have it, you're lucky.",
    name: "Stuart MacGregor",
    title: "MSc Computer Science graduate",
    subtitle: "Founder and leader",
    img: Stu,
  },
  {
    id: "Team-3",
    content:
      "It is usually people in the money business, finance, and international trade that are really rich.",
    name: "Jonathan Tate",
    title: "University of Birmingham Head Squash Coach",
    subtitle: "Director",
    img: Jon,
  },
  {
    id: "Team-4",
    content:
      "It is usually people in the money business, finance, and international trade that are really rich.",
    name: "Max Di Luca",
    title: "Associate Professor",
    subtitle: "Co-founder",
    img: Max,
  },
  {
    id: "Team-5",
    content:
      "It is usually people in the money business, finance, and international trade that are really rich.",
    name: "Genia Penksik",
    title: "Research assistant",
    subtitle: "Co-founder",
    img: Genia,
  },
];


export const stats = [
  {
    id: "stats-1",
    title: "Installations",
    value: "360+",
  },
  {
    id: "stats-2",
    title: "Professional broadcasting",
    value: "Worldwide",
  },
  {
    id: "stats-3",
    title: "Users",
    value: "1M+",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://www.hoobank.com/content/",
      },
      {
        name: "How it Works",
        link: "https://www.hoobank.com/how-it-works/",
      },
      {
        name: "Create",
        link: "https://www.hoobank.com/create/",
      },
      {
        name: "Explore",
        link: "https://www.hoobank.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.hoobank.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.hoobank.com/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.hoobank.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.hoobank.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.hoobank.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.hoobank.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.hoobank.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.hoobank.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/thesquash_ai?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "",
  },
];

export const clients = [
  {
    id: "client-1",
    logo: airbnb,
  },
  {
    id: "client-2",
    logo: binance,
  },
  {
    id: "client-3",
    logo: coinbase,
  },
  {
    id: "client-4",
    logo: dropbox,
  },
];