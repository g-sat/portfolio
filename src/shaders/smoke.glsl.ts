import * as THREE from 'three'

/**
 * GPU smoke plume. Every particle is a pure function of (uTime, aRand):
 * the CPU never touches positions. Emitter-local space, +Z == emission normal
 * (the Points mesh is oriented to the eye normal).
 */
export const SMOKE_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uReveal;
  uniform float uFlicker;
  uniform vec3 uNormal;
  attribute vec4 aRand;
  varying float vAlpha;
  varying float vAge;

  void main() {
    float speed = 0.14 + aRand.x * 0.16;
    float age = fract(uTime * speed + aRand.y);

    // Short push along the face normal, then it rises and curls as it cools.
    vec3 curl = vec3(
      sin(aRand.z * 6.2831 + uTime * 0.7 + age * 4.0),
      0.0,
      cos(aRand.w * 6.2831 + uTime * 0.55 + age * 3.0)
    ) * 0.16 * age;
    vec3 p = uNormal * (0.04 + age * 0.35) + vec3(0.0, age * 0.25 + age * age * 1.15, 0.0) + curl;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = mix(0.04, 0.55, pow(age, 0.9)) * (0.55 + aRand.w * 0.9);
    gl_PointSize = size * uScale / max(-mv.z, 0.1);

    vAlpha = smoothstep(0.08, 0.4, age) * pow(1.0 - age, 1.3) * uReveal * uFlicker;
    vAge = age;
  }
`

export const SMOKE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vAge;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    vec3 hot = uColor * 1.15;
    vec3 cool = vec3(0.02, 0.2, 0.07);
    vec3 col = mix(hot, cool, smoothstep(0.0, 0.8, vAge));
    gl_FragColor = vec4(col, a * vAlpha * 0.32);
  }
`

export function createSmokeUniforms() {
  return {
    uTime: { value: 0 },
    uScale: { value: 1000 },
    uReveal: { value: 0 },
    uFlicker: { value: 1 },
    uColor: { value: new THREE.Color('#2dff5e') },
  }
}

/** Glow halo shader for the eye sprites (additive radial falloff). */
export const GLOW_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const GLOW_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5)) * 2.0;
    float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.4);
    gl_FragColor = vec4(uColor * a * uIntensity, a * uIntensity);
  }
`
