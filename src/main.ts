import { initAmbient } from './ambient'
import { initPlants, initButterflies } from './sprites'
import { initCursor } from './cursor'
import { buildCovers } from './gallery'
import { openProduct, closeProduct, initSizeSelector } from './product'
import {
  addToCart,
  openCartDrawer,
  closeCartDrawer,
  showToast,
} from './cart'
import {
  setCheckoutBuyNow,
  openCheckout,
  initCheckoutPlaceOrder,
  initCartCheckoutButton,
} from './checkout'
import { showView, initBackButton, initNavLinks, initScrollReveal } from './router'

// ─── Boot ─────────────────────────────────────────────────────────────────────

function boot(): void {
  // Environment / decorative
  initAmbient()
  initPlants()
  initButterflies()
  initCursor()

  // Gallery covers — pass openProduct as the click handler
  buildCovers((idx, coverEl) => openProduct(idx, coverEl))

  // Product panel close
  document.getElementById('close-btn')?.addEventListener('click', closeProduct)
  document.getElementById('overlay')?.addEventListener('click', closeProduct)
  initSizeSelector()

  // Product → Add to cart
  document.getElementById('p-buy-btn')?.addEventListener('click', function (this: HTMLElement) {
    const idx = parseInt((this as HTMLButtonElement).dataset['idx'] ?? '0', 10)
    addToCart(idx)
    showToast(`Added to cart`)
    this.classList.add('p-buy-added')
    this.textContent = 'Added ✓'
    const btn = this
    setTimeout(() => {
      btn.classList.remove('p-buy-added')
      btn.textContent = 'Add to cart'
    }, 1400)
  })

  // Product → Buy now (go direct to checkout for this one item)
  document.getElementById('p-buynow-btn')?.addEventListener('click', () => {
    const buyBtn = document.getElementById('p-buy-btn') as HTMLButtonElement | null
    const idx = parseInt(buyBtn?.dataset['idx'] ?? '0', 10)
    setCheckoutBuyNow(idx)
    closeProduct()
    setTimeout(() => openCheckout(v => showView(v)), 300)
  })

  // Cart drawer
  document.getElementById('cart-btn')?.addEventListener('click', openCartDrawer)
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCartDrawer)
  document.getElementById('cart-overlay')?.addEventListener('click', closeCartDrawer)

  // Checkout
  initCheckoutPlaceOrder()
  initCartCheckoutButton(v => showView(v))

  // Explore collection button
  document.getElementById('explore-btn')?.addEventListener('click', () => showView('contents'))

  // Navigation
  initBackButton()
  initNavLinks()
  initScrollReveal()
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
