<template>
  <div class="flow-container" ref="containerRef">
    <svg ref="svgRef" :viewBox="viewBox" class="flow-svg">
      <!-- 层间连线 -->
      <line v-for="(edge, ei) in edges" :key="'e' + ei"
        :x1="edge.x1" :y1="edge.y1" :x2="edge.x2" :y2="edge.y2"
        :stroke="edge.color" :stroke-width="edge.width"
        :opacity="edge.opacity" />

      <!-- 层标签 -->
      <text v-for="(layer, li) in layers" :key="'lt' + li"
        :x="getLayerX(li)" :y="topY - 15"
        text-anchor="middle" class="layer-label"
        :fill="layer.color || '#94a3b8'" font-size="11">
        {{ layer.name }} ({{ layer.activation }})
      </text>

      <!-- 节点 -->
      <g v-for="(layer, li) in layers" :key="'l' + li">
        <circle v-for="(node, ni) in layer.nodes" :key="'n' + ni"
          :cx="getLayerX(li)" :cy="getNodeY(li, ni)"
          :r="nodeRadius(li)"
          :fill="nodeColor(node)"
          :stroke="selectedNode && selectedNode.layerIdx === li && selectedNode.nodeIdx === ni ? '#f59e0b' : 'rgba(255,255,255,0.2)'"
          :stroke-width="selectedNode && selectedNode.layerIdx === li && selectedNode.nodeIdx === ni ? 2.5 : 1"
          class="flow-node"
          @click="selectNode(li, ni, node)" />
      </g>
    </svg>

    <!-- 节点详情弹窗 -->
    <div v-if="selectedNode" class="node-detail" :style="detailStyle">
      <div class="detail-header">
        <strong>{{ selectedNode.node.layer }} 节点 #{{ selectedNode.nodeIdx }}</strong>
        <button class="close-btn" @click="selectedNode = null">×</button>
      </div>
      <div class="detail-body">
        <div class="detail-section">
          <span class="detail-label">偏置 b</span>
          <span class="detail-value">{{ formatNum(selectedNode.node.bias) }}</span>
        </div>
        <div class="detail-section">
          <span class="detail-label">激活值 a</span>
          <span class="detail-value activation">{{ formatNum(selectedNode.node.activation) }}</span>
        </div>
        <div class="detail-section">
          <span class="detail-label">预激活 z</span>
          <span class="detail-value">{{ formatNum(selectedNode.node.preActivation) }}</span>
        </div>
        <div class="detail-section">
          <span class="detail-label">输入权重</span>
        </div>
        <div class="weight-list">
          <div v-for="(w, wi) in selectedNode.node.weights" :key="'w' + wi" class="weight-row">
            <span class="weight-index">w{{ wi }}</span>
            <div class="weight-bar-wrap">
              <div class="weight-bar" :style="{ width: weightBarWidth(w) + '%', background: weightColor(w) }"></div>
            </div>
            <span class="weight-val">{{ formatNum(w) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 训练数据流动画指示器 -->
    <div v-if="flowAnimating" class="flow-indicator">
      <span v-if="isForward">数据流动中 →</span>
      <span v-else>← 梯度回传中</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  networkState: { type: Object, default: () => ({ layers: [] }) },
  isForward: { type: Boolean, default: true }
})

const containerRef = ref(null)
const svgRef = ref(null)
const selectedNode = ref(null)
const flowAnimating = ref(false)

const topY = 30
const layerGap = 100
const nodeGap = 22
const padding = 40

const viewBox = computed(() => {
  const w = Math.max(400, props.networkState.layers.length * layerGap + padding * 2)
  const maxNodes = Math.max(...props.networkState.layers.map(l => l.size), 1)
  const h = maxNodes * nodeGap + topY + 60
  return `0 0 ${w} ${h}`
})

const layers = computed(() => {
  return props.networkState.layers.map((l, li) => {
    const maxSize = Math.max(...props.networkState.layers.map(x => x.size))
    const nodes = []
    for (let i = 0; i < l.size; i++) {
      const prevWeights = li > 0 ? props.networkState.layers[li - 1].weights.map(row => row[i]) : []
      nodes.push({
        bias: l.biases[i],
        activation: l.activations[i],
        preActivation: l.preActivation[i],
        weights: prevWeights,
        layer: l.name
      })
    }
    return {
      name: l.name,
      activation: l.activationFn,
      size: l.size,
      maxSize,
      nodes,
      color: li === 0 ? '#60a5fa' : li === props.networkState.layers.length - 1 ? '#f472b6' : '#a78bfa'
    }
  })
})

const edges = computed(() => {
  const result = []
  for (let li = 1; li < props.networkState.layers.length; li++) {
    const prev = props.networkState.layers[li - 1]
    const curr = props.networkState.layers[li]
    for (let p = 0; p < prev.size; p++) {
      for (let c = 0; c < curr.size; c++) {
        const w = curr.weights[c][p]
        const absW = Math.abs(w)
        result.push({
          x1: getLayerX(li - 1), y1: getNodeY(li - 1, p),
          x2: getLayerX(li), y2: getNodeY(li, c),
          color: w > 0 ? 'rgba(96,165,250,0.35)' : 'rgba(248,113,113,0.35)',
          width: Math.max(0.5, Math.min(3, absW * 5)),
          opacity: Math.max(0.08, Math.min(0.5, absW * 0.8))
        })
      }
    }
  }
  return result
})

function getLayerX(li) {
  return padding + li * layerGap
}
function getNodeY(li, ni) {
  const layer = props.networkState.layers[li]
  const maxSize = Math.max(...props.networkState.layers.map(x => x.size))
  const offset = (maxSize - layer.size) * nodeGap / 2
  return topY + offset + ni * nodeGap + 20
}
function nodeRadius(li) {
  return li === 0 ? 8 : li === props.networkState.layers.length - 1 ? 8 : 7
}
function nodeColor(node) {
  const act = Math.abs(node.activation)
  if (act > 0.8) return '#34d399'
  if (act > 0.4) return '#60a5fa'
  if (act > 0.1) return '#818cf8'
  return '#475569'
}

function selectNode(li, ni, node) {
  selectedNode.value = { layerIdx: li, nodeIdx: ni, node }
}

const detailStyle = computed(() => {
  if (!selectedNode.value) return {}
  const x = getLayerX(selectedNode.value.layerIdx)
  const y = getNodeY(selectedNode.value.layerIdx, selectedNode.value.nodeIdx)
  return {
    left: Math.min(x + 30, window.innerWidth - 270) + 'px',
    top: Math.min(Math.max(y - 50, 60), window.innerHeight - 350) + 'px'
  }
})

function formatNum(n) {
  if (typeof n !== 'number' || isNaN(n)) return '0'
  return Math.abs(n) < 0.001 ? n.toExponential(3) : n.toFixed(4)
}
function weightBarWidth(w) {
  return Math.min(100, Math.abs(w) * 200)
}
function weightColor(w) {
  return w > 0 ? '#34d399' : '#f87171'
}

const emit = defineEmits(['node-click'])
watch(selectedNode, (val) => {
  if (val) emit('node-click', val)
})

defineExpose({ triggerFlowAnimation })
function triggerFlowAnimation(forward = true) {
  flowAnimating.value = true
  setTimeout(() => { flowAnimating.value = false }, 800)
}
</script>

<style scoped>
.flow-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 250px;
  overflow: auto;
}
.flow-svg {
  width: 100%;
  min-height: 250px;
}
.flow-node {
  cursor: pointer;
  transition: all 0.15s;
}
.flow-node:hover {
  filter: brightness(1.5);
  stroke: #f59e0b !important;
}
.layer-label {
  font-family: 'Courier New', monospace;
}
.node-detail {
  position: absolute;
  width: 240px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  padding: 0.75rem;
  z-index: 20;
  backdrop-filter: blur(12px);
  pointer-events: auto;
}
.detail-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem; color: #e2e8f0;
}
.close-btn {
  background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem;
}
.close-btn:hover { color: #f87171; }
.detail-body { font-size: 0.78rem; }
.detail-section {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.25rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.detail-label { color: #94a3b8; }
.detail-value { color: #e2e8f0; font-family: 'Courier New', monospace; }
.detail-value.activation { color: #34d399; font-weight: 600; }
.weight-list { max-height: 180px; overflow-y: auto; margin-top: 0.25rem; }
.weight-row { display: flex; align-items: center; gap: 0.35rem; padding: 0.15rem 0; }
.weight-index { color: #64748b; font-size: 0.7rem; width: 22px; text-align: right; }
.weight-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
.weight-bar { height: 100%; border-radius: 3px; transition: width 0.3s; }
.weight-val { color: #94a3b8; font-size: 0.7rem; font-family: 'Courier New', monospace; width: 52px; text-align: right; }
.flow-indicator {
  position: absolute; top: 5px; right: 10px;
  background: rgba(59,130,246,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;
  font-size: 0.7rem; color: #60a5fa;
}
</style>
