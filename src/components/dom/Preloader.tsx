'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useProgress } from '@react-three/drei'
import { live, useExperienceStore } from '@/src/store/useExperienceStore'

const GLYPHS = '█▓▒░/\\|+*#@%&01<>'

function scrambleTo(el: HTMLElement, text: string, duration: number, delay = 0) {
  const state = { p: 0 }
  return gsap.to(state, {
    p: 1,
    duration,
    delay,
    ease: 'none',
    onUpdate() {
      const reveal = Math.floor(state.p * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        out += ch === ' ' || i < reveal ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      el.textContent = out
    },
    onComplete() {
      el.textContent = text
    },
  })
}

const MIN_SECONDS = 2.6

/**
 * Brutalist curtain. Holds until:
 *   assets loaded (useProgress) AND programs compiled (Scene → sceneReady) AND min time.
 * Then: scramble → split-curtain → camera dolly-in + DOM entrance.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const label = useRef<HTMLParagraphElement>(null)
  const status = useRef<HTMLParagraphElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)

  const { progress, active } = useProgress()
  const sceneReady = useExperienceStore((s) => s.sceneReady)
  const gate = useRef({ asset: 0, active: true, sceneReady: false })

  useEffect(() => {
    gate.current = { asset: progress, active, sceneReady }
  }, [progress, active, sceneReady])

  useEffect(() => {
    const el = root.current
    if (!el) return

    if (useExperienceStore.getState().revealed) {
      el.style.display = 'none'
      live.intro = 1
      return
    }

    document.documentElement.classList.add('is-loading')

    const labelEl = label.current
    const statusEl = status.current
    if (labelEl) scrambleTo(labelEl, 'SATHWIK G / ARCHIVE 2026', 1.4)

    const start = performance.now()
    const shown = { v: 0 }
    let done = false
    let exit: gsap.core.Timeline | null = null

    const runExit = () => {
      exit = gsap.timeline({
        onComplete: () => {
          el.style.display = 'none'
          document.documentElement.classList.remove('is-loading')
        },
      })

      if (statusEl) exit.add(() => scrambleTo(statusEl, 'ACCESS GRANTED', 0.5), 0)
      exit
        .to(content.current, { opacity: 0, yPercent: -8, duration: 0.5, ease: 'power3.in' }, 0.55)
        .to(top.current, { yPercent: -100, duration: 1.15, ease: 'power4.inOut' }, 1)
        .to(bottom.current, { yPercent: 100, duration: 1.15, ease: 'power4.inOut' }, 1)
        .to(live, { intro: 1, duration: 3, ease: 'power3.inOut' }, 1)
        .add(() => useExperienceStore.getState().setRevealed(), 1.7)
    }

    const tick = (_t: number, deltaMs: number) => {
      const elapsed = (performance.now() - start) / 1000
      const timeP = Math.min(elapsed / MIN_SECONDS, 1)
      const eased = 1 - Math.pow(1 - timeP, 3)
      const g = gate.current
      // Safety valve: never trap a slow device behind the curtain.
      const stuck = elapsed > 14 && timeP >= 1
      const ready = (g.sceneReady && !g.active && timeP >= 1) || stuck
      const target = ready ? 100 : Math.min(94, Math.max(g.asset * 0.94, eased * 94))

      shown.v += (target - shown.v) * (1 - Math.exp(-5 * (deltaMs / 1000)))

      if (counter.current) {
        counter.current.textContent = String(Math.round(shown.v)).padStart(3, '0')
      }
      if (bar.current) bar.current.style.transform = `scaleX(${(shown.v / 100).toFixed(4)})`
      if (statusEl && !done && Math.random() < 0.08) {
        statusEl.textContent = ready
          ? 'SYNC COMPLETE'
          : g.sceneReady
            ? 'WARMING SHADERS'
            : 'COMPILING PROGRAMS'
      }

      if (!done && shown.v >= 99.4) {
        done = true
        gsap.ticker.remove(tick)
        if (counter.current) counter.current.textContent = '100'
        runExit()
      }
    }

    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      exit?.kill()
      document.documentElement.classList.remove('is-loading')
    }
  }, [])

  return (
    <div ref={root} className="fixed inset-0 z-[100] text-white" role="status" aria-label="Loading">
      <div ref={top} className="absolute inset-x-0 top-0 h-1/2 bg-black" />
      <div ref={bottom} className="absolute inset-x-0 bottom-0 h-1/2 bg-black" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/20" />

      <div
        ref={content}
        className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8"
      >
        <div className="flex items-start justify-between font-bitcount text-[10px] uppercase tracking-[0.35em] text-white/60">
          <p ref={label}>SATHWIK G / ARCHIVE 2026</p>
          <p className="hidden sm:block">[ 14.058° N, 80.044° E ]</p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="flex items-start leading-none">
            <span
              ref={counter}
              className="bento-title text-[clamp(7rem,30vw,26rem)] leading-[0.78] tracking-[-0.06em]"
            >
              000
            </span>
            <span className="bento-title mt-2 text-[clamp(1.5rem,5vw,4rem)] text-[#1de81d]">
              %
            </span>
          </div>

          <div className="hidden max-w-[16rem] pb-3 text-right font-bitcount text-[10px] uppercase leading-loose tracking-[0.3em] text-white/50 md:block">
            <p ref={status}>COMPILING PROGRAMS</p>
            <p>R3F / GLSL / GSAP / LENIS</p>
          </div>
        </div>

        <div className="h-px w-full bg-white/15">
          <div
            ref={bar}
            className="h-px origin-left bg-[#1de81d] shadow-[0_0_12px_#1de81d]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </div>
  )
}
