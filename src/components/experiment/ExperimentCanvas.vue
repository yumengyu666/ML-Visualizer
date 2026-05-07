<template>
  <div class="canvas-container" ref="containerRef">
    <canvas ref="canvasRef" @click="handleClick" @mousemove="handleMove" @mouseleave="hoverPoint = null" />
    <div class="canvas-legend">
      <span class="legend-dot pos"></span> 正类 &nbsp;
      <span class="legend-dot neg"></span> 负类 &nbsp;
      <span class="legend-hint">背景=网络预测</span>
    </div>
    <div v-if="hoverPred !== null" class="hover-tip" :style="hoverStyle">
      预测: {{ formatNum(hoverPred) }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  predictFn: { type: Function, default: null },
  dataset: { type: Array, default: () => [] },
  epoch: { type: Number, default: 0 },
  hasNetwork: { type: Boolean, default: false }
})

const canvasRef = ref(null)
const containerRef = ref(null)
const hoverPoint = ref(null)
const hoverPred = ref(null)
const hoverStyle = ref({})

const RES = 80 // 决策边界分辨率
const PADDING = 30

let gridCache = null

onMounted(() => draw())

watch(() => [props.epoch, props.dataset, props.hasNetwork], () => {
  nextTick(draw)
}, { deep: true })

function getRange() {
  const points = props.dataset.flatMap(d => d.input)
  if (points.length === 0) return { xMin: -1, xMax: 1, yMin: -1, yMax: 1 }
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity
  for (const d of props.dataset) {
    xMin = Math.min(xMin, d.input[0]); xMax = Math.max(xMax, d.input[0])
    yMin = Math.min(yMin, d.input[1] || 0); yMax = Math.max(yMax, d.input[1] || 0)
  }
  const padX = Math.max(0.5, (xMax - xMin) * 0.3)
  const padY = Math.max(0.5, (yMax - yMin) * 0.3)
  return { xMin: xMin - padX, xMax: xMax + padX, yMin: yMin - padY, yMax: yMax + padY }
}

function toCanvas(cx, cy, range, w, h) {
  const sx = PADDING + ((cx - range.xMin) / (range.xMax - range.xMin)) * (w - PADDING * 2)
  const sy = PADDING + ((range.yMax - cy) / (range.yMax - range.yMin)) * (h - PADDING * 2)
  return { x: sx, y: sy }
}

function fromCanvas(sx, sy, range, w, h) {
  const cx = range.xMin + ((sx - PADDING) / (w - PADDING * 2)) * (range.xMax - range.xMin)
  const cy = range.yMax - ((sy - PADDING) / (h - PADDING * 2)) * (range.yMax - range.yMin)
  return { x: cx, y: cy }
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = containerRef.value
  const w = parent ? parent.clientWidth : 400
  const h = Math.max(300, w * 0.75)
  canvas.width = w * 2
  canvas.height = h * 2
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'

  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)
  ctx.clearRect(0, 0, w, h)

  const range = getRange()

  // 1. 绘制决策边界背景（如果有网络）
  if (props.hasNetwork && props.predictFn) {
    for (let ix = 0; ix < RES; ix++) {
      for (let iy = 0; iy < RES; iy++) {
        const cx = range.xMin + (ix / RES) * (range.xMax - range.xMin)
        const cy = range.yMin + (iy / RES) * (range.yMax - range.yMin)
        const pred = props.predictFn([cx, cy])
        const p = Array.isArray(pred) ? pred[0] : pred
        const { x, y } = toCanvas(cx, cy, range, w, h)
        const cellW = (w - PADDING * 2) / RES
        const cellH = (h - PADDING * 2) / RES
        if (p > 0.5) {
          ctx.fillStyle = `rgba(239, 68, 68, ${Math.min(0.8, (p - 0.5) * 1.6)})`
        } else {
          ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.8, (0.5 - p) * 1.6)})`
        }
        ctx.fillRect(x, y, cellW + 1, cellH + 1)
      }
    }
  }

  // 2. 绘制网格线
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
  ctx.lineWidth = 0.5
  for (let ix = 0; ix <= 8; ix++) {
    const x = PADDING + (ix / 8) * (w - PADDING * 2)
    ctx.beginPath(); ctx.moveTo(x, PADDING); ctx.lineTo(x, h - PADDING); ctx.stroke()
  }
  for (let iy = 0; iy <= 6; iy++) {
    const y = PADDING + (iy / 6) * (h - PADDING * 2)
    ctx.beginPath(); ctx.moveTo(PADDING, y); ctx.lineTo(w - PADDING, y); ctx.stroke()
  }

  // 3. 绘制坐标轴
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
  ctx.lineWidth = 1
  const origin = toCanvas(0, 0, range, w, h)
  if (origin.x >= PADDING && origin.x <= w - PADDING) {
    ctx.beginPath(); ctx.moveTo(origin.x, PADDING); ctx.lineTo(origin.x, h - PADDING); ctx.stroke()
  }
  if (origin.y >= PADDING && origin.y <= h - PADDING) {
    ctx.beginPath(); ctx.moveTo(PADDING, origin.y); ctx.lineTo(w - PADDING, origin.y); ctx.stroke()
  }

  // 4. 绘制数据点
  for (const d of props.dataset) {
    const { x, y } = toCanvas(d.input[0], d.input[1] || 0, range, w, h)
    const cls = d.target[0]
    const isHovered = hoverPoint.value && hoverPoint.value.d === d

    ctx.beginPath()
    ctx.arc(x, y, isHovered ? 7 : 5, 0, Math.PI * 2)
    ctx.fillStyle = cls > 0.5 ? '#f87171' : '#60a5fa'
    ctx.fill()
    ctx.strokeStyle = isHovered ? '#fff' : 'rgba(0,0,0,0.3)'
    ctx.lineWidth = isHovered ? 2 : 1
    ctx.stroke()

    // 如果被悬停，显示预测值
    if (isHovered && props.predictFn) {
      const pred = props.predictFn(d.input)
      const p = Array.isArray(pred) ? pred[0] : pred
      ctx.fillStyle = '#fff'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`${p.toFixed(3)}`, x, y - 10)
    }
  }

  // 5. 标签
  ctx.fillStyle = '#94a3b8'
  ctx.font = '10px monospace'
  ctx.textAlign = 'right'
  ctx.fillText(`x: ${range.xMax.toFixed(1)}`, w - PADDING, h - 5)
  ctx.fillText(`y: ${range.yMax.toFixed(1)}`, w - 5, PADDING + 10)
  ctx.textAlign = 'left'
  ctx.fillText(`x: ${range.xMin.toFixed(1)}`, PADDING, h - 5)
  ctx.fillText(`y: ${range.yMin.toFixed(1)}`, PADDING + 2, PADDING + 10)
}

function handleClick(e) {
  const canvas = canvasRef.value
  if (!canvas || !props.predictFn) return
  const rect = canvas.getBoundingClientRect()
  const sx = e.clientX - rect.left
  const sy = e.clientY - rect.top
  const w = parseInt(canvas.style.width)
  const h = parseInt(canvas.style.height)
  const range = getRange()
  const pt = fromCanvas(sx, sy, range, w, h)
  const pred = props.predictFn([pt.x, pt.y])
  // 添加为临时数据点？这里仅显示
}

function handleMove(e) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const sx = e.clientX - rect.left
  const sy = e.clientY - rect.top
  const w = parseInt(canvas.style.width)
  const h = parseInt(canvas.style.height)
  const range = getRange()
  const pt = fromCanvas(sx, sy, range, w, h)

  // 检查是否悬停在数据点上
  let found = null
  for (const d of props.dataset) {
    const { x, y } = toCanvas(d.input[0], d.input[1] || 0, range, w, h)
    if (Math.sqrt((sx - x) ** 2 + (sy - y) ** 2) < 10) {
      found = d
      break
    }
  }
  hoverPoint.value = found ? { d: found } : null
  if (props.predictFn) {
    hoverPred.value = props.predictFn([pt.x, pt.y])
    hoverStyle.value = { left: (sx + 15) + 'px', top: (sy - 10) + 'px' }
  } else {
    hoverPred.value = null
  }
}

function formatNum(n) {
  if (typeof n !== 'number' || isNaN(n)) return '0'
  const val = Array.isArray(hoverPred.value) ? hoverPred.value : [n]
  return (Array.isArray(val) ? val[0] : val).toFixed(4)
}

defineExpose({ refresh: draw })
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%; aspect-ratio: 4/3; min-height: 300px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
}
canvas {
  display: block; width: 100%; height: 100%; cursor: crosshair;
}
.canvas-legend {
  position: absolute; top: 8px; left: 12px;
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.68rem; color: #94a3b8; pointer-events: none;
}
.legend-dot {
  width: 8px; height: 8px; border-radius: 50%; display: inline-block;
}
.legend-dot.pos { background: #f87171; }
.legend-dot.neg { background: #60a5fa; }
.legend-hint { color: #64748b; }
.hover-tip {
  position: absolute; pointer-events: none;
  background: rgba(15, 23, 42, 0.9); color: #e2e8f0;
  padding: 0.15rem 0.35rem; border-radius: 3px;
  font-size: 0.7rem; font-family: 'Courier New', monospace;
}
</style>
