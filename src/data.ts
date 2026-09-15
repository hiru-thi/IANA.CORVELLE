import type { Product, Category } from './types'

export const PALETTE: Array<[string, string]> = [
  ['#1a1a1a', '#3a3a3a'],
  ['#101820', '#1f3a52'],
  ['#221a14', '#4a3324'],
  ['#181818', '#2c2c2c'],
  ['#1b1410', '#3d2b1f'],
  ['#0f1a17', '#1f3a30'],
  ['#1c1410', '#3a2a1c'],
  ['#141414', '#2a2a2a'],
  ['#1a1620', '#332a44'],
  ['#100c0a', '#2e2014'],
]

// ─── Category → folder mapping ─────────────────────────────────────────────
//
//  public/
//    products/
//      journals/          ← drop your journal images here
//      notebooks/         ← drop your notebook images here
//      posters/           ← drop your poster images here
//      bookmarks/         ← drop your bookmark images here
//
// Each image file should be named after the product slug below.
// Supported extensions (tried in order): .jpg, .jpeg, .png, .webp
// Example: public/products/journals/ink-and-quiet.jpg
//
export const CATEGORY_FOLDER: Record<Category, string> = {
  Journal:  'journals',
  Notebook: 'notebooks',
  Poster:   'posters',
  Bookmark: 'bookmarks',
}

// ─── Products ───────────────────────────────────────────────────────────────
//
// To add or edit a product:
//   1. Add/edit an entry in the array below
//   2. Drop the image file into the matching public/products/<category>/ folder
//   3. The name should match the slug exactly (with hyphens instead of spaces)
//
const RAW: Array<{
  name: string
  slug: string          // filename (without extension) inside the category folder
  category: Category
  price: number
  desc: string
}> = [
  {
    name: 'Ink & Quiet',
    slug: 'ink-and-quiet',
    category: 'Journal',
    price: 68,
    desc: 'A study in restraint — cotton paper, a single typeface debossed into the cover, and nothing else asking for attention.',
  },
  {
    name: 'Field Notes',
    slug: 'field-notes',
    category: 'Journal',
    price: 52,
    desc: 'Pocket-sized clarity. Built for the moments between meetings, written in margins, kept for years.',
  },
  {
    name: 'The Long Pause',
    slug: 'the-long-pause',
    category: 'Journal',
    price: 82,
    desc: 'For the journal that outlives the year it started in. Refillable, numbered, quietly built to last.',
  },
  {
    name: 'Marrow',
    slug: 'marrow',
    category: 'Notebook',
    price: 74,
    desc: 'Heavier paper, looser grid. For people who think in diagrams as often as sentences.',
  },
  {
    name: 'Counterpoint',
    slug: 'counterpoint',
    category: 'Notebook',
    price: 46,
    desc: 'A grid that disappears once you stop looking for it. Dot matrix, edge to edge.',
  },
  {
    name: 'Undertow',
    slug: 'undertow',
    category: 'Notebook',
    price: 58,
    desc: 'Wide enough for sketches, structured enough for systems. The notebook that adapts to the week.',
  },
  {
    name: 'Low Tide',
    slug: 'low-tide',
    category: 'Poster',
    price: 128,
    desc: 'Archival print on cotton rag. A single horizon line, held in tension across the page.',
  },
  {
    name: 'Still Frame',
    slug: 'still-frame',
    category: 'Poster',
    price: 128,
    desc: 'One frame, one breath. Printed to be looked at slowly, not scrolled past.',
  },
  {
    name: 'Thin Gold Line',
    slug: 'thin-gold-line',
    category: 'Bookmark',
    price: 24,
    desc: 'Brushed brass, hand-finished edge. Heavier than you expect, which is the point.',
  },
  {
    name: 'Aperture',
    slug: 'aperture',
    category: 'Bookmark',
    price: 24,
    desc: 'A thin window into whatever page you left. Cut from a single sheet of blackened steel.',
  },
]

export const PRODUCTS: Product[] = RAW.map((r, idx) => ({
  idx,
  name: r.name,
  slug: r.slug,
  category: r.category,
  price: r.price,
  desc: r.desc,
  palette: PALETTE[idx]!,
  // Image path base — gallery.ts probes .jpg/.jpeg/.png/.webp in order
  imagePath: `/products/${CATEGORY_FOLDER[r.category]}/${r.slug}`,
}))

// Extensions probed in order when loading a product image
export const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp'] as const
