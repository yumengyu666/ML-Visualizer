<template>
  <div class="glass-card" :class="{ 'glow-hover': glow }">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({ glow: { type: Boolean, default: true } })
</script>

<style scoped>
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal), transform var(--transition-normal);
}
.glass-card.glow-hover:hover {
  border-color: var(--accent-blue);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}
.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}
.card-body { padding: 1.5rem; }
.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
}
</style>
