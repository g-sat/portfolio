'use client'

import { useMemo } from 'react'
import type { JSX } from 'react'
import { useGLTF } from '@react-three/drei'

const MODEL_PATH = '/models/generic_roman_bust/scene.gltf'

export function Model(props: JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF(MODEL_PATH)
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  return (
    <group {...props} dispose={null}>
      <primitive object={clonedScene} dispose={null} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
