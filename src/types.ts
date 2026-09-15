export type View = 'home' | 'contents' | 'gallery' | 'account' | 'checkout'

export type Category = 'Journal' | 'Notebook' | 'Poster' | 'Bookmark'

export interface Product {
  idx: number
  name: string
  slug: string
  category: Category
  price: number
  desc: string
  palette: [string, string]
  /**
   * Base path to the product image, without extension.
   * e.g. "/products/journals/ink-and-quiet"
   * gallery.ts probes .jpg / .jpeg / .png / .webp in that order.
   * Falls back to a gradient swatch if no image is found.
   */
  imagePath: string
}

export interface DragState {
  dragging: boolean
  startX: number
  startOffset: number
  lastX: number
  lastT: number
  dragDistance: number
  offset: number
  velocity: number
}

export interface PlantSpot {
  bottom: string
  left?: string
  right?: string
  scale: number
  delay: number
}

export interface ShowViewOptions {
  cat?: Category
  fromHistory?: boolean
  silent?: boolean
}

// Cart maps product index (as string key) → quantity
export type Cart = Record<string, number>

export type CheckoutMode = 'cart' | 'buynow'
