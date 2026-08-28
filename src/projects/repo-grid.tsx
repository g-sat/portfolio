import type { GithubRepo } from '@/src/projects/github'

function formatUpdated(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function RepoGrid({ repos }: { repos: GithubRepo[] }) {
  if (repos.length === 0) {
    return (
      <p className="text-sm text-white/45">
        Couldn’t load repositories right now. Check back soon.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <li key={repo.id} className="bg-black">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="group flex h-full flex-col gap-4 px-5 py-6 transition-colors hover:bg-white/[0.03] sm:px-6 sm:py-7"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="bento-title text-[clamp(1.15rem,2vw,1.45rem)] leading-[1] tracking-[-0.03em] text-white transition-colors group-hover:text-[#1de81d]">
                {repo.name}
              </h3>
              <span className="shrink-0 font-bitcount text-[10px] uppercase tracking-[0.3em] text-white/30 transition-colors group-hover:text-white/55">
                ↗
              </span>
            </div>

            <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-white/45">
              {repo.description || 'No description provided.'}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-bitcount text-[10px] uppercase tracking-[0.22em] text-white/35">
              {repo.language && <span>{repo.language}</span>}
              <span>★ {repo.stargazers_count}</span>
              <span>Updated {formatUpdated(repo.updated_at)}</span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
