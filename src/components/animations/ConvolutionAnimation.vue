<template>
  <div class="convolution-animation">
    <div class="animation-header">
      <h3>卷积操作动画</h3>
      <div class="controls">
        <button @click="togglePlay" class="ctrl-btn">{{ isPlaying ? '⏸ 暂停' : '▶ 播放' }}</button>
        <button @click="reset" class="ctrl-btn">↺ 重置</button>
        <label class="speed-control">
          速度
          <input type="range" v-model.number="speed" min="0.3" max="3" step="0.1" />
          <span>{{ speed.toFixed(1) }}x</span>
        </label>
      </div>
    </div>
    <div class="conv-content">
      <div class="conv-section">
        <div class="section-label">输入特征图 (5×5)</div>
        <canvas ref="inputCanvas" width="250" height="250" class="conv-canvas"></canvas>
      </div>
      <div class="conv-arrow">
        <span class="operator">*</span>
        <div class="kernel-editor">
          <div class="section-label">卷积核 (3×3)</div>
          <div class="kernel-grid">
            <input v-for="(v, i) in kernel" :key="i" type="number" v-model.number="kernel[i]" class="kernel-cell" @change="recalcOutput" />
          </div>
        </div>
      </div>
      <div class="conv-section">
        <div class="section-label">输出特征图 (3×3)</div>
        <canvas ref="outputCanvas" width="150" height="150" class="conv-canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const inputCanvas = ref(null)
const outputCanvas = ref(null)
const isPlaying = ref(true)
const speed = ref(1.0)

const input = [
  [1, 2, 0, 1, 3],
  [0, 1, 2, 3, 1],
  [1, 3, 1, 0, 2],
  [2, 0, 3, 1, 1],
  [1, 2, 1, 2, 0]
]

const kernel = ref([1, 0, -1, 1, 0, -1, 1, 0, -1])
const output = ref(Array(9).fill(null))

let rafId = null
let currentRow = 0
let currentCol = 0
let animProgress = 0
const cellSize = 50
const outCellSize = 50

function calculateOutput() {
  const k = kernel.value
  const result = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0
      for (let kr = 0; kr < 3; kr++) {
        for (let kc = 0; kc < 3; kc++) {
          sum += input[r + kr][c + kc] * k[kr * 3 + kc]
        }
      }
      result.push(sum)
    }
  }
  return result
}

function recalcOutput() {
  output.value = calculateOutput()
  drawOutput()
}

function drawInput() {
  const canvas = inputCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 250, 250)

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const val = input[r][c]
      const intensity = val / 3
      ctx.fillStyle = `rgba(0,212,255,${0.1 + intensity * 0.4})`
      ctx.fillRect(c * cellSize, r * cellSize, cellSize - 2, cellSize - 2)

      ctx.fillStyle = '#e5e7eb'
      ctx.font = '14px Inter'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(val, c * cellSize + cellSize/2, r * cellSize + cellSize/2)
    }
  }

  // Draw kernel highlight
  ctx.strokeStyle = '#00FFB3'
  ctx.lineWidth = 2
  ctx.strokeRect(currentCol * cellSize, currentRow * cellSize, 3 * cellSize, 3 * cellSize)

  // Fill kernel area with semi-transparent highlight
  ctx.fillStyle = 'rgba(0,255,179,0.1)'
  ctx.fillRect(currentCol * cellSize, currentRow * cellSize, 3 * cellSize, 3 * cellSize)
}

function drawOutput() {
  const canvas = outputCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 150, 150)

  const out = output.value
  const maxVal = Math.max(...out.filter(v => v !== null).map(Math.abs), 1)

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const idx = r * 3 + c
      const val = out[idx]

      if (val !== null) {
        const intensity = Math.abs(val) / maxVal
        if (val >= 0) {
          ctx.fillStyle = `rgba(0,255,179,${0.1 + intensity * 0.5})`
        } else {
          ctx.fillStyle = `rgba(255,71,87,${0.1 + intensity * 0.5})`
        }
        ctx.fillRect(c * outCellSize, r * outCellSize, outCellSize - 2, outCellSize - 2)

        ctx.fillStyle = '#e5e7eb'
        ctx.font = '14px Inter'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(val, c * outCellSize + outCellSize/2, r * outCellSize + outCellSize/2)
      } else {
        ctx.fillStyle = 'rgba(17,24,39,0.5)'
        ctx.fillRect(c * outCellSize, r * outCellSize, outCellSize - 2, outCellSize - 2)
        ctx.fillStyle = '#4b5563'
        ctx.font = '14px Inter'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('?', c * outCellSize + outCellSize/2, r * outCellSize + outCellSize/2)
      }
    }
  }
}

function animate() {
  if (!isPlaying.value) {
    rafId = requestAnimationFrame(animate)
    return
  }

  animProgress += 0.02 * speed.value

  if (animProgress >= 1) {
    animProgress = 0
    // Calculate current output cell
    const outIdx = currentRow * 3 + currentCol
    let sum = 0
    for (let kr = 0; kr < 3; kr++) {
      for (let kc = 0; kc < 3; kc++) {
        sum += input[currentRow + kr][currentCol + kc] * kernel.value[kr * 3 + kc]
      }
    }
    output.value[outIdx] = sum

    // Move to next position
    currentCol++
    if (currentCol >= 3) { currentCol = 0; currentRow++ }
    if (currentRow >= 3) { currentRow = 0; currentCol = 0; output.value = Array(9).fill(null) }

    drawOutput()
  }

  drawInput()
  rafId = requestAnimationFrame(animate)
}

function togglePlay() { isPlaying.value = !isPlaying.value }
function reset() {
  currentRow = 0; currentCol = 0; animProgress = 0
  output.value = Array(9).fill(null)
  drawInput(); drawOutput()
}

onMounted(() => {
  drawInput(); drawOutput(); animate()
})
onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>

<style scoped>
.convolution-animation {
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
.speed-control span { min-width: 30px; }
.conv-content {
  display: flex; align-items: center; justify-content: center;
  gap: 1.5rem; padding: 1.5rem; flex-wrap: wrap;
}
.conv-section { text-align: center; }
.section-label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.conv-canvas { border-radius: 8px; background: rgba(17,24,39,0.5); }
.conv-arrow {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
}
.operator { font-size: 1.5rem; color: var(--accent-blue); font-weight: bold; }
.kernel-editor { text-align: center; }
.kernel-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;
}
.kernel-cell {
  width: 45px; height: 45px; text-align: center; font-size: 0.85rem;
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 6px; color: var(--text-primary); font-family: 'JetBrains Mono', monospace;
}
.kernel-cell:focus { border-color: var(--accent-blue); outline: none; }
</style>
