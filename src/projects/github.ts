export const GITHUB_USERNAME = 'g-sat'
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`

export type GithubRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  fork: boolean
  archived: boolean
}

export type ContributionDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export type ContributionData = {
  total: number
  contributions: ContributionDay[]
}

type GithubRepoApi = GithubRepo & {
  topics?: string[]
}

type ContributionsApiResponse = {
  total: Record<string, number> | number
  contributions: ContributionDay[]
}

export async function getGithubRepos(limit = 9): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio-site',
      },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) return []

  const repos = (await res.json()) as GithubRepoApi[]

  return repos
    .filter((repo) => !repo.fork && !repo.archived)
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count
      }
      return +new Date(b.updated_at) - +new Date(a.updated_at)
    })
    .slice(0, limit)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
      topics: repo.topics ?? [],
      fork: repo.fork,
      archived: repo.archived,
    }))
}

export async function getGithubContributions(): Promise<ContributionData> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
    {
      headers: { 'User-Agent': 'portfolio-site' },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) {
    return { total: 0, contributions: [] }
  }

  const data = (await res.json()) as ContributionsApiResponse
  const total =
    typeof data.total === 'number'
      ? data.total
      : Object.values(data.total).reduce((sum, n) => sum + n, 0)

  return {
    total,
    contributions: data.contributions ?? [],
  }
}
