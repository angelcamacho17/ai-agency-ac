import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'

/**
 * The five states of the agent sculpture, sampled as point clouds so a single
 * particle system can morph between them on scroll:
 *
 *  0 RAW BLOCK   chiseled marble block         (raw material)
 *  1 THE CORE    carved sphere + orbital rings (structure, precision)
 *  2 THE SWARM   nucleus + six satellite orbs  (every channel, one brain)
 *  3 THE STREAM  continuous torus knot         (the pipeline, always moving)
 *  4 THE MARK    extruded chrome "M" monogram  (the finished sculpture)
 *
 * Every target has exactly `count` points so they map 1:1 onto the same
 * particle buffer. Sampling is uniform over surface area via
 * MeshSurfaceSampler; composite states split the budget across their parts.
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

function rawBlock(count: number, out: Float32Array): void {
  // Chunky quantized displacement along the normal reads as hewn stone.
  const chisel: Displace = (p, n) => {
    const f = fbm(p.x * 1.35 + 7.7, p.y * 1.35 + 2.1, p.z * 1.35 + 4.9)
    const q = Math.floor(f * 5) / 5
    p.addScaledVector(n, q * 0.5)
  }
  samplePoints(
    [
      {
        geometry: new THREE.BoxGeometry(2.35, 2.7, 2.35, 20, 24, 20),
        weight: 1,
        displace: chisel,
      },
    ],
    count,
    out,
  )
}

function theCore(count: number, out: Float32Array): void {
  const ring = (radius: number, rx: number, rz: number) => {
    const g = new THREE.TorusGeometry(radius, 0.02, 8, 220)
    g.rotateX(rx)
    g.rotateZ(rz)
    return g
  }
  samplePoints(
    [
      { geometry: new THREE.IcosahedronGeometry(1.42, 24), weight: 0.7 },
      { geometry: ring(1.95, 1.35, 0.2), weight: 0.1 },
      { geometry: ring(2.1, 0.55, -0.9), weight: 0.1 },
      { geometry: ring(1.8, 1.9, 1.15), weight: 0.1 },
    ],
    count,
    out,
  )
}

function theSwarm(count: number, out: Float32Array): void {
  const parts: Part[] = [
    { geometry: new THREE.SphereGeometry(0.56, 48, 32), weight: 0.32 },
  ]
  const satellites = 6
  for (let i = 0; i < satellites; i++) {
    const angle = (i / satellites) * Math.PI * 2 + 0.4
    const radius = 1.62
    const g = new THREE.SphereGeometry(0.29, 32, 20)
    g.translate(
      Math.cos(angle) * radius,
      Math.sin(i * 1.9) * 0.52,
      Math.sin(angle) * radius,
    )
    parts.push({ geometry: g, weight: 0.68 / satellites })
  }
  samplePoints(parts, count, out)
}

function theStream(count: number, out: Float32Array): void {
  samplePoints(
    [{ geometry: new THREE.TorusKnotGeometry(1.22, 0.34, 260, 40), weight: 1 }],
    count,
    out,
  )
}

function theMark(count: number, out: Float32Array): void {
  // Bold geometric "M" polygon (matches the squared Space Grotesk voice).
  const m = new THREE.Shape()
  const pts: [number, number][] = [
    [-1.2, -1.2],
    [-1.2, 1.2],
    [-0.52, 1.2],
    [0, 0.12],
    [0.52, 1.2],
    [1.2, 1.2],
    [1.2, -1.2],
    [0.64, -1.2],
    [0.64, 0.32],
    [0, -0.52],
    [-0.64, 0.32],
    [-0.64, -1.2],
  ]
  m.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) m.lineTo(pts[i][0], pts[i][1])
  m.closePath()

  const g = new THREE.ExtrudeGeometry(m, {
    depth: 0.6,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.045,
    bevelSegments: 2,
    steps: 1,
  })
  g.center()
  g.scale(1.12, 1.12, 1.12)
  samplePoints([{ geometry: g, weight: 1 }], count, out)
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

  rawBlock(count, targets[0])
  theCore(count, targets[1])
  theSwarm(count, targets[2])
  theStream(count, targets[3])
  theMark(count, targets[4])

  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) seeds[i] = Math.random()

  return { targets, seeds, count }
}
