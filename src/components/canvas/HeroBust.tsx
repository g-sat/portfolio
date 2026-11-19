'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { live } from '@/src/store/useExperienceStore'
import { BustFX, type Eye } from '@/src/components/canvas/BustFX'

const MODEL_PATH = '/models/generic_roman_bust/scene.gltf'
const BUST_HEIGHT = 4.0
const EYE_X = 0.145
/** The head sits left of the body's centre line. */
const EYE_CX = -0.39
const EYE_Y = 0.93
/** The scan is turned in its own space; this yaw brings the face to the camera. */
const FACE_YAW = -0.4
/** Head is rolled slightly: the viewer-left eye sits lower than the right. */
const EYE_ROLL = 0.02

const smooth = (t: number) => t * t * (3 - 2 * t)

type Slot = { top: number; bottom: number; side: 'left' | 'right' | 'center' }

/**
 * The Roman bust as the persistent hero of the stage.
 * Slides left / right between DOM sections (data-bust attribute: left, right or center),
 * looks at the cursor, twists with scroll. Zero React state in the loop.
 */
export function HeroBust() {
  const group = useRef<THREE.Group>(null)
  const viewport = useThree((s) => s.viewport)
  const { scene } = useGLTF(MODEL_PATH)

  const { model, scale, offset, eyes, center } = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh && mesh.material) {
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
        mat.envMapIntensity = 2.2
        mat.roughness = 0.38
        mat.metalness = 0.55
        mat.color.multiplyScalar(0.55)
        mesh.material = mat
      }
    })
    clone.rotation.y = FACE_YAW
    clone.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const scale = BUST_HEIGHT / Math.max(size.y, 0.0001)
    const offset = center.clone().multiplyScalar(-1)

    // Locate the face surface by raycasting at eye level (frame: world / scale)
    clone.position.copy(offset)
    clone.updateMatrixWorld(true)
    const ray = new THREE.Raycaster()
    const eyes: Eye[] = ([-1, 1] as const).map((side) => {
      const wx = EYE_CX + side * EYE_X
      const wy = EYE_Y + side * EYE_ROLL
      const origin = new THREE.Vector3(wx / scale, wy / scale, 40 / scale)
      ray.set(origin, new THREE.Vector3(0, 0, -1))
      const hit = ray.intersectObject(clone, true)[0]
      const normal = hit?.face
        ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize()
        : new THREE.Vector3(0, 0, 1)
      if (normal.z < 0.3) normal.set(0, 0, 1)
      const pos = hit
        ? hit.point.clone().multiplyScalar(scale)
        : new THREE.Vector3(wx, wy, 0.6)
      pos.addScaledVector(normal, 0.02)
      return { pos, normal, side }
    })
    const center2 = new THREE.Vector3(EYE_CX, EYE_Y, (eyes[0].pos.z + eyes[1].pos.z) / 2 - 0.2)
    return { model: clone, scale, offset, eyes, center: center2 }
  }, [scene])

  useEffect(() => {
    return () => {
      model.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.isMesh && mesh.material) {
          ;(mesh.material as THREE.Material).dispose()
        }
      })
    }
  }, [model])

  // Section slots (cached; recomputed on layout change, never inside the frame loop)
  const slots = useRef<Slot[]>([])
  useEffect(() => {
    const measure = () => {
      slots.current = Array.from(
        document.querySelectorAll<HTMLElement>('[data-bust]')
      ).map((el) => {
        const r = el.getBoundingClientRect()
        const top = r.top + window.scrollY
        return {
          top,
          bottom: top + r.height,
          side: (el.dataset.bust as Slot['side']) ?? 'center',
        }
      })
    }
    measure()
    const t = window.setTimeout(measure, 1200)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(t)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const x = useRef(0)

  useFrame(({ clock }, delta) => {
    const g = group.current
    if (!g) return

    const t = clock.elapsedTime
    const wide = viewport.aspect > 1.05
    const mid = live.scroll.y + window.innerHeight * 0.5

    let side: Slot['side'] = 'center'
    for (const s of slots.current) {
      if (mid >= s.top && mid < s.bottom) {
        side = s.side
        break
      }
    }

    const span = viewport.width * 0.2
    const targetX = !wide ? 0 : side === 'right' ? span : side === 'left' ? -span : 0
    x.current = THREE.MathUtils.damp(x.current, targetX, 2.6, delta)

    const intro = smooth(THREE.MathUtils.clamp(live.intro, 0, 1))
    const base = wide ? 1 : 0.72
    const s = THREE.MathUtils.damp(g.scale.x, base * (0.55 + intro * 0.45), 3, delta)
    g.scale.setScalar(s)

    g.position.x = x.current + live.pointer.x * 0.12
    g.position.y = THREE.MathUtils.damp(
      g.position.y,
      Math.sin(t * 0.9) * 0.09 - (1 - intro) * 1.2 + (wide ? 0 : 0.6),
      3,
      delta
    )

    const twist = Math.sin(live.scroll.progress * Math.PI * 4) * 0.6
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      live.pointer.x * 0.5 + twist + Math.sin(t * 0.5) * 0.06 - x.current * 0.08,
      3.2,
      delta
    )
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, live.pointer.y * 0.22, 3.2, delta)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, live.pointer.x * 0.04, 3, delta)
  })

  return (
    <group ref={group}>
      <group scale={scale}>
        <primitive object={model} position={offset} />
      </group>
      <BustFX eyes={eyes} center={center} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
