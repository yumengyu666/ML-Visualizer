<template>
  <nav class="navbar" :class="{ collapsed: isScrolled }">
    <div class="navbar-inner">
      <div class="navbar-left">
        <button class="hamburger-btn lg:hidden" @click="$emit('toggle-sidebar')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <router-link to="/" class="logo">
          <span class="logo-icon">◆</span>
          <span class="logo-text">ML-Visualizer</span>
        </router-link>
      </div>
      <div class="navbar-center hidden md:flex">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-link"
          active-class="nav-link-active">
          {{ item.label }}
        </router-link>
      </div>
      <div class="navbar-right">
        <button class="search-btn" @click="searchStore.openSearch()" title="搜索 (Ctrl+K)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span class="hidden sm:inline search-hint">搜索</span>
          <kbd class="hidden sm:inline">⌘K</kbd>
        </button>
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { useSearchStore } from '@/stores/search'

defineEmits(['toggle-sidebar'])
const searchStore = useSearchStore()
const isScrolled = ref(false)

const navItems = [
  { path: '/ml-basics', label: 'ML基础' },
  { path: '/deep-learning', label: '深度学习' },
  { path: '/cnn', label: 'CNN' },
  { path: '/transformer', label: 'Transformer' },
  { path: '/generative', label: '生成模型' },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-bottom: 1px solid var(--glass-border);
  z-index: 100;
  will-change: transform;
  transform: translateZ(0);
  transition: height var(--transition-normal), box-shadow var(--transition-normal);
}
.navbar.collapsed {
  height: 52px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.3);
}
.navbar-inner {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  gap: 1rem;
}
.navbar-left { display: flex; align-items: center; gap: 0.75rem; }
.hamburger-btn {
  background: none; border: none; color: var(--text-secondary); cursor: pointer;
  padding: 0.25rem; border-radius: 6px; transition: color var(--transition-fast);
}
.hamburger-btn:hover { color: var(--accent-blue); }
.logo {
  display: flex; align-items: center; gap: 0.5rem; text-decoration: none;
  color: var(--text-primary); font-weight: 700; font-size: 1.25rem;
}
.logo-icon { color: var(--accent-blue); font-size: 1.5rem; }
.logo-text { background: linear-gradient(135deg, var(--accent-blue), var(--accent-violet)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.navbar-center { display: flex; gap: 0.25rem; }
.nav-link {
  padding: 0.4rem 0.75rem; border-radius: 8px; text-decoration: none;
  color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;
  transition: all var(--transition-fast); white-space: nowrap;
}
.nav-link:hover { color: var(--accent-blue); background: rgba(0,212,255,0.08); }
.nav-link-active { color: var(--accent-blue) !important; background: rgba(0,212,255,0.12); }
.navbar-right { display: flex; align-items: center; gap: 0.75rem; }
.search-btn {
  display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.75rem;
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 8px; color: var(--text-secondary); cursor: pointer;
  font-size: 0.8rem; transition: all var(--transition-fast);
}
.search-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
.search-hint { color: var(--text-muted); }
kbd {
  background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: 4px; padding: 0.1rem 0.4rem; font-size: 0.7rem; color: var(--text-muted);
}
</style>
