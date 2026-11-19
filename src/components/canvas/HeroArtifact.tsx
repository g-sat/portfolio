'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createHeroMaterial } from '@/src/shaders/hero.glsl'
import { live } from '@/src/store/useExperienceStore'

const smooth = (t: number) => t * t * (3 - 2 * t)

/**
 * Refractive iridescent liquid-glass core.
 * All displacement lives in the vertex shader — the CPU only feeds uniforms.
 */
export function HeroArtifact() {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)

  const { material, uniforms } = useMemo(() => createHeroMaterial(), [])
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.35, 40), [])

  // Scratch objects — zero allocations per frame
  const scratch = useMemo(
    () => ({
      mouse: new THREE.Vector3(0, 0, 1),
      inv: new THREE.Quaternion(),
    }),
    []
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame(({ clock }, delta) => {
    const g = group.current
    if (!g) return

    const progress = live.scroll.progress
    const vel = Math.min(Math.abs(live.scroll.velocity) * 0.08, 1.5)

    uniforms.uTime.value = clock.elapsedTime
    uniforms.uScrollProgress.value = THREE.MathUtils.damp(
      uniforms.uScrollProgress.value,
      progress,
      3,
      delta
    )
    uniforms.uVelocity.value = THREE.MathUtils.damp(
      uniforms.uVelocity.value,
      vel,
      4,
      delta
    )
    uniforms.uReveal.value = smooth(THREE.MathUtils.clamp(live.intro, 0, 1))

    // Orientation: slow drift + scroll twist + pointer tilt
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      progress * Math.PI * 1.4 + clock.elapsedTime * 0.04,
      2.5,
      delta
    )
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, live.pointer.y * 0.18, 3, delta)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, live.pointer.x * 0.06, 3, delta)

    // Pointer → mesh-local space so the distortion field tracks the cursor
    scratch.mouse.set(live.pointer.x * 1.15, -live.pointer.y * 1.15, 0.95)
    scratch.inv.copy(g.quaternion).invert()
    scratch.mouse.applyQuaternion(scratch.inv)
    uniforms.uMouse.value.x = THREE.MathUtils.damp(
      uniforms.uMouse.value.x,
      scratch.mouse.x,
      3.5,
      delta
    )
    uniforms.uMouse.value.y = THREE.MathUtils.damp(
      uniforms.uMouse.value.y,
      scratch.mouse.y,
      3.5,
      delta
    )
    uniforms.uMouse.value.z = THREE.MathUtils.damp(
      uniforms.uMouse.value.z,
      scratch.mouse.z,
      3.5,
      delta
    )

    // Inner wireframe core counter-rotates (seen through the glass)
    if (core.current) {
      core.current.rotation.y -= delta * (0.25 + vel * 1.2)
      core.current.rotation.x += delta * 0.12
      const s = 0.4 + uniforms.uReveal.value * 0.6
      core.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} />

      <mesh ref={core}>
        <icosahedronGeometry args={[0.62, 2]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#1de81d"
          emissiveIntensity={2.4}
          wireframe
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
