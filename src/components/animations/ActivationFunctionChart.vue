<template>
  <div class="activation-chart">
    <div class="animation-header">
      <h3>激活函数对比</h3>
      <div class="controls">
        <button v-for="fn in functionList" :key="fn.key" class="fn-toggle"
          :class="{ active: activeFunctions.includes(fn.key) }"
          :style="{ borderColor: fn.color, color: activeFunctions.includes(fn.key) ? fn.color : 'var(--text-muted)' }"
          @click="toggleFunction(fn.key)">
          {{ fn.name }}
        </button>
      </div>
    </div>
    <div class="chart-area" ref="chartRef">
      <canvas ref="canvasRef" class="chart-canvas" @mousemove="handleMouseMove" @mouseleave="mouseX = -1"></canvas>
      <div v-if="mouseX >= 0" class="tooltip" :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }">
        <div class="tooltip-x">x = {{ currentX.toFixed(2) }}</div>
        <div v-for="fn in activeFunctions" :key="fn" class="tooltip-row">
          <span class="fn-dot" :style="{ background: getFuncColor(fn) }"></span>
          {{ getFuncName(fn) }}: f(x)={{ getFuncValue(fn, currentX).toFixed(4) }}, f'(x)={{ getFuncDerivative(fn, currentX).toFixed(4) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
const chartRef = ref(null)
const mouseX = ref(-1)
const currentX = ref(0)
const tooltipPos = reactive({ x: 0, y: 0 })

const functionList = [
  { key: 'relu', name: 'ReLU', color: '#00D4FF' },
  { key: 'sigmoid', name: 'Sigmoid', color: '#7B61FF' },
  { key: 'tanh', name: 'Tanh', color: '#00FFB3' },
  { key: 'gelu', name: 'GELU', color: '#FF6B35' },
  { key: 'swish', name: 'Swish', color: '#FFD93D' },
]

const activeFunctions = reactive(['relu', 'sigmoid', 'tanh'])

const fns = {
  relu: { fn: x => Math.max(0, x), dfn: x => x > 0 ? 1 : 0, name: 'ReLU', color: '#00D4FF' },
  sigmoid: { fn: x => 1 / (1 + Math.exp(-x)), dfn: x => { const s = 1 / (1 + Math.exp(-x)); return s * (1 - s) }, name: 'Sigmoid', color: '#7B61FF' },
  tanh: { fn: x => Math.tanh(x), dfn: x => 1 - Math.tanh(x) ** 2, name: 'Tanh', color: '#00FFB3' },
  gelu: { fn: x => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))), dfn: x => { const s = Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)); return 0.5 * (1 + s) + 0.5 * x * (1 - s * s) * Math.sqrt(2 / Math.PI) * (1 + 0.134145 * x * x) }, name: 'GELU', color: '#FF6B35' },
  swish: { fn: x => x / (1 + Math.exp(-x)), dfn: x => { const s = 1 / (1 + Math.exp(-x)); return s + x * s * (1 - s) }, name: 'Swish', color: '#FFD93D' },
}

function getFuncColor(key) { return fns[key]?.color || '#fff' }
function getFuncName(key) { return fns[key]?.name || '' }
function getFuncValue(key, x) { return fns[key]?.fn(x) || 0 }
function getFuncDerivative(key, x) { return fns[key]?.dfn(x) || 0 }

function toggleFunction(key) {
  const idx = activeFunctions.indexOf(key)
  if (idx >= 0) activeFunctions.splice(idx, 1)
  else activeFunctions.push(key)
}

let rafId = null
const xRange = [-5, 5]
const yRange = [-1.5, 3]

function draw() {
  const canvas = canvasRef.value
  const chart = chartRef.value
  if (!canvas || !chart) return

  const w = chart.clientWidth
  const h = 350
  const dpr = window.devicePixelRatio || 1
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  const pad = { top: 20, right: 20, bottom: 30, left: 50 }
  const cw = w - pad.left - pad.right
  const ch = h - pad.top - pad.bottom

  ctx.clearRect(0, 0, w, h)

  function toScreen(x, y) {
    const sx = pad.left + (x - xRange[0]) / (xRange[1] - xRange[0]) * cw
    const sy = pad.top + (1 - (y - yRange[0]) / (yRange[1] - yRange[0])) * ch
    return { x: sx, y: sy }
  }

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
    const s = toScreen(x, 0)
    ctx.beginPath(); ctx.moveTo(s.x, pad.top); ctx.lineTo(s.x, h - pad.bottom); ctx.stroke()
    ctx.fillStyle = '#6b7280'; ctx.font = '11px Inter'; ctx.textAlign = 'center'
    ctx.fillText(x, s.x, h - pad.bottom + 15)
  }
  for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
    const s = toScreen(0, y)
    ctx.beginPath(); ctx.moveTo(pad.left, s.y); ctx.lineTo(w - pad.right, s.y); ctx.stroke()
    ctx.fillStyle = '#6b7280'; ctx.font = '11px Inter'; ctx.textAlign = 'right'
    ctx.fillText(y, pad.left - 8, s.y + 4)
  }

  // Zero lines
  const origin = toScreen(0, 0)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(pad.left, origin.y); ctx.lineTo(w - pad.right, origin.y); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(origin.x, pad.top); ctx.lineTo(origin.x, h - pad.bottom); ctx.stroke()

  // Draw functions
  activeFunctions.forEach(key => {
    const f = fns[key]
    ctx.beginPath()
    ctx.strokeStyle = f.color
    ctx.lineWidth = 2.5

    for (let px = 0; px <= cw; px++) {
      const x = xRange[0] + (px / cw) * (xRange[1] - xRange[0])
      const y = f.fn(x)
      const s = toScreen(x, y)
      if (px === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    }
    ctx.stroke()
  })

  // Mouse crosshair
  if (mouseX.value >= 0) {
    const x = xRange[0] + ((mouseX.value - pad.left) / cw) * (xRange[1] - xRange[0])
    currentX.value = x
    const sx = toScreen(x, 0).x

    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(sx, pad.top); ctx.lineTo(sx, h - pad.bottom); ctx.stroke()
    ctx.setLineDash([])

    // Points on curves
    activeFunctions.forEach(key => {
      const f = fns[key]
      const y = f.fn(x)
      const s = toScreen(x, y)
      ctx.beginPath()
      ctx.arc(s.x, s.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = f.color
      ctx.fill()
      ctx.beginPath()
      ctx.arc(s.x, s.y, 8, 0, Math.PI * 2)
      ctx.strokeStyle = f.color
      ctx.lineWidth = 1.5
      ctx.stroke()
    })
  }

  rafId = requestAnimationFrame(draw)
}

function handleMouseMove(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  tooltipPos.x = e.clientX - rect.left + 15
  tooltipPos.y = e.clientY - rect.top - 10
}

onMounted(() => draw())
onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>

<style scoped>
.activation-chart {
  border-radius: 16px; overflow: hidden;
  background: rgba(10,14,26,0.8); border: 1px solid var(--border-color);
}
.animation-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap; gap: 0.75rem;
}
.animation-header h3 { font-size: 1rem; font-weight: 600; }
.controls { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.fn-toggle {
  padding: 0.3rem 0.7rem; border-radius: 6px; border: 1.5px solid var(--border-color);
  background: transparent; font-size: 0.78rem; cursor: pointer;
  transition: all 0.2s; font-family: inherit; color: var(--text-muted);
}
.fn-toggle.active { background: rgba(0,212,255,0.08); }
.fn-toggle:hover { background: rgba(0,212,255,0.05); }
.chart-area { position: relative; padding: 0.5rem; }
.chart-canvas { width: 100%; display: block; cursor: crosshair; }
.tooltip {
  position: absolute; background: rgba(10,14,26,0.95); border: 1px solid var(--border-color);
  border-radius: 8px; padding: 0.6rem 0.8rem; font-size: 0.75rem;
  pointer-events: none; z-index: 10; min-width: 180px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.tooltip-x { font-weight: 600; margin-bottom: 0.3rem; color: var(--accent-blue); }
.tooltip-row { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.2rem; color: var(--text-secondary); }
.fn-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
</style>
