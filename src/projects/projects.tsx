import {
  GITHUB_PROFILE_URL,
  GITHUB_USERNAME,
  getGithubContributions,
  getGithubRepos,
} from '@/src/projects/github'
import { ContributionGraph } from '@/src/projects/contribution-graph'
import { RepoGrid } from '@/src/projects/repo-grid'

export async function Projects() {
  const [repos, contributions] = await Promise.all([
    getGithubRepos(9),
    getGithubContributions(),
  ])

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-t border-white/10 bg-black px-5 py-24 text-white sm:px-8 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-bitcount text-[10px] uppercase tracking-[0.45em] text-white/35">
              Work / 002
            </p>
            <h2 className="bento-title mt-4 text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.88] tracking-[-0.06em]">
              Projects
            </h2>
            <p className="mt-4 max-w-xl text-sm uppercase tracking-[0.18em] text-white/45 sm:text-base">
              Live from GitHub — @{GITHUB_USERNAME}
            </p>
          </div>

          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-3 border border-white/15 px-5 py-3 font-bitcount text-[10px] uppercase tracking-[0.35em] text-white/70 transition-colors hover:border-[#1de81d]/50 hover:text-[#1de81d]"
          >
            Open GitHub
            <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="border-b border-white/10 py-10">
          <ContributionGraph
            contributions={contributions.contributions}
            total={contributions.total}
          />
        </div>

        <div className="pt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-bitcount text-[10px] uppercase tracking-[0.45em] text-white/35">
                Repositories
              </p>
              <p className="mt-2 text-sm text-white/55">
                Recent public work, sorted by activity.
              </p>
            </div>
          </div>

          <RepoGrid repos={repos} />
        </div>
      </div>
    </section>
  )
}
