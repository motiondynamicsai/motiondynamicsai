export function TeamSection({ intro, members }) {
  const groups = [
    'Core team',
    'Business Supports',
    'Technical Team',
    'Marketing Team',
    'Collaborators',
  ].map((group) => ({
    id: group.toLowerCase().replaceAll(' ', '-'),
    title: group,
    members: members.filter((member) => member.group === group),
  }));

  return (
    <section className="scene team-section" id="team">
      <div className="section-intro">
        <p className="kicker">Team</p>
        <h2>{intro.title}</h2>
        <p>{intro.text}</p>
      </div>

      <div className="team-board">
        {groups.map((group) =>
          group.members.length ? (
            <section className="team-group" key={group.id}>
              <div className="team-group-heading">
                <small>{String(group.members.length).padStart(2, '0')}</small>
                <h3>{group.title}</h3>
              </div>
              <div
                className={`team-row ${group.title === 'Core team' ? 'team-row-core' : 'team-row-support'}`}
                aria-label={group.title}
              >
                {group.members.map((member) => (
                  <TeamCard member={member} important={group.title === 'Core team'} key={member.id} />
                ))}
              </div>
            </section>
          ) : null
        )}
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
