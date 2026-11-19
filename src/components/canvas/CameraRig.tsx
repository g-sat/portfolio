'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { live } from '@/src/store/useExperienceStore'

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Scroll-linked CatmullRom spline + damped mouse parallax.
 * Intro: camera dollies in from far/low after the preloader lifts.
 */
export function CameraRig() {
  const progress = useRef(0)
  const parallax = useRef({ x: 0, y: 0 })

  const { path, target } = useMemo(
    () => ({
      path: new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 0.2, 9.2),
          new THREE.Vector3(1.0, 0.5, 8.4),
          new THREE.Vector3(-1.0, -0.2, 8.0),
          new THREE.Vector3(0.4, 0.7, 7.6),
          new THREE.Vector3(0, 0.1, 9.4),
        ],
        false,
        'catmullrom',
        0.5
      ),
      target: new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 0),
        ],
        false,
        'catmullrom',
        0.5
      ),
    }),
    []
  )

  const pos = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }, delta) => {
    const cam = camera as THREE.PerspectiveCamera

    progress.current = THREE.MathUtils.damp(
      progress.current,
      THREE.MathUtils.clamp(live.scroll.progress, 0, 1),
      2.4,
      delta
    )

    path.getPointAt(progress.current, pos)
    target.getPointAt(progress.current, look)

    const intro = easeOutCubic(THREE.MathUtils.clamp(live.intro, 0, 1))
    pos.z += (1 - intro) * 8
    pos.y -= (1 - intro) * 1.4

    parallax.current.x = THREE.MathUtils.damp(
      parallax.current.x,
      live.pointer.x * 0.7,
      3,
      delta
    )
    parallax.current.y = THREE.MathUtils.damp(
      parallax.current.y,
      -live.pointer.y * 0.45,
      3,
      delta
    )

    cam.position.set(
      pos.x + parallax.current.x,
      pos.y + parallax.current.y,
      pos.z
    )
    cam.lookAt(look)

    // FOV kick tied to scroll velocity — speed feels physical
    const targetFov = 38 + Math.min(Math.abs(live.scroll.velocity) * 0.35, 9)
    if (Math.abs(cam.fov - targetFov) > 0.01) {
      cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, delta)
      cam.updateProjectionMatrix()
    }
  })

  return null
}
