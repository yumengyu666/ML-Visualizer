<template>
  <div class="floating-toc" v-if="headings.length > 1">
    <div class="toc-title">本节目录</div>
    <nav class="toc-nav">
      <a v-for="h in headings" :key="h.id" class="toc-link"
        :class="{ active: activeId === h.id }" :style="{ paddingLeft: (h.level - 2) * 12 + 8 + 'px' }"
        @click.prevent="scrollTo(h.id)">
        {{ h.text }}
      </a>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const NAVBAR_HEIGHT = 90
const headings = ref([])
const headingElements = ref([]) // 缓存 DOM 引用
const activeId = ref('')

function collectHeadings() {
  const els = document.querySelectorAll('.module-content h2[id], .module-content h3[id]')
  headingElements.value = Array.from(els)
  headings.value = Array.from(els).map(el => ({
    id: el.id,
    text: el.textContent,
    level: parseInt(el.tagName[1])
  }))
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
  window.scrollTo({ top, behavior: 'smooth' })
  activeId.value = id
}

// 使用缓存的元素引用，避免每帧 querySelectorAll
function updateActiveOnScroll() {
  let currentId = ''
  for (const el of headingElements.value) {
    if (el.getBoundingClientRect().top <= NAVBAR_HEIGHT + 60) {
      currentId = el.id
    }
  }
  if (currentId) activeId.value = currentId
}

let scrollTicking = false

onMounted(() => {
  // 延迟收集，确保 KnowledgeCard 内容已渲染
  let attempts = 0
  const tryCollect = () => {
    collectHeadings()
    if (headings.value.length === 0 && attempts < 10) {
      attempts++
      setTimeout(tryCollect, 300)
    }
  }
  tryCollect()

  // 滚动监听（throttled）
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateActiveOnScroll()
        scrollTicking = false
      })
      scrollTicking = true
    }
  }, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveOnScroll)
})
</script>

<style scoped>
.floating-toc {
  position: fixed; top: 100px; right: 20px; width: 200px;
  max-height: calc(100vh - 140px); overflow-y: auto; z-index: 10;
  background: rgba(10, 14, 26, 0.92);
  border-radius: 10px;
  padding: 12px 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.3s;
}
.floating-toc:hover {
  background: rgba(10, 14, 26, 0.95);
}
.toc-title {
  font-size: 0.7rem; font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;
  padding-left: 8px;
}
.toc-link {
  display: block; padding: 0.3rem 8px; font-size: 0.75rem;
  color: var(--text-muted); text-decoration: none; border-left: 2px solid transparent;
  transition: all var(--transition-fast); line-height: 1.5;
  border-radius: 4px;
}
.toc-link:hover { color: var(--text-secondary); background: rgba(255,255,255,0.04); }
.toc-link.active { color: var(--accent-blue); border-left-color: var(--accent-blue); background: rgba(59,130,246,0.08); }

@media (max-width: 1400px) { .floating-toc { display: none; } }
</style>
