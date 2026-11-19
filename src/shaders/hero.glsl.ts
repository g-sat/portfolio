import * as THREE from 'three'
import { SIMPLEX_NOISE_3D } from '@/src/shaders/noise.glsl'

export type HeroUniforms = {
  uTime: { value: number }
  uMouse: { value: THREE.Vector3 }
  uScrollProgress: { value: number }
  uVelocity: { value: number }
  uReveal: { value: number }
}

export function createHeroUniforms(): HeroUniforms {
  return {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 1) },
    uScrollProgress: { value: 0 },
    uVelocity: { value: 0 },
    uReveal: { value: 0 },
  }
}

/** Vertex: simplex liquid displacement + cursor distortion field + analytic normals. */
const VERT_HEAD = /* glsl */ `
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uScrollProgress;
  uniform float uVelocity;
  uniform float uReveal;
  varying float vDisp;

  ${SIMPLEX_NOISE_3D}

  vec3 hDisplace(vec3 p) {
    vec3 n = normalize(p);
    float r = length(p);
    float t = uTime * 0.16;

    float amp = 0.17 + uScrollProgress * 0.2 + uVelocity * 0.28;
    float d = hSnoise(n * 1.35 + vec3(t, 0.0, t * 0.6)) * amp;
    d += hSnoise(n * 3.1 - vec3(0.0, t * 1.3, t)) * amp * 0.38;
    d += hSnoise(n * 7.2 + t * 1.8) * amp * 0.1;

    // Cursor-following distortion field (angular falloff on the unit sphere)
    vec3 m = normalize(uMouse);
    float md = distance(n, m);
    float field = smoothstep(1.0, 0.0, md);
    d += field * field * 0.34;
    d -= smoothstep(0.35, 0.0, md) * 0.08;

    return n * (r * mix(0.2, 1.0, uReveal) + d * uReveal);
  }

  vec3 hNormal(vec3 p) {
    vec3 n = normalize(p);
    vec3 up = abs(n.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 t = normalize(cross(up, n));
    vec3 b = normalize(cross(n, t));
    float e = 0.018;
    float r = length(p);
    vec3 d0 = hDisplace(p);
    vec3 d1 = hDisplace(normalize(n + t * e) * r);
    vec3 d2 = hDisplace(normalize(n + b * e) * r);
    vec3 nn = normalize(cross(d1 - d0, d2 - d0));
    return dot(nn, n) < 0.0 ? -nn : nn;
  }
`

/** Fragment: Fresnel rim lighting driven by displacement + scroll velocity. */
const FRAG_HEAD = /* glsl */ `
  uniform float uVelocity;
  uniform float uScrollProgress;
  varying float vDisp;
`

const FRAG_RIM = /* glsl */ `
  {
    float fres = pow(1.0 - saturate(dot(normalize(normal), normalize(vViewPosition))), 3.2);
    vec3 neon = vec3(0.11, 0.91, 0.11);
    vec3 acid = vec3(1.0, 0.97, 0.28);
    vec3 ice = vec3(0.45, 1.0, 0.9);
    vec3 rim = mix(neon, acid, smoothstep(-0.05, 0.28, vDisp));
    rim = mix(rim, ice, smoothstep(0.55, 1.0, uScrollProgress));
    outgoingLight += rim * fres * (1.9 + uVelocity * 2.2);
  }
  #include <opaque_fragment>
`

export function createHeroMaterial() {
  const uniforms = createHeroUniforms()

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'),
    metalness: 0.0,
    roughness: 0.035,
    transmission: 1,
    thickness: 1.8,
    ior: 1.42,
    dispersion: 0.6,
    iridescence: 1,
    iridescenceIOR: 1.4,
    iridescenceThicknessRange: [140, 560],
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    attenuationColor: new THREE.Color('#1de81d'),
    attenuationDistance: 2.4,
    envMapIntensity: 1.6,
  })

  material.customProgramCacheKey = () => 'hero-liquid-glass-v1'

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERT_HEAD}`)
      .replace(
        '#include <beginnormal_vertex>',
        `#include <beginnormal_vertex>
         objectNormal = hNormal(position);`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         transformed = hDisplace(position);
         vDisp = length(transformed) - length(position);`
      )

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAG_HEAD}`)
      .replace('#include <opaque_fragment>', FRAG_RIM)
  }

  return { material, uniforms }
}
