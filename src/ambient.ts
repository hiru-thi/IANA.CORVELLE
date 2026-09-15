function el<K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K] {
  return document.createElement(tag)
}

export function initAmbient(): void {
  const ambient = document.getElementById('ambient')
  if (!ambient) return

  // Glow orbs
  for (let i = 0; i < 3; i++) {
    const orb = el('div')
    orb.className = 'glow-orb'
    const size = 300 + i * 120
    orb.style.width = `${size}px`
    orb.style.height = `${size}px`
    orb.style.left = `${10 + i * 35}%`
    orb.style.top = `${15 + i * 25}%`
    orb.style.animationDelay = `${i * 3}s`
    ambient.appendChild(orb)
  }

  // Fireflies
  for (let i = 0; i < 14; i++) {
    const f = el('div')
    f.className = 'firefly'
    f.style.left = `${Math.random() * 100}%`
    f.style.top = `${50 + Math.random() * 45}%`
    f.style.animationDelay = `${Math.random() * 8}s`
    f.style.animationDuration = `${6 + Math.random() * 6}s`
    ambient.appendChild(f)
  }

  // Petals
  for (let i = 0; i < 10; i++) {
    const p = el('div')
    p.className = 'petal'
    p.style.left = `${Math.random() * 100}%`
    p.style.animationDelay = `${Math.random() * 16}s`
    p.style.animationDuration = `${14 + Math.random() * 10}s`
    ambient.appendChild(p)
  }
}
