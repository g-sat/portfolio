import type { ContributionDay } from '@/src/projects/github'

const LEVEL_CLASS: Record<ContributionDay['level'], string> = {
  0: 'bg-white/[0.04]',
  1: 'bg-[#1de81d]/25',
  2: 'bg-[#1de81d]/45',
  3: 'bg-[#1de81d]/70',
  4: 'bg-[#1de81d]',
}

function chunkWeeks(days: ContributionDay[]) {
  const weeks: ContributionDay[][] = []
  let week: ContributionDay[] = []

  // Pad start so the first week begins on Sunday
  if (days.length > 0) {
    const first = new Date(`${days[0].date}T00:00:00`)
    const pad = first.getDay()
    for (let i = 0; i < pad; i += 1) {
      week.push({ date: '', count: 0, level: 0 })
    }
  }

  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push({ date: '', count: 0, level: 0 })
    }
    weeks.push(week)
  }

  return weeks
}

export function ContributionGraph({
  contributions,
  total,
}: {
  contributions: ContributionDay[]
  total: number
}) {
  const weeks = chunkWeeks(contributions)

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-bitcount text-[10px] uppercase tracking-[0.45em] text-white/35">
            Activity
          </p>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            <span className="font-medium text-white">{total}</span> contributions
            in the last year
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/35">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className={`h-2.5 w-2.5 rounded-[2px] ${LEVEL_CLASS[level as ContributionDay['level']]}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="inline-flex min-w-full gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={`${wi}-${di}-${day.date || 'pad'}`}
                  title={
                    day.date
                      ? `${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`
                      : undefined
                  }
                  className={`h-[11px] w-[11px] rounded-[2px] sm:h-3 sm:w-3 ${
                    day.date
                      ? LEVEL_CLASS[(day.level ?? 0) as ContributionDay['level']]
                      : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
