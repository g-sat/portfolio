'use client'

import {
  Children,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type HomeAboutTransitionProps = {
  children: ReactNode
}

/**
 * Home → About: bubble-gum stretch + gooey neon wipe (GSAP ScrollTrigger).
 * Expects <Hero /> then <About />.
 */
export function HomeAboutTransition({ children }: HomeAboutTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [hero, about] = Children.toArray(children)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const pin = root.querySelector<HTMLElement>('[data-home-pin]')
    const stage = root.querySelector<HTMLElement>('[data-home-stage]')
    const copy = root.querySelector<HTMLElement>('[data-home-copy]')
    const visual = root.querySelector<HTMLElement>('[data-home-visual]')
    const aboutInner = root.querySelector<HTMLElement>('[data-about-inner]')
    const gum = root.querySelector<HTMLElement>('[data-gum]')
    const gumCore = root.querySelector<HTMLElement>('[data-gum-core]')
    const gumHalo = root.querySelector<HTMLElement>('[data-gum-halo]')
    const gumSheet = root.querySelector<HTMLElement>('[data-gum-sheet]')
    const stretchBand = root.querySelector<HTMLElement>('[data-stretch-band]')

    if (!pin || !stage) return

    const ctx = gsap.context(() => {
      if (aboutInner) gsap.set(aboutInner, { y: 80, opacity: 0.35, scale: 0.97 })
      if (gum) gsap.set(gum, { autoAlpha: 1 })
      if (gumCore) gsap.set(gumCore, { scale: 0 })
      if (gumHalo) gsap.set(gumHalo, { scale: 0 })
      if (gumSheet) {
        gsap.set(gumSheet, {
          scaleY: 0,
          opacity: 1,
          transformOrigin: '50% 100%',
        })
      }
      if (stretchBand) gsap.set(stretchBand, { scaleY: 0, opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=200%',
          pin,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            if (gum) gsap.set(gum, { autoAlpha: 0 })
          },
          onEnterBack: () => {
            if (gum) gsap.set(gum, { autoAlpha: 1 })
          },
        },
      })

      // --- Bubble gum pull (elastic stretch) ---
      if (visual) {
        tl.fromTo(
          visual,
          { scaleY: 1, scaleX: 1, yPercent: 0, filter: 'blur(0px)' },
          {
            scaleY: 1.65,
            scaleX: 0.84,
            yPercent: 8,
            transformOrigin: '50% 10%',
            duration: 0.38,
          },
          0
        )
      }

      if (copy) {
        tl.fromTo(
          copy,
          { scaleY: 1, scaleX: 1, yPercent: 0, skewX: 0, opacity: 1 },
          {
            scaleY: 1.4,
            scaleX: 0.9,
            yPercent: 22,
            skewX: -6,
            opacity: 0.5,
            transformOrigin: '50% 100%',
            duration: 0.38,
          },
          0
        )
      }

      if (stretchBand) {
        tl.to(
          stretchBand,
          {
            scaleY: 1.15,
            opacity: 1,
            transformOrigin: '50% 0%',
            duration: 0.32,
          },
          0.06
        )
      }

      // --- Chew / snap into the seam ---
      if (visual) {
        tl.to(
          visual,
          {
            scaleY: 0.08,
            scaleX: 1.35,
            yPercent: 55,
            filter: 'blur(10px)',
            duration: 0.3,
          },
          0.36
        )
      }

      if (copy) {
        tl.to(
          copy,
          {
            scaleY: 0.12,
            scaleX: 1.22,
            yPercent: 70,
            opacity: 0,
            filter: 'blur(12px)',
            duration: 0.3,
          },
          0.36
        )
      }

      if (stretchBand) {
        tl.to(
          stretchBand,
          { scaleY: 3.2, opacity: 0, duration: 0.28 },
          0.4
        )
      }

      // --- Gooey neon bubble eruption ---
      if (gumHalo) {
        tl.to(
          gumHalo,
          { scale: 32, duration: 0.48, ease: 'power2.in' },
          0.44
        )
      }
      if (gumCore) {
        tl.to(
          gumCore,
          { scale: 36, duration: 0.52, ease: 'power2.in' },
          0.46
        )
      }

      // White sheet climbs like stretched gum skin
      if (gumSheet) {
        tl.to(
          gumSheet,
          { scaleY: 1, duration: 0.42, ease: 'power3.in' },
          0.52
        )
      }

      tl.to(stage, { opacity: 0, duration: 0.18 }, 0.62)

      // About content settles as you arrive
      if (aboutInner) {
        tl.to(
          aboutInner,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
          },
          0.7
        )
      }

      // Hold opaque white until pin releases (seamless into About)
      if (gumSheet) {
        tl.to(gumSheet, { opacity: 1, duration: 0.15 }, 0.85)
      }
    }, root)

    const refresh = () => ScrollTrigger.refresh()
    const t = window.setTimeout(refresh, 400)
    window.addEventListener('load', refresh)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={rootRef} className="home-about-bridge relative">
      <div data-home-pin className="relative h-dvh overflow-hidden bg-black">
        {hero}

        {/* Stretch filament */}
        <div
          data-stretch-band
          aria-hidden
          className="pointer-events-none absolute top-[38%] left-1/2 z-35 h-[32vh] w-[min(48vw,260px)] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#1de81d]/0 via-[#1de81d]/75 to-[#fff947]"
        />

        {/* Goo wipe */}
        <div
          data-gum
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
        >
          <svg className="absolute h-0 w-0" aria-hidden>
            <defs>
              <filter id="gum-goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="20"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>

          <div className="absolute inset-0" style={{ filter: 'url(#gum-goo)' }}>
            <div
              data-gum-halo
              className="absolute bottom-[-12%] left-1/2 h-[22vmax] w-[22vmax] -translate-x-1/2 rounded-full bg-[#1de81d]"
            />
            <div
              data-gum-core
              className="absolute bottom-[-9%] left-1/2 h-[16vmax] w-[16vmax] -translate-x-1/2 rounded-full bg-[#d4ff1a]"
            />
          </div>

          <div data-gum-sheet className="absolute inset-0 bg-white" />
        </div>
      </div>

      {about}
    </div>
  )
}
