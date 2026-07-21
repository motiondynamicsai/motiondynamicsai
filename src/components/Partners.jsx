import React from 'react';
import { Helmet } from 'react-helmet';
import styles from "../style";
import { hand_tracking_gif } from '../assets';

const academicMilestones = [
  {
    date: "Mar 2024",
    title: "Peer-Reviewed Academic Validation",
    description:
      "Our system was used in a successful PhD research project exploring fine-grained body motion, resulting in a published paper. The project also processed over 50,000 videos—demonstrating both research-grade accuracy and platform scalability.",
    media:hand_tracking_gif,
    size: "small"
  },
];

const professionalMilestones = [
  {
    date: "May 2024",
    title: "Applied in Elite Training Environments",
    description:
      "A professional strength & conditioning coach is using our platform to explore training transfer in squash—demonstrating the system’s ability to support high-level, on-court analysis and decision-making.",
    media: "/assets/strength-conditioning.mp4",
  },
];

const MilestoneCard = ({ date, title, description, media, size }) => (
  <div className="flex flex-col md:flex-row md:items-center md:space-x-10 bg-[#1c1c24] rounded-xl p-6 shadow-md">
    <div className="md:w-1/3">
      {media.endsWith('.mp4') ? (
        <video src={media} controls className="rounded-lg w-full" />
      ) : (
        <img
          src={media}
          alt={title}
          className={`rounded-lg ${size === 'small' ? 'w-2/3 mx-auto' : 'w-full'}`}
        />
      )}
    </div>
    <div className="md:w-2/3 mt-4 md:mt-0">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-400">{date}</p>
      <p className="mt-2 text-base text-gray-300">{description}</p>
    </div>
  </div>
);


const Partnerships = () => {
  return (
    <div className="bg-primary text-white min-h-screen px-6 py-10">
      <Helmet>
        <title>Partnerships - Motion Dynamics</title>
        <meta
          name="description"
          content="Explore how Motion Dynamics is supporting both academic research and elite sports performance through advanced motion tracking technology."
        />
      </Helmet>

      <h1 className="text-4xl font-bold mb-12 text-center">Our 18-Month Journey</h1>

      {/* Academic Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold mb-6 text-accent text-center">Academic Collaboration</h2>
        <div className="space-y-12">
          {academicMilestones.map((item, index) => (
            <MilestoneCard key={index} {...item} />
          ))}
        </div>
      </section>

      {/* Professional Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-accent text-center">Professional Application</h2>
        <div className="space-y-12">
          {professionalMilestones.map((item, index) => (
            <MilestoneCard key={index} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Partnerships;
