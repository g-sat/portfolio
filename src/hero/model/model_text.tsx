'use client'

import type { JSX } from 'react'
import { Text } from '@react-three/drei'

export function ModelText(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props}>
      <Text
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="bottom"
        position={[0, 0, 0]}
      >
        Hello There!
      </Text>
    </group>
  )
}
