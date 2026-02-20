import { team, teamGroups } from '../constants';

import { Link } from 'react-router-dom';

const TeamCard = ({ id, img, name, title, subtitle, featured = false }) => (
  <Link
    to={`/team/${id}`}
    aria-label={`View ${name}'s profile`}
    className="group block w-full max-w-md"
  >
    <article className="relative h-full overflow-hidden rounded-lg border border-white/10 bg-dark/40 backdrop-blur-sm shadow-[0_18px_50px_-28px_rgba(0,0,0,0.75)] transition-all duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:bg-dark/50 hover:shadow-[0_26px_70px_-34px_rgba(0,0,0,0.78)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-secondary/60 to-accent/40 opacity-80" />

      <div className={featured ? "flex gap-5 p-5" : "flex gap-4 p-4"}>
        <div
          className={
            featured
              ? "relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/10"
              : "relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/10"
          }
        >
          <img
            src={img}
            alt={`${name} - ${title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-white text-base sm:text-lg font-semibold leading-snug truncate">{name}</h4>
          <p className="mt-1 text-secondary/90 text-sm font-medium leading-snug">{title}</p>
          {subtitle ? <p className="mt-2 text-dimWhite text-xs leading-snug">{subtitle}</p> : null}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-dimWhite/70 uppercase tracking-[0.28em]">Profile</span>
            <span className="text-secondary/70 text-sm transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </article>
  </Link>
);


const Team = () => {
  const groupPriority = {
    'core team': 0,
    'technical team': 1,
    'business supports': 2,
    collaborators: 3,
  };

  const orderedGroups = [...teamGroups].sort((a, b) => {
    const aRank = groupPriority[String(a.title ?? '').toLowerCase()] ?? 999;
    const bRank = groupPriority[String(b.title ?? '').toLowerCase()] ?? 999;
    return aRank - bRank;
  });

  return (
    <section id="team" className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em] text-dimWhite">
            <span className="h-px w-10 bg-secondary/60" />
            Team
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Built by engineers, athletes, and researchers.
            </h2>
            <p className="text-lg text-dimWhite max-w-xl md:justify-self-end">
              An industrial-grade team focused on shipping real-world motion intelligence—fast, reliable, and measurable.
            </p>
          </div>
        </div>

        {/* Hierarchy */}
        <div className="space-y-10">
          {orderedGroups.map((group, groupIndex) => {
            const rawMemberIds = group.memberIds ?? group.memeberIds ?? [];
            const memberIds = Array.isArray(rawMemberIds) ? rawMemberIds : [];

            const members = memberIds
              .map((memberId) => team.find((m) => m.id === memberId))
              .filter(Boolean);

            const isCoreTeam = String(group.title ?? '').toLowerCase() === 'core team';
            const groupNumber = String(groupIndex + 1).padStart(2, '0');
            const gridCols = isCoreTeam
              ? "grid-cols-1 sm:grid-cols-2"
              : members.length <= 1
                ? "grid-cols-1"
                : members.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

            return (
              <div
                key={group.title}
                className="rounded-lg border border-white/10 bg-dark/20 backdrop-blur-sm p-6 md:p-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-secondary/80 text-xs font-semibold tracking-[0.32em]">{groupNumber}</span>
                  <h3 className="text-lg md:text-xl font-semibold text-white uppercase tracking-wide">{group.title}</h3>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-dimWhite/70">{members.length}</span>
                </div>

                <div
                  className={`grid ${gridCols} gap-8 justify-items-center`}
                >
                  {members.map((member) => {
                    const featured = isCoreTeam;
                    return <TeamCard key={member.id} id={member.id} featured={featured} {...member} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;
