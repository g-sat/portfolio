'use client'

import { useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { Lighting } from '@/src/components/canvas/Lighting'
import { CameraRig } from '@/src/components/canvas/CameraRig'
import { HeroBust } from '@/src/components/canvas/HeroBust'
import { TitleBackdrop } from '@/src/components/canvas/TitleBackdrop'
import { ParticleField } from '@/src/components/canvas/ParticleField'
import { Effects } from '@/src/components/canvas/Effects'
import { useExperienceStore } from '@/src/store/useExperienceStore'

/** Compile every program up-front so the curtain only lifts on a hot GPU. */
function Warmup() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const setSceneReady = useExperienceStore((s) => s.setSceneReady)

  useEffect(() => {
    let cancelled = false
    let raf = 0

    const run = async () => {
      try {
        await gl.compileAsync(scene, camera)
      } catch {
        /* non-fatal: programs compile lazily on first draw */
      }
      // Two frames so the composer + first transmission pass are warm
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          if (!cancelled) setSceneReady()
        })
      })
    }

    // Wait a tick so siblings have mounted into the scene graph
    const t = window.setTimeout(run, 50)
    return () => {
      cancelled = true
      window.clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [gl, scene, camera, setSceneReady])

  return null
}

/**
 * Persistent full-bleed stage. Lives behind all DOM (-z-10) and never unmounts.
 */
export default function Scene({ lite = false }: { lite?: boolean }) {
  const [dpr, setDpr] = useState(lite ? 0.75 : 1.25)

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-black"
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0.2, 9.2], fov: 38, near: 0.1, far: 60 }}
        gl={{
          antialias: false,
          powerPreference: lite ? 'default' : 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 28]} />

        {!lite && (
          <PerformanceMonitor
            onDecline={() => setDpr(0.9)}
            onIncline={() => setDpr(1.25)}
          />
        )}

        <Lighting />
        <CameraRig />
        <TitleBackdrop />
        <HeroBust />
        {!lite && <ParticleField />}
        {!lite && <Effects />}
        <Warmup />
      </Canvas>
    </div>
  )
}
