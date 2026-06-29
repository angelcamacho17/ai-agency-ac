import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import { Sculpture } from './Sculpture'

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Camera eases in and arcs slightly as the sculpture is revealed. */
function Rig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera, pointer, size } = useThree()
  const target = new THREE.Vector3()
  useFrame(() => {
    const p = progress.current
    const portrait = size.width < 768
    const z = THREE.MathUtils.lerp(portrait ? 5.6 : 4.6, portrait ? 6.4 : 5.4, smoothstep(0, 1, p))
    const px = pointer.x * 0.5
    const py = pointer.y * 0.35
    target.set(px, py - p * 0.3, z)
    camera.position.lerp(target, 0.06)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/**
 * Fixed WebGL layer holding the morphing sculpture. Sits behind all DOM,
 * pointer-events-none so the page scrolls normally. The object reads the
 * shared scroll-progress ref and transforms continuously as the user scrolls.
 */
export function SculptureCanvas({
  progress,
}: {
  progress: MutableRefObject<number>
}) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 42 }}
        dpr={[1, reduce ? 1 : 1.8]}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        frameloop={reduce ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[4, 6, 5]} intensity={1.3} color="#fff7e6" />
          <directionalLight position={[-5, -2, -3]} intensity={0.9} color="#7b5cff" />
          <pointLight position={[0, 2, 4]} intensity={4} color="#cde84a" distance={14} />

          <Rig progress={progress} />

          <Float speed={1} rotationIntensity={0.18} floatIntensity={0.35}>
            <Sculpture progress={progress} />
          </Float>

          <Environment preset="studio" environmentIntensity={0.6} />

          {!reduce && (
            <EffectComposer>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.55}
                luminanceSmoothing={0.85}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.2} darkness={0.9} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
