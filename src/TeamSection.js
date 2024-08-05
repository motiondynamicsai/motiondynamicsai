import React from 'react';
import './TeamSection.css'; // Ensure this CSS file exists and is imported

// Import images
import DiarImage from './Headshots/Diar Headshot.png';
import StuartImage from './Headshots/Stu headshot copy.jpg';
import JonathanImage from './Headshots/Jon headshot.jpg';
import MaxImage from './Headshots/Max headshot.png';
import GeniaImage from './Headshots/Genia Headshot.png';

const teamMembers = [
  {
    name: 'Diar Karim',
    title: 'Post-doctoral Research Fellow',
    institution: 'University of Birmingham',
    image: DiarImage,
    bioLink: 'diar_bio.html'
  },
  {
    name: 'Stuart MacGregor',
    title: 'MSc Computer Science graduate',
    institution: 'University of Birmingham',
    image: StuartImage,
    bioLink: 'stu_bio.html'
  },
  {
    name: 'Jonathan Tate',
    title: 'University of Birmingham Head Squash Coach',
    institution: 'University of Birmingham',
    image: JonathanImage,
    bioLink: 'jon_bio.html'
  },
  {
    name: 'Max Di Luca',
    title: 'Associate Professor',
    institution: 'University of Birmingham',
    image: MaxImage,
    bioLink: 'max_bio.html'
  },
  {
    name: 'Genia Penksik',
    title: 'Research assistant',
    institution: 'University of Birmingham',
    image: GeniaImage,
    bioLink: 'Genia_bio.html'
  }
];

const TeamSection = () => {
  return (
    <section id="team" className="section">
      <div className="container">
        <h2 className="title is-4">Meet the Team</h2>
        <div className="team-cards">
          {teamMembers.map((member, index) => (
            <div key={index} className="card">
              <div className="card-image">
                <figure className="image">
                  <img src={member.image} alt={member.name} />
                </figure>
              </div>
              <div className="card-content">
                <p className="title is-5"><a href={member.bioLink}>{member.name}</a></p>
                <p className="subtitle is-6">{member.title}</p>
                <p className="subtitle is-6">{member.institution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
