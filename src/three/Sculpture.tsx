import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * The sculpture: a form that starts as a rough chiseled block and refines into
 * a smooth sculpted bust as the page scrolls. "We sculpt AI agents."
 *
 * Implemented with a custom vertex shader that displaces an icosphere by 3D
 * simplex-ish value noise. Scroll progress (`progress`) drives:
 *  - uChisel  1 -> 0 : facet/blockiness amplitude (rough stone -> refined)
 *  - uRefine  0 -> 1 : higher-frequency micro-detail + smoothing
 *  - uMetal   0 -> 1 : material marble -> metallic AI sheen (set on material)
 * No geometry swap, no re-renders: uniforms updated in the frame loop.
 */
export function Sculpture({
  progress,
}: {
  progress: MutableRefObject<number>
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChisel: { value: 1 },
      uRefine: { value: 0 },
    }),
    [],
  )

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.35, 64), [])

  // Inject displacement into the standard material's vertex stage.
  const onBeforeCompile = useMemo(
    () => (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime = uniforms.uTime
      shader.uniforms.uChisel = uniforms.uChisel
      shader.uniforms.uRefine = uniforms.uRefine

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          /* glsl */ `
          #include <common>
          uniform float uTime;
          uniform float uChisel;
          uniform float uRefine;

          // hash + value noise
          vec3 hash3(vec3 p){
            p = vec3(dot(p,vec3(127.1,311.7,74.7)),
                     dot(p,vec3(269.5,183.3,246.1)),
                     dot(p,vec3(113.5,271.9,124.6)));
            return -1.0 + 2.0*fract(sin(p)*43758.5453123);
          }
          float vnoise(vec3 p){
            vec3 i = floor(p); vec3 f = fract(p);
            vec3 u = f*f*(3.0-2.0*f);
            float n = mix(mix(mix(dot(hash3(i+vec3(0,0,0)),f-vec3(0,0,0)),
                                  dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                              mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),
                                  dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
                          mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),
                                  dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                              mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),
                                  dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
            return n;
          }
          // fractal brownian motion
          float fbm(vec3 p){
            float a = 0.5; float s = 0.0;
            for(int i=0;i<4;i++){ s += a*vnoise(p); p*=2.02; a*=0.5; }
            return s;
          }
          `,
        )
        .replace(
          '#include <begin_vertex>',
          /* glsl */ `
          #include <begin_vertex>

          // Rough chiseled block: low-frequency, high-amplitude faceted noise,
          // quantized into chunky steps so it reads as hewn stone.
          float blocky = fbm(position * 1.6 + 12.3);
          blocky = floor(blocky * 5.0) / 5.0;            // chunky chisel steps
          float chiselDisp = blocky * 0.55 * uChisel;

          // Refined form: gentle low-frequency swell + fine breathing detail.
          float swell = fbm(position * 1.1 + uTime * 0.05);
          float micro = fbm(position * 4.0 - uTime * 0.08) * 0.06;
          float refineDisp = (swell * 0.22 + micro) * uRefine;

          float disp = chiselDisp + refineDisp;
          transformed += normalize(position) * disp;
          `,
        )
    },
    [uniforms],
  )

  useFrame((state, delta) => {
    const p = progress.current
    uniforms.uTime.value = state.clock.elapsedTime

    // Offset to the right + scale down on desktop so it sits in negative space
    // beside the left-aligned copy. On mobile (portrait) keep it centered and
    // smaller; the text columns sit above/around it there.
    if (meshRef.current) {
      const portrait = state.size.width < 768
      const targetX = portrait ? 0 : 1.7
      const targetScale = portrait ? 0.72 : 0.92
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetX,
        0.1,
      )
      const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
      meshRef.current.scale.setScalar(s)
    }

    // Chisel falls off early, refinement grows through the middle/late scroll.
    uniforms.uChisel.value = 1 - smoothstep(0.05, 0.62, p)
    uniforms.uRefine.value = smoothstep(0.25, 0.9, p)

    if (matRef.current) {
      const m = matRef.current
      // marble (rough, light) -> metallic AI sheen (smooth, dark, reflective)
      m.metalness = THREE.MathUtils.lerp(0.05, 0.92, smoothstep(0.2, 0.95, p))
      m.roughness = THREE.MathUtils.lerp(0.85, 0.18, smoothstep(0.2, 0.95, p))
      m.color.lerpColors(
        new THREE.Color('#8f8b7e'), // muted marble (dimmer so text reads over it)
        new THREE.Color('#23231d'), // dark metal body
        smoothstep(0.3, 0.95, p),
      )
      m.emissive.lerpColors(
        new THREE.Color('#000000'),
        new THREE.Color('#cde84a'), // acid rim glow as it "comes alive"
        smoothstep(0.55, 1, p),
      )
      m.emissiveIntensity = 0.35 * smoothstep(0.55, 1, p)
      m.flatShading = uniforms.uChisel.value > 0.35 // faceted while blocky
      m.needsUpdate = true
    }

    if (meshRef.current) {
      // Slow turntable so the form is read in the round; eases with scroll.
      meshRef.current.rotation.y += delta * (0.12 + p * 0.18)
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={matRef}
        color="#d8d4c8"
        roughness={0.85}
        metalness={0.05}
        flatShading
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  )
}
