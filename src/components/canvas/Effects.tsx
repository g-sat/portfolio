'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import { live } from '@/src/store/useExperienceStore'

/** Shared Vector2 mutated each frame (no React churn). */
const caOffset = new THREE.Vector2(0.0004, 0.0004)

type CAEffect = { offset: THREE.Vector2 }

export function Effects() {
  const ca = useRef<CAEffect | null>(null)
  const vel = useRef(0)

  useFrame((_, delta) => {
    // Chromatic aberration + DOF breathe with scroll velocity
    const target = Math.min(Math.abs(live.scroll.velocity) * 0.0004, 0.014)
    vel.current = THREE.MathUtils.damp(vel.current, target, 5, delta)

    caOffset.set(0.0004 + vel.current, 0.0004 + vel.current * 0.6)
    if (ca.current) ca.current.offset.copy(caOffset)
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur luminanceThreshold={1.0} luminanceSmoothing={0.2} intensity={0.3} />
      <ChromaticAberration
        ref={ca as never}
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise opacity={0.03} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={0.15} darkness={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
