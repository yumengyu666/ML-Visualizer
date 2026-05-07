<template>
  <div class="writing-guide">
    <div class="guide-header">
      <span class="guide-icon">✍️</span>
      <span class="guide-title">论文写作指导</span>
    </div>
    <div class="guide-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.writing-guide {
  padding: 1.25rem;
  background: rgba(0,255,179,0.04);
  border: 1px solid rgba(0,255,179,0.15);
  border-radius: 12px;
  margin: 1.5rem 0;
}
.guide-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0,255,179,0.1);
}
.guide-icon { font-size: 1.1rem; }
.guide-title {
  font-weight: 600;
  color: var(--accent-green);
  font-size: 0.95rem;
}
.guide-content {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.8;
}
.guide-content :deep(ul) { padding-left: 1.2rem; margin: 0.5rem 0; }
.guide-content :deep(li) { margin-bottom: 0.3rem; }
.guide-content :deep(strong) { color: var(--accent-green); }
</style>
