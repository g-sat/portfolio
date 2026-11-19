'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { live, useExperienceStore } from '@/src/store/useExperienceStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis ↔ GSAP bridge.
 *  - single RAF: gsap.ticker drives lenis.raf
 *  - writes scroll / velocity / pointer into the non-reactive `live` store
 *  - applies inertial parallax + velocity skew to every [data-inertia] element
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: !reduced,
      autoRaf: false,
    })
    if (!useExperienceStore.getState().revealed) lenis.stop()

    lenis.on('scroll', ScrollTrigger.update)

    // --- inertia targets -------------------------------------------------
    type Inertia = { el: HTMLElement; speed: number; y: number }
    let inertia: Inertia[] = []
    const collect = () => {
      inertia = Array.from(
        document.querySelectorAll<HTMLElement>('[data-inertia]')
      ).map((el) => ({
        el,
        speed: parseFloat(el.dataset.inertia ?? '0') || 0,
        y: 0,
      }))
    }
    collect()
    const recollect = window.setTimeout(collect, 1200)

    // --- single RAF ------------------------------------------------------
    const tick = (time: number, deltaMs: number) => {
      lenis.raf(time * 1000)

      live.scroll.y = lenis.scroll
      live.scroll.limit = lenis.limit
      live.scroll.progress = lenis.limit > 0 ? lenis.scroll / lenis.limit : 0
      live.scroll.velocity = lenis.velocity

      if (reduced) return
      const dt = Math.min(deltaMs / 1000, 0.05)
      const k = 1 - Math.exp(-6 * dt)
      const skew = Math.max(-5, Math.min(5, live.scroll.velocity * 0.14))
      for (const item of inertia) {
        item.y += (live.scroll.y * item.speed - item.y) * k
        item.el.style.transform = `translate3d(0, ${item.y.toFixed(2)}px, 0) skewY(${(skew * Math.sign(item.speed || 1) * 0.6).toFixed(3)}deg)`
      }
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // --- pointer ---------------------------------------------------------
    const coarse = window.matchMedia('(pointer: coarse)')
    const onPointer = (e: PointerEvent) => {
      if (coarse.matches) return
      live.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      live.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const unsub = useExperienceStore.subscribe((s) => {
      if (s.revealed) {
        lenis.start()
        collect()
      }
    })

    return () => {
      unsub()
      window.clearTimeout(recollect)
      window.removeEventListener('pointermove', onPointer)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
