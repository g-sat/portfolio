'use client'

import { Suspense, useEffect, useState } from 'react'
import { Center } from '@react-three/drei'
import Canvas from '@/src/hero/lib/canvas'
import { Model } from './model'

function useModelScale() {
  const [scale, setScale] = useState(0.012)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      if (width >= 1024) setScale(0.017)
      else if (width >= 640) setScale(0.014)
      else setScale(0.011)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return scale
}

export default function Scene() {
  const scale = useModelScale()

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
          <Model scale={scale} />
        </Center>
      </Suspense>
    </Canvas>
  )
}
