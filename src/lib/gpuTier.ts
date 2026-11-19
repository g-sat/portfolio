export type GpuTier = 'none' | 'lite' | 'full'

/** True when a WebGL context can actually be created on this device. */
function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    const gl =
      c.getContext('webgl2') ||
      c.getContext('webgl') ||
      c.getContext('experimental-webgl')
    if (!gl) return false
    ;(gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * Cheap capability probe, client only.
 *  none: no WebGL -> DOM-only experience
 *  lite: weak CPU / low memory / software renderer / reduced motion -> no post-processing, no particles, low dpr
 *  full: everything on
 */
export function detectGpuTier(): GpuTier {
  if (typeof document === 'undefined') return 'full'
  if (!hasWebGL()) return 'none'

  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 8
  const mem = nav.deviceMemory ?? 8
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let software = false
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl') as WebGLRenderingContext | null
    const ext = gl?.getExtension('WEBGL_debug_renderer_info')
    const name = ext ? String(gl!.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''
    software = /swiftshader|llvmpipe|software|basic render/i.test(name)
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    /* ignore */
  }

  if (software || reduced || cores <= 4 || mem <= 4 || coarse) return 'lite'
  return 'full'
}
