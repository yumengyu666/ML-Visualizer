<template>
  <div class="nf-wrap">
    <svg :viewBox="`0 0 ${vw} ${vh}`" class="nf-svg">
      <!-- 连线 -->
      <line v-for="(e,i) in edges" :key="'e'+i"
        :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2"
        :stroke="e.color" :stroke-width="e.width" :opacity="e.opacity" />
      <!-- 层标签 -->
      <text v-for="(l,i) in layers" :key="'lt'+i" :x="lx(i)" :y="18" text-anchor="middle" fill="#94a3b8" font-size="9">
        {{ l.name }} <tspan :fill="actColor(l.activation)" font-size="8">({{ l.activation }})</tspan>
      </text>
      <!-- 节点 -->
      <g v-for="(l,li) in layers" :key="'l'+li">
        <circle v-for="(n,ni) in l.nodes" :key="'n'+ni"
          :cx="lx(li)" :cy="ny(li,ni)" :r="nr(li)"
          :fill="n.color" :stroke="selN&&selN.li===li&&selN.ni===ni?'#f59e0b':'rgba(255,255,255,0.15)'"
          :stroke-width="selN&&selN.li===li&&selN.ni===ni?2.5:1"
          class="nf-node" @click="sel(li,ni,n)" />
      </g>
    </svg>
    <div class="nf-hint">💡 点击节点查看权重/偏置/激活值</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ networkState: Object })
const emit = defineEmits(['node-click'])
const selN = ref(null)

const LY=28, LG=85, NG=20, PAD=35, R=7

const layers = computed(() => (props.networkState?.layers||[]).map((l,li) => {
  const maxS = Math.max(...(props.networkState?.layers||[]).map(x=>x.size), 1)
  const nodes = []
  for (let i=0;i<l.size;i++) {
    const pw = li>0 ? props.networkState.layers[li-1].weights.map(r=>r[i]) : []
    const a = Math.abs(l.activations[i]||0)
    nodes.push({ bias:l.biases[i], activation:l.activations[i], preActivation:l.preActivation[i], weights:pw, layer:l.name, color: a>0.7?'#34d399':a>0.3?'#60a5fa':a>0.1?'#818cf8':'#475569' })
  }
  return { name:l.name, activation:l.activationFn, size:l.size, nodes, color:li===0?'#60a5fa':li===props.networkState.layers.length-1?'#f472b6':'#a78bfa' }
}))
const vw = computed(() => Math.max(350, layers.value.length*LG+PAD*2))
const vh = computed(() => Math.max(...layers.value.map(l=>l.size),1)*NG+LY+40)
const lx = (li) => PAD+li*LG
const ny = (li,ni) => { const l=props.networkState?.layers[li]; const mx=Math.max(...(props.networkState?.layers||[]).map(x=>x.size)); return LY+((mx-l.size)*NG/2)+ni*NG+18 }
const nr = (li) => li===0||li===layers.value.length-1?R:R-1

const edges = computed(() => {
  const r=[]; const ls=props.networkState?.layers||[]
  for (let li=1;li<ls.length;li++) {
    const p=ls[li-1],c=ls[li]
    for (let pi=0;pi<p.size;pi++) for (let ci=0;ci<c.size;ci++) {
      const w=c.weights[ci][pi], aw=Math.abs(w)
      r.push({ x1:lx(li-1),y1:ny(li-1,pi),x2:lx(li),y2:ny(li,ci), color:w>0?'rgba(96,165,250,0.3)':'rgba(248,113,113,0.3)', width:Math.max(0.4,Math.min(2.5,aw*4)), opacity:Math.max(0.06,Math.min(0.4,aw*0.6)) })
    }
  }
  return r
})
function actColor(a) { return a==='relu'?'#60a5fa':a==='sigmoid'?'#f472b6':a==='tanh'?'#a78bfa':a==='linear'?'#34d399':'#94a3b8' }
function sel(li,ni,n) { selN.value={li,ni,node:n}; emit('node-click',{layerIdx:li,nodeIdx:ni,node:n}) }
</script>

<style scoped>
.nf-wrap { width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:auto }
.nf-svg { min-width:300px;min-height:200px }
.nf-node { cursor:pointer;transition:all 0.15s }
.nf-node:hover { filter:brightness(1.8);stroke:#f59e0b!important }
.nf-hint { font-size:0.62rem;color:#475569;margin-top:0.3rem }
</style>
