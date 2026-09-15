import { PRODUCTS } from './data'
import type { Category } from './types'
import { setCursorDrag, setCursorHoverCover, shimmerBurst } from './cursor'

// ─── State ────────────────────────────────────────────────────────────────────

let galleryWrap: HTMLElement
let track: HTMLElement
let covers: HTMLElement[] = []

let cardTotalWidth = 0
let offset = 0
let velocity = 0
let dragging = false
let startX = 0
let startOffset = 0
let lastX = 0
let lastT = 0
let dragDistance = 0
export let entered = false

// ─── Helpers ─────────────────────────────────────────────────────────────────

function measure(): void {
  const c = covers[0]
  if (!c) return
  const rect = c.getBoundingClientRect()
  const style = getComputedStyle(c)
  const marginPx = parseFloat(style.marginLeft) + parseFloat(style.marginRight)
  cardTotalWidth = rect.width + marginPx
}

function setTrackTransform(): void {
  track.style.transform = `translate(-50%,-50%) translateX(${offset}px)`
}

function clampOffset(): void {
  measure()
  const totalWidth = cardTotalWidth * covers.length
  const maxOffset = totalWidth / 2 - cardTotalWidth / 2
  if (offset > maxOffset) offset = maxOffset
  if (offset < -maxOffset) offset = -maxOffset
}

export function updateCoverStates(): void {
  measure()
  const centerScreen = window.innerWidth / 2
  covers.forEach(cover => {
    const rect = cover.getBoundingClientRect()
    const coverCenter = rect.left + rect.width / 2
    const dist = coverCenter - centerScreen
    const norm = Math.max(-2.2, Math.min(2.2, dist / (cardTotalWidth * 1.4)))
    const rotateY = norm * 34
    const scale = 1 - Math.min(Math.abs(norm) * 0.16, 0.32)
    const opacity = 1 - Math.min(Math.abs(norm) * 0.32, 0.62)
    const z = 100 - Math.round(Math.abs(norm) * 10)
    cover.style.transform = `perspective(1200px) rotateY(${-rotateY}deg) scale(${scale})`
    cover.style.opacity = String(opacity)
    cover.style.zIndex = String(z)
    cover.style.filter = `brightness(${1 - Math.min(Math.abs(norm) * 0.18, 0.35)})`
    cover.classList.toggle('is-center', Math.abs(norm) < 0.18)
  })
}

// ─── Animation loop ───────────────────────────────────────────────────────────

function loop(): void {
  if (!dragging && Math.abs(velocity) > 0.02) {
    offset += velocity
    velocity *= 0.93
    clampOffset()
    setTrackTransform()
    updateCoverStates()
  } else if (!dragging) {
    velocity = 0
  }
  requestAnimationFrame(loop)
}

// ─── Pointer events ───────────────────────────────────────────────────────────

function pointerDown(e: MouseEvent | TouchEvent): void {
  if (!entered) return
  dragging = true
  dragDistance = 0
  setCursorDrag(true)
  const x = 'touches' in e ? e.touches[0]!.clientX : e.clientX
  startX = x
  startOffset = offset
  lastX = x
  lastT = Date.now()
  velocity = 0
}

function pointerMove(e: MouseEvent | TouchEvent): void {
  if (!dragging) return
  const x = 'touches' in e ? e.touches[0]!.clientX : e.clientX
  const dx = x - startX
  dragDistance = dx
  offset = startOffset + dx
  clampOffset()
  setTrackTransform()
  updateCoverStates()
  const now = Date.now()
  const dt = now - lastT
  if (dt > 0) velocity = ((x - lastX) / dt) * 16
  lastX = x
  lastT = now
}

function pointerUp(): void {
  if (!dragging) return
  dragging = false
  setCursorDrag(false)
}

// ─── Public API ───────────────────────────────────────────────────────────────

interface ProductOpenHandler {
  (idx: number, coverEl: HTMLElement): void
}

export function buildCovers(onOpen: ProductOpenHandler): void {
  galleryWrap = document.getElementById('gallery-wrap')!
  track = document.getElementById('track')!

  PRODUCTS.forEach(product => {
    const cover = document.createElement('div')
    cover.className = 'cover'
    cover.dataset['idx'] = String(product.idx)

    const inner = document.createElement('div')
    inner.className = 'cover-inner'
    // Gradient is always the CSS background — image layers on top as it loads
    inner.style.background = `linear-gradient(160deg,${product.palette[0]},${product.palette[1]})`

    // Product image — probes .jpg → .jpeg → .png → .webp in order
    // Falls back to gradient silently if no file exists yet (before you add photos)
    const img = document.createElement('img')
    img.className = 'cover-img'
    img.alt = product.name
    img.draggable = false

    const exts = ['jpg', 'jpeg', 'png', 'webp', 'svg']
    let extIdx = 0
    const tryNextExt = (): void => {
      const ext = exts[extIdx]
      if (!ext) { img.style.display = 'none'; return }   // no image found — gradient shows
      img.src = `${product.imagePath}.${ext}`
      extIdx++
    }
    img.addEventListener('error', tryNextExt)
    tryNextExt()   // start probing

    inner.appendChild(img)

    const sheen = document.createElement('div')
    sheen.className = 'cover-sheen'

    const label = document.createElement('div')
    label.className = 'cover-label'
    label.textContent = product.category

    cover.appendChild(inner)
    cover.appendChild(sheen)
    cover.appendChild(label)
    track.appendChild(cover)
    covers.push(cover)

    cover.addEventListener('mouseenter', () => setCursorHoverCover(true))
    cover.addEventListener('mouseleave', () => {
      setCursorHoverCover(false)
      inner.style.transform = ''
    })
    cover.addEventListener('mousemove', (e: MouseEvent) => {
      if (dragging) return
      const rect = cover.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      inner.style.transform = `rotateY(${px * 10}deg) rotateX(${py * -10}deg) scale(1.03)`
    })
    cover.addEventListener('click', (e: MouseEvent) => {
      if (Math.abs(dragDistance) > 6) return
      shimmerBurst(e.clientX, e.clientY)
      const idx = parseInt(cover.dataset['idx'] ?? '0', 10)
      setTimeout(() => onOpen(idx, cover), 140)
    })
  })

  // Global pointer listeners
  window.addEventListener('mousedown', pointerDown)
  window.addEventListener('mousemove', pointerMove)
  window.addEventListener('mouseup', pointerUp)
  window.addEventListener('touchstart', e => pointerDown(e), { passive: true })
  window.addEventListener('touchmove', e => pointerMove(e), { passive: true })
  window.addEventListener('touchend', pointerUp)

  window.addEventListener('wheel', (e: WheelEvent) => {
    if (!entered) return
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY
    offset -= delta * 0.9
    clampOffset()
    setTrackTransform()
    updateCoverStates()
  }, { passive: true })

  window.addEventListener('resize', () => {
    if (!entered) return
    clampOffset()
    setTrackTransform()
    updateCoverStates()
  })

  requestAnimationFrame(loop)
}

export function activateGallery(opts: { cat?: Category; app: HTMLElement; silent?: boolean }): void {
  // Ensure gallery-wrap is at app root (not embedded in contents slot)
  opts.app.appendChild(galleryWrap)
  galleryWrap.classList.remove('embedded')
  entered = true
  galleryWrap.classList.add('visible')

  measure()
  covers.forEach(cover => {
    const idx = parseInt(cover.dataset['idx'] ?? '0', 10)
    const product = PRODUCTS[idx]!
    cover.style.display = !opts.cat || product.category === opts.cat ? 'flex' : 'none'
  })
  offset = 0
  clampOffset()
  setTrackTransform()
  updateCoverStates()

  if (!opts.silent) {
    const hint = document.getElementById('hint')
    if (hint) {
      setTimeout(() => hint.classList.add('show'), 500)
      setTimeout(() => hint.classList.remove('show'), 4000)
    }
  }
}

export function activateContentsGallery(slot: HTMLElement): void {
  slot.appendChild(galleryWrap)
  galleryWrap.classList.add('embedded')
  entered = true
  galleryWrap.classList.add('visible')

  covers.forEach(cover => { cover.style.display = 'flex' })
  measure()
  offset = 0
  clampOffset()
  setTrackTransform()
  updateCoverStates()
}

export function deactivateGallery(): void {
  galleryWrap.classList.remove('visible')
  entered = false
}

export function getGalleryWrap(): HTMLElement {
  return galleryWrap
}
