<template>
  <div class="training-dashboard">
    <div class="animation-header">
      <h3>训练过程仪表盘</h3>
      <div class="controls">
        <button @click="togglePlay" class="ctrl-btn">{{ isPlaying ? '⏸ 暂停' : '▶ 播放' }}</button>
        <button @click="reset" class="ctrl-btn">↺ 重置</button>
        <label class="speed-control">
          速度
          <input type="range" v-model.number="speed" min="1" max="10" step="1" />
          <span>{{ speed }}x</span>
        </label>
      </div>
    </div>
    <div class="dashboard-content">
      <div class="chart-section">
        <div class="chart-label">损失曲线 (Loss)</div>
        <canvas ref="lossCanvas" class="chart-canvas"></canvas>
      </div>
      <div class="chart-section">
        <div class="chart-label">准确率 (Accuracy)</div>
        <canvas ref="accCanvas" class="chart-canvas"></canvas>
      </div>
    </div>
    <div class="stats-bar">
      <div class="stat">
        <span class="stat-label">Epoch</span>
        <span class="stat-value">{{ epoch }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">训练损失</span>
        <span class="stat-value loss-color">{{ trainLoss.length ? trainLoss[trainLoss.length-1].toFixed(4) : '-' }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">验证损失</span>
        <span class="stat-value val-color">{{ valLoss.length ? valLoss[valLoss.length-1].toFixed(4) : '-' }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">训练准确率</span>
        <span class="stat-value acc-color">{{ trainAcc.length ? (trainAcc[trainAcc.length-1]*100).toFixed(1) + '%' : '-' }}</span>
      </div>
      <div class="stat" v-if="overfittingStart > 0">
        <span class="stat-label overfitting">⚠ 过拟合</span>
        <span class="stat-value overfitting-color">Epoch {{ overfittingStart }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const lossCanvas = ref(null)
const accCanvas = ref(null)
const isPlaying = ref(true)
const speed = ref(3)
const epoch = ref(0)
const trainLoss = ref([])
const valLoss = ref([])
const trainAcc = ref([])
const valAcc = ref([])
const overfittingStart = ref(0)

let rafId = null
let frameCount = 0

function generateTrainData(e) {
  const baseLoss = 2.5 * Math.exp(-e * 0.08) + 0.15
  const noise = (Math.random() - 0.5) * 0.05
  return Math.max(0.01, baseLoss + noise)
}

function generateValData(e) {
  const baseLoss = 2.5 * Math.exp(-e * 0.06) + 0.2
  // Simulate overfitting after epoch 40
  const overfit = e > 40 ? (e - 40) * 0.01 : 0
  const noise = (Math.random() - 0.5) * 0.06
  return Math.max(0.01, baseLoss + overfit + noise)
}

function generateTrainAcc(e) {
  return Math.min(0.99, 0.3 + 0.65 * (1 - Math.exp(-e * 0.07)) + (Math.random() - 0.5) * 0.02)
}

function generateValAcc(e) {
  const max = e > 40 ? 0.88 - (e - 40) * 0.001 : 0.88
  return Math.min(max, 0.3 + 0.55 * (1 - Math.exp(-e * 0.06)) + (Math.random() - 0.5) * 0.02)
}

function stepTraining() {
  const e = epoch.value + 1
  epoch.value = e

  trainLoss.value.push(generateTrainData(e))
  valLoss.value.push(generateValData(e))
  trainAcc.value.push(generateTrainAcc(e))
  valAcc.value.push(generateValAcc(e))

  // Detect overfitting
  if (valLoss.value.length > 5 && overfittingStart.value === 0) {
    const recent = valLoss.value.slice(-5)
    if (recent[4] > recent[0] && e > 30) {
      overfittingStart.value = e - 3
    }
  }

  if (e >= 100) {
    isPlaying.value = false
  }
}

function drawChart(canvas, data1, data2, label1, label2, color1, color2, isLoss) {
  if (!canvas) return
  const parent = canvas.parentElement
  const w = parent.clientWidth
  const h = 200
  const dpr = window.devicePixelRatio || 1
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, w, h)

  const pad = { top: 10, right: 10, bottom: 25, left: 45 }
  const cw = w - pad.left - pad.right
  const ch = h - pad.top - pad.bottom

  const allData = [...data1, ...data2]
  const maxVal = Math.max(...allData, 0.1)
  const minVal = Math.min(...allData, 0)
  const range = maxVal - minVal || 1

  function toScreen(i, v) {
    const x = pad.left + (i / Math.max(data1.length - 1, 1)) * cw
    const y = pad.top + (1 - (v - minVal) / range) * ch
    return { x, y }
  }

  // Overfitting region
  if (isLoss && overfittingStart.value > 0) {
    const startX = pad.left + ((overfittingStart.value - 1) / Math.max(data1.length - 1, 1)) * cw
    ctx.fillStyle = 'rgba(255,71,87,0.08)'
    ctx.fillRect(startX, pad.top, w - pad.right - startX, ch)

    ctx.strokeStyle = 'rgba(255,71,87,0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(startX, pad.top)
    ctx.lineTo(startX, h - pad.bottom)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // Draw lines
  function drawLine(data, color) {
    if (data.length < 2) return
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    data.forEach((v, i) => {
      const s = toScreen(i, v)
      if (i === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    })
    ctx.stroke()
  }

  drawLine(data1, color1)
  drawLine(data2, color2)

  // Axis labels
  ctx.fillStyle = '#6b7280'
  ctx.font = '10px Inter'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 4; i++) {
    const val = minVal + (range * i / 4)
    const s = toScreen(0, val)
    ctx.fillText(val.toFixed(2), pad.left - 5, s.y + 3)
  }
  ctx.textAlign = 'center'
  const step = Math.max(1, Math.floor(data1.length / 5))
  for (let i = 0; i < data1.length; i += step) {
    const s = toScreen(i, minVal)
    ctx.fillText(i + 1, s.x, h - pad.bottom + 15)
  }
}

function animate() {
  frameCount++
  if (isPlaying.value && frameCount % Math.max(1, 6 - speed.value) === 0) {
    stepTraining()
  }

  drawChart(lossCanvas.value, trainLoss.value, valLoss.value, '训练', '验证', '#00D4FF', '#7B61FF', true)
  drawChart(accCanvas.value, trainAcc.value, valAcc.value, '训练', '验证', '#00FFB3', '#FFD93D', false)

  rafId = requestAnimationFrame(animate)
}

function togglePlay() { isPlaying.value = !isPlaying.value }
function reset() {
  epoch.value = 0; trainLoss.value = []; valLoss.value = []
  trainAcc.value = []; valAcc.value = []; overfittingStart.value = 0
  isPlaying.value = true; frameCount = 0
}

onMounted(() => animate())
onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>

<style scoped>
.training-dashboard {
  border-radius: 16px; overflow: hidden;
  background: rgba(10,14,26,0.8); border: 1px solid var(--border-color);
}
.animation-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap; gap: 0.75rem;
}
.animation-header h3 { font-size: 1rem; font-weight: 600; }
.controls { display: flex; align-items: center; gap: 0.5rem; }
.ctrl-btn {
  padding: 0.35rem 0.75rem; border-radius: 8px; border: 1px solid var(--border-color);
  background: var(--bg-surface); color: var(--text-secondary); font-size: 0.8rem;
  cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.ctrl-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
.speed-control {
  display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-secondary);
}
.speed-control input[type="range"] { width: 80px; accent-color: var(--accent-blue); }
.speed-control span { min-width: 25px; }
.dashboard-content {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
  padding: 1rem 1.25rem;
}
@media (max-width: 768px) { .dashboard-content { grid-template-columns: 1fr; } }
.chart-section { }
.chart-label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.4rem; }
.chart-canvas { width: 100%; height: 200px; background: rgba(17,24,39,0.3); border-radius: 8px; }
.stats-bar {
  display: flex; gap: 1.5rem; padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border-color); flex-wrap: wrap;
}
.stat { display: flex; flex-direction: column; align-items: center; }
.stat-label { font-size: 0.7rem; color: var(--text-muted); }
.stat-value { font-size: 0.9rem; font-weight: 600; font-family: 'JetBrains Mono', monospace; }
.loss-color { color: #00D4FF; }
.val-color { color: #7B61FF; }
.acc-color { color: #00FFB3; }
.overfitting { color: #FF4757; }
.overfitting-color { color: #FF4757; }
</style>
