# IANA.CORVELLE

## Setup

```bash
npm install
npm run dev     # dev server at http://localhost:5173
npm run build   # production build → dist/
```

---

## Adding your product images

Images live in `public/products/`, organized by category:

```
public/
  products/
    journals/        ← journal cover photos
    notebooks/       ← notebook cover photos
    posters/         ← poster photos
    bookmarks/       ← bookmark photos
```

### How to add a photo

1. Name your file after the product slug (see table below)
2. Drop it into the matching category folder
3. Supported formats: **.jpg** · **.jpeg** · **.png** · **.webp** (SVG works too)
4. Done — no code changes needed

### Product slugs

| Product | Category | Filename |
|---|---|---|
| Ink & Quiet | journals | `ink-and-quiet.jpg` |
| Field Notes | journals | `field-notes.jpg` |
| The Long Pause | journals | `the-long-pause.jpg` |
| Marrow | notebooks | `marrow.jpg` |
| Counterpoint | notebooks | `counterpoint.jpg` |
| Undertow | notebooks | `undertow.jpg` |
| Low Tide | posters | `low-tide.jpg` |
| Still Frame | posters | `still-frame.jpg` |
| Thin Gold Line | bookmarks | `thin-gold-line.jpg` |
| Aperture | bookmarks | `aperture.jpg` |

> **Tip — recommended image size:**
> Journals / Notebooks / Bookmarks → 800 × 1100 px (portrait)
> Posters → 800 × 1100 px portrait or 1100 × 800 px landscape
> Keep files under 500 KB for fast load times

---

## Adding a new product

Edit `src/data.ts`. Add an entry to the `RAW` array:

```ts
{
  name: 'Your Product Name',
  slug: 'your-product-name',    // used as the image filename
  category: 'Journal',          // Journal | Notebook | Poster | Bookmark
  price: 75,
  desc: 'One or two sentences describing the piece.',
},
```

Then drop `your-product-name.jpg` into the matching category folder.

---

## Project structure

```
src/
  main.ts       ← entry point, boots everything
  router.ts     ← view state machine (home/contents/gallery/account/checkout)
  gallery.ts    ← drag physics, cover rendering
  product.ts    ← product panel open/close
  cart.ts       ← cart state, drawer, toast
  checkout.ts   ← checkout page, order flow
  cursor.ts     ← custom cursor, shimmer burst
  sprites.ts    ← pixel plants + butterflies
  ambient.ts    ← glow orbs, fireflies, petals
  data.ts       ← all product data ← EDIT THIS FILE
  types.ts      ← TypeScript interfaces
```
