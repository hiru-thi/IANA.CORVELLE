import type { View, ShowViewOptions, Category } from './types'
import { activateGallery, activateContentsGallery, deactivateGallery } from './gallery'
import { fadeButterflies, showButterflies } from './sprites'
import { isProductOpen, closeProduct } from './product'
import { isCartDrawerOpen, closeCartDrawer } from './cart'

// ─── State ────────────────────────────────────────────────────────────────────

let viewHistory: View[] = ['home']

// ─── DOM helpers ─────────────────────────────────────────────────────────────

function showEl(id: string): void {
  const el = document.getElementById(id)
  if (el) el.classList.add('active')
}

function hideEl(id: string): void {
  const el = document.getElementById(id)
  if (el) el.classList.remove('active')
}

function hideAllSecondaryViews(): void {
  hideEl('contents-page')
  hideEl('account-page')
  hideEl('checkout-page')
  deactivateGallery()
  window.dispatchEvent(new Event('contents-page-hidden'))
}

// ─── Navbar / chrome visibility ───────────────────────────────────────────────

function showChrome(): void {
  document.getElementById('navbar')?.classList.add('show')
  document.getElementById('back-btn')?.classList.add('show')
  document.getElementById('cart-btn')?.classList.add('show')
}

function hideChrome(): void {
  document.getElementById('navbar')?.classList.remove('show')
  document.getElementById('back-btn')?.classList.remove('show')
  document.getElementById('cart-btn')?.classList.remove('show')
}

// ─── Main showView ────────────────────────────────────────────────────────────

export function showView(view: View, opts: ShowViewOptions = {}): void {
  const hero = document.getElementById('hero')
  const homeWrap = document.getElementById('home-wrap')
  const wasOnHero = hero?.style.display !== 'none' && homeWrap?.style.display !== 'none'

  if (view === 'home') {
    hideAllSecondaryViews()
    hideChrome()
    document.body.classList.remove('lock-scroll')
    if (homeWrap) homeWrap.style.display = ''
    if (hero) {
      hero.style.display = 'flex'
      requestAnimationFrame(() => hero.classList.remove('fade-out'))
    }
    showButterflies()
    if (!opts.fromHistory) viewHistory.push('home')
    return
  }

  // Leaving home → hide hero, lock scroll
  if (wasOnHero) {
    hero?.classList.add('fade-out')
    setTimeout(() => {
      if (hero) hero.style.display = 'none'
      if (homeWrap) homeWrap.style.display = 'none'
    }, 900)
  } else {
    if (homeWrap) homeWrap.style.display = 'none'
  }

  document.body.classList.add('lock-scroll')
  window.scrollTo(0, 0)
  showChrome()

  // Schedule butterfly fade-out after 2.5s on any non-home page
  const t = setTimeout(fadeButterflies, 2500)
  ;(showView as unknown as { _butterflyTimer?: ReturnType<typeof setTimeout> })._butterflyTimer = t

  const delay = wasOnHero ? 900 : 0

  setTimeout(() => {
    hideAllSecondaryViews()

    if (view === 'gallery') {
      const app = document.getElementById('app')!
      activateGallery({
  ...(opts.cat !== undefined ? { cat: opts.cat as Category } : {}),
  app,
  ...(opts.silent !== undefined ? { silent: opts.silent } : {})
})

    } else if (view === 'contents') {
      const slot = document.getElementById('contents-gallery-slot')
      if (slot) activateContentsGallery(slot)
      showEl('contents-page')
      window.dispatchEvent(new Event('contents-page-shown'))

    } else if (view === 'account') {
      showEl('account-page')

    } else if (view === 'checkout') {
      showEl('checkout-page')
    }
  }, delay)

  if (!opts.fromHistory) viewHistory.push(view)
}

// ─── Back button logic ────────────────────────────────────────────────────────

export function initBackButton(): void {
  document.getElementById('back-btn')?.addEventListener('click', () => {
    if (isProductOpen()) { closeProduct(); return }
    if (isCartDrawerOpen()) { closeCartDrawer(); return }
    viewHistory.pop()
    const prev: View = viewHistory.length > 0 ? viewHistory[viewHistory.length - 1]! : 'home'
    showView(prev, { fromHistory: true })
  })
}

// ─── Nav links ────────────────────────────────────────────────────────────────

export function initNavLinks(): void {
  // Wordmark → home
  document.getElementById('nav-home')?.addEventListener('click', () => {
    viewHistory = ['home']
    showView('home')
  })

  // Nav list items
  document.querySelectorAll<HTMLElement>('.nav-links li').forEach(li => {
    li.addEventListener('click', () => {
      document.querySelectorAll('.nav-links li').forEach(o => o.classList.remove('active-cat'))
      li.classList.add('active-cat')
      const cat = li.dataset['cat']
      if (cat === 'account') { showView('account'); return }
      if (cat === 'all') { showView('contents'); return }
      showView('gallery', { cat: cat as Category })
    })
  })
}

// ─── Home scroll listener (reveals navbar on About section) ──────────────────

export function initScrollReveal(): void {
  window.addEventListener('scroll', () => {
    if (document.body.classList.contains('lock-scroll')) return
    const navbar = document.getElementById('navbar')
    const cartBtn = document.getElementById('cart-btn')
    if (window.scrollY > window.innerHeight * 0.5) {
      navbar?.classList.add('show')
      cartBtn?.classList.add('show')
    } else {
      navbar?.classList.remove('show')
      cartBtn?.classList.remove('show')
    }
  })
}

export { showView as navigate }
