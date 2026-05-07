<template>
  <div class="gradient-descent">
    <div class="animation-header">
      <h3>梯度下降可视化</h3>
      <div class="controls">
        <select v-model="currentOptimizer" @change="resetOptimizer" class="ctrl-select">
          <option value="sgd">SGD</option>
          <option value="momentum">Momentum</option>
          <option value="adam">Adam</option>
          <option value="rmsprop">RMSProp</option>
        </select>
        <button @click="togglePlay" class="ctrl-btn">{{ isPlaying ? '⏸ 暂停' : '▶ 播放' }}</button>
        <button @click="resetAll" class="ctrl-btn">↺ 重置</button>
      </div>
    </div>
    <div ref="containerRef" class="three-container"></div>
    <div class="optimizer-legend">
      <span v-for="(opt, key) in optimizerColors" :key="key" class="legend-item"
        :class="{ active: currentOptimizer === key }">
        <span class="dot" :style="{ background: opt }"></span>{{ key.toUpperCase() }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)
const isPlaying = ref(true)
const currentOptimizer = ref('sgd')

const optimizerColors = {
  sgd: '#00D4FF',
  momentum: '#00FFB3',
  adam: '#FF6B35',
  rmsprop: '#FFD93D'
}

let scene, camera, renderer, controls, surface, balls, rafId
let trajectories = {}

function lossSurface(x, y) {
  return (x * x + y * y) / 4 + Math.sin(x * 2) * 0.3 + Math.cos(y * 2) * 0.3
}

function lossGradient(x, y) {
  const dx = x / 2 + Math.cos(x * 2) * 0.6
  const dy = y / 2 - Math.sin(y * 2) * 0.6
  return { dx, dy }
}

// Optimizer states
const optStates = {}
function initOptimizerState(key) {
  optStates[key] = {
    x: 2.5, y: 2.5,
    vx: 0, vy: 0, // momentum
    m_dx: 0, m_dy: 0, v_dx: 0, v_dy: 0, t: 0, // Adam
    lr: key === 'sgd' ? 0.05 : key === 'momentum' ? 0.05 : key === 'adam' ? 0.1 : 0.05
  }
}

function stepOptimizer(key) {
  const s = optStates[key]
  const { dx, dy } = lossGradient(s.x, s.y)
  const beta1 = 0.9, beta2 = 0.999, eps = 1e-8

  switch (key) {
    case 'sgd':
      s.x -= s.lr * dx
      s.y -= s.lr * dy
      break
    case 'momentum':
      s.vx = 0.9 * s.vx - s.lr * dx
      s.vy = 0.9 * s.vy - s.lr * dy
      s.x += s.vx
      s.y += s.vy
      break
    case 'adam':
      s.t++
      s.m_dx = beta1 * s.m_dx + (1 - beta1) * dx
      s.m_dy = beta1 * s.m_dy + (1 - beta1) * dy
      s.v_dx = beta2 * s.v_dx + (1 - beta2) * dx * dx
      s.v_dy = beta2 * s.v_dy + (1 - beta2) * dy * dy
      const m_dx_hat = s.m_dx / (1 - Math.pow(beta1, s.t))
      const m_dy_hat = s.m_dy / (1 - Math.pow(beta1, s.t))
      const v_dx_hat = s.v_dx / (1 - Math.pow(beta2, s.t))
      const v_dy_hat = s.v_dy / (1 - Math.pow(beta2, s.t))
      s.x -= s.lr * m_dx_hat / (Math.sqrt(v_dx_hat) + eps)
      s.y -= s.lr * m_dy_hat / (Math.sqrt(v_dy_hat) + eps)
      break
    case 'rmsprop':
      s.v_dx = 0.9 * s.v_dx + 0.1 * dx * dx
      s.v_dy = 0.9 * s.v_dy + 0.1 * dy * dy
      s.x -= s.lr * dx / (Math.sqrt(s.v_dx) + eps)
      s.y -= s.lr * dy / (Math.sqrt(s.v_dy) + eps)
      break
  }
  s.x = Math.max(-3.5, Math.min(3.5, s.x))
  s.y = Math.max(-3.5, Math.min(3.5, s.y))
}

async function init() {
  const container = containerRef.value
  if (!container) return

  const THREE = await import('three')
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')

  const w = container.clientWidth
  const h = 450

  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0A0E1A, 15, 30)

  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
  camera.position.set(6, 6, 6)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x0A0E1A, 0.5)
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.maxPolarAngle = Math.PI / 2.2

  // Create surface
  const size = 60
  const geometry = new THREE.PlaneGeometry(7, 7, size, size)
  const vertices = geometry.attributes.position.array
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i]
    const y = vertices[i + 1]
    vertices[i + 2] = lossSurface(x, y)
  }
  geometry.computeVertexNormals()

  const material = new THREE.MeshPhongMaterial({
    color: 0x0A1628,
    specular: 0x00D4FF,
    shininess: 30,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
    wireframe: false
  })
  surface = new THREE.Mesh(geometry, material)
  surface.rotation.x = -Math.PI / 2
  scene.add(surface)

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x00D4FF, wireframe: true, transparent: true, opacity: 0.08 })
  const wireframe = new THREE.Mesh(geometry.clone(), wireMat)
  wireframe.rotation.x = -Math.PI / 2
  scene.add(wireframe)

  // Lights
  const ambient = new THREE.AmbientLight(0x404060, 0.8)
  scene.add(ambient)
  const directional = new THREE.DirectionalLight(0x00D4FF, 0.5)
  directional.position.set(5, 10, 5)
  scene.add(directional)

  // Init balls
  balls = {}
  Object.keys(optimizerColors).forEach(key => {
    const ballGeo = new THREE.SphereGeometry(0.1, 16, 16)
    const ballMat = new THREE.MeshPhongMaterial({ color: new THREE.Color(optimizerColors[key]), emissive: new THREE.Color(optimizerColors[key]), emissiveIntensity: 0.5 })
    const ball = new THREE.Mesh(ballGeo, ballMat)
    scene.add(ball)
    balls[key] = ball

    initOptimizerState(key)
    trajectories[key] = []
  })

  // Trajectory lines
  Object.keys(optimizerColors).forEach(key => {
    const lineGeo = new THREE.BufferGeometry()
    const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(optimizerColors[key]), transparent: true, opacity: 0.6 })
    const line = new THREE.Line(lineGeo, lineMat)
    line.name = 'trail_' + key
    scene.add(line)
  })

  animate()
}

function animate() {
  if (!renderer) return
  rafId = requestAnimationFrame(animate)
  controls.update()

  if (isPlaying.value) {
    const key = currentOptimizer.value
    stepOptimizer(key)
    const s = optStates[key]
    const z = lossSurface(s.x, s.y) + 0.15
    balls[key].position.set(s.x, z, s.y)

    trajectories[key].push(s.x, z, s.y)
    if (trajectories[key].length > 300) trajectories[key] = trajectories[key].slice(-300)

    const line = scene.getObjectByName('trail_' + key)
    if (line) {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(trajectories[key], 3))
      line.geometry.dispose()
      line.geometry = geo
    }
  }

  renderer.render(scene, camera)
}

function togglePlay() { isPlaying.value = !isPlaying.value }

function resetOptimizer() {
  initOptimizerState(currentOptimizer.value)
  trajectories[currentOptimizer.value] = []
}

function resetAll() {
  Object.keys(optimizerColors).forEach(key => {
    initOptimizerState(key)
    trajectories[key] = []
    if (balls[key]) {
      balls[key].position.set(2.5, lossSurface(2.5, 2.5) + 0.15, 2.5)
    }
    const line = scene?.getObjectByName('trail_' + key)
    if (line) {
      line.geometry.dispose()
      line.geometry = new THREE.BufferGeometry()
    }
  })
}

function handleResize() {
  const container = containerRef.value
  if (!container || !renderer) return
  const w = container.clientWidth
  const h = 450
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

onMounted(() => { init(); window.addEventListener('resize', handleResize) })
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', handleResize)
  renderer?.dispose()
})
</script>

<style scoped>
.gradient-descent {
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
.ctrl-select {
  padding: 0.35rem 0.75rem; border-radius: 8px; border: 1px solid var(--border-color);
  background: var(--bg-surface); color: var(--text-secondary); font-size: 0.8rem;
  cursor: pointer; font-family: inherit;
}
.ctrl-btn {
  padding: 0.35rem 0.75rem; border-radius: 8px; border: 1px solid var(--border-color);
  background: var(--bg-surface); color: var(--text-secondary); font-size: 0.8rem;
  cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.ctrl-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
.three-container { width: 100%; height: 450px; }
.optimizer-legend {
  display: flex; gap: 1.5rem; padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border-color); font-size: 0.75rem;
}
.legend-item { display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted); }
.legend-item.active { color: var(--text-primary); font-weight: 600; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
</style>
