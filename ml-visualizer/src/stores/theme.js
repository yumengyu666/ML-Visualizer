import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function initTheme() {
    const saved = localStorage.getItem('ml-viz-theme')
    if (saved) {
      isDark.value = saved === 'dark'
    }
    applyTheme()
  }

  function applyTheme() {
    const html = document.documentElement
    html.classList.toggle('dark', isDark.value)
    html.classList.toggle('light', !isDark.value)
    document.body.style.backgroundColor = isDark.value ? '#0A0E1A' : '#F3F4F6'
  }

  watch(isDark, () => {
    localStorage.setItem('ml-viz-theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  })

  return { isDark, toggleTheme, initTheme }
})
