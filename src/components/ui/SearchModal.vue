<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="searchStore.isSearchOpen" class="search-overlay" @click.self="searchStore.closeSearch()">
        <div class="search-modal glass">
          <div class="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input ref="inputRef" v-model="query" @input="handleSearch" class="search-input" placeholder="搜索知识点..." autofocus />
            <kbd @click="searchStore.closeSearch()">ESC</kbd>
          </div>
          <div class="search-results" v-if="searchStore.searchResults.length">
            <router-link v-for="item in searchStore.searchResults" :key="item.id" :to="item.module" class="search-result-item"
              @click="searchStore.closeSearch()">
              <span class="result-title">{{ item.title }}</span>
              <span class="result-module">{{ getModuleLabel(item.module) }}</span>
            </router-link>
          </div>
          <div v-else-if="query && !searchStore.searchResults.length" class="search-empty">
            未找到相关知识点
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()
const query = ref('')
const inputRef = ref(null)

const moduleLabels = {
  '/ml-basics': 'ML基础', '/deep-learning': '深度学习', '/cnn': 'CNN',
  '/rnn': 'RNN', '/transformer': 'Transformer', '/generative': '生成模型',
  '/practice': '实践', '/frontier': '前沿',
}

function getModuleLabel(path) { return moduleLabels[path] || '' }

function handleSearch() { searchStore.search(query.value) }

watch(() => searchStore.isSearchOpen, (v) => {
  if (v) {
    query.value = ''
    nextTick(() => inputRef.value?.focus())
  }
})
</script>

<style scoped>
.search-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200;
  display: flex; align-items: flex-start; justify-content: center; padding-top: 15vh;
}
.search-modal {
  width: 90%; max-width: 560px; border-radius: 16px; overflow: hidden;
}
.search-input-wrapper {
  display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}
.search-input-wrapper svg { color: var(--text-muted); flex-shrink: 0; }
.search-input {
  flex: 1; background: none; border: none; outline: none; color: var(--text-primary);
  font-size: 1rem; font-family: inherit;
}
.search-input::placeholder { color: var(--text-muted); }
kbd {
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 4px; padding: 0.15rem 0.5rem; font-size: 0.7rem;
  color: var(--text-muted); cursor: pointer;
}
.search-results { max-height: 320px; overflow-y: auto; padding: 0.5rem; }
.search-result-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem 1rem; border-radius: 10px; text-decoration: none;
  color: var(--text-primary); transition: background var(--transition-fast);
}
.search-result-item:hover { background: rgba(0,212,255,0.08); }
.result-title { font-weight: 500; }
.result-module { font-size: 0.75rem; color: var(--accent-blue); background: rgba(0,212,255,0.1); padding: 0.15rem 0.5rem; border-radius: 4px; }
.search-empty { padding: 2rem; text-align: center; color: var(--text-muted); }
.modal-enter-active { transition: opacity 0.2s ease; }
.modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
