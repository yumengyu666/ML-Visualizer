import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const visitedSections = ref({})
  const totalSections = 8

  function initProgress() {
    const saved = localStorage.getItem('ml-viz-progress')
    if (saved) {
      try {
        visitedSections.value = JSON.parse(saved)
      } catch {
        visitedSections.value = {}
      }
    }
  }

  function markVisited(moduleId) {
    visitedSections.value[moduleId] = {
      visited: true,
      timestamp: Date.now()
    }
    saveProgress()
  }

  function isVisited(moduleId) {
    return !!visitedSections.value[moduleId]?.visited
  }

  const progressPercent = computed(() => {
    const visited = Object.keys(visitedSections.value).length
    return Math.round((visited / totalSections) * 100)
  })

  function saveProgress() {
    localStorage.setItem('ml-viz-progress', JSON.stringify(visitedSections.value))
  }

  function resetProgress() {
    visitedSections.value = {}
    localStorage.removeItem('ml-viz-progress')
  }

  return {
    visitedSections,
    totalSections,
    progressPercent,
    initProgress,
    markVisited,
    isVisited,
    resetProgress
  }
})
