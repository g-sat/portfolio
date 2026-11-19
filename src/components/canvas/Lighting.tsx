'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { live } from '@/src/store/useExperienceStore'

/** Scroll-driven mood: neon → acid → ice → neon */
const MOODS = ['#1de81d', '#fff947', '#7dffe9', '#1de81d'].map(
  (c) => new THREE.Color(c)
)

function sampleMood(progress: number, out: THREE.Color) {
  const f = THREE.MathUtils.clamp(progress, 0, 1) * (MOODS.length - 1)
  const i = Math.min(Math.floor(f), MOODS.length - 2)
  return out.lerpColors(MOODS[i], MOODS[i + 1], f - i)
}

export function Lighting() {
  const scene = useThree((s) => s.scene)
  const key = useRef<THREE.DirectionalLight>(null)
  const rim = useRef<THREE.DirectionalLight>(null)
  const cursorLight = useRef<THREE.PointLight>(null)
  const mood = useMemo(() => new THREE.Color(), [])

  useFrame((_, delta) => {
    const p = live.scroll.progress
    sampleMood(p, mood)

    if (rim.current) rim.current.color.lerp(mood, 1 - Math.exp(-3 * delta))
    if (cursorLight.current) {
      cursorLight.current.color.lerp(mood, 1 - Math.exp(-3 * delta))
      cursorLight.current.position.x = THREE.MathUtils.damp(
        cursorLight.current.position.x,
        live.pointer.x * 4,
        4,
        delta
      )
      cursorLight.current.position.y = THREE.MathUtils.damp(
        cursorLight.current.position.y,
        -live.pointer.y * 3,
        4,
        delta
      )
    }
    if (key.current) {
      key.current.intensity = THREE.MathUtils.damp(
        key.current.intensity,
        1.1 + Math.sin(p * Math.PI) * 0.8,
        2,
        delta
      )
    }

    scene.environmentIntensity = THREE.MathUtils.damp(
      scene.environmentIntensity,
      0.75 + Math.sin(p * Math.PI * 2) * 0.2,
      2,
      delta
    )
  })

  return (
    <>
      {/* Procedural studio: softboxes + neon strips (no network HDRI) */}
      <Environment resolution={512} frames={1} background={false}>
        <Lightformer
          form="rect"
          intensity={5}
          position={[-4, 4, -6]}
          scale={[10, 6, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={14}
          position={[7, 0.5, -3]}
          rotation-y={-Math.PI / 2.4}
          scale={[1.2, 9, 1]}
          color="#1de81d"
        />
        <Lightformer
          form="rect"
          intensity={10}
          position={[-7, -1, -2]}
          rotation-y={Math.PI / 2.4}
          scale={[1, 7, 1]}
          color="#fff947"
        />
        <Lightformer
          form="ring"
          intensity={3}
          position={[0, 6, 2]}
          rotation-x={Math.PI / 2}
          scale={5}
          color="#d8fff0"
        />
        <Lightformer
          form="circle"
          intensity={2}
          position={[0, -5, 3]}
          rotation-x={-Math.PI / 2}
          scale={8}
          color="#2a2a2a"
        />
      </Environment>

      <directionalLight ref={key} position={[4, 5, 6]} intensity={1.2} color="#ffffff" />
      <directionalLight ref={rim} position={[-6, 2, -4]} intensity={2.4} color="#1de81d" />
      <pointLight
        ref={cursorLight}
        position={[0, 0, 3.2]}
        intensity={22}
        distance={9}
        decay={2}
        color="#1de81d"
      />
    </>
  )
}
