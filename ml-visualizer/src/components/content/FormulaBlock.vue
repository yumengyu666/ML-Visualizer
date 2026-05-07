<template>
  <div class="formula-block" ref="containerRef"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import katex from 'katex'

const props = defineProps({
  formula: { type: String, required: true },
  displayMode: { type: Boolean, default: true },
  label: { type: String, default: '' }
})

const containerRef = ref(null)

function render() {
  if (!containerRef.value) return
  try {
    katex.render(props.formula, containerRef.value, {
      displayMode: props.displayMode,
      throwOnError: false,
      trust: true
    })
  } catch (e) {
    containerRef.value.textContent = props.formula
  }
}

onMounted(render)
watch(() => props.formula, render)
</script>

<style scoped>
.formula-block {
  margin: 1rem 0;
  padding: 1rem 1.25rem;
  contain: layout style paint;
  content-visibility: auto;
  contain-intrinsic-size: 60px;
  background: rgba(17,24,39,0.5);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.15) transparent;
}
.formula-block::-webkit-scrollbar {
  height: 4px;
}
.formula-block::-webkit-scrollbar-track {
  background: transparent;
}
.formula-block::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
}
.formula-block :deep(.katex-display) {
  margin: 0;
  padding: 0.25rem 0;
}
.formula-block :deep(.katex) {
  white-space: nowrap;
}
</style>
