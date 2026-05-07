<template>
  <Teleport to="body">
    <Transition name="lab-fade">
      <div v-if="visible" class="lab-overlay" @click.self="onOverlayClick">
        <div class="lab-panel">
          <!-- 顶栏 -->
          <div class="lab-header">
            <span class="lab-icon">🔬</span>
            <span class="lab-title">{{ config?.title || '实验台' }}</span>
            <span class="lab-mode">{{ modeLabel }}</span>
            <span v-if="isTraining" class="badge-training">训练中 {{ currentEpoch }}</span>
            <button class="lab-close" @click="emit('close')">✕</button>
          </div>

          <div class="lab-body">
            <!-- 左栏 -->
            <div class="pane-l">
              <h4>📊 数据集</h4>
              <div class="ds-grid">
                <button v-for="ds in dsList" :key="ds.name"
                  :class="['ds-btn', { on: activeDs === ds.name }]"
                  @click="loadDs(ds)">
                  {{ ds.name }}<span class="ds-n">{{ ds.data.length }}</span>
                </button>
              </div>
              <h4>🧠 网络</h4>
              <div class="arch-row">
                <span v-for="(s,i) in archSizes" :key="i" class="arch-node">{{ s }}</span>
              </div>
              <div class="arch-acts">{{ config?.activations?.join(' → ') }}</div>
            </div>

            <!-- 中栏：按模式渲染不同面板 -->
            <div class="pane-c">
              <Classification2D v-if="mode === 'classification-2d'"
                :predict-fn="predictWrap" :dataset="currentData"
                :epoch="currentEpoch" :has-network="hasRun" />
              <Regression1D v-else-if="mode === 'regression-1d'"
                :predict-fn="predictWrap" :dataset="currentData"
                :epoch="currentEpoch" :has-network="hasRun" />
              <NetworkFlow v-else-if="mode === 'network-flow'"
                :network-state="netState" @node-click="onNodeClick" />
              <FunctionPlot v-else-if="mode === 'function-plot'"
                :functions="config?.functions || []" />
              <div v-else class="pane-c-empty">实验类型: {{ mode }}</div>

              <!-- 节点详情浮层 -->
              <div v-if="selNode" class="nd-popup" :style="ndStyle">
                <div class="nd-head">{{ selNode.node.layer }} 节点 #{{ selNode.nodeIdx }} <button @click="selNode=null">×</button></div>
                <div class="nd-row"><span>偏置</span><span>{{ fmt(selNode.node.bias) }}</span></div>
                <div class="nd-row"><span>激活</span><span class="c-g">{{ fmt(selNode.node.activation) }}</span></div>
                <div class="nd-row"><span>预激活</span><span>{{ fmt(selNode.node.preActivation) }}</span></div>
                <div class="nd-weights">
                  <div v-for="(w,wi) in selNode.node.weights" :key="wi" class="nd-w">
                    <div class="nd-wb" :style="{ width: bw(w)+'%', background: w>0?'#34d399':'#f87171' }"></div>
                    <span>{{ fmt(w) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右栏 -->
            <div class="pane-r">
              <h4>⚙️ 控制</h4>
              <label>学习率 {{ lr.toFixed(4) }}</label>
              <input type="range" v-model.number="lr" min="0.001" max="1" step="0.001" class="sl" />
              <label>每批 {{ eb }} Epochs</label>
              <input type="range" v-model.number="eb" min="1" max="100" class="sl" />
              <div class="btns">
                <button class="b b-train" @click="start" :disabled="isTraining">{{ isTraining ? '⏳' : '▶ 训练' }}</button>
                <button class="b b-step" @click="step" :disabled="isTraining">⏭ 单步</button>
                <button class="b b-test" @click="runTest">🧪 测试</button>
                <button class="b b-reset" @click="reset">↺ 重置</button>
              </div>
              <div class="metrics">
                <div class="m"><span>Epoch</span><span>{{ currentEpoch }}</span></div>
                <div class="m"><span>Loss</span><span class="c-r">{{ fmt(curLoss) }}</span></div>
                <div class="m"><span>Test</span><span>{{ fmt(testL) }}</span></div>
                <div class="m"><span>Acc</span><span class="c-g">{{ accPct }}</span></div>
              </div>
              <svg viewBox="0 0 200 80" class="chart">
                <polyline :points="lp" fill="none" stroke="#60a5fa" stroke-width="1.2" />
                <circle v-for="(p,i) in dots" :key="i" :cx="p[0]" :cy="p[1]" r="1.2" :fill="p[2]" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useSimpleNN } from '@/composables/useSimpleNN'
import Classification2D from './Classification2D.vue'
import Regression1D from './Regression1D.vue'
import NetworkFlow from './NetworkFlow.vue'
import FunctionPlot from './FunctionPlot.vue'

const props = defineProps({ visible: Boolean, config: Object })
const emit = defineEmits(['close'])

const { layers, initNetwork, trainEpoch, predict, getNetworkState, computeLoss } = useSimpleNN()

const currentData = ref([])
const dsList = ref([])
const activeDs = ref('')
const lr = ref(0.1)
const eb = ref(10)
const currentEpoch = ref(0)
const curLoss = ref(0)
const testL = ref(0)
const acc = ref(0)
const isTraining = ref(false)
const hasRun = ref(false)
const hist = ref([])
const selNode = ref(null)
const ndStyle = ref({})

const mode = computed(() => props.config?.type || 'classification-2d')
const modeLabel = computed(() => ({ 'classification-2d': '分类边界', 'regression-1d': '曲线拟合', 'network-flow': '网络流图', 'function-plot': '函数对比' }[mode.value] || ''))
const archSizes = computed(() => (props.config?.architecture || '2,4,1').split(',').map(s => parseInt(s.trim())))
const archConfig = computed(() => ({ layers: archSizes.value, activations: props.config?.activations || ['relu','sigmoid'], learningRate: lr.value, loss: props.config?.loss || 'bce' }))
const netState = computed(() => getNetworkState())

const accPct = computed(() => typeof acc.value === 'number' ? (acc.value*100).toFixed(1)+'%' : '—')
const dots = computed(() => {
  if (hist.value.length < 2) return []
  const maxL = Math.max(...hist.value, 0.01), step = Math.max(1, Math.floor(hist.value.length/80))
  const pts = []
  for (let i = 0; i < hist.value.length; i += step)
    pts.push([4+(i/hist.value.length)*192, 4+((1-hist.value[i]/maxL)*72), hist.value[i]<0.15?'#34d399':'#60a5fa'])
  return pts
})
const lp = computed(() => dots.value.map(p => `${p[0]},${p[1]}`).join(' '))

function loadDs(ds) { activeDs.value = ds.name; currentData.value = ds.data; reset() }
function predictWrap(input) { const o = predict(input); return o }
function reset() { stop(); currentEpoch.value=0; curLoss.value=0; testL.value=0; acc.value=0; hist.value=[]; hasRun.value=false; initNetwork(archConfig.value) }
function step() { if (!currentData.value.length) return; if (!hasRun.value) reset(); curLoss.value = trainEpoch(currentData.value); currentEpoch.value++; hasRun.value=true; hist.value.push(curLoss.value); updateTest() }
function start() { if (isTraining.value||!currentData.value.length) return; stop(); if (!hasRun.value) reset(); isTraining.value=true; const tgt = currentEpoch.value+eb.value; function loop() { if (currentEpoch.value>=tgt||!isTraining.value) { stop(); updateTest(); return } curLoss.value = trainEpoch(currentData.value); currentEpoch.value++; hasRun.value=true; hist.value.push(curLoss.value); setTimeout(loop,50) } setTimeout(loop,10) }
function stop() { isTraining.value=false }
function runTest() { updateTest() }
function updateTest() { if (!currentData.value.length) return; let tl=0,c=0; for (const d of currentData.value) { const o=predict(d.input); tl+=computeLoss(o,d.target); if (Math.round(o[0])===d.target[0]) c++ } testL.value=tl/currentData.value.length; acc.value=c/currentData.value.length }

function onNodeClick(d) { selNode.value = d }
function fmt(n) { return typeof n!=='number'||isNaN(n) ? '0' : Math.abs(n)<0.001 ? n.toExponential(2) : n.toFixed(4) }
function bw(w) { return Math.min(100,Math.abs(w)*250) }

watch(() => props.visible, v => { if (v) { nextTick(() => { dsList.value = props.config?.datasets||[]; if(dsList.value.length) loadDs(dsList.value[0]) }) } else stop() })
</script>

<style scoped>
.lab-overlay { position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center }
.lab-panel { width:96vw;max-width:1500px;height:92vh;background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid rgba(148,163,184,0.12);border-radius:16px;display:flex;flex-direction:column;overflow:hidden }
.lab-header { display:flex;align-items:center;gap:0.75rem;padding:0.55rem 1rem;border-bottom:1px solid rgba(148,163,184,0.08);background:rgba(15,23,42,0.9);font-size:0.9rem;color:#e2e8f0 }
.lab-icon { font-size:1.1rem }
.lab-title { font-weight:600 }
.lab-mode { font-size:0.7rem;color:#64748b;background:rgba(255,255,255,0.04);padding:0.1rem 0.4rem;border-radius:4px }
.badge-training { font-size:0.68rem;color:#60a5fa;background:rgba(59,130,246,0.12);padding:0.1rem 0.4rem;border-radius:4px;animation:pulse 1.5s infinite }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
.lab-close { margin-left:auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#94a3b8;padding:0.2rem 0.6rem;border-radius:6px;cursor:pointer;font-size:0.78rem }
.lab-close:hover { background:rgba(239,68,68,0.15);color:#f87171 }
.lab-body { display:grid;grid-template-columns:180px 1fr 185px;flex:1;overflow:hidden }
.pane-l,.pane-r { padding:0.5rem;overflow-y:auto;border-right:1px solid rgba(148,163,184,0.06) }
.pane-l:last-child,.pane-r:last-child { border-right:none }
.pane-l h4,.pane-r h4 { font-size:0.72rem;color:#94a3b8;margin:0 0 0.4rem;font-weight:500 }
.ds-grid { display:flex;flex-direction:column;gap:0.2rem;margin-bottom:0.6rem }
.ds-btn { display:flex;justify-content:space-between;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#94a3b8;padding:0.3rem 0.4rem;border-radius:5px;cursor:pointer;font-size:0.68rem;transition:all 0.15s }
.ds-btn:hover { background:rgba(59,130,246,0.08);color:#93c5fd }
.ds-btn.on { background:rgba(59,130,246,0.1);color:#60a5fa;border-color:rgba(59,130,246,0.25) }
.ds-n { color:#475569;font-size:0.62rem }
.arch-row { display:flex;align-items:center;justify-content:center;gap:0.15rem }
.arch-node { width:24px;height:24px;border-radius:50%;background:rgba(59,130,246,0.12);color:#60a5fa;display:flex;align-items:center;justify-content:center;font-size:0.68rem;font-weight:600 }
.arch-acts { font-size:0.6rem;color:#64748b;text-align:center;margin-top:0.2rem }
.pane-c { position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center }
.pane-c-empty { color:#475569;font-size:0.8rem }
.nd-popup { position:absolute;width:220px;background:rgba(15,23,42,0.96);border:1px solid rgba(148,163,184,0.15);border-radius:8px;padding:0.5rem;z-index:20;font-size:0.68rem;color:#94a3b8;backdrop-filter:blur(8px) }
.nd-head { display:flex;justify-content:space-between;margin-bottom:0.3rem;color:#cbd5e1;font-weight:600 }
.nd-head button { background:none;border:none;color:#64748b;cursor:pointer }
.nd-row { display:flex;justify-content:space-between;padding:0.12rem 0;border-bottom:1px solid rgba(255,255,255,0.03) }
.nd-row span:last-child { font-family:monospace;color:#cbd5e1 }
.c-g { color:#34d399!important;font-weight:600 }
.c-r { color:#f87171!important }
.nd-weights { margin-top:0.3rem }
.nd-w { display:flex;align-items:center;gap:0.25rem;padding:0.08rem 0 }
.nd-wb { height:4px;border-radius:2px }
.nd-w span { font-family:monospace;font-size:0.6rem;color:#64748b;width:44px;text-align:right }
.pane-r label { display:block;font-size:0.64rem;color:#94a3b8;margin:0 0 0.1rem }
.sl { width:100%;accent-color:#60a5fa;margin-bottom:0.4rem }
.btns { display:grid;grid-template-columns:1fr 1fr;gap:0.25rem;margin-bottom:0.4rem }
.b { padding:0.3rem 0.35rem;border-radius:5px;border:none;cursor:pointer;font-size:0.65rem;font-weight:500;transition:all 0.15s }
.b-train { background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff }
.b-train:disabled { opacity:0.5;cursor:not-allowed }
.b-step { background:rgba(59,130,246,0.1);color:#60a5fa;border:1px solid rgba(59,130,246,0.2) }
.b-test { background:rgba(52,211,153,0.1);color:#34d399;border:1px solid rgba(52,211,153,0.2) }
.b-reset { background:rgba(239,68,68,0.06);color:#f87171;border:1px solid rgba(239,68,68,0.12) }
.metrics { display:grid;grid-template-columns:1fr 1fr;gap:0.2rem;margin-bottom:0.4rem }
.m { background:rgba(255,255,255,0.03);padding:0.25rem;border-radius:4px;text-align:center }
.m span:first-child { display:block;font-size:0.58rem;color:#64748b }
.m span:last-child { font-size:0.7rem;color:#e2e8f0;font-family:monospace;font-weight:600 }
.chart { width:100%;height:70px;background:rgba(0,0,0,0.2);border-radius:4px }
.lab-fade-enter-active,.lab-fade-leave-active { transition:opacity 0.2s }
.lab-fade-enter-from,.lab-fade-leave-to { opacity:0 }
</style>
