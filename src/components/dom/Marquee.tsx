'use client'

import { useEffect, useRef } from 'react'
import { live } from '@/src/store/useExperienceStore'

/**
 * Giant mixed solid/outline ticker. Drifts constantly, speeds up and skews with
 * scroll velocity, and reverses direction per instance. Pure rAF + transforms, no React state.
 */
export function Marquee({
  words,
  reverse = false,
}: {
  words: string[]
  reverse?: boolean
}) {
  const track = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    const box = wrap.current
    if (!el || !box) return
    let x = 0
    let skew = 0
    let last = performance.now()
    let raf = 0
    const dir = reverse ? 1 : -1

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const v = live.scroll.velocity
      const half = el.scrollWidth / 2
      x += dir * (60 + Math.min(Math.abs(v), 60) * 14) * dt
      if (half > 0) x = ((x % half) - half) % half
      const target = Math.max(-10, Math.min(10, v * 0.35))
      skew += (target - skew) * (1 - Math.exp(-8 * dt))
      el.style.transform = `translate3d(${x}px,0,0)`
      box.style.transform = `skewX(${skew}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reverse])

  const row = words.map((w, i) => (
    <span key={w + i} className="flex items-center gap-[4vw] pr-[4vw]">
      <span className={i % 2 ? 'exp-marq-outline' : 'exp-marq-solid'}>{w}</span>
      <span className="exp-marq-star" aria-hidden>
        ✦
      </span>
    </span>
  ))

  return (
    <div
      aria-hidden
      className="pointer-events-none relative z-10 overflow-hidden border-y border-white/10 py-4"
    >
      <div ref={wrap} className="will-change-transform">
        <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
          {row}
          {row}
        </div>
      </div>
    </div>
  )
}
