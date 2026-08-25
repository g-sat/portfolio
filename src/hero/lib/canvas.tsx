'use client'

import { Canvas as R3FCanvas } from '@react-three/fiber'
import type { CSSProperties, ReactNode } from 'react'

export type CanvasProps = {
  children?: ReactNode
  camera?: { position?: [number, number, number]; fov?: number }
  style?: CSSProperties
  className?: string
}

export default function Canvas({ children, camera, style, className }: CanvasProps) {
  return (
    <R3FCanvas
      className={className}
      camera={camera}
      style={style}
      gl={{ alpha: true }}
    >
      {children}
    </R3FCanvas>
  )
}
