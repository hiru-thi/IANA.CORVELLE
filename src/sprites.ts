import type { PlantSpot } from './types'

// ─── Pixel plant SVG ────────────────────────────────────────────────────────

type RGB = string
type Cell = [number, number, RGB]

const PLANT_PALETTES: Array<[RGB, RGB, RGB, RGB]> = [
  ['#1f3a2c', '#2d5a3f', '#3f7a55', '#6fae7c'],
  ['#2a2410', '#4a3d18', '#6b5a22', '#a08a3a'],
  ['#241a2e', '#3c2a4a', '#583f6b', '#8a6bb0'],
]

export function pixelPlantSVG(seed: number): string {
  const c = PLANT_PALETTES[seed % PLANT_PALETTES.length]!
  const GRID = 12
  const cells: Cell[] = []
  const stemH = 6 + (seed % 3)

  for (let y = 0; y < stemH; y++) {
    cells.push([5, 11 - y, c[1]])
  }

  const leafSets: Cell[][] = [
    [
      [4, 11 - stemH, c[2]], [3, 10 - stemH, c[2]],
      [6, 11 - stemH, c[2]], [7, 10 - stemH, c[2]],
      [5, 9 - stemH, c[3]], [4, 8 - stemH, c[3]], [6, 8 - stemH, c[3]],
    ],
    [
      [4, 11 - stemH, c[2]], [6, 11 - stemH, c[2]],
      [3, 9 - stemH, c[3]], [7, 9 - stemH, c[3]],
      [5, 8 - stemH, c[3]], [5, 7 - stemH, c[3]],
    ],
  ]
  const leaves = leafSets[seed % leafSets.length]!
  leaves.forEach(l => cells.push(l))

  const PX = 8
  const size = GRID * PX
  const rects = cells
    .map(([cx, cy, fill]) => `<rect x="${cx * PX}" y="${cy * PX}" width="${PX}" height="${PX}" fill="${fill}"/>`)
    .join('')
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`
}

export function initPlants(): void {
  const layer = document.getElementById('plant-layer')
  if (!layer) return

  const spots: PlantSpot[] = [
    { bottom: '0px', left: '18px', scale: 1.0, delay: 0 },
    { bottom: '0px', right: '24px', scale: 0.85, delay: 1.2 },
    { bottom: '0px', left: '46%', scale: 0.65, delay: 2.1 },
  ]

  spots.forEach((spot, i) => {
    const div = document.createElement('div')
    div.className = 'pixel-plant'
    div.innerHTML = pixelPlantSVG(i)
    div.style.bottom = spot.bottom
    if (spot.left !== undefined) div.style.left = spot.left
    if (spot.right !== undefined) div.style.right = spot.right
    div.style.transform = `scale(${spot.scale})`
    div.style.animationDuration = `${5 + i}s`
    div.style.animationDelay = `${spot.delay}s`
    layer.appendChild(div)
  })
}

// ─── Butterfly pixel SVG ─────────────────────────────────────────────────────

type ButterflyTone = 0 | 1

const BUTTERFLY_PALETTES: Array<[RGB, RGB, RGB]> = [
  ['#c9a86b', '#8a6f45', '#e8cf9a'],
  ['#a899c2', '#71658f', '#cfc3e8'],
]

function butterflyPixelSVG(tone: ButterflyTone, wingsOpen: boolean): string {
  const c = BUTTERFLY_PALETTES[tone]!
  const PX = 2

  const openWings: Cell[] = [
    [2,1,c[0]],[3,1,c[0]],[7,1,c[0]],[8,1,c[0]],
    [1,2,c[0]],[2,2,c[2]],[3,2,c[0]],[7,2,c[0]],[8,2,c[2]],[9,2,c[0]],
    [1,3,c[0]],[2,3,c[0]],[3,3,c[0]],[7,3,c[0]],[8,3,c[0]],[9,3,c[0]],
    [2,4,c[0]],[3,4,c[0]],[7,4,c[0]],[8,4,c[0]],
    [3,5,c[1]],[7,5,c[1]],
  ]
  const closedWings: Cell[] = [
    [3,1,c[0]],[7,1,c[0]],
    [2,2,c[0]],[3,2,c[2]],[7,2,c[2]],[8,2,c[0]],
    [2,3,c[0]],[3,3,c[0]],[7,3,c[0]],[8,3,c[0]],
    [3,4,c[1]],[7,4,c[1]],
  ]
  const body: Cell[] = [
    [5,1,c[1]],[5,2,c[1]],[5,3,c[1]],[5,4,c[1]],[5,5,c[1]],[4,0,c[1]],[6,0,c[1]],
  ]

  const cells = (wingsOpen ? openWings : closedWings).concat(body)
  const W = 11 * PX
  const H = 7 * PX
  const rects = cells
    .map(([cx, cy, fill]) => `<rect x="${cx*PX}" y="${cy*PX}" width="${PX}" height="${PX}" fill="${fill}"/>`)
    .join('')
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`
}

// ─── Butterfly animation ──────────────────────────────────────────────────────

interface ButterflyState {
  x: number
  y: number
  targetX: number
  targetY: number
  t: number
}

export const butterflyElements: HTMLDivElement[] = []

function initButterfly(tone: ButterflyTone): void {
  const el = document.createElement('div')
  el.className = 'butterfly'
  el.innerHTML = butterflyPixelSVG(tone, true)
  el.style.transform = 'scale(2.6)'
  document.body.appendChild(el)
  butterflyElements.push(el)

  let wingsOpen = true
  setInterval(() => {
    wingsOpen = !wingsOpen
    el.innerHTML = butterflyPixelSVG(tone, wingsOpen)
  }, 220)

  const state: ButterflyState = {
    x: window.innerWidth * (0.2 + tone * 0.3),
    y: window.innerHeight * (0.55 + tone * 0.12),
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.6,
    t: Math.random() * 1000,
  }

  const pickTarget = (): void => {
    const margin = 80
    state.targetX = margin + Math.random() * (window.innerWidth - margin * 2)
    state.targetY = window.innerHeight * (0.45 + Math.random() * 0.45)
  }
  pickTarget()

  const frame = (): void => {
    state.t += 1
    const dx = state.targetX - state.x
    const dy = state.targetY - state.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 40) pickTarget()

    const ease = 0.012
    const wobble = Math.sin(state.t * 0.04 + tone * 3) * 14
    const perpX = -dy / (dist || 1)
    const perpY = dx / (dist || 1)
    state.x += dx * ease + perpX * wobble * 0.02
    state.y += dy * ease + perpY * wobble * 0.02 + Math.sin(state.t * 0.07) * 0.3

    const flip = dx < 0 ? -1 : 1
    el.style.left = `${state.x}px`
    el.style.top = `${state.y}px`
    el.style.transform = `scale(2.6) scaleX(${flip})`
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

export function initButterflies(): void {
  try {
    initButterfly(0)
    initButterfly(1)
  } catch (err) {
    console.error('butterfly init failed:', err)
  }
}

export function fadeButterflies(): void {
  butterflyElements.forEach(el => el.classList.add('fade-out'))
}

export function showButterflies(): void {
  butterflyElements.forEach(el => el.classList.remove('fade-out'))
}
