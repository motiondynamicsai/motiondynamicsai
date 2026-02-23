import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { team } from '../constants';
import { github, linkedin, website } from "../assets/index.js"

const TeamMemberDetail = () => {
  const { id } = useParams();
  const member = team.find((m) => m.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!member) {
    return (
      <section className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-white text-2xl">Member not found</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-32 bg-primary px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col items-center relative">
        {/* Name and Titles */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{member.name}</h2>
          <p className="text-secondary/90 text-lg font-medium">{member.title}</p>
          <p className="text-dimWhite text-md mt-1">{member.subtitle}</p>
        </div>

        {/* Image */}
        <div className="relative mb-10">
          <div className="absolute inset-0 -z-10 rounded-full bg-secondary/10 blur-3xl" />
          <img
            src={member.img}
            alt={member.name}
            className="w-64 h-64 rounded-full object-cover shadow-lg ring-4 ring-secondary/25"
          />
        </div>

        {/* Content */}
        <div className="relative max-w-3xl w-full text-center text-dimWhite text-lg leading-relaxed px-6 py-6 bg-dark/40 border border-white/10 rounded-lg backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-secondary/60 to-accent/40 opacity-80" />
          {member.content}
        </div>

        {/* Links */}
        <div className="relative max-w-3xl w-full flex items-center gap-3 text-dimWhite text-lg leading-relaxed px-6 py-6 backdrop-blur-sm">
          {member?.github?.trim() && (
            <a 
              href={member.github} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src={github} 
                height={20} 
                width={20} 
                style={{ paddingTop: 10 }} 
                alt="GitHub profile"
              />
            </a>
          )}

          {member?.linkedin?.trim() && (
            <a 
              href={member.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src={linkedin} 
                height={20} 
                width={20} 
                style={{ paddingTop: 10 }} 
                alt="GitHub profile"
              />
            </a>
          )}          
          
          {member?.website?.trim() && (
            <a 
              href={member.website} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src={website} 
                height={20} 
                width={20} 
                style={{ paddingTop: 10 }} 
                alt="GitHub profile"
              />
            </a>
          )}          
        </div>
        

        {/* Back Button */}
        <Link
          to="/#team"
          className="mt-12 inline-block text-secondary/90 text-sm border border-secondary/30 px-6 py-2 rounded-full hover:bg-secondary hover:text-black transition-all"
        >
          ← Back to Team
        </Link>
      </div>
    </section>
  );
};

export default TeamMemberDetail;
