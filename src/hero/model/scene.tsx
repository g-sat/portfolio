'use client'

import { Suspense } from 'react'
import { Center } from '@react-three/drei'
import Canvas from '@/src/hero/lib/canvas'
import { Model } from './model'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      className="bg-transparent"
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        <Center>
          <Model scale={0.017} />
        </Center>
      </Suspense>
    </Canvas>
  )
}
