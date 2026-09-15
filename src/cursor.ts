let cursorEl: HTMLElement | null = null

export function initCursor(): void {
  cursorEl = document.getElementById('cursor')
  if (!cursorEl) return

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!cursorEl) return
    cursorEl.style.left = `${e.clientX}px`
    cursorEl.style.top = `${e.clientY}px`
  })

  document.addEventListener('mousedown', (e: MouseEvent) => {
    const r = document.createElement('div')
    r.className = 'ripple'
    r.style.left = `${e.clientX}px`
    r.style.top = `${e.clientY}px`
    document.body.appendChild(r)
    setTimeout(() => r.remove(), 700)
  })
}

export function setCursorDrag(active: boolean): void {
  cursorEl?.classList.toggle('drag', active)
}

export function setCursorHoverCover(active: boolean): void {
  cursorEl?.classList.toggle('hover-cover', active)
}

export function shimmerBurst(x: number, y: number): void {
  const wrap = document.createElement('div')
  wrap.className = 'shimmer-wrap'
  wrap.style.left = `${x}px`
  wrap.style.top = `${y}px`

  const ring = document.createElement('div')
  ring.className = 'shimmer-ring'
  wrap.appendChild(ring)

  const COUNT = 10
  for (let i = 0; i < COUNT; i++) {
    const spark = document.createElement('div')
    spark.className = 'shimmer-spark'
    const angle = (Math.PI * 2 / COUNT) * i + Math.random() * 0.4
    const dist = 40 + Math.random() * 50
    spark.style.setProperty('--tx', `${Math.cos(angle) * dist}px`)
    spark.style.setProperty('--ty', `${Math.sin(angle) * dist}px`)
    const s = 3 + Math.random() * 3
    spark.style.width = `${s}px`
    spark.style.height = `${s}px`
    spark.style.left = '0px'
    spark.style.top = '0px'
    spark.style.animationDelay = `${Math.random() * 0.1}s`
    wrap.appendChild(spark)
  }

  document.body.appendChild(wrap)
  setTimeout(() => wrap.remove(), 1000)
}
