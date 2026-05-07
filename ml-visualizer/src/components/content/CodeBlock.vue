<template>
  <div class="code-block">
    <div class="code-header">
      <span class="code-lang">{{ lang }}</span>
      <button class="copy-btn" @click="copyCode">{{ copied ? '✓ 已复制' : '复制' }}</button>
    </div>
    <pre><code>{{ code }}</code></pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  code: { type: String, default: '' },
  lang: { type: String, default: 'python' }
})

const copied = ref(false)

function copyCode() {
  navigator.clipboard.writeText(props.code).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}
</script>

<style scoped>
.code-block {
  background: #0D1117;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  margin: 1rem 0;
  content-visibility: auto;
  contain-intrinsic-size: 200px;
}
.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid var(--border-color);
}
.code-lang {
  font-size: 0.75rem;
  color: var(--accent-blue);
  font-weight: 500;
  text-transform: uppercase;
}
.copy-btn {
  padding: 0.2rem 0.6rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.copy-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
pre {
  padding: 1rem;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.82rem;
  line-height: 1.6;
  color: #e6edf3;
}
</style>
