import { PRODUCTS } from './data'
import { getCart, clearCart, cartTotal, closeCartDrawer } from './cart'
import type { Cart, CheckoutMode } from './types'

let checkoutMode: CheckoutMode = 'cart'
let buyNowIdx: number | null = null

export function setCheckoutBuyNow(idx: number): void {
  checkoutMode = 'buynow'
  buyNowIdx = idx
}

export function setCheckoutFromCart(): void {
  checkoutMode = 'cart'
  buyNowIdx = null
}

function checkoutLineItems(): Cart {
  if (checkoutMode === 'buynow' && buyNowIdx !== null) {
    return { [String(buyNowIdx)]: 1 }
  }
  return getCart()
}

export function renderCheckoutSummary(): void {
  const items = checkoutLineItems()
  const keys = Object.keys(items)

  const total = keys.reduce((sum, k) => {
    const idx = parseInt(k, 10)
    const product = PRODUCTS[idx]
    return sum + (product?.price ?? 0) * (items[k] ?? 0)
  }, 0)

  const summaryEl = document.getElementById('checkout-summary-items')
  if (summaryEl) {
    summaryEl.innerHTML = keys.map(k => {
      const idx = parseInt(k, 10)
      const product = PRODUCTS[idx]
      if (!product) return ''
      const qty = items[k] ?? 0
      return `<div class="checkout-summary-item">
        <span>${product.name}${qty > 1 ? ` &times; ${qty}` : ''}</span>
        <span>$${product.price * qty}</span>
      </div>`
    }).join('')
  }

  const totalEl = document.getElementById('checkout-total')
  if (totalEl) totalEl.textContent = `$${total}`
}

export function openCheckout(showViewFn: (view: 'checkout') => void): void {
  const body = document.getElementById('checkout-body') as HTMLElement | null
  const success = document.getElementById('checkout-success') as HTMLElement | null
  if (body) body.style.display = ''
  if (success) success.style.display = 'none'
  renderCheckoutSummary()
  showViewFn('checkout')
}

export function initCheckoutPlaceOrder(): void {
  document.getElementById('checkout-place-btn')?.addEventListener('click', () => {
    const items = checkoutLineItems()
    const namesList = Object.keys(items).map(k => {
      const idx = parseInt(k, 10)
      return PRODUCTS[idx]?.name ?? ''
    }).filter(Boolean)

    const body = document.getElementById('checkout-body') as HTMLElement | null
    const success = document.getElementById('checkout-success') as HTMLElement | null
    const successBody = document.getElementById('checkout-success-body')

    if (body) body.style.display = 'none'
    if (success) success.style.display = 'block'
    if (successBody) {
      const label = namesList.length === 1
        ? namesList[0]!
        : `${namesList.length} pieces`
      successBody.textContent = `${label} will arrive soon. A confirmation has been sent to your inbox.`
    }

    if (checkoutMode === 'cart') {
      clearCart()
    } else {
      buyNowIdx = null
    }
  })
}

export function initCartCheckoutButton(showViewFn: (view: 'checkout') => void): void {
  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    setCheckoutFromCart()
    closeCartDrawer()
    setTimeout(() => openCheckout(showViewFn), 250)
  })
}

export { checkoutMode, buyNowIdx }
