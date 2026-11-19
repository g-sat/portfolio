'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  PARTICLE_FRAG,
  PARTICLE_VERT,
  createParticleUniforms,
} from '@/src/shaders/particles.glsl'
import { live } from '@/src/store/useExperienceStore'

const COUNT = 2600

/** GPU Points — shell + accretion disc, exploding / reassembling with scroll. */
export function ParticleField() {
  const points = useRef<THREE.Points>(null)
  const viewport = useThree((s) => s.viewport)
  const gl = useThree((s) => s.gl)

  const uniforms = useMemo(() => createParticleUniforms(), [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(COUNT * 3)
    const rand = new Float32Array(COUNT * 4)

    for (let i = 0; i < COUNT; i++) {
      const isDisc = Math.random() < 0.4
      let x: number, y: number, z: number

      if (isDisc) {
        const a = Math.random() * Math.PI * 2
        const r = 2.6 + Math.pow(Math.random(), 1.6) * 6.2
        x = Math.cos(a) * r
        z = Math.sin(a) * r
        y = (Math.random() - 0.5) * 0.45 * (1 + r * 0.15)
      } else {
        const u = Math.random() * 2 - 1
        const a = Math.random() * Math.PI * 2
        const s = Math.sqrt(1 - u * u)
        const r = 2.4 + Math.pow(Math.random(), 2) * 4.6
        x = s * Math.cos(a) * r
        y = u * r
        z = s * Math.sin(a) * r
      }

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      rand[i * 4] = Math.random()
      rand[i * 4 + 1] = Math.random()
      rand[i * 4 + 2] = Math.random()
      rand[i * 4 + 3] = Math.random()
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 4))
    return geo
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: uniforms as unknown as Record<string, THREE.IUniform>,
        vertexShader: PARTICLE_VERT,
        fragmentShader: PARTICLE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms]
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame(({ clock }, delta) => {
    const vel = Math.min(Math.abs(live.scroll.velocity) * 0.08, 1.5)
    const p = live.scroll.progress

    uniforms.uTime.value = clock.elapsedTime
    uniforms.uPixelRatio.value = gl.getPixelRatio()
    uniforms.uVelocity.value = THREE.MathUtils.damp(uniforms.uVelocity.value, vel, 4, delta)
    uniforms.uScrollProgress.value = THREE.MathUtils.damp(
      uniforms.uScrollProgress.value,
      p,
      3,
      delta
    )

    // Explode at 1/6 and 5/6 of the journey, reassemble in between
    const explodeTarget = Math.pow(Math.max(0, Math.sin(p * Math.PI * 3)), 1.4)
    uniforms.uExplode.value = THREE.MathUtils.damp(
      uniforms.uExplode.value,
      explodeTarget,
      2.2,
      delta
    )

    const intro = THREE.MathUtils.clamp(live.intro, 0, 1)
    uniforms.uReveal.value = intro * intro * (3 - 2 * intro)

    uniforms.uMouse.value.x = THREE.MathUtils.damp(
      uniforms.uMouse.value.x,
      live.pointer.x * (viewport.aspect > 1 ? 1.2 : 0.8),
      3.5,
      delta
    )
    uniforms.uMouse.value.y = THREE.MathUtils.damp(
      uniforms.uMouse.value.y,
      -live.pointer.y,
      3.5,
      delta
    )

    if (points.current) {
      points.current.rotation.y += delta * 0.018
    }
  })

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
}
