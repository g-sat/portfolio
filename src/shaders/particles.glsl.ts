import * as THREE from 'three'
import { SIMPLEX_NOISE_3D } from '@/src/shaders/noise.glsl'

export const PARTICLE_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uExplode;
  uniform float uVelocity;
  uniform float uScrollProgress;
  uniform float uPixelRatio;
  uniform float uReveal;
  uniform vec3 uMouse;

  attribute vec4 aRand;

  varying float vAlpha;
  varying vec3 vColor;

  ${SIMPLEX_NOISE_3D}

  void main() {
    vec3 p = position;
    float t = uTime * 0.07;

    // Flow field
    vec3 flow = vec3(
      hSnoise(p * 0.28 + vec3(t, 0.0, 0.0)),
      hSnoise(p * 0.28 + vec3(0.0, t, 7.1)),
      hSnoise(p * 0.28 + vec3(3.3, 1.7, t))
    );
    p += flow * (0.45 + uVelocity * 1.4);

    // Explode / reassemble with scroll
    p += normalize(position) * uExplode * (1.5 + aRand.x * 7.0);
    p *= mix(0.15, 1.0, uReveal);

    // Cursor repulsion
    vec2 dm = p.xy - uMouse.xy * 2.6;
    float md = length(dm);
    float push = smoothstep(2.0, 0.0, md);
    p.xy += normalize(dm + 1e-4) * push * 0.95;
    p.z += push * 0.7;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = (0.6 + aRand.w * 2.2) * (1.0 + uVelocity * 1.6);
    gl_PointSize = size * uPixelRatio * (14.0 / -mv.z);

    vAlpha = (0.25 + 0.75 * aRand.y) * uReveal * (1.0 - uExplode * 0.35);
    vec3 col = mix(vec3(0.11, 0.91, 0.11), vec3(1.0, 0.97, 0.28), step(0.72, aRand.z));
    col = mix(col, vec3(1.0), step(0.93, aRand.z));
    vColor = col;
  }
`

export const PARTICLE_FRAG = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor * (1.0 + a * 1.8), a * vAlpha);
  }
`

export type ParticleUniforms = {
  uTime: { value: number }
  uExplode: { value: number }
  uVelocity: { value: number }
  uScrollProgress: { value: number }
  uPixelRatio: { value: number }
  uReveal: { value: number }
  uMouse: { value: THREE.Vector3 }
}

export function createParticleUniforms(): ParticleUniforms {
  return {
    uTime: { value: 0 },
    uExplode: { value: 0 },
    uVelocity: { value: 0 },
    uScrollProgress: { value: 0 },
    uPixelRatio: { value: 1 },
    uReveal: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
  }
}
