<template>
  <canvas ref="canvasRef" class="particle-bg"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let rafId = null
let particles = []
let frameSkip = 0

function init() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // 减少粒子数
  const count = Math.min(Math.floor(window.innerWidth / 35), 40)
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.2 + 0.4,
    color: Math.random() > 0.5 ? 'rgba(0,212,255,' : 'rgba(123,97,255,',
    alpha: Math.random() * 0.25 + 0.08,
  }))

  // 预建空间哈希网格加速连线检测（简化：只连最近几个粒子）
  function draw() {
    // 页面不可见时跳过
    if (document.hidden) {
      rafId = requestAnimationFrame(draw)
      return
    }

    // 每2帧画一次连线（减少一半开销）
    frameSkip = (frameSkip + 1) % 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 更新位置
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0
    }

    // 画连线（仅偶数帧，缩小距离阈值）
    if (frameSkip === 0) {
      const MAX_DIST = 100
      const MAX_LINKS = 5  // 每个粒子最多连5条线
      for (let i = 0; i < particles.length; i++) {
        let links = 0
        for (let j = i + 1; j < particles.length && links < MAX_LINKS; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = dx * dx + dy * dy  // 用平方距离，避免 sqrt
          if (dist < MAX_DIST * MAX_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0,212,255,${0.04 * (1 - Math.sqrt(dist) / MAX_DIST)})`
            ctx.lineWidth = 0.4
            ctx.stroke()
            links++
          }
        }
      }
    }

    // 画粒子
    for (const p of particles) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = p.color + p.alpha + ')'
      ctx.fill()
    }

    rafId = requestAnimationFrame(draw)
  }
  draw()

  return () => window.removeEventListener('resize', resize)
}

onMounted(init)
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  particles = []
})
</script>

<style scoped>
.particle-bg {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0; pointer-events: none;
}
</style>
