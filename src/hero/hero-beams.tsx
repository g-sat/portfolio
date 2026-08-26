'use client'

import dynamic from 'next/dynamic'

const Beams = dynamic(() => import('./background'), { ssr: false })

export default function HeroBeams() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <Beams
        beamWidth={1.2}
        beamHeight={15}
        beamNumber={20}
        lightColor="#bfbfbf"
        speed={2}
        noiseIntensity={5}
        scale={0.2}
        rotation={20}
      />
    </div>
  )
}
