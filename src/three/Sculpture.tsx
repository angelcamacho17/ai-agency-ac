import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import { buildTargets } from './targets'

/**
 * The sculpture: ~42k GPU particles (one draw call) morphing through the five
 * states of an agent as the page scrolls. The swarm of particles IS the brand
 * metaphor: many small workers reorganizing into whatever form the job needs.
 *
 * The vertex shader blends each particle between the two states around
 * `uJourney` (0..4) with a per-particle staggered back-out ease, a vortex
 * swirl mid-flight, and a breathing idle. Spark particles stay acid-lime in
 * every chapter (one locked accent) and are bright enough for bloom to catch.
 */

const VERTEX = /* glsl */ `
  attribute vec3 aT1;
  attribute vec3 aT2;
  attribute vec3 aT3;
  attribute vec3 aT4;
  attribute float aSeed;

  uniform float uTime;
  uniform float uJourney;
  uniform float uPx;
  uniform float uSizeBase;
  uniform vec3 uBase[5];
  uniform float uBright[5];
  uniform vec3 uSpark;

  varying vec3 vColor;

  void main() {
    float seg = clamp(floor(uJourney), 0.0, 3.0);
    float t = clamp(uJourney - seg, 0.0, 1.0);

    vec3 from = position;
    vec3 to = aT1;
    if (seg > 2.5)      { from = aT3; to = aT4; }
    else if (seg > 1.5) { from = aT2; to = aT3; }
    else if (seg > 0.5) { from = aT1; to = aT2; }

    // Staggered departure per particle, back-out ease with a little overshoot.
    float d = fract(aSeed * 61.17);
    float tt = clamp((t - d * 0.3) / 0.7, 0.0, 1.0);
    float u = tt - 1.0;
    float e = 1.0 + 2.35 * u * u * u + 1.35 * u * u;
    vec3 p = mix(from, to, e);

    // Vortex swirl mid-flight: strongest at the middle of the transition.
    float sw = sin(3.14159265 * tt);
    float ang = sw * (0.85 + d * 1.5);
    float ca = cos(ang);
    float sa = sin(ang);
    p = vec3(ca * p.x + sa * p.z, p.y + sw * (d - 0.5) * 1.1, -sa * p.x + ca * p.z);

    // Breathing idle, amplified while in transit so the swarm feels alive.
    vec3 dir = normalize(
      vec3(fract(aSeed * 13.7), fract(aSeed * 27.3), fract(aSeed * 39.1)) - 0.5 + 0.001
    );
    p += dir * (0.022 + sw * 0.16) * sin(uTime * (0.6 + d) + aSeed * 40.0);

    // Chapter color ramp; sparks stay acid in every state.
    int s0 = int(seg);
    int s1 = s0 + 1;
    float cm = smoothstep(0.15, 0.85, t);
    vec3 base = mix(uBase[s0], uBase[s1], cm) * (0.75 + 0.5 * fract(aSeed * 5.3));
    float bright = mix(uBright[s0], uBright[s1], cm);
    float spark = step(0.93, fract(aSeed * 7.31));
    float tw = 0.7 + 0.3 * sin(uTime * 2.2 + aSeed * 90.0);
    vColor = mix(base, uSpark * (1.25 + 0.75 * tw), spark) * bright;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float sz = uSizeBase
      * (0.6 + 0.9 * fract(aSeed * 3.7))
      * (1.0 + spark * 0.9)
      * (1.0 + sw * 0.7);
    gl_PointSize = max(sz * uPx * (4.6 / -mv.z), 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAGMENT = /* glsl */ `
  uniform float uDim;
  varying vec3 vColor;

  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float r = length(q);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.14, r);
    a += smoothstep(0.1, 0.0, r) * 0.35;
    a *= mix(0.62, 0.26, uDim);
    gl_FragColor = vec4(vColor, a);
  }
`

export function Sculpture({
  journey,
  dim,
}: {
  journey: MutableRefObject<number>
  dim: MutableRefObject<number>
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const { gl } = useThree()

  const { geometry, material } = useMemo(() => {
    const count = window.innerWidth < 768 ? 16000 : 42000
    const { targets, seeds } = buildTargets(count)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(targets[0], 3))
    geo.setAttribute('aT1', new THREE.BufferAttribute(targets[1], 3))
    geo.setAttribute('aT2', new THREE.BufferAttribute(targets[2], 3))
    geo.setAttribute('aT3', new THREE.BufferAttribute(targets[3], 3))
    geo.setAttribute('aT4', new THREE.BufferAttribute(targets[4], 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uJourney: { value: 0 },
        uDim: { value: 0 },
        uPx: { value: 1 },
        uSizeBase: { value: 2.2 },
        uSpark: { value: new THREE.Color('#d9ff3d') },
        uBase: {
          value: [
            new THREE.Color('#8f8a7c'), // raw stone
            new THREE.Color('#9aa3b8'), // carved core, cool marble
            new THREE.Color('#8f88c9'), // swarm, violet depth
            new THREE.Color('#a9b0ba'), // stream, steel
            new THREE.Color('#efeee2'), // the mark, chrome paper
          ],
        },
        uBright: { value: [0.85, 0.95, 1.0, 1.0, 1.35] },
      },
    })
    return { geometry: geo, material: mat }
  }, [])

  useEffect(() => {
    material.uniforms.uPx.value = gl.getPixelRatio()
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material, gl])

  useFrame((state, delta) => {
    const j = journey.current
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uJourney.value = j
    material.uniforms.uDim.value = dim.current

    const points = pointsRef.current
    if (!points) return

    // Centered stage; smaller on portrait so the form fits beside the copy.
    const portrait = state.size.width < 768
    const s = THREE.MathUtils.lerp(points.scale.x, portrait ? 0.68 : 1, 0.08)
    points.scale.setScalar(s)

    // Slow turntable that spins up while a transformation is playing, then
    // settles to face the camera as the "M" mark forms in the final chapter.
    const transit = Math.sin(Math.PI * (j - Math.floor(j)))
    const settle = THREE.MathUtils.smoothstep(j, 3.5, 3.95)
    points.rotation.y += delta * (0.11 + transit * 0.38) * (1 - settle)
    if (settle > 0) {
      const facing = Math.round(points.rotation.y / (Math.PI * 2)) * Math.PI * 2
      points.rotation.y = THREE.MathUtils.lerp(
        points.rotation.y,
        facing,
        settle * 0.06,
      )
    }
    points.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.06
  })

  return (
    <points ref={pointsRef} frustumCulled={false} geometry={geometry}>
      <primitive object={material} attach="material" />
    </points>
  )
}
