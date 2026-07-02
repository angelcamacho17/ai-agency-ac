import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import { Sculpture } from './Sculpture'
import type { JourneyRefs } from './journey'

/** Per-chapter camera distance: each state gets its own framing. */
const CHAPTER_Z = [5.0, 5.5, 6.3, 5.8, 6.1]

function Rig({ journey }: { journey: MutableRefObject<number> }) {
  const { camera, pointer, size } = useThree()
  const target = new THREE.Vector3()
  useFrame(() => {
    const j = journey.current
    const i = Math.min(3, Math.floor(j))
    const z = THREE.MathUtils.lerp(CHAPTER_Z[i], CHAPTER_Z[i + 1], j - i)
    const portrait = size.width < 768
    target.set(
      pointer.x * 0.45,
      pointer.y * 0.3,
      z + (portrait ? 0.9 : 0),
    )
    camera.position.lerp(target, 0.06)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/**
 * Fixed WebGL layer holding the morphing particle sculpture, centered like
 * animejs.com's hero object. Sits behind all DOM, pointer-events-none so the
 * page scrolls normally. Reads the shared journey refs every frame.
 */
export function SculptureCanvas({ journey, dim }: JourneyRefs) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, reduce ? 1 : 1.8]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        frameloop={reduce ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <Rig journey={journey} />
          <Sculpture journey={journey} dim={dim} />
          {!reduce && (
            <EffectComposer>
              <Bloom
                intensity={0.65}
                luminanceThreshold={0.5}
                luminanceSmoothing={0.8}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.2} darkness={0.85} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
