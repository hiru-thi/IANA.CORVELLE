import { PRODUCTS } from './data'

let currentProductIdx: number = 0

export function openProduct(idx: number, coverEl: HTMLElement): void {
  currentProductIdx = idx
  const product = PRODUCTS[idx]
  if (!product) return

  const card = document.getElementById('expand-card') as HTMLElement
  const overlay = document.getElementById('overlay') as HTMLElement
  const panel = document.getElementById('product-panel') as HTMLElement

  // Snapshot cover position for shared-element transition
  const rect = coverEl.getBoundingClientRect()
  const inner = coverEl.querySelector('.cover-inner') as HTMLElement | null
  card.style.display = 'flex'
  card.style.left = `${rect.left}px`
  card.style.top = `${rect.top}px`
  card.style.width = `${rect.width}px`
  card.style.height = `${rect.height}px`
  card.style.background = inner?.style.background ?? ''
  card.style.transform = 'none'

  overlay.classList.add('active')

  requestAnimationFrame(() => {
    const targetW = Math.min(window.innerWidth * 0.34, 420)
    const targetH = window.innerHeight * 0.7
    card.style.left = `${window.innerWidth * 0.5 - targetW * 0.78}px`
    card.style.top = `${window.innerHeight * 0.5 - targetH / 2}px`
    card.style.width = `${targetW}px`
    card.style.height = `${targetH}px`
  })

  // Populate panel
  const setText = (id: string, text: string): void => {
    const el = document.getElementById(id)
    if (el) el.textContent = text
  }
  setText('p-eyebrow', product.category)
  setText('p-title', product.name)
  setText('p-desc', product.desc)
  setText('p-price', `$${product.price}`)

  // Product image hero in panel — probes same extensions as gallery covers
  const panelHero = document.getElementById('p-hero-img') as HTMLImageElement | null
  if (panelHero) {
    panelHero.alt = product.name
    panelHero.style.display = 'block'
    const exts = ['jpg', 'jpeg', 'png', 'webp', 'svg']
    let extIdx = 0
    const tryNext = (): void => {
      const ext = exts[extIdx]
      if (!ext) { panelHero.style.display = 'none'; return }
      panelHero.src = `${product.imagePath}.${ext}`
      extIdx++
    }
    panelHero.addEventListener('error', tryNext, { passive: true })
    tryNext()
  }

  const buyBtn = document.getElementById('p-buy-btn') as HTMLButtonElement | null
  if (buyBtn) {
    buyBtn.dataset['idx'] = String(idx)
    buyBtn.textContent = 'Add to cart'
    buyBtn.classList.remove('p-buy-added')
  }

  setTimeout(() => panel.classList.add('open'), 280)
}

export function closeProduct(): void {
  const panel = document.getElementById('product-panel')
  const overlay = document.getElementById('overlay')
  const card = document.getElementById('expand-card')
  panel?.classList.remove('open')
  overlay?.classList.remove('active')
  setTimeout(() => {
    if (card) card.style.display = 'none'
  }, 500)
}

export function isProductOpen(): boolean {
  return document.getElementById('product-panel')?.classList.contains('open') ?? false
}

export function getCurrentProductIdx(): number {
  return currentProductIdx
}

export function initSizeSelector(): void {
  document.querySelectorAll('.p-size').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.p-size').forEach(s => s.classList.remove('active'))
      el.classList.add('active')
    })
  })
}
