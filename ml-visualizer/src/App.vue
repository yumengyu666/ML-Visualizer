<template>
  <AppLayout>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppLayout>
  <SearchModal />
  <ExperimentLab :visible="experimentLab.visible" :config="experimentLab.config" @close="closeExperiment" />
</template>

<script setup>
import { onMounted, onUnmounted, provide } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import SearchModal from '@/components/ui/SearchModal.vue'
import ExperimentLab from '@/components/experiment/ExperimentLab.vue'
import { useThemeStore } from '@/stores/theme'
import { useProgressStore } from '@/stores/progress'
import { useSearchStore } from '@/stores/search'
import { experimentLab, openExperiment, closeExperiment } from '@/composables/useExperiment'

const themeStore = useThemeStore()
const progressStore = useProgressStore()
const searchStore = useSearchStore()

provide('openExperiment', openExperiment)

function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    searchStore.openSearch()
  }
  if (e.key === 'Escape') {
    searchStore.closeSearch()
  }
}

onMounted(() => {
  themeStore.initTheme()
  progressStore.initProgress()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
