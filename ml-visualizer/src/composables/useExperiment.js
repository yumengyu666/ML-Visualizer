import { reactive } from 'vue'

export const experimentLab = reactive({
  visible: false,
  config: null
})

export function openExperiment(config) {
  experimentLab.config = config
  experimentLab.visible = true
}

export function closeExperiment() {
  experimentLab.visible = false
}

export function useExperiment() {
  return { experimentLab, openExperiment, closeExperiment }
}
