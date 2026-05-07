// 本地存储工具 / Local storage utility

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage save failed:', e)
  }
}

export function loadFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch {
    return defaultValue
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.warn('localStorage remove failed:', e)
  }
}
