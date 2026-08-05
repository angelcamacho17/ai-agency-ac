import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import { buildTargets, loadMarkTarget } from './targets'
import { CHAPTER_LANE, CHAPTER_LIFT, CHAPTER_SCALE } from './choreography'

/**
 * The sculpture: ~42k GPU particles (one draw call) morphing through the five
 * states of an agent as the page scrolls. The swarm of particles IS the brand
 * metaphor: many small workers reorganizing into whatever form the job needs.
 *
 * In the hero chapter the statue is alive: a mask around the neck pivot lets
 * the head rotate toward the cursor (uHeadYaw/uHeadPitch), the hands ripple
 * over the keyboard in a typing cadence, and the screen slab glows acid; all
 * three are weighted by uHero so they dissolve as the first morph begins.
 * The body holds a three-quarter rest pose instead of the turntable.
 *
 * On desktop the object also rides a horizontal lane per chapter (opposite
 * the copy column) and glides across the open morph stages, banking gently
 * into the direction of travel; nothing ever renders above it. On stacked
 * layouts it stays centered and the copy dims it instead.
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
  uniform float uHero;
  uniform float uHeadYaw;
  uniform float uHeadPitch;

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

    // The living statue (hero chapter only). Masks are computed from the
    // statue's base positions (the state-0 target), so they follow the same
    // particles wherever the morph carries them, fading with uHero.
    float headM = 0.0;
    if (uHero > 0.001) {
      // Head + wreath rotate around the neck pivot toward the cursor.
      headM = (1.0 - smoothstep(0.34, 0.58, distance(position, vec3(0.0, 0.58, 0.08)))) * uHero;
      if (headM > 0.001) {
        vec3 pivot = vec3(0.0, 0.34, 0.05);
        vec3 hp = p - pivot;
        float cy = cos(uHeadYaw);
        float sy = sin(uHeadYaw);
        hp = vec3(cy * hp.x + sy * hp.z, hp.y, -sy * hp.x + cy * hp.z);
        float cx = cos(uHeadPitch);
        float sx = sin(uHeadPitch);
        hp = vec3(hp.x, cx * hp.y - sx * hp.z, sx * hp.y + cx * hp.z);
        p = mix(p, hp + pivot, headM);
      }

      // Hands keep coding: alternating key-press ripple, per-particle phase.
      float typeL = 1.0 - smoothstep(0.13, 0.3, distance(position, vec3(-0.22, -0.52, 0.62)));
      float typeR = 1.0 - smoothstep(0.13, 0.3, distance(position, vec3(0.22, -0.52, 0.62)));
      p.y -= (0.5 + 0.5 * sin(uTime * 8.0 + aSeed * 30.0)) * 0.045 * typeL * uHero;
      p.y -= (0.5 + 0.5 * sin(uTime * 8.0 + 2.4 + aSeed * 30.0)) * 0.045 * typeR * uHero;
    }

    // Chapter color ramp; sparks stay acid in every state.
    int s0 = int(seg);
    int s1 = s0 + 1;
    float cm = smoothstep(0.15, 0.85, t);
    vec3 base = mix(uBase[s0], uBase[s1], cm) * (0.75 + 0.5 * fract(aSeed * 5.3));
    float bright = mix(uBright[s0], uBright[s1], cm);
    float spark = step(0.93, fract(aSeed * 7.31));
    float tw = 0.7 + 0.3 * sin(uTime * 2.2 + aSeed * 90.0);
    vColor = mix(base, uSpark * (1.25 + 0.75 * tw), spark) * bright;

    // The statue's screen glows acid while he codes (hero chapter only).
    if (uHero > 0.001) {
      float screenM = (1.0 - smoothstep(0.06, 0.16, abs(position.z - 1.06)))
        * (1.0 - smoothstep(0.42, 0.52, abs(position.x)))
        * (1.0 - smoothstep(0.28, 0.38, abs(position.y - 0.12)));
      float flicker = 0.85 + 0.15 * sin(uTime * 3.7 + sin(uTime * 9.3) * 0.8);
      vColor = mix(vColor, uSpark * 0.95 * flicker, screenM * uHero * 0.7);
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float sz = uSizeBase
      * (0.6 + 0.9 * fract(aSeed * 3.7))
      * (1.0 + spark * 0.9)
      * (1.0 + sw * 0.7);
    gl_PointSize = max(sz * uPx * (4.6 / -mv.z), 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

/** The sculptor's three-quarter rest pose (radians around Y). */
const REST_YAW = -0.5

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
  const liftY = useRef(0)
  const { gl, invalidate } = useThree()

  const { geometry, material, count } = useMemo(() => {
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
        uHero: { value: 1 },
        uHeadYaw: { value: 0 },
        uHeadPitch: { value: 0 },
        uSpark: { value: new THREE.Color('#d9ff3d') },
        uBase: {
          value: [
            new THREE.Color('#a89f8e'), // the sculptor, warm marble
            new THREE.Color('#9aa3b8'), // the mind, cool marble
            new THREE.Color('#8f88c9'), // the network, violet depth
            new THREE.Color('#a9b0ba'), // the ascent, steel
            new THREE.Color('#efeee2'), // the mark, chrome paper
          ],
        },
        uBright: { value: [0.9, 0.95, 1.0, 1.0, 1.35] },
      },
    })
    return { geometry: geo, material: mat, count }
  }, [])

  useEffect(() => {
    material.uniforms.uPx.value = gl.getPixelRatio()
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material, gl])

  // Swap the sampled logo "m." into the final-state buffer once it decodes.
  useEffect(() => {
    let alive = true
    loadMarkTarget(count)
      .then((mark) => {
        if (!alive) return
        const attr = geometry.getAttribute('aT4') as THREE.BufferAttribute
        ;(attr.array as Float32Array).set(mark)
        attr.needsUpdate = true
        invalidate()
      })
      .catch(() => {
        // Sampling failed: the mark stays as the stream shape, page still works.
      })
    return () => {
      alive = false
    }
  }, [geometry, count, invalidate])

  useFrame((state, delta) => {
    const j = journey.current
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uJourney.value = j
    material.uniforms.uDim.value = dim.current

    const points = pointsRef.current
    if (!points) return

    // The statue is alive while the hero chapter holds; the effect dissolves
    // early in the first morph flight.
    const heroHold = 1 - THREE.MathUtils.smoothstep(j, 0.05, 0.55)
    material.uniforms.uHero.value = heroHold

    // Face follows the cursor: yaw compensates the body's rest rotation so
    // the gaze lands where the pointer is, eased for a slow, stony turn.
    const yawT = THREE.MathUtils.clamp(
      state.pointer.x * 0.55 - points.rotation.y,
      -0.7,
      0.7,
    )
    const pitchT = THREE.MathUtils.clamp(-state.pointer.y * 0.3, -0.3, 0.35)
    const uYaw = material.uniforms.uHeadYaw
    const uPitch = material.uniforms.uHeadPitch
    uYaw.value += (yawT - uYaw.value) * 0.055
    uPitch.value += (pitchT - uPitch.value) * 0.055

    // Lane choreography: chapter fraction is eased so the object glides
    // between lanes with grace exactly while a morph gap is on stage.
    const i = Math.min(3, Math.floor(j))
    const t = THREE.MathUtils.smootherstep(j - i, 0, 1)
    const stacked = state.size.width < 1024
    const cam = state.camera as THREE.PerspectiveCamera
    const halfH =
      Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z
    const halfW = halfH * (state.size.width / state.size.height)

    const lane = stacked
      ? 0
      : THREE.MathUtils.lerp(CHAPTER_LANE[i], CHAPTER_LANE[i + 1], t)
    // Lift applies on every layout: the final "m." must clear the closing
    // copy, which anchors to the bottom of the last viewport.
    const lift = THREE.MathUtils.lerp(CHAPTER_LIFT[i], CHAPTER_LIFT[i + 1], t)
    // Stacked layouts run smaller; the wide "m." shrinks a touch more as it
    // forms so the full wordmark fits inside a phone viewport.
    const markT = THREE.MathUtils.smoothstep(j, 3, 4)
    const scale = stacked
      ? THREE.MathUtils.lerp(0.62, 0.5, markT)
      : THREE.MathUtils.lerp(CHAPTER_SCALE[i], CHAPTER_SCALE[i + 1], t)

    points.scale.setScalar(THREE.MathUtils.lerp(points.scale.x, scale, 0.08))

    const dx = (lane * halfW - points.position.x) * 0.07
    points.position.x += dx
    liftY.current += (lift * halfH - liftY.current) * 0.07
    points.position.y =
      liftY.current + Math.sin(state.clock.elapsedTime * 0.5) * 0.06

    // Gentle banking into the direction of travel, easing flat at rest.
    const bank = THREE.MathUtils.clamp(-dx * 1.6, -0.09, 0.09)
    points.rotation.z = THREE.MathUtils.lerp(points.rotation.z, bank, 0.1)

    // Slow turntable that spins up while a transformation is playing. It is
    // suppressed at both ends of the journey: the sculptor holds a
    // three-quarter working pose in the hero, and the brand "m." settles to
    // face the camera in the final chapter.
    const transit = Math.sin(Math.PI * (j - Math.floor(j)))
    const settle = THREE.MathUtils.smoothstep(j, 3.5, 3.95)
    points.rotation.y +=
      delta * (0.11 + transit * 0.38) * (1 - settle) * (1 - heroHold)
    if (heroHold > 0) {
      // Nearest equivalent angle so returning from below never spins the long way.
      const rest =
        REST_YAW +
        Math.round((points.rotation.y - REST_YAW) / (Math.PI * 2)) * Math.PI * 2
      points.rotation.y = THREE.MathUtils.lerp(
        points.rotation.y,
        rest,
        heroHold * 0.07,
      )
    }
    if (settle > 0) {
      const facing = Math.round(points.rotation.y / (Math.PI * 2)) * Math.PI * 2
      points.rotation.y = THREE.MathUtils.lerp(
        points.rotation.y,
        facing,
        settle * 0.06,
      )
    }
  })

  return (
    <points ref={pointsRef} frustumCulled={false} geometry={geometry}>
      <primitive object={material} attach="material" />
    </points>
  )
}
