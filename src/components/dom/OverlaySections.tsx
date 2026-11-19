'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CONTACT_CHANNELS } from '@/src/contact/links'
import MergedShape from '@/src/about/bento'
import { Marquee } from './Marquee'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const COORDS = '[ 14.058° N, 80.044° E ]'

const CHAPTERS = [
  {
    id: '01',
    word: 'Craft',
    tag: 'Interface / Motion',
    align: 'left',
    body: 'Layered compositions with real weight — type that overlaps, surfaces that refract, and interaction that answers every micro-movement.',
    points: ['Kinetic typography', 'Physical materials', 'Scroll choreography'],
  },
  {
    id: '02',
    word: 'Systems',
    tag: 'AI / ML / Realtime',
    align: 'right',
    body: 'Models, agents and data pipelines wired into interfaces that feel alive — intelligence you can touch, not a chatbox in the corner.',
    points: ['Agent architectures', 'Realtime data-art', 'Edge-aware inference'],
  },
  {
    id: '03',
    word: 'Signal',
    tag: 'Contact / Open',
    align: 'left',
    body: 'Open for collaborations, freelance, and strange ideas worth building.',
    points: [],
  },
] as const

/** Editorial chapters synced to the camera spline. */
export function OverlaySections() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const sections = gsap.utils.toArray<HTMLElement>('[data-chapter]')

      sections.forEach((sec) => {
        const lines = sec.querySelectorAll('[data-chline]')
        const fades = sec.querySelectorAll('[data-chfade]')

        if (reduced) {
          gsap.set(lines, { yPercent: 0 })
          gsap.set(fades, { opacity: 1, y: 0 })
          return
        }

        gsap.set(lines, { yPercent: 115 })
        gsap.set(fades, { opacity: 0, y: 40 })

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sec,
              start: 'top 62%',
              end: 'bottom 30%',
              toggleActions: 'play reverse play reverse',
            },
          })
          .to(lines, { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.08 })
          .to(
            fades,
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 },
            0.2
          )
      })
    },
    { scope: root }
  )

  // Cursor-reactive spotlight + damped 3D tilt on bento / glass surfaces.
  useGSAP(
    () => {
      if (window.matchMedia('(pointer: coarse)').matches) return
      const cleanups: Array<() => void> = []
      gsap.utils.toArray<HTMLElement>('.exp-bento, .exp-glass').forEach((el) => {
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
        gsap.set(el, { transformPerspective: 900 })
        const max = el.classList.contains('exp-bento') ? 5 : 8
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width
          const py = (e.clientY - r.top) / r.height
          el.style.setProperty('--mx', `${px * 100}%`)
          el.style.setProperty('--my', `${py * 100}%`)
          ry((px - 0.5) * 2 * max)
          rx(-(py - 0.5) * 2 * max)
        }
        const leave = () => {
          rx(0)
          ry(0)
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      })
      return () => cleanups.forEach((fn) => fn())
    },
    { scope: root }
  )

  return (
    <div ref={root}>
      <section
        data-bust="left"
        data-chapter
        id="exp-about"
        className="relative flex min-h-dvh items-center overflow-x-clip px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="relative z-10 grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block" aria-hidden />
          <div data-inertia="0.06">
            <p data-chfade className="mb-4 font-bitcount text-[10px] uppercase tracking-[0.45em] text-white/60">
              00 / Quick intro — {COORDS}
            </p>
            <h2 className="exp-chapter-title mb-8 select-none text-white">
              <span className="exp-mask">
                <span data-chline className="exp-line">Quick Intro</span>
              </span>
            </h2>
            <div data-chfade className="exp-bento rounded-sm ring-1">
              <MergedShape fill="#111111" />
            </div>
          </div>
        </div>
      </section>
      <Marquee words={['Design', 'Engineer', 'Intelligence', 'Motion', 'Systems']} />
      {CHAPTERS.map((c, idx) => (
        <section
          key={c.id}
          data-chapter
          data-bust={c.align === 'right' ? 'left' : 'right'}
          id={c.id === '03' ? 'exp-contact' : undefined}
          className="relative flex min-h-[140vh] items-center overflow-x-clip px-5 sm:px-8 lg:px-12"
        >
          <div
            className={`relative z-10 flex w-full flex-col gap-8 ${
              c.align === 'right' ? 'items-end text-right' : 'items-start'
            }`}
          >
            <span
              aria-hidden
              data-inertia={c.align === 'right' ? '0.18' : '-0.18'}
              className={`exp-ghost-index pointer-events-none absolute -top-[18vh] select-none ${
                c.align === 'right' ? 'right-0' : 'left-0'
              }`}
            >
              {c.id}
            </span>
            <p
              data-chfade
              className="font-bitcount text-[10px] uppercase tracking-[0.45em] text-white/50"
            >
              {c.id} / {c.tag} — {COORDS}
            </p>

            <h2
              data-inertia={c.align === 'right' ? '-0.1' : '0.1'}
              className="exp-chapter-title select-none text-white"
            >
              <span className="exp-mask">
                <span data-chline className="exp-line exp-outline">
                  {c.word}
                </span>
              </span>
            </h2>

            <div data-inertia={c.align === 'right' ? '0.08' : '-0.06'} className="w-full max-w-md">
              <article data-chfade className="exp-glass p-6">
                <p className="text-sm leading-relaxed text-white/70">{c.body}</p>

                {c.points.length > 0 && (
                  <ul className="mt-5 space-y-2 font-bitcount text-[11px] uppercase tracking-[0.25em] text-white/60">
                    {c.points.map((p, i) => (
                      <li
                        key={p}
                        className="flex items-baseline justify-between border-b border-white/10 pb-2"
                      >
                        <span>{p}</span>
                        <span className="text-[#1de81d]">0{i + 1}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {c.id === '03' && (
                  <ul className="mt-5 space-y-1">
                    {CONTACT_CHANNELS.map((ch) => (
                      <li key={ch.id}>
                        <a
                          data-cursor
                          href={ch.href}
                          target={ch.href.startsWith('mailto:') ? undefined : '_blank'}
                          rel={ch.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                          className="group flex items-baseline justify-between border-b border-white/10 py-3 font-bitcount text-[11px] uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-[#1de81d]"
                        >
                          <span>{ch.title}</span>
                          <span className="truncate pl-4 text-white/40 group-hover:text-white">
                            {ch.value} ↗
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          </div>
        </section>
      ))}

      <Marquee reverse words={['Open for work', 'Say hello', 'Build weird things', 'Let’s talk']} />
      <footer className="relative z-10 flex flex-col justify-between gap-3 border-t border-white/10 px-5 py-6 font-bitcount text-[10px] uppercase tracking-[0.4em] text-white/40 sm:flex-row sm:px-8 lg:px-12">
        <span>SG © {new Date().getFullYear()}</span>
        <span>Design. Build. Intelligence.</span>
        <a data-cursor href="/" className="hover:text-[#1de81d]">
          ← Classic portfolio
        </a>
      </footer>
    </div>
  )
}
