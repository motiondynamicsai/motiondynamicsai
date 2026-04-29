import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { team, teamGroups } from '../constants';
import { WordReveal } from './shared/WordReveal';

const HEADLINE_WORDS = [
  'Built',
  'by',
  'engineers,',
  'athletes,',
  'and',
  'researchers.',
] as const;

interface TeamCardProps {
  id: string;
  img: string;
  name: string;
  title: string;
  subtitle?: string;
}

const TeamCard = ({ id, img, name, title, subtitle }: TeamCardProps) => (
  <Link
    to={`/team/${encodeURIComponent(id)}`}
    aria-label={`View ${name}'s profile`}
    className="group block w-full"
  >
    <article
      className="flex flex-col"
      style={{
        transition: 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-md"
        style={{
          backgroundColor: 'var(--color-md-surface)',
          border: '1px solid color-mix(in oklab, var(--color-md-text-mid) 12%, transparent)',
        }}
      >
        <img
          src={img}
          alt={`${name} - ${title}`}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{
            filter: 'grayscale(100%)',
            transition:
              'filter 350ms cubic-bezier(0.22, 1, 0.36, 1), transform 350ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.filter = 'grayscale(0%)';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.filter = 'grayscale(100%)';
          }}
        />
      </div>

      <div className="mt-4">
        <h4
          className="text-base sm:text-lg font-semibold leading-snug truncate tracking-tight"
          style={{ color: 'var(--color-md-text-hi)' }}
        >
          {name}
        </h4>
        <p
          className="mt-1 text-sm font-medium leading-snug"
          style={{ color: 'var(--color-md-accent)' }}
        >
          {title}
        </p>
        {subtitle ? (
          <p
            className="mt-2 text-xs leading-snug"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </article>
  </Link>
);

const Team = () => {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const groupPriority: Record<string, number> = {
    'core team': 0,
    'business supports': 1,
    'technical team': 2,
    'marketing team': 3,
    collaborators: 4,
  };

  const orderedGroups = [...teamGroups].sort((a, b) => {
    const aRank = groupPriority[String(a.title ?? '').toLowerCase()] ?? 999;
    const bRank = groupPriority[String(b.title ?? '').toLowerCase()] ?? 999;
    return aRank - bRank;
  });

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--color-md-bg)' }}
    >
      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="mb-14">
          <div
            className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            <span
              className="h-px w-10"
              style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-accent) 60%, transparent)' }}
            />
            Team
            <span
              className="h-px flex-1"
              style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-text-mid) 18%, transparent)' }}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
            <h2
              id="team-heading"
              className="text-4xl md:text-5xl font-semibold tracking-tight"
              style={{ color: 'var(--color-md-text-hi)' }}
            >
              <WordReveal
                words={HEADLINE_WORDS}
                reduced={reduced}
                className="flex flex-wrap"
              />
            </h2>
            <p
              className="text-lg max-w-xl md:justify-self-end leading-relaxed"
              style={{ color: 'var(--color-md-text-mid)' }}
            >
              An industrial-grade team focused on shipping real-world motion intelligence — fast, reliable, and measurable.
            </p>
          </div>
        </div>

        {/* Hierarchy */}
        <div className="space-y-12">
          {orderedGroups.map((group, groupIndex) => {
            const groupRecord = group as {
              memberIds?: string[];
              memeberIds?: string[];
              title?: string;
            };
            const rawMemberIds = groupRecord.memberIds ?? groupRecord.memeberIds ?? [];
            const memberIds = Array.isArray(rawMemberIds) ? rawMemberIds : [];

            const members = memberIds
              .map((memberId) => team.find((m) => m.id === memberId))
              .filter((m): m is NonNullable<typeof m> => Boolean(m));

            const isCoreTeam = String(group.title ?? '').toLowerCase() === 'core team';
            const groupNumber = String(groupIndex + 1).padStart(2, '0');
            const gridCols = isCoreTeam
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : members.length <= 1
                ? 'grid-cols-1 sm:grid-cols-2'
                : members.length === 2
                  ? 'grid-cols-2 sm:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

            return (
              <div
                key={group.title}
                className="rounded-md p-6 md:p-8"
                style={{
                  backgroundColor: 'color-mix(in oklab, var(--color-md-surface) 60%, transparent)',
                  border: '1px solid color-mix(in oklab, var(--color-md-text-mid) 10%, transparent)',
                }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <span
                    className="text-xs font-semibold tracking-[0.32em] tabular-nums"
                    style={{ color: 'var(--color-md-accent)' }}
                  >
                    {groupNumber}
                  </span>
                  <h3
                    className="text-lg md:text-xl font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-md-text-hi)' }}
                  >
                    {group.title}
                  </h3>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-text-mid) 14%, transparent)' }}
                  />
                  <span
                    className="text-xs tabular-nums"
                    style={{ color: 'var(--color-md-text-mid)' }}
                  >
                    {members.length}
                  </span>
                </div>

                <div className={`grid ${gridCols} gap-6 md:gap-8`}>
                  {members.map((member) => (
                    <TeamCard
                      key={member.id}
                      id={member.id}
                      img={member.img}
                      name={member.name}
                      title={member.title}
                      subtitle={member.subtitle}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { Team };
export default Team;
