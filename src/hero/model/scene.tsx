'use client'

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Center } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Canvas from '@/src/hero/lib/canvas'
import { Model } from './model'

function useModelScale() {
  const [scale, setScale] = useState(0.012)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      if (width >= 1024) setScale(0.017)
      else if (width >= 640) setScale(0.014)
      else setScale(0.011)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return scale
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}

/** Normalized pointer in [-1, 1], updated from the window for smoother tracking. */
function usePointerTarget(enabled: boolean) {
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) {
      target.current.x = 0
      target.current.y = 0
      return
    }

    const coarse = window.matchMedia('(pointer: coarse)')
    const onMove = (e: PointerEvent) => {
      if (coarse.matches) return
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  return target
}

function BustRig({
  children,
  reducedMotion,
}: {
  children: ReactNode
  reducedMotion: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const pointer = usePointerTarget(!reducedMotion)

  useFrame(({ clock }, delta) => {
    const g = group.current
    if (!g) return

    const t = clock.elapsedTime

    if (reducedMotion) {
      g.rotation.set(0, 0, 0)
      g.position.set(0, 0, 0)
      g.scale.setScalar(1)
      return
    }

    // Cursor look — small pitch / yaw
    const lookX = pointer.current.y * -0.32
    const lookY = pointer.current.x * 0.45

    // Idle sway + float
    const swayY = Math.sin(t * 0.55) * 0.08
    const swayX = Math.sin(t * 0.4) * 0.04
    const floatY = Math.sin(t * 0.9) * 0.07
    const breath = 1 + Math.sin(t * 1.1) * 0.012

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, lookX + swayX, 3.5, delta)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, lookY + swayY, 3.5, delta)
    g.rotation.z = THREE.MathUtils.damp(
      g.rotation.z,
      pointer.current.x * 0.04,
      3,
      delta
    )
    g.position.y = THREE.MathUtils.damp(g.position.y, floatY, 2.8, delta)
    const s = THREE.MathUtils.damp(g.scale.x, breath, 2.5, delta)
    g.scale.setScalar(s)
  })

  return <group ref={group}>{children}</group>
}

export default function Scene() {
  const scale = useModelScale()
  const reducedMotion = usePrefersReducedMotion()

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      className="bg-transparent"
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        <BustRig reducedMotion={reducedMotion}>
          <Center>
            <Model scale={scale} />
          </Center>
        </BustRig>
      </Suspense>
    </Canvas>
  )
}
