'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { live } from '@/src/store/useExperienceStore'

const W = 2048
const H = 1024
const PLANE_Z = -2.6
const smooth = (t: number) => t * t * (3 - 2 * t)

function draw(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, W, H)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const family = '"Castoro Titling", "Times New Roman", serif'
  const fit = (text: string, target: number) => {
    ctx.font = `100px ${family}`
    const w = ctx.measureText(text).width
    return Math.floor((100 * target) / w)
  }

  // DESIGN — solid, vertical gradient white → acid green
  const f1 = fit('DESIGN', 1880)
  ctx.font = `${f1}px ${family}`
  const g = ctx.createLinearGradient(0, 120, 0, 120 + f1)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.55, '#d9ffe0')
  g.addColorStop(1, '#3dff6b')
  ctx.fillStyle = g
  ctx.fillText('DESIGN', W / 2, 290)

  // ENGINEER — outline with faint fill
  const f2 = fit('ENGINEER', 1880)
  ctx.font = `${f2}px ${family}`
  ctx.lineWidth = 5
  ctx.strokeStyle = 'rgba(255,255,255,0.95)'
  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  ctx.fillText('ENGINEER', W / 2, 720)
  ctx.strokeText('ENGINEER', W / 2, 720)
}

/** Giant editorial type living in 3D *behind* the bust — real depth, parallax, fog-free. */
export function TitleBackdrop() {
  const mesh = useRef<THREE.Mesh>(null)
  const viewport = useThree((s) => s.viewport)

  const { texture, material } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      fog: false,
      opacity: 0,
    })
    return { texture: tex, material: mat }
  }, [])

  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    let cancelled = false
    const render = () => {
      if (cancelled) return
      draw(ctx)
      texture.needsUpdate = true
    }
    render()
    // Redraw once the webfont lands
    document.fonts?.load('100px "Castoro Titling"').then(render).catch(() => {})
    return () => {
      cancelled = true
      texture.dispose()
      material.dispose()
    }
  }, [texture, material])

  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return

    const intro = smooth(THREE.MathUtils.clamp(live.intro, 0, 1))
    const p = live.scroll.progress
    const fade = 1 - smooth(THREE.MathUtils.clamp((p - 0.03) / 0.14, 0, 1))
    material.opacity = intro * fade * 0.95

    // Fit the plane to the frustum at its depth
    const dist = 9.2 - PLANE_Z
    const vh = 2 * dist * Math.tan((38 * Math.PI) / 360)
    const vw = vh * viewport.aspect
    const width = Math.min(vw * 0.98, vh * 2 * 0.92) * 0.72
    m.scale.set(width, width / 2, 1)

    // Parallax + scroll drift (damped)
    const baseX = viewport.aspect > 1.05 ? -vw * 0.07 : 0
    m.position.x = THREE.MathUtils.damp(m.position.x, baseX - live.pointer.x * 0.4, 3, delta)
    m.position.y = THREE.MathUtils.damp(m.position.y, vh * 0.19 - live.pointer.y * 0.2 + p * 14, 3, delta)
    m.position.z = PLANE_Z - (1 - intro) * 3
  })

  return (
    <mesh ref={mesh} position={[0, 1.05, PLANE_Z]} material={material} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}
