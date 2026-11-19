'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useExperienceStore } from '@/src/store/useExperienceStore'

const COORDS = '[ 14.058° N, 80.044° E ]'

/** Hero overlay: oversized overlapping type with masked line reveals + glass metadata. */
export function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const lines = el.querySelectorAll('[data-line]')
    const fades = el.querySelectorAll('[data-fade]')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.set(lines, { yPercent: reduced ? 0 : 115 })
    gsap.set(fades, { opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 })

    let played = false
    const play = () => {
      if (played || reduced) return
      played = true
      gsap
        .timeline()
        .to(lines, { yPercent: 0, duration: 1.5, ease: 'power4.out', stagger: 0.1 })
        .to(
          fades,
          { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.07 },
          0.5
        )
    }

    if (useExperienceStore.getState().revealed) play()
    const unsub = useExperienceStore.subscribe((s) => {
      if (s.revealed) play()
    })

    return () => {
      unsub()
      gsap.killTweensOf([lines, fades])
    }
  }, [])

  return (
    <section
      ref={root}
      id="exp-hero"
      data-bust="right"
      className="relative flex min-h-dvh flex-col justify-between overflow-x-clip px-5 pb-8 pt-6 sm:px-8 lg:px-12"
    >
      {/* Registration marks */}
      <span aria-hidden className="exp-reg left-3 top-3" />
      <span aria-hidden className="exp-reg right-3 top-3" />
      <span aria-hidden className="exp-reg bottom-3 left-3" />
      <span aria-hidden className="exp-reg bottom-3 right-3" />

      {/* Top meta row */}
      <header className="relative z-10 flex items-start justify-between font-bitcount text-[10px] uppercase tracking-[0.35em] text-white/70">
        <div data-fade className="leading-loose">
          <p>SG © 2026</p>
          <p className="text-white/40">Portfolio / Index</p>
        </div>
        <p data-fade className="hidden text-center md:block">
          {COORDS}
          <span className="mt-1 block text-white/35">Amaravati — IN</span>
        </p>
        <nav data-fade className="flex flex-col items-end gap-1 leading-loose">
          <a data-cursor href="/#projects" className="hover:text-[#1de81d]">
            Work
          </a>
          <a data-cursor href="/#about" className="hover:text-[#1de81d]">
            About
          </a>
          <a data-cursor href="#exp-contact" className="hover:text-[#1de81d]">
            Contact
          </a>
        </nav>
      </header>

      {/* Editorial type stack — overlapping, blended against the WebGL stage */}
      <h1
        data-inertia="0.14"
        className="exp-title relative z-10 select-none text-white"
      >
        {/* “Design” + “Engineer” are rendered in 3D behind the bust (TitleBackdrop) */}
        <span className="sr-only">Design Engineer </span>
        <span className="exp-mask exp-shift-b">
          <span data-line className="exp-line exp-l3 exp-front">
            Intelli<span className="text-[#1de81d]">gence</span>
          </span>
        </span>
      </h1>

      {/* Vertical edge label */}
      <p
        data-fade
        aria-hidden
        className="exp-vertical absolute right-3 top-1/2 hidden -translate-y-1/2 font-bitcount text-[10px] uppercase tracking-[0.5em] text-white/40 lg:block"
      >
        Interactive Developer — Creative Technologist
      </p>

      {/* Glass cards */}
      <div className="relative z-10 grid grid-cols-1 items-end gap-4 md:grid-cols-[minmax(0,22rem)_1fr_minmax(0,18rem)]">
        <div data-inertia="-0.05">
          <article data-fade className="exp-glass p-5">
            <p className="font-bitcount text-[10px] uppercase tracking-[0.4em] text-[#1de81d]">
              01 / Profile
            </p>
            <p className="bento-title mt-3 text-2xl leading-[0.95] sm:text-3xl">
              Sathwik Garikapati
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Web design meets AI/ML engineering — interfaces with weight,
              systems with intent.
            </p>
            <p className="mt-4 font-bitcount text-[10px] uppercase tracking-[0.3em] text-white/40">
              {COORDS}
            </p>
          </article>
        </div>

        <p
          data-fade
          className="hidden self-end text-center font-bitcount text-[10px] uppercase tracking-[0.5em] text-white/35 md:block"
        >
          Scroll to travel the spline ↓
        </p>

        <div data-inertia="0.18">
          <article data-fade className="exp-glass p-5">
            <p className="font-bitcount text-[10px] uppercase tracking-[0.4em] text-[#fff947]">
              02 / Stack
            </p>
            <ul className="mt-3 space-y-2 font-bitcount text-xs uppercase tracking-[0.22em] text-white/70">
              {['React Three Fiber', 'GLSL / Simplex Noise', 'GSAP + Lenis', 'Next.js App Router'].map(
                (item, i) => (
                  <li key={item} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2">
                    <span>{item}</span>
                    <span className="text-white/30">0{i + 1}</span>
                  </li>
                )
              )}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}
