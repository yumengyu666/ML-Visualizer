// 动画工具函数 / Animation utility functions

// 基于 requestAnimationFrame 的动画循环
export function createAnimationLoop(callback) {
  let rafId = null
  let lastTime = 0

  function loop(time) {
    const delta = time - lastTime
    lastTime = time
    callback(delta, time)
    rafId = requestAnimationFrame(loop)
  }

  function start() {
    lastTime = performance.now()
    rafId = requestAnimationFrame(loop)
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  return { start, stop }
}

// 缓动函数
export const easings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
}

// Intersection Observer 滚动动画
export function setupScrollReveal(selector = '.scroll-reveal', options = {}) {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    ...options
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        if (!options.persistent) {
          observer.unobserve(entry.target)
        }
      }
    })
  }, defaultOptions)

  document.querySelectorAll(selector).forEach(el => observer.observe(el))
  return observer
}

// 颜色插值
export function interpolateColor(color1, color2, t) {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)
  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r},${g},${b})`
}

// Canvas DPI 适配
export function setupHiDPICanvas(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  return ctx
}
