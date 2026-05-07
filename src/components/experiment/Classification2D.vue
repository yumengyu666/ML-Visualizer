<template>
  <div class="c2d-wrap" ref="wrapRef">
    <canvas ref="cvRef" @click="onClick" @mousemove="onMove" @mouseleave="tip=null" />
    <div class="legend"><span class="ld pos"></span>正类 <span class="ld neg"></span>负类 <span class="lh">背景=预测</span></div>
    <div v-if="tip" class="tip" :style="tipS">{{ tip }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
const props = defineProps({ predictFn: Function, dataset: Array, epoch: Number, hasNetwork: Boolean })
const wrapRef = ref(null), cvRef = ref(null), tip = ref(null), tipS = ref({})
const RES = 70, PAD = 35

watch(() => [props.epoch, props.dataset, props.hasNetwork], () => nextTick(draw), { deep: true })
onMounted(() => nextTick(draw))

function range() {
  let xMin=1e9,xMax=-1e9,yMin=1e9,yMax=-1e9
  for (const d of props.dataset||[]) { xMin=Math.min(xMin,d.input[0]);xMax=Math.max(xMax,d.input[0]);yMin=Math.min(yMin,d.input[1]||0);yMax=Math.max(yMax,d.input[1]||0) }
  const px=Math.max(0.5,(xMax-xMin)*0.3), py=Math.max(0.5,(yMax-yMin)*0.3)
  return { xMin:xMin-px, xMax:xMax+px, yMin:yMin-py, yMax:yMax+py }
}
function toC(cx,cy,r,w,h) { return { x:PAD+((cx-r.xMin)/(r.xMax-r.xMin))*(w-2*PAD), y:PAD+((r.yMax-cy)/(r.yMax-r.yMin))*(h-2*PAD) } }
function fromC(sx,sy,r,w,h) { return { x:r.xMin+((sx-PAD)/(w-2*PAD))*(r.xMax-r.xMin), y:r.yMax-((sy-PAD)/(h-2*PAD))*(r.yMax-r.yMin) } }

function draw() {
  const c=cvRef.value, w=wrapRef.value; if(!c||!w) return
  const W=w.clientWidth, H=Math.max(300,W*0.75)
  c.width=W*2; c.height=H*2; c.style.width=W+'px'; c.style.height=H+'px'
  const ctx=c.getContext('2d'); ctx.scale(2,2)
  const r=range(), cw=(W-2*PAD)/RES, ch=(H-2*PAD)/RES

  if (props.hasNetwork&&props.predictFn) {
    for (let ix=0;ix<RES;ix++) for (let iy=0;iy<RES;iy++) {
      const cx=r.xMin+(ix/RES)*(r.xMax-r.xMin),cy=r.yMin+(iy/RES)*(r.yMax-r.yMin)
      const p=props.predictFn([cx,cy]), v=Array.isArray(p)?p[0]:p
      const {x,y}=toC(cx,cy,r,W,H)
      ctx.fillStyle = v>0.5 ? `rgba(239,68,68,${Math.min(0.75,(v-0.5)*1.5)})` : `rgba(59,130,246,${Math.min(0.75,(0.5-v)*1.5)})`
      ctx.fillRect(x,y,cw+1,ch+1)
    }
  }
  // 网格
  ctx.strokeStyle='rgba(148,163,184,0.06)';ctx.lineWidth=0.5
  for (let i=0;i<=8;i++) { const x=PAD+(i/8)*(W-2*PAD); ctx.beginPath();ctx.moveTo(x,PAD);ctx.lineTo(x,H-PAD);ctx.stroke() }
  for (let i=0;i<=6;i++) { const y=PAD+(i/6)*(H-2*PAD); ctx.beginPath();ctx.moveTo(PAD,y);ctx.lineTo(W-PAD,y);ctx.stroke() }
  // 数据点
  for (const d of props.dataset||[]) {
    const {x,y}=toC(d.input[0],d.input[1]||0,r,W,H), cls=d.target[0]
    ctx.beginPath();ctx.arc(x,y,4.5,0,Math.PI*2)
    ctx.fillStyle=cls>0.5?'#f87171':'#60a5fa';ctx.fill()
    ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=1;ctx.stroke()
  }
  // 坐标
  ctx.fillStyle='#475569';ctx.font='9px monospace';ctx.textAlign='right'
  ctx.fillText(r.xMax.toFixed(1),W-PAD,H-4);ctx.fillText(r.yMax.toFixed(1),W-4,PAD+10)
  ctx.textAlign='left';ctx.fillText(r.xMin.toFixed(1),PAD,H-4);ctx.fillText(r.yMin.toFixed(1),PAD+2,PAD+10)
}
function onClick(e) {
  const c=cvRef.value,w=wrapRef.value; if(!c||!props.predictFn) return
  const rc=c.getBoundingClientRect(),W=parseInt(c.style.width),H=parseInt(c.style.height)
  const pt=fromC(e.clientX-rc.left,e.clientY-rc.top,range(),W,H)
  const p=props.predictFn([pt.x,pt.y])
}
function onMove(e) {
  const c=cvRef.value,w=wrapRef.value; if(!c||!props.predictFn) return
  const rc=c.getBoundingClientRect(),W=parseInt(c.style.width),H=parseInt(c.style.height)
  const pt=fromC(e.clientX-rc.left,e.clientY-rc.top,range(),W,H)
  const p=props.predictFn([pt.x,pt.y]), v=Array.isArray(p)?p[0]:p
  tip.value=`(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)}) → ${v.toFixed(4)}`; tipS.value={left:(e.clientX-rc.left+15)+'px',top:(e.clientY-rc.top-20)+'px'}
}
</script>

<style scoped>
.c2d-wrap { position:relative;width:100%;height:100%;background:rgba(0,0,0,0.25);border-radius:8px;overflow:hidden }
canvas { display:block;width:100%;height:100%;cursor:crosshair }
.legend { position:absolute;top:6px;left:10px;display:flex;align-items:center;gap:0.4rem;font-size:0.62rem;color:#94a3b8;pointer-events:none }
.ld { width:7px;height:7px;border-radius:50% }.ld.pos{background:#f87171}.ld.neg{background:#60a5fa}
.lh { color:#64748b;margin-left:0.3rem }
.tip { position:absolute;pointer-events:none;background:rgba(15,23,42,0.92);color:#e2e8f0;padding:0.12rem 0.3rem;border-radius:3px;font-size:0.68rem;font-family:monospace }
</style>
