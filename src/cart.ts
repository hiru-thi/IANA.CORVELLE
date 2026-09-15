import { PRODUCTS } from './data'
import type { Cart } from './types'

// ─── State ────────────────────────────────────────────────────────────────────

let cart: Cart = {}

// ─── Toast ────────────────────────────────────────────────────────────────────

let toastTimer: ReturnType<typeof setTimeout> | null = null

export function showToast(msg: string): void {
  const toast = document.getElementById('p-toast')
  if (!toast) return
  toast.textContent = msg
  toast.classList.add('show')
  if (toastTimer !== null) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200)
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function cartCount(): number {
  return Object.values(cart).reduce((s, q) => s + q, 0)
}

export function cartTotal(): number {
  return Object.entries(cart).reduce((sum, [k, qty]) => {
    const idx = parseInt(k, 10)
    const product = PRODUCTS[idx]
    return sum + (product?.price ?? 0) * qty
  }, 0)
}

export function updateCartBadge(): void {
  const countEl = document.getElementById('cart-count')
  const cartBtn = document.getElementById('cart-btn')
  if (countEl) countEl.textContent = String(cartCount())
  if (cartBtn) {
    cartBtn.classList.remove('bump')
    requestAnimationFrame(() => cartBtn.classList.add('bump'))
  }
}

// ─── Add to cart ──────────────────────────────────────────────────────────────

export function addToCart(idx: number, qty = 1): void {
  cart[String(idx)] = (cart[String(idx)] ?? 0) + qty
  updateCartBadge()
}

// ─── Cart drawer ──────────────────────────────────────────────────────────────

export function renderCartDrawer(): void {
  const wrap = document.getElementById('cart-items')
  const footer = document.getElementById('cart-footer') as HTMLElement | null
  if (!wrap || !footer) return

  const keys = Object.keys(cart)
  if (keys.length === 0) {
    wrap.innerHTML = '<p class="cart-empty-msg">Your cart is empty — find something worth keeping.</p>'
    footer.style.display = 'none'
    return
  }

  footer.style.display = 'block'
  wrap.innerHTML = keys.map(k => {
    const idx = parseInt(k, 10)
    const product = PRODUCTS[idx]
    if (!product) return ''
    const qty = cart[k] ?? 0
    const grad = `linear-gradient(160deg,${product.palette[0]},${product.palette[1]})`
    return `
      <div class="cart-item" data-idx="${idx}">
        <div class="cart-item-swatch" style="background:${grad}"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-meta">${product.category}</div>
          <div class="cart-item-qty">
            <button class="cart-qty-btn" data-action="dec" data-idx="${idx}">&minus;</button>
            <span class="cart-qty-val">${qty}</span>
            <button class="cart-qty-btn" data-action="inc" data-idx="${idx}">&plus;</button>
            <span class="cart-item-remove" data-action="remove" data-idx="${idx}">Remove</span>
          </div>
        </div>
        <div class="cart-item-price">$${product.price * qty}</div>
      </div>`
  }).join('')

  const subtotalEl = document.getElementById('cart-subtotal')
  if (subtotalEl) subtotalEl.textContent = `$${cartTotal()}`

  wrap.querySelectorAll<HTMLElement>('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = el.dataset['idx'] ?? ''
      const action = el.dataset['action']
      if (action === 'inc') cart[idx] = (cart[idx] ?? 0) + 1
      else if (action === 'dec') {
        const next = (cart[idx] ?? 0) - 1
        if (next <= 0) delete cart[idx]
        else cart[idx] = next
      } else if (action === 'remove') {
        delete cart[idx]
      }
      updateCartBadge()
      renderCartDrawer()
    })
  })
}

export function openCartDrawer(): void {
  renderCartDrawer()
  document.getElementById('cart-overlay')?.classList.add('active')
  document.getElementById('cart-drawer')?.classList.add('open')
}

export function closeCartDrawer(): void {
  document.getElementById('cart-overlay')?.classList.remove('active')
  document.getElementById('cart-drawer')?.classList.remove('open')
}

export function isCartDrawerOpen(): boolean {
  return document.getElementById('cart-drawer')?.classList.contains('open') ?? false
}

// ─── Checkout helpers ─────────────────────────────────────────────────────────

export function getCart(): Cart {
  return cart
}

export function clearCart(): void {
  cart = {}
  updateCartBadge()
}
