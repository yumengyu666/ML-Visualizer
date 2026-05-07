<template>
  <div class="knowledge-card glass-card">
    <div class="card-header" v-if="title">
      <span class="card-icon" v-if="icon">{{ icon }}</span>
      <h2 class="card-title">{{ title }}</h2>
      <div class="card-actions">
        <button v-if="experiment" class="btn-experiment" @click.stop="openLab" title="打开实验台">
          🔬 实验
        </button>
      </div>
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  experiment: { type: Object, default: null }
})

const openExperiment = inject('openExperiment', null)

function openLab() {
  if (openExperiment && props.experiment) {
    openExperiment(props.experiment)
  }
}
</script>

<style scoped>
.knowledge-card {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  content-visibility: auto;
  contain-intrinsic-size: 500px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}
.card-icon { font-size: 1.25rem; }
.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}
.card-actions { display: flex; gap: 0.4rem; }
.btn-experiment {
  background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15));
  border: 1px solid rgba(99,102,241,0.25);
  color: #a78bfa;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.15s;
}
.btn-experiment:hover {
  background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25));
  color: #c4b5fd;
  border-color: rgba(167,139,250,0.4);
}
.card-body {
  color: var(--text-secondary);
  line-height: 1.8;
}
.card-body :deep(p) { margin-bottom: 0.75rem; }
.card-body :deep(strong) { color: var(--accent-blue); }
</style>
