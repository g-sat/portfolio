'use client'

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('./scene'), { ssr: false })

export default function SceneLoader() {
  return (
    <div className="h-full min-h-full w-full">
      <Scene />
    </div>
  )
}
