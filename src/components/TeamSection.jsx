export function TeamSection({ intro, members }) {
  const coreMembers = members.filter((member) => member.group === 'Core team');
  const supportingMembers = members.filter((member) => member.group !== 'Core team');

  return (
    <section className="scene team-section" id="team">
      <div className="section-intro">
        <p className="kicker">Team</p>
        <h2>{intro.title}</h2>
        <p>{intro.text}</p>
      </div>

      <div className="team-board">
        <div className="team-row team-row-core" aria-label="Core team">
          {coreMembers.map((member) => (
            <TeamCard member={member} important key={member.id} />
          ))}
        </div>
        <div className="team-row team-row-support" aria-label="Team members">
          {supportingMembers.map((member) => (
            <TeamCard member={member} key={member.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, important = false }) {
  const description = member.content || member.subtitle || member.title;

  return (
    <article className={`team-card${important ? ' important' : ''}`}>
      <div className="flip-box">
        <div className="flip-box-front">
          <div className="team-photo-frame">
            <img className="team-photo" src={member.image} alt={`${member.name} - ${member.title}`} />
          </div>
        </div>
        <div className="flip-box-back">
          <div className="flip-inner">
            <h3>{member.name}</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
      <div className="team-card-content">
        <h3>{member.name}</h3>
        <p>{member.title}</p>
        {member.subtitle ? <small>{member.subtitle}</small> : null}
      </div>
    </article>
  );
}
