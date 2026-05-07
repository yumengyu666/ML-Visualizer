<template>
  <div class="neural-flow">
    <div class="animation-header">
      <h3>神经网络信息流动</h3>
      <div class="controls">
        <button @click="toggleMode" class="ctrl-btn mode-btn">
          {{ isForward ? '正向传播' : '反向传播' }}
        </button>
        <button @click="togglePlay" class="ctrl-btn">
          {{ isPlaying ? '⏸ 暂停' : '▶ 播放' }}
        </button>
        <button @click="reset" class="ctrl-btn">↺ 重置</button>
        <label class="speed-control">
          速度
          <input type="range" v-model.number="speed" min="0.2" max="3" step="0.1" />
          <span>{{ speed.toFixed(1) }}x</span>
        </label>
      </div>
    </div>
    <canvas ref="canvasRef" class="neural-canvas"></canvas>
    <div class="legend">
      <span class="legend-item"><span class="dot cold"></span>未激活</span>
      <span class="legend-item"><span class="dot warm"></span>高激活</span>
      <span class="legend-item"><span class="dot purple"></span>梯度信号</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'

const canvasRef = ref(null)
const isPlaying = ref(true)
const isForward = ref(true)
const speed = ref(1.0)

// Network config: layers and nodes per layer
const layers = [4, 6, 8, 6, 3]
const layerNames = ['输入层', '隐藏层1', '隐藏层2', '隐藏层3', '输出层']

let rafId = null
let ctx = null
let width = 0
let height = 0
let nodes = []
let connections = []
let particles = []
let time = 0
let signalWave = 0

function initNetwork() {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.parentElement.getBoundingClientRect()
  width = rect.width
  height = 450
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  // Create nodes
  nodes = []
  const layerSpacing = width / (layers.length + 1)
  layers.forEach((count, li) => {
    const x = layerSpacing * (li + 1)
    const nodeSpacing = height / (count + 1)
    for (let ni = 0; ni < count; ni++) {
      const y = nodeSpacing * (ni + 1)
      nodes.push({
        x, y, layer: li, index: ni,
        activation: 0, targetActivation: 0,
        radius: 8
      })
    }
  })

  // Create connections
  connections = []
  let prevStart = 0
  for (let li = 1; li < layers.length; li++) {
    const currStart = prevStart + layers[li - 1]
    for (let pi = prevStart; pi < prevStart + layers[li - 1]; pi++) {
      for (let ci = currStart; ci < currStart + layers[li]; ci++) {
        connections.push({ from: pi, to: ci, weight: Math.random() * 0.5 + 0.3 })
      }
    }
    prevStart = currStart
  }

  particles = []
  signalWave = 0
}

function spawnParticles() {
  if (!isPlaying.value) return
  const layerCount = layers.length

  if (isForward.value) {
    // Forward propagation
    for (let li = 0; li < layerCount - 1; li++) {
      const fromStart = layers.slice(0, li).reduce((a, b) => a + b, 0)
      const toStart = fromStart + layers[li]
      // Random connections to animate
      const count = Math.ceil(layers[li] * 0.3)
      for (let i = 0; i < count; i++) {
        const fi = fromStart + Math.floor(Math.random() * layers[li])
        const ti = toStart + Math.floor(Math.random() * layers[li + 1])
        const conn = connections.find(c => c.from === fi && c.to === ti)
        if (conn) {
          particles.push({
            fromNode: fi, toNode: ti,
            progress: 0, speed: (0.005 + Math.random() * 0.01) * speed.value,
            color: isForward.value ? '#00FFB3' : '#7B61FF'
          })
        }
      }
    }
  } else {
    // Backward propagation
    for (let li = layerCount - 1; li > 0; li--) {
      const fromStart = layers.slice(0, li).reduce((a, b) => a + b, 0)
      const toStart = fromStart - layers[li - 1]
      if (toStart < 0) continue
      const count = Math.ceil(layers[li] * 0.3)
      for (let i = 0; i < count; i++) {
        const fi = fromStart + Math.floor(Math.random() * layers[li])
        const ti = toStart + Math.floor(Math.random() * layers[li - 1])
        const conn = connections.find(c => c.from === ti && c.to === fi)
        if (conn) {
          particles.push({
            fromNode: fi, toNode: ti, reverse: true,
            progress: 0, speed: (0.005 + Math.random() * 0.01) * speed.value,
            color: '#7B61FF'
          })
        }
      }
    }
  }
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  // Update signal wave
  if (isPlaying.value) {
    signalWave += 0.02 * speed.value
    // Activate nodes based on wave
    const layerCount = layers.length
    const waveLayer = isForward.value
      ? (signalWave % (layerCount + 1))
      : layerCount - 1 - (signalWave % (layerCount + 1))

    nodes.forEach(n => {
      const dist = Math.abs(n.layer - waveLayer)
      n.targetActivation = Math.max(0, 1 - dist * 0.5)
      n.activation += (n.targetActivation - n.activation) * 0.1
    })
  }

  // Draw connections
  connections.forEach(conn => {
    const from = nodes[conn.from]
    const to = nodes[conn.to]
    const activation = (from.activation + to.activation) / 2

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    // Bezier curve
    const cpx = (from.x + to.x) / 2
    ctx.bezierCurveTo(cpx, from.y, cpx, to.y, to.x, to.y)

    if (isForward.value) {
      const alpha = 0.1 + activation * 0.3
      ctx.strokeStyle = `rgba(0,212,255,${alpha})`
    } else {
      const alpha = 0.1 + activation * 0.4
      ctx.strokeStyle = `rgba(123,97,255,${alpha})`
    }
    ctx.lineWidth = 0.8 + activation * 1.2
    ctx.stroke()
  })

  // Draw particles
  particles.forEach(p => {
    const from = nodes[p.fromNode]
    const to = nodes[p.toNode]
    p.progress += p.speed

    if (p.progress >= 1) { p.dead = true; return }

    const t = p.progress
    const cpx = (from.x + to.x) / 2
    // Bezier interpolation
    const x = (1-t)*(1-t)*(1-t)*from.x + 3*(1-t)*(1-t)*t*cpx + 3*(1-t)*t*t*cpx + t*t*t*to.x
    const y = (1-t)*(1-t)*(1-t)*from.y + 3*(1-t)*(1-t)*t*from.y + 3*(1-t)*t*t*to.y + t*t*t*to.y

    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.fill()

    // Glow
    const grd = ctx.createRadialGradient(x, y, 0, x, y, 12)
    grd.addColorStop(0, p.color + '80')
    grd.addColorStop(1, p.color + '00')
    ctx.beginPath()
    ctx.arc(x, y, 12, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()
  })
  particles = particles.filter(p => !p.dead)

  // Draw nodes
  nodes.forEach(n => {
    const a = n.activation
    // Base circle
    ctx.beginPath()
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)

    if (isForward.value) {
      const r = Math.round(0 + a * 0)
      const g = Math.round(100 + a * 155)
      const b = Math.round(180 + a * 75)
      ctx.fillStyle = `rgb(${r},${g},${b})`
    } else {
      const r = Math.round(80 + a * 43)
      const g = Math.round(60 + a * 37)
      const b = Math.round(160 + a * 95)
      ctx.fillStyle = `rgb(${r},${g},${b})`
    }
    ctx.fill()

    // Glow effect
    if (a > 0.3) {
      const glowColor = isForward.value ? '#00D4FF' : '#7B61FF'
      const grd = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, n.radius * 3)
      grd.addColorStop(0, glowColor + Math.round(a * 100).toString(16).padStart(2, '0'))
      grd.addColorStop(1, glowColor + '00')
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2)
      ctx.fillStyle = grd
      ctx.fill()
    }

    ctx.beginPath()
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
    ctx.strokeStyle = isForward.value ? `rgba(0,212,255,${0.3 + a * 0.5})` : `rgba(123,97,255,${0.3 + a * 0.5})`
    ctx.lineWidth = 1.5
    ctx.stroke()
  })

  // Layer labels
  const layerSpacing = width / (layers.length + 1)
  ctx.font = '12px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(156,163,175,0.7)'
  layerNames.forEach((name, i) => {
    ctx.fillText(name, layerSpacing * (i + 1), height - 15)
  })

  time++
  if (time % 15 === 0) spawnParticles()

  rafId = requestAnimationFrame(draw)
}

function togglePlay() { isPlaying.value = !isPlaying.value }
function toggleMode() { isForward.value = !isForward.value; reset() }
function reset() {
  signalWave = 0
  particles = []
  nodes.forEach(n => { n.activation = 0; n.targetActivation = 0 })
  time = 0
}

onMounted(() => {
  initNetwork()
  draw()
  window.addEventListener('resize', initNetwork)
})
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', initNetwork)
})
</script>

<style scoped>
.neural-flow {
  border-radius: 16px; overflow: hidden;
  background: rgba(10,14,26,0.8); border: 1px solid var(--border-color);
}
.animation-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap; gap: 0.75rem;
}
.animation-header h3 { font-size: 1rem; font-weight: 600; color: var(--text-primary); }
.controls { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.ctrl-btn {
  padding: 0.35rem 0.75rem; border-radius: 8px; border: 1px solid var(--border-color);
  background: var(--bg-surface); color: var(--text-secondary); font-size: 0.8rem;
  cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.ctrl-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
.mode-btn { background: rgba(0,212,255,0.1); color: var(--accent-blue); border-color: rgba(0,212,255,0.3); }
.speed-control {
  display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-secondary);
}
.speed-control input[type="range"] { width: 80px; accent-color: var(--accent-blue); }
.speed-control span { min-width: 30px; }
.neural-canvas { width: 100%; display: block; }
.legend {
  display: flex; gap: 1.5rem; padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border-color); font-size: 0.75rem; color: var(--text-muted);
}
.legend-item { display: flex; align-items: center; gap: 0.4rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.cold { background: #1e3a5f; }
.dot.warm { background: #00FFB3; }
.dot.purple { background: #7B61FF; }
</style>
