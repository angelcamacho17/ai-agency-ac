import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import logoUrl from '../assets/m-logo.png'

/**
 * The five states of the agent sculpture, sampled as point clouds so a single
 * particle system can morph between them on scroll. Each state is the literal
 * meaning of its chapter:
 *
 *  0 THE SCULPTOR  Roman statue seated at a desk, coding: laurel wreath,
 *                  keyboard, glowing screen. Its head tracks the cursor and
 *                  its hands type (both driven in the vertex shader via
 *                  masks over these base positions).
 *  1 THE MIND      classical bust + orbital scan rings (anatomy of an agent)
 *  2 THE NETWORK   nucleus wired to six satellites     (every channel, one brain)
 *  3 THE ASCENT    rising helix with four milestones   (kickoff to live, day by day)
 *  4 THE MARK      the brand "m." wordmark, sampled from m-logo.png
 *
 * Every target has exactly `count` points so they map 1:1 onto the same
 * particle buffer. States 0-3 are sampled uniformly over surface area via
 * MeshSurfaceSampler; state 4 is rejection-sampled from the logo's ink pixels
 * (async image decode, see loadMarkTarget).
 *
 * NOTE: the shader masks in Sculpture.tsx reference exact statue coordinates
 * (head center, neck pivot, hand rests, screen slab). If you move those parts
 * here, move the masks too.
 */

/* ---------------------------------------------------------------- noise -- */

const fract = (v: number) => v - Math.floor(v)
const hash3 = (x: number, y: number, z: number) =>
  fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123)

/** Trilinear value noise, output roughly in [-1, 1]. */
function vnoise(x: number, y: number, z: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = x - ix
  const fy = y - iy
  const fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const uz = fz * fz * (3 - 2 * fz)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const c = (dx: number, dy: number, dz: number) =>
    hash3(ix + dx, iy + dy, iz + dz) * 2 - 1
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), ux), lerp(c(0, 1, 0), c(1, 1, 0), ux), uy),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), ux), lerp(c(0, 1, 1), c(1, 1, 1), ux), uy),
    uz,
  )
}

function fbm(x: number, y: number, z: number): number {
  let amp = 0.5
  let sum = 0
  let fx = x
  let fy = y
  let fz = z
  for (let i = 0; i < 3; i++) {
    sum += amp * vnoise(fx, fy, fz)
    fx *= 2.03
    fy *= 2.03
    fz *= 2.03
    amp *= 0.5
  }
  return sum
}

/* -------------------------------------------------------------- sampling -- */

type Displace = (p: THREE.Vector3, n: THREE.Vector3) => void

type Part = {
  geometry: THREE.BufferGeometry
  weight: number
  displace?: Displace
}

/** Sample `parts` into `out`, budget split by weight. Disposes geometries. */
function samplePoints(parts: Part[], count: number, out: Float32Array): void {
  const totalWeight = parts.reduce((sum, part) => sum + part.weight, 0)
  const pos = new THREE.Vector3()
  const nor = new THREE.Vector3()
  let written = 0

  parts.forEach((part, index) => {
    const isLast = index === parts.length - 1
    const n = isLast
      ? count - written
      : Math.round((part.weight / totalWeight) * count)
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(part.geometry)).build()
    for (let i = 0; i < n; i++) {
      sampler.sample(pos, nor)
      part.displace?.(pos, nor)
      out[(written + i) * 3] = pos.x
      out[(written + i) * 3 + 1] = pos.y
      out[(written + i) * 3 + 2] = pos.z
    }
    written += n
    part.geometry.dispose()
  })
}

/* --------------------------------------------------------------- targets -- */

/** Light quantized fbm along the normal: hand-chiseled marble surface. */
const marbleChisel: Displace = (p, n) => {
  const f = fbm(p.x * 3.1 + 5.2, p.y * 3.1 + 1.3, p.z * 3.1 + 8.8)
  p.addScaledVector(n, (Math.floor(f * 4) / 4) * 0.05)
}

/**
 * The Roman sculptor at his desk. Faces +Z at rest (the Sculpture holds a
 * three-quarter pose); the desk, keyboard and screen sit in front of him.
 * Shader landmarks: head center (0, 0.58, 0.08), neck pivot (0, 0.34, 0.05),
 * hands (±0.22, -0.52, 0.62), screen slab around z = 1.06.
 */
function theSculptor(count: number, out: Float32Array): void {
  const box = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const g = new THREE.BoxGeometry(w, h, d, 6, 6, 6)
    g.translate(x, y, z)
    return g
  }
  const capsule = (
    r: number,
    len: number,
    rx: number,
    x: number,
    y: number,
    z: number,
  ) => {
    const g = new THREE.CapsuleGeometry(r, len, 6, 14)
    g.rotateX(rx)
    g.translate(x, y, z)
    return g
  }

  const torso = new THREE.CylinderGeometry(0.33, 0.44, 0.95, 20, 12)
  torso.rotateX(0.1)
  torso.translate(0, -0.28, 0)

  const shoulders = new THREE.CapsuleGeometry(0.13, 0.62, 6, 14)
  shoulders.rotateZ(Math.PI / 2)
  shoulders.translate(0, 0.22, 0.02)

  const head = new THREE.SphereGeometry(0.26, 26, 20)
  head.translate(0, 0.58, 0.06)

  const nose = new THREE.ConeGeometry(0.055, 0.14, 10)
  nose.rotateX(Math.PI / 2)
  nose.translate(0, 0.56, 0.33)

  const wreath = new THREE.TorusGeometry(0.27, 0.035, 8, 44)
  wreath.rotateX(1.25)
  wreath.translate(0, 0.68, 0.04)

  const hand = (x: number) => {
    const g = new THREE.SphereGeometry(0.105, 16, 12)
    g.scale(1.3, 0.7, 1.5)
    g.translate(x, -0.52, 0.62)
    return g
  }

  const monitor = new THREE.BoxGeometry(0.95, 0.6, 0.06, 10, 8, 2)
  monitor.rotateX(-0.08)
  monitor.translate(0, 0.12, 1.06)

  samplePoints(
    [
      // marble base + seat
      { geometry: box(1.7, 0.3, 1.15, 0, -1.45, 0.1), weight: 0.09 },
      { geometry: box(0.75, 0.55, 0.6, 0, -1.02, -0.15), weight: 0.06 },
      // figure
      { geometry: torso, weight: 0.16, displace: marbleChisel },
      { geometry: shoulders, weight: 0.05, displace: marbleChisel },
      { geometry: new THREE.CylinderGeometry(0.09, 0.11, 0.18, 12).translate(0, 0.4, 0.04), weight: 0.015 },
      { geometry: head, weight: 0.075, displace: marbleChisel },
      { geometry: nose, weight: 0.012 },
      { geometry: wreath, weight: 0.03 },
      { geometry: capsule(0.1, 0.42, 0.9, -0.43, -0.05, 0.16), weight: 0.045, displace: marbleChisel },
      { geometry: capsule(0.1, 0.42, 0.9, 0.43, -0.05, 0.16), weight: 0.045, displace: marbleChisel },
      { geometry: capsule(0.085, 0.46, Math.PI / 2 - 0.15, -0.3, -0.44, 0.4), weight: 0.04 },
      { geometry: capsule(0.085, 0.46, Math.PI / 2 - 0.15, 0.3, -0.44, 0.4), weight: 0.04 },
      { geometry: hand(-0.22), weight: 0.02 },
      { geometry: hand(0.22), weight: 0.02 },
      { geometry: capsule(0.15, 0.5, Math.PI / 2, -0.19, -0.85, 0.18), weight: 0.045, displace: marbleChisel },
      { geometry: capsule(0.15, 0.5, Math.PI / 2, 0.19, -0.85, 0.18), weight: 0.045, displace: marbleChisel },
      { geometry: capsule(0.12, 0.5, 0, -0.19, -1.2, 0.48), weight: 0.035 },
      { geometry: capsule(0.12, 0.5, 0, 0.19, -1.2, 0.48), weight: 0.035 },
      // the workstation
      { geometry: box(1.75, 0.07, 0.62, 0, -0.42, 0.72), weight: 0.07 },
      { geometry: box(0.05, 0.9, 0.55, -0.83, -0.92, 0.72), weight: 0.02 },
      { geometry: box(0.05, 0.9, 0.55, 0.83, -0.92, 0.72), weight: 0.02 },
      { geometry: box(0.62, 0.05, 0.22, 0, -0.375, 0.62), weight: 0.025 },
      { geometry: monitor, weight: 0.065 },
      { geometry: new THREE.CylinderGeometry(0.05, 0.07, 0.28, 10).translate(0, -0.27, 1.02), weight: 0.01 },
      { geometry: box(0.3, 0.04, 0.2, 0, -0.4, 1.02), weight: 0.01 },
    ],
    count,
    out,
  )
}

/** Classical bust under orbital scan rings: the agent's mind, examined. */
function theMind(count: number, out: Float32Array): void {
  const ring = (radius: number, rx: number, rz: number) => {
    const g = new THREE.TorusGeometry(radius, 0.025, 8, 220)
    g.rotateX(rx)
    g.rotateZ(rz)
    g.translate(0, 0.15, 0)
    return g
  }

  const chest = new THREE.CylinderGeometry(0.62, 0.98, 0.85, 24, 10)
  chest.translate(0, -0.82, 0)

  const head = new THREE.SphereGeometry(0.5, 28, 22)
  head.scale(0.88, 1.05, 0.95)
  head.translate(0, 0.32, 0.03)

  const nose = new THREE.ConeGeometry(0.09, 0.2, 10)
  nose.rotateX(Math.PI / 2)
  nose.translate(0, 0.28, 0.5)

  const wreath = new THREE.TorusGeometry(0.52, 0.05, 8, 48)
  wreath.rotateX(1.2)
  wreath.translate(0, 0.52, 0)

  samplePoints(
    [
      { geometry: new THREE.BoxGeometry(1.5, 0.28, 1.0).translate(0, -1.35, 0), weight: 0.1 },
      { geometry: chest, weight: 0.3, displace: marbleChisel },
      { geometry: new THREE.CylinderGeometry(0.16, 0.2, 0.28, 14).translate(0, -0.32, 0), weight: 0.03 },
      { geometry: head, weight: 0.22, displace: marbleChisel },
      { geometry: nose, weight: 0.01 },
      { geometry: wreath, weight: 0.04 },
      { geometry: ring(1.5, 1.35, 0.2), weight: 0.1 },
      { geometry: ring(1.65, 0.55, -0.9), weight: 0.1 },
      { geometry: ring(1.4, 1.9, 1.15), weight: 0.1 },
    ],
    count,
    out,
  )
}

/** Nucleus wired to six satellites: every channel, one brain. */
function theNetwork(count: number, out: Float32Array): void {
  const parts: Part[] = [
    { geometry: new THREE.SphereGeometry(0.56, 48, 32), weight: 0.3 },
  ]
  const satellites = 6
  for (let i = 0; i < satellites; i++) {
    const angle = (i / satellites) * Math.PI * 2 + 0.4
    const pos = new THREE.Vector3(
      Math.cos(angle) * 1.62,
      Math.sin(i * 1.9) * 0.52,
      Math.sin(angle) * 1.62,
    )

    const orb = new THREE.SphereGeometry(0.29, 32, 20)
    orb.translate(pos.x, pos.y, pos.z)
    parts.push({ geometry: orb, weight: 0.58 / satellites })

    // Spoke from the nucleus edge to the satellite edge.
    const len = pos.length() - 0.75
    const spoke = new THREE.CylinderGeometry(0.02, 0.02, len, 6, 8)
    spoke.translate(0, len / 2 + 0.5, 0)
    spoke.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        pos.clone().normalize(),
      ),
    )
    parts.push({ geometry: spoke, weight: 0.12 / satellites })
  }
  samplePoints(parts, count, out)
}

/** Rising helix with four milestone orbs: kickoff to live, day by day. */
function theAscent(count: number, out: Float32Array): void {
  class Helix extends THREE.Curve<THREE.Vector3> {
    constructor() {
      super()
    }
    override getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
      const ang = t * 2.1 * Math.PI * 2 - Math.PI / 2
      return target.set(Math.cos(ang) * 0.95, -1.15 + t * 2.3, Math.sin(ang) * 0.95)
    }
  }

  const parts: Part[] = [
    { geometry: new THREE.TubeGeometry(new Helix(), 240, 0.085, 10), weight: 0.7 },
  ]
  const curve = new Helix()
  for (const t of [0.18, 0.44, 0.7, 0.96]) {
    const p = curve.getPoint(t)
    const g = new THREE.SphereGeometry(0.17, 20, 14)
    g.translate(p.x, p.y, p.z)
    parts.push({ geometry: g, weight: 0.075 })
  }
  samplePoints(parts, count, out)
}

/**
 * State 4: the real brand mark. Ink pixels of m-logo.png are rejection-sampled
 * into a shallow slab so the sculpture's final form IS the logo's fluid "m.".
 * Async because of the image decode; buildTargets seeds the buffer with a copy
 * of the stream so the 3 -> 4 morph is a no-op until this resolves (which in
 * practice happens seconds before anyone scrolls that far).
 */
export async function loadMarkTarget(count: number): Promise<Float32Array> {
  const img = new Image()
  img.decoding = 'async'
  img.src = logoUrl
  await img.decode()

  const W = 420
  const H = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * W))
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('2d context unavailable')
  ctx.drawImage(img, 0, 0, W, H)
  const { data } = ctx.getImageData(0, 0, W, H)

  // Ink = dark, opaque pixels (the mark is near-black on white/transparent).
  const ink: number[] = []
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = (y * W + x) * 4
      const lum = 0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2]
      if (data[k + 3] > 64 && lum < 128) ink.push(x, y)
    }
  }
  if (ink.length < 8) throw new Error('logo sampling found no ink pixels')

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < ink.length; i += 2) {
    minX = Math.min(minX, ink[i])
    maxX = Math.max(maxX, ink[i])
    minY = Math.min(minY, ink[i + 1])
    maxY = Math.max(maxY, ink[i + 1])
  }
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const px2world = 3.7 / Math.max(1, maxX - minX)
  const depth = 0.17

  const out = new Float32Array(count * 3)
  const pixels = ink.length / 2
  for (let i = 0; i < count; i++) {
    const p = (Math.random() * pixels) | 0
    const x = ink[p * 2] + Math.random() - 0.5
    const y = ink[p * 2 + 1] + Math.random() - 0.5
    // Most particles sit on the front/back faces, the rest fill the slab, so
    // the mark reads as an extruded solid rather than fog.
    const face = Math.random() < 0.55
    const z = face
      ? (Math.random() < 0.5 ? -depth : depth) + (Math.random() - 0.5) * 0.02
      : (Math.random() * 2 - 1) * depth
    out[i * 3] = (x - cx) * px2world
    out[i * 3 + 1] = (cy - y) * px2world
    out[i * 3 + 2] = z
  }
  return out
}

/* ------------------------------------------------------------------ API -- */

export type SculptureTargets = {
  /** targets[0] doubles as the base `position` attribute. */
  targets: [Float32Array, Float32Array, Float32Array, Float32Array, Float32Array]
  seeds: Float32Array
  count: number
}

export function buildTargets(count: number): SculptureTargets {
  const targets = [
    new Float32Array(count * 3),
    new Float32Array(count * 3),
    new Float32Array(count * 3),
    new Float32Array(count * 3),
    new Float32Array(count * 3),
  ] as SculptureTargets['targets']

  theSculptor(count, targets[0])
  theMind(count, targets[1])
  theNetwork(count, targets[2])
  theAscent(count, targets[3])
  // Seed the mark with the stream; loadMarkTarget swaps in the sampled logo.
  targets[4].set(targets[3])

  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) seeds[i] = Math.random()

  return { targets, seeds, count }
}
