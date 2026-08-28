'use client'

import { useEffect, useState } from 'react'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function FlipDigit({ value }: { value: string }) {
  const [current, setCurrent] = useState(value)
  const [previous, setPrevious] = useState(value)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    if (value === current) return

    setPrevious(current)
    setCurrent(value)
    setFlipping(true)

    const id = window.setTimeout(() => setFlipping(false), 600)
    return () => window.clearTimeout(id)
  }, [value, current])

  return (
    <div className="flip-digit" aria-hidden>
      <div className="flip-digit__static flip-digit__static--top">
        <span>{current}</span>
      </div>
      <div className="flip-digit__static flip-digit__static--bottom">
        <span>{flipping ? previous : current}</span>
      </div>

      <div
        className={`flip-digit__flap flip-digit__flap--top${flipping ? ' is-flipping' : ''}`}
      >
        <span>{flipping ? previous : current}</span>
      </div>
      <div
        className={`flip-digit__flap flip-digit__flap--bottom${flipping ? ' is-flipping' : ''}`}
      >
        <span>{current}</span>
      </div>
    </div>
  )
}

function FlipGroup({ value }: { value: string }) {
  return (
    <div className="flex gap-[2px] sm:gap-1">
      <FlipDigit value={value[0] ?? '0'} />
      <FlipDigit value={value[1] ?? '0'} />
    </div>
  )
}

export default function FlipClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()

    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const hours = pad2(now.getHours())
  const minutes = pad2(now.getMinutes())

  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-2">
      <span className="pl-[0.45em] font-bitcount text-[9px] uppercase tracking-[0.45em] text-white/35 sm:text-[10px]">
        06 / NOW
      </span>

      <div
        className="flip-clock"
        role="timer"
        aria-live="polite"
        aria-label={`Current time ${hours}:${minutes}`}
      >
        <FlipGroup value={hours} />
        <span className="flip-clock__colon">:</span>
        <FlipGroup value={minutes} />
      </div>
    </div>
  )
}
