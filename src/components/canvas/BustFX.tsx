'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  GLOW_FRAG,
  GLOW_VERT,
  SMOKE_FRAG,
  SMOKE_VERT,
  createSmokeUniforms,
} from '@/src/shaders/smoke.glsl'
import { live } from '@/src/store/useExperienceStore'

export type Eye = { pos: THREE.Vector3; normal: THREE.Vector3; side: -1 | 1 }

/** Flip to true to bring back the glowing eyes + smoke (placement lives in HeroBust.tsx). */
const SHOW_EYES = false
const SMOKE_PER_EYE = 70
const GREEN = new THREE.Color('#2dff5e')
const Z = new THREE.Vector3(0, 0, 1)

const smooth = (t: number) => t * t * (3 - 2 * t)

function EyeSmoke({ eye, uniforms }: { eye: Eye; uniforms: ReturnType<typeof createSmokeUniforms> }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const rand = new Float32Array(SMOKE_PER_EYE * 4)
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SMOKE_PER_EYE * 3), 3))
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 4))
    return geo
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { ...(uniforms as unknown as Record<string, THREE.IUniform>), uNormal: { value: eye.normal } },
        vertexShader: SMOKE_VERT,
        fragmentShader: SMOKE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms, eye.normal]
  )

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  return (
    <points
      geometry={geometry}
      material={material}
      position={eye.pos}
      frustumCulled={false}
    />
  )
}

/** Glowing green eyes + halo ring + eye-smoke. Lives inside the bust root group. */
export function BustFX({ eyes, center }: { eyes: Eye[]; center: THREE.Vector3 }) {
  const gl = useThree((s) => s.gl)
  const light = useRef<THREE.PointLight>(null)
  const ring = useRef<THREE.Mesh>(null)
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)

  const smokeUniforms = useMemo(() => createSmokeUniforms(), [])

  const eyeMat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({ toneMapped: false })
    m.color.setRGB(0.04, 1.0, 0.14)
    return m
  }, [])

  const glowUniforms = useMemo(
    () => ({ uColor: { value: GREEN.clone() }, uIntensity: { value: 1 } }),
    []
  )
  const glowMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: glowUniforms,
        vertexShader: GLOW_VERT,
        fragmentShader: GLOW_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [glowUniforms]
  )

  const eyeQuats = useMemo(
    () =>
      eyes.map((e) => {
        const q = new THREE.Quaternion().setFromUnitVectors(Z, e.normal)
        // almond slant: outer corners rise
        const slant = new THREE.Quaternion().setFromAxisAngle(Z, e.side * 0.32)
        return q.multiply(slant)
      }),
    [eyes]
  )
  const glowQuats = useMemo(
    () => eyes.map((e) => new THREE.Quaternion().setFromUnitVectors(Z, e.normal)),
    [eyes]
  )

  useEffect(() => () => {
    eyeMat.dispose()
    glowMat.dispose()
  }, [eyeMat, glowMat])

  useFrame(({ clock, camera }, delta) => {
    const t = clock.elapsedTime
    const reveal = smooth(THREE.MathUtils.clamp((live.intro - 0.35) / 0.65, 0, 1))
    const flick =
      0.88 + Math.sin(t * 6.3) * 0.06 + Math.sin(t * 13.1 + 1.7) * 0.04 + Math.sin(t * 2.1) * 0.05

    const fov = (camera as THREE.PerspectiveCamera).fov
    smokeUniforms.uTime.value = t
    smokeUniforms.uScale.value = gl.domElement.height / (2 * Math.tan((fov * Math.PI) / 360))
    smokeUniforms.uReveal.value = reveal
    smokeUniforms.uFlicker.value = flick

    glowUniforms.uIntensity.value = reveal * flick * 0.3
    eyeMat.color.setRGB(0.04 * flick, 1.0 * flick * reveal, 0.14 * flick)
    if (light.current) light.current.intensity = reveal * flick * 0.4

    if (ring.current) {
      ring.current.rotation.z += delta * 0.22
    }
    if (ringMat.current) {
      ringMat.current.color.setRGB(0.3, 2.6 * reveal, 0.6)
    }
  })

  return (
    <>
      {SHOW_EYES && eyes.map((e, i) => (
        <group key={i}>
          <mesh position={e.pos} quaternion={eyeQuats[i]} scale={[0.075, 0.028, 0.03]} material={eyeMat}>
            <sphereGeometry args={[1, 24, 16]} />
          </mesh>
          <EyeSmoke eye={e} uniforms={smokeUniforms} />
        </group>
      ))}

      {SHOW_EYES && (
      <pointLight
        ref={light}
        position={[center.x, center.y, center.z + 1.1]}
        color="#2dff5e"
        distance={5}
        decay={2}
        intensity={0}
      />
      )}

      {/* Halo ring tilted around the head */}
      <group position={[center.x, center.y + 0.05, center.z - 0.1]} rotation={[1.15, 0.0, 0.35]}>
        <mesh ref={ring}>
          <torusGeometry args={[1.55, 0.014, 12, 220]} />
          <meshBasicMaterial ref={ringMat} toneMapped={false} />
        </mesh>
      </group>
    </>
  )
}
