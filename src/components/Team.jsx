import { team } from '../constants';

import { Link } from 'react-router-dom';

const TeamCard = ({ id, img, name, title, subtitle }) => (
  <Link to={`/team/${id}`} className="group">
    <div className="relative overflow-hidden rounded-xl border border-gray-700 hover:border-accent shadow-md hover:shadow-lg transition-all duration-500">
      <div className="relative h-80 overflow-hidden">
        <img
          src={img}
          alt={`${name} - ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 backdrop-blur-sm bg-black/20 group-hover:bg-black/30 transition-all">
        <h4 className="text-white text-lg font-semibold">{name}</h4>
        <p className="text-accent text-sm font-medium">{title}</p>
        <p className="text-dimWhite text-xs mt-1">{subtitle}</p>
      </div>
    </div>
  </Link>
);


const Team = () => (
  <section id="team" className="py-24 bg-dark/80 relative">
    <div className="container mx-auto px-6">
      {/* Section Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
            Meet Our Team
          </span>
        </h2>
        <p className="text-lg text-dimWhite max-w-2xl mx-auto">
          A group of engineers, athletes, and researchers delivering real-world impact.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {team.map((member) => (
          <TeamCard key={member.id} id={member.id} {...member} />
        ))}

      </div>
    </div>
  </section>
);

export default Team;
