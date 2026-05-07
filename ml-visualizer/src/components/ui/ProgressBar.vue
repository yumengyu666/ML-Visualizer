<template>
  <div class="progress-wrapper">
    <div v-if="showLabel" class="progress-label">
      <span>{{ label }}</span>
      <span class="progress-value">{{ percent }}%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percent + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  percent: { type: Number, default: 0 },
  label: { type: String, default: '' },
  showLabel: { type: Boolean, default: true }
})
</script>

<style scoped>
.progress-wrapper { margin: 0.5rem 0; }
.progress-label { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.3rem; }
.progress-value { color: var(--accent-green); font-weight: 600; }
.progress-track { height: 4px; background: var(--bg-surface); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-blue), var(--accent-green)); border-radius: 2px; transition: width 0.5s ease; }
</style>
