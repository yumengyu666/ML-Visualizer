<template>
  <aside class="sidebar" :class="{ open, 'desktop-open': isDesktop }">
    <div v-if="!isDesktop" class="sidebar-overlay" @click="$emit('close')"></div>
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h3 class="sidebar-title">目录导航</h3>
        <button v-if="!isDesktop" class="close-btn" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="progress-section">
        <div class="progress-label">
          <span>学习进度</span>
          <span class="progress-value">{{ progressStore.progressPercent }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressStore.progressPercent + '%' }"></div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <router-link v-for="item in sidebarItems" :key="item.path" :to="item.path" class="sidebar-link"
          :class="{ visited: progressStore.isVisited(item.id) }" active-class="sidebar-link-active"
          @click="$emit('close')">
          <span class="link-icon">{{ item.icon }}</span>
          <span class="link-text">{{ item.label }}</span>
          <span v-if="progressStore.isVisited(item.id)" class="check-mark">✓</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useProgressStore } from '@/stores/progress'

defineProps({ open: Boolean })
defineEmits(['close'])

const progressStore = useProgressStore()
const isDesktop = ref(false)
import { ref } from 'vue'

function checkDesktop() { isDesktop.value = window.innerWidth >= 1024 }
onMounted(() => { checkDesktop(); window.addEventListener('resize', checkDesktop) })
onUnmounted(() => window.removeEventListener('resize', checkDesktop))

const sidebarItems = [
  { path: '/', id: 'home', icon: '🏠', label: '首页' },
  { path: '/ml-basics', id: 'ml-basics', icon: '📊', label: '机器学习基础' },
  { path: '/deep-learning', id: 'deep-learning', icon: '🧠', label: '深度学习核心' },
  { path: '/cnn', id: 'cnn', icon: '🔍', label: '卷积神经网络' },
  { path: '/rnn', id: 'rnn', icon: '🔄', label: '循环神经网络' },
  { path: '/transformer', id: 'transformer', icon: '⚡', label: 'Transformer' },
  { path: '/generative', id: 'generative', icon: '🎨', label: '生成模型' },
  { path: '/practice', id: 'practice', icon: '🛠️', label: '实践与工程' },
  { path: '/frontier', id: 'frontier', icon: '🚀', label: '前沿研究方向' },
  { path: '/knowledge-graph', id: 'knowledge-graph', icon: '🕸️', label: '知识图谱' },
]
</script>

<style scoped>
.sidebar { position: relative; z-index: 50; }
.sidebar-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 49;
  opacity: 0; transition: opacity var(--transition-normal); pointer-events: none;
}
.open .sidebar-overlay { opacity: 1; pointer-events: auto; }
.sidebar-content {
  position: fixed; top: var(--navbar-height); left: 0; bottom: 0;
  width: var(--sidebar-width); background: var(--bg-secondary);
  border-right: 1px solid var(--border-color); padding: 1rem;
  transform: translateX(-100%); transition: transform var(--transition-normal);
  overflow-y: auto; z-index: 51;
}
.desktop-open .sidebar-content { transform: translateX(0); }
.open .sidebar-content { transform: translateX(0); }
.sidebar-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color);
}
.sidebar-title { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.close-btn { background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.25rem; }
.progress-section { margin-bottom: 1.5rem; }
.progress-label { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.4rem; }
.progress-value { color: var(--accent-green); font-weight: 600; }
.progress-bar { height: 4px; background: var(--bg-surface); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-blue), var(--accent-green)); border-radius: 2px; transition: width var(--transition-slow); }
.sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; }
.sidebar-link {
  display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem;
  border-radius: 10px; text-decoration: none; color: var(--text-secondary);
  font-size: 0.875rem; transition: all var(--transition-fast);
}
.sidebar-link:hover { background: rgba(0,212,255,0.06); color: var(--text-primary); }
.sidebar-link-active { background: rgba(0,212,255,0.1) !important; color: var(--accent-blue) !important; }
.sidebar-link.visited .link-text { color: var(--text-primary); }
.link-icon { font-size: 1rem; width: 1.5rem; text-align: center; }
.check-mark { margin-left: auto; color: var(--accent-green); font-size: 0.75rem; }
</style>
