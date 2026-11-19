'use client'

import dynamic from 'next/dynamic'
import { Component, useEffect, useState, type ReactNode } from 'react'
import { SmoothScroll } from '@/src/components/dom/SmoothScroll'
import { Preloader } from '@/src/components/dom/Preloader'
import { CustomCursor } from '@/src/components/dom/CustomCursor'
import { Hud } from '@/src/components/dom/Hud'
import { Hero } from '@/src/components/dom/Hero'
import { OverlaySections } from '@/src/components/dom/OverlaySections'
import { detectGpuTier, type GpuTier } from '@/src/lib/gpuTier'
import { useExperienceStore } from '@/src/store/useExperienceStore'

// WebGL is client-only; keep the Canvas out of SSR.
const Scene = dynamic(() => import('@/src/components/canvas/Scene'), { ssr: false })

/** If the canvas ever throws (context lost, shader failure) the DOM must still work. */
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** Persistent stage (fixed canvas) + DOM floating over it. */
export function Experience() {
  const [tier, setTier] = useState<GpuTier | null>(null)
  const setSceneReady = useExperienceStore((s) => s.setSceneReady)

  useEffect(() => {
    const t = detectGpuTier()
    setTier(t)
    // No GPU path: release the curtain ourselves
    if (t === 'none') setSceneReady()
  }, [setSceneReady])

  return (
    <SmoothScroll>
      <div className="exp-root relative">
        {tier && tier !== 'none' && (
          <SceneBoundary onError={setSceneReady}>
            <Scene lite={tier === 'lite'} />
          </SceneBoundary>
        )}
        <Preloader />
        <CustomCursor />
        <Hud />

        <main className="relative">
          <Hero />
          <OverlaySections />
        </main>
      </div>
    </SmoothScroll>
  )
}
