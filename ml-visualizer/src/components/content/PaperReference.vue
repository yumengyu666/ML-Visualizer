<template>
  <div class="paper-reference">
    <div class="paper-icon">📄</div>
    <div class="paper-info">
      <div class="paper-title">{{ paper.title }}</div>
      <div class="paper-authors">{{ paper.authors }}</div>
      <div class="paper-venue">{{ paper.venue }}, {{ paper.year }}</div>
      <a v-if="paper.url" :href="paper.url" target="_blank" class="paper-link">查看论文 →</a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  paper: {
    type: Object,
    required: true,
    default: () => ({ title: '', authors: '', venue: '', year: '', url: '' })
  }
})
</script>

<style scoped>
.paper-reference {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(123,97,255,0.05);
  border: 1px solid rgba(123,97,255,0.15);
  border-radius: 10px;
  margin: 0.75rem 0;
}
.paper-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 0.2rem; }
.paper-info { flex: 1; }
.paper-title { font-weight: 600; color: var(--text-primary); font-size: 0.9rem; }
.paper-authors { color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.2rem; }
.paper-venue { color: var(--text-muted); font-size: 0.75rem; font-style: italic; }
.paper-link {
  display: inline-block; margin-top: 0.3rem;
  color: var(--accent-blue); font-size: 0.78rem; text-decoration: none;
}
.paper-link:hover { text-decoration: underline; }
</style>
