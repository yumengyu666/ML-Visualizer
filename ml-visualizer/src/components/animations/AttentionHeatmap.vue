<template>
  <div class="attention-heatmap">
    <div class="animation-header">
      <h3>Self-Attention 热力图</h3>
      <div class="controls">
        <button @click="toggleMode" class="ctrl-btn">{{ showHeatmap ? '热力图' : '连线图' }}</button>
        <button @click="resetAnimation" class="ctrl-btn">↺ 重置</button>
      </div>
    </div>
    <div class="attention-content">
      <div class="token-row">
        <div v-for="(token, i) in tokens" :key="i" class="token" :class="{ active: hoverToken === i }"
          @mouseenter="hoverToken = i" @mouseleave="hoverToken = -1"
          :style="{ opacity: animProgress > i * 0.1 ? 1 : 0.3 }">
          {{ token }}
        </div>
      </div>
      <div class="attention-visual" ref="visualRef">
        <canvas ref="canvasRef" class="attention-canvas"></canvas>
      </div>
      <div class="token-row bottom">
        <div v-for="(token, i) in tokens" :key="i" class="token target"
          :class="{ active: hoverToken === i }"
          :style="{ opacity: animProgress > i * 0.1 + 0.5 ? 1 : 0.3 }">
          {{ token }}
        </div>
      </div>
    </div>
    <div class="heatmap-legend">
      <span class="legend-label">低权重</span>
      <div class="gradient-bar"></div>
      <span class="legend-label">高权重</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
const visualRef = ref(null)
const hoverToken = ref(-1)
const showHeatmap = ref(true)
const animProgress = ref(0)

const tokens = ['我', '喜欢', '机器', '学习', '和', '深度', '学习']

// Simulated attention weights (7x7)
const attentionWeights = [
  [0.8, 0.1, 0.02, 0.02, 0.02, 0.02, 0.02],
  [0.15, 0.5, 0.15, 0.1, 0.02, 0.03, 0.05],
  [0.05, 0.1, 0.5, 0.25, 0.02, 0.03, 0.05],
  [0.05, 0.05, 0.3, 0.4, 0.05, 0.05, 0.1],
  [0.05, 0.05, 0.05, 0.1, 0.5, 0.15, 0.1],
  [0.05, 0.05, 0.1, 0.2, 0.05, 0.4, 0.15],
  [0.05, 0.1, 0.1, 0.35, 0.02, 0.08, 0.3],
]

let rafId = null

function heatColor(value) {
  if (value < 0.25) return `rgba(0,50,100,${0.3 + value * 2})`
  if (value < 0.5) return `rgba(0,150,200,${0.3 + value})`
  if (value < 0.75) return `rgba(0,212,255,${0.3 + value * 0.8})`
  return `rgba(0,255,179,${0.5 + value * 0.5})`
}

function drawHeatmap() {
  const canvas = canvasRef.value
  const visual = visualRef.value
  if (!canvas || !visual) return

  const w = visual.clientWidth
  const h = 200
  const dpr = window.devicePixelRatio || 1
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, w, h)

  const n = tokens.length
  const cellW = w / n
  const cellH = h / n

  if (showHeatmap.value) {
    // Draw heatmap grid
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const weight = attentionWeights[r][c]
        const progress = Math.min(1, animProgress.value - r * 0.1)
        if (progress <= 0) continue

        const isHighlighted = hoverToken.value === r || hoverToken.value === c
        const alpha = isHighlighted ? 1 : (hoverToken.value >= 0 ? 0.3 : 1)

        ctx.globalAlpha = alpha
        ctx.fillStyle = heatColor(weight)
        ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2)

        if (weight > 0.3) {
          ctx.fillStyle = '#fff'
          ctx.font = '11px Inter'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(weight.toFixed(2), c * cellW + cellW/2, r * cellH + cellH/2)
        }
      }
    }
    ctx.globalAlpha = 1
  } else {
    // Draw connection lines
    const topY = 10
    const bottomY = h - 10
    const tokenSpacing = w / n

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const weight = attentionWeights[r][c]
        if (weight < 0.05) continue

        const isHighlighted = hoverToken.value === r || hoverToken.value === c
        const alpha = isHighlighted ? weight : (hoverToken.value >= 0 ? weight * 0.2 : weight * 0.6)
        const lineWidth = weight * 4

        ctx.beginPath()
        ctx.moveTo(r * tokenSpacing + tokenSpacing/2, topY)
        ctx.lineTo(c * tokenSpacing + tokenSpacing/2, bottomY)
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`
        ctx.lineWidth = lineWidth
        ctx.stroke()
      }
    }
  }
}

function animate() {
  if (animProgress.value < 2) {
    animProgress.value += 0.02
  }
  drawHeatmap()
  rafId = requestAnimationFrame(animate)
}

function toggleMode() { showHeatmap.value = !showHeatmap.value }
function resetAnimation() { animProgress.value = 0 }

onMounted(() => animate())
onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>

<style scoped>
.attention-heatmap {
  border-radius: 16px; overflow: hidden;
  background: rgba(10,14,26,0.8); border: 1px solid var(--border-color);
}
.animation-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-color);
}
.animation-header h3 { font-size: 1rem; font-weight: 600; }
.controls { display: flex; gap: 0.5rem; }
.ctrl-btn {
  padding: 0.35rem 0.75rem; border-radius: 8px; border: 1px solid var(--border-color);
  background: var(--bg-surface); color: var(--text-secondary); font-size: 0.8rem;
  cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.ctrl-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
.attention-content { padding: 1.5rem; }
.token-row {
  display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 0.75rem;
}
.token-row.bottom { margin-top: 0.75rem; margin-bottom: 0; }
.token {
  padding: 0.35rem 0.75rem; border-radius: 8px; font-size: 0.9rem;
  background: var(--bg-surface); border: 1px solid var(--border-color);
  color: var(--text-secondary); cursor: pointer;
  transition: all 0.2s; user-select: none;
}
.token.active {
  border-color: var(--accent-blue); color: var(--accent-blue);
  background: rgba(0,212,255,0.1);
  box-shadow: 0 0 10px rgba(0,212,255,0.2);
}
.token.target { cursor: default; }
.attention-visual { width: 100%; }
.attention-canvas { width: 100%; display: block; }
.heatmap-legend {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.75rem; border-top: 1px solid var(--border-color);
}
.legend-label { font-size: 0.7rem; color: var(--text-muted); }
.gradient-bar {
  width: 120px; height: 8px; border-radius: 4px;
  background: linear-gradient(90deg, rgba(0,50,100,0.8), rgba(0,150,200,0.8), rgba(0,212,255,0.9), rgba(0,255,179,1));
}
</style>
