<template>
  <div class="r1d-wrap" ref="wrapRef">
    <svg ref="svgRef" :viewBox="`0 0 ${W} ${H}`" class="r1d-svg">
      <!-- 网格 -->
      <line v-for="i in 10" :key="'gx'+i" :x1="PAD" :y1="PY(i)" :x2="W-PAD" :y2="PY(i)" stroke="rgba(148,163,184,0.08)" stroke-width="0.5" />
      <line v-for="i in 6" :key="'gy'+i" :x1="PX(i)" :y1="PAD" :x2="PX(i)" :y2="H-PAD" stroke="rgba(148,163,184,0.08)" stroke-width="0.5" />
      <!-- 预测曲线 -->
      <polyline v-if="hasNetwork" :points="curvePts" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.9" />
      <!-- 数据点 -->
      <circle v-for="(d,i) in dataset" :key="'d'+i" :cx="px(d.input[0])" :cy="py(d.target[0])" r="4" :fill="ptColor(d)" stroke="rgba(0,0,0,0.3)" stroke-width="1" />
    </svg>
    <div class="r1d-legend">
      <span class="rld dot"></span> 数据 <span class="rld line"></span> 预测
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
const props = defineProps({ predictFn: Function, dataset: Array, epoch: Number, hasNetwork: Boolean })
const wrapRef = ref(null), svgRef = ref(null)

const W=500, H=350, PAD=40
function PX(i) { return PAD+(i/6)*(W-2*PAD) }
function PY(i) { return PAD+(i/10)*(H-2*PAD) }
function crange() {
  const ds=props.dataset||[]; if(!ds.length) return {xMin:-1,xMax:1,yMin:-1,yMax:1}
  let [xM,xm,yM,ym]=[-1e9,1e9,-1e9,1e9]
  for (const d of ds) { xM=Math.max(xM,d.input[0]);xm=Math.min(xm,d.input[0]);yM=Math.max(yM,d.target[0]);ym=Math.min(ym,d.target[0]) }
  const px=Math.max(0.3,(xM-xm)*0.2),py=Math.max(0.3,(yM-ym)*0.2)
  return {xMin:xm-px,xMax:xM+px,yMin:ym-py,yMax:yM+py}
}
function px(v) { const r=crange(); return PAD+((v-r.xMin)/(r.xMax-r.xMin))*(W-2*PAD) }
function py(v) { const r=crange(); return PAD+((r.yMax-v)/(r.yMax-r.yMin))*(H-2*PAD) }
function ptColor(d) { return '#60a5fa' }

const curvePts = computed(() => {
  if (!props.hasNetwork||!props.predictFn) return ''
  const r=crange(), pts=[]
  for (let i=0;i<=200;i++) {
    const x=r.xMin+(i/200)*(r.xMax-r.xMin)
    const o=props.predictFn([x]), y=Array.isArray(o)?o[0]:o
    pts.push(`${px(x)},${py(y)}`)
  }
  return pts.join(' ')
})

watch(() => [props.epoch, props.dataset, props.hasNetwork], () => nextTick(() => {}), { deep: true })
</script>

<style scoped>
.r1d-wrap { position:relative;width:100%;height:100%;background:rgba(0,0,0,0.25);border-radius:8px;display:flex;align-items:center;justify-content:center }
.r1d-svg { width:100%;height:100% }
.r1d-legend { position:absolute;top:6px;left:10px;display:flex;align-items:center;gap:0.3rem;font-size:0.6rem;color:#94a3b8;pointer-events:none }
.rld { width:8px;height:8px;border-radius:50%;display:inline-block }.rld.dot{background:#60a5fa}.rld.line{width:12px;height:2px;border-radius:1px;background:#60a5fa}
</style>
