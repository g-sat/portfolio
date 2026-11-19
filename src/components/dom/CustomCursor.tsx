'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/** Lerped ring + dot. Inverts via mix-blend and swells over [data-cursor] / links. */
export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pos = { x: target.x, y: target.y, s: 1 }
    let scaleTarget = 1

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }
    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null
      scaleTarget = el?.closest('a, button, [data-cursor]') ? 2.6 : 1
    }

    const tick = (_t: number, deltaMs: number) => {
      const dt = Math.min(deltaMs / 1000, 0.05)
      const k = 1 - Math.exp(-14 * dt)
      const ks = 1 - Math.exp(-10 * dt)
      pos.x += (target.x - pos.x) * k
      pos.y += (target.y - pos.y) * k
      pos.s += (scaleTarget - pos.s) * ks
      if (ring.current) {
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${pos.s.toFixed(3)})`
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden mix-blend-difference [@media(pointer:fine)]:block"
    >
      <div
        ref={ring}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white"
      />
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white" />
    </div>
  )
}
