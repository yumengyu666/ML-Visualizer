<template>
  <div class="fp-wrap">
    <svg viewBox="0 0 520 320" class="fp-svg">
      <line x1="40" y1="160" x2="480" y2="160" stroke="rgba(148,163,184,0.2)" stroke-width="1" />
      <line x1="260" y1="10" x2="260" y2="310" stroke="rgba(148,163,184,0.2)" stroke-width="1" />
      <polyline v-for="(fn,i) in curves" :key="i" :points="fn.pts" fill="none" :stroke="fn.color" stroke-width="1.8" opacity="0.85" />
      <text v-for="(fn,i) in curves" :key="'l'+i" :x="440" :y="30+i*18" :fill="fn.color" font-size="10">{{ fn.name }}</text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const colors = ['#60a5fa','#f472b6','#34d399','#a78bfa','#fbbf24','#f87171']
const funcDefs = {
  relu: { name:'ReLU', fn: x => Math.max(0,x), xMin:-3, xMax:3 },
  sigmoid: { name:'Sigmoid', fn: x => 1/(1+Math.exp(-x)), xMin:-5, xMax:5 },
  tanh: { name:'Tanh', fn: x => Math.tanh(x), xMin:-3, xMax:3 },
  gelu: { name:'GELU', fn: x => 0.5*x*(1+Math.tanh(Math.sqrt(2/Math.PI)*(x+0.044715*x*x*x))), xMin:-3, xMax:3 },
  linear: { name:'Linear', fn: x => x, xMin:-3, xMax:3 },
  mse: { name:'MSE', fn: x => x*x, xMin:-2, xMax:2 },
  mae: { name:'MAE', fn: x => Math.abs(x), xMin:-2, xMax:2 },
  bce: { name:'BCE(y=1)', fn: x => -Math.log(Math.max(1e-7,x)), xMin:0.001, xMax:1 },
  hinge: { name:'Hinge', fn: x => Math.max(0,1-x), xMin:-2, xMax:3 },
  'sobel-x': { name:'Sobel-X', fn: x => -x, xMin:-1, xMax:1 },
  'sobel-y': { name:'Sobel-Y', fn: x => x, xMin:-1, xMax:1 },
  sharpen: { name:'Sharpen', fn: x => x*2, xMin:-1, xMax:1 },
  gaussian: { name:'Gaussian', fn: x => Math.exp(-x*x*2), xMin:-2, xMax:2 },
  'positional-sin': { name:'PE dim=4', fn: x => Math.sin(x/(10000**(0/64))), xMin:0, xMax:50 },
}

const props = defineProps({ functions: Array })
const curves = computed(() => (props.functions||[]).map((f,i) => {
  const d = funcDefs[f] || funcDefs['relu']
  const pts = []
  for (let j=0;j<=200;j++) {
    const x = d.xMin + (j/200)*(d.xMax-d.xMin)
    const y = d.fn(x)
    const sx = 40 + ((x-d.xMin)/(d.xMax-d.xMin))*440
    const sy = 160 - y*30
    if (sy>8&&sy<312) pts.push(`${sx},${sy}`)
  }
  return { name:d.name, pts:pts.join(' '), color:colors[i%colors.length] }
}))
</script>

<style scoped>
.fp-wrap { width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.25);border-radius:8px }
.fp-svg { width:100%;height:100% }
</style>
