import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { team } from '../constants';

const TeamMemberDetail = () => {
  const { id } = useParams();
  const member = team.find((m) => m.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!member) {
    return (
      <section className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white text-2xl">Member not found</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-32 bg-dark px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Name and Titles */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">
            {member.name}
          </h2>
          <p className="text-accent text-lg">{member.title}</p>
          <p className="text-dimWhite text-md mt-1">{member.subtitle}</p>
        </div>

        {/* Image */}
        <div className="relative mb-10">
          <img
            src={member.img}
            alt={member.name}
            className="w-64 h-64 rounded-full object-cover shadow-lg border-4 border-dark-300"
          />
          <div className="absolute -bottom-8 -left-10 w-40 h-40 orange__gradient z-0 blur-xl rounded-full opacity-30" />
          <div className="absolute -top-10 -right-14 w-32 h-32 blue__gradient z-0 blur-xl rounded-full opacity-20" />
        </div>

        {/* Content */}
        <div className="max-w-3xl text-center text-dimWhite text-lg leading-relaxed px-4">
          {member.content}
        </div>

        {/* Back Button */}
        <Link
          to="/#team"
          className="mt-12 inline-block text-white text-sm border border-accent px-6 py-2 rounded-full hover:bg-accent hover:text-dark transition-all"
        >
          ← Back to Team
        </Link>
      </div>
    </section>
  );
};

export default TeamMemberDetail;
