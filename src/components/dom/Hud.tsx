'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { live } from '@/src/store/useExperienceStore'

/** Fixed technical readout — written straight to the DOM from the ticker (no React renders). */
export function Hud() {
  const scroll = useRef<HTMLSpanElement>(null)
  const vel = useRef<HTMLSpanElement>(null)
  const xy = useRef<HTMLSpanElement>(null)
  const rail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tick = () => {
      const p = live.scroll.progress
      if (scroll.current) scroll.current.textContent = (p * 100).toFixed(1).padStart(5, '0')
      if (vel.current) {
        const v = live.scroll.velocity
        vel.current.textContent = `${v >= 0 ? '+' : '-'}${Math.abs(v).toFixed(2).padStart(5, '0')}`
      }
      if (xy.current) {
        const x = live.pointer.x
        const y = live.pointer.y
        xy.current.textContent = `${x >= 0 ? '+' : '-'}${Math.abs(x).toFixed(2)} ${y >= 0 ? '+' : '-'}${Math.abs(y).toFixed(2)}`
      }
      if (rail.current) rail.current.style.transform = `scaleY(${p.toFixed(4)})`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 hidden font-bitcount text-[10px] uppercase tracking-[0.3em] text-white mix-blend-difference md:block"
    >
      <div className="absolute bottom-6 left-8 leading-loose opacity-70">
        <p>
          SCRL <span ref={scroll}>000.0</span>%
        </p>
        <p>
          VEL <span ref={vel}>+00.00</span>
        </p>
      </div>

      <div className="absolute bottom-6 right-8 text-right leading-loose opacity-70">
        <p>
          PTR <span ref={xy}>+0.00 +0.00</span>
        </p>
        <p>60 FPS TARGET</p>
      </div>

      <div className="absolute right-3 top-1/2 h-24 w-px -translate-y-1/2 bg-white/20">
        <div ref={rail} className="h-full w-px origin-top bg-white" style={{ transform: 'scaleY(0)' }} />
      </div>
    </div>
  )
}
