// 数学工具函数 / Math utility functions

// 激活函数
export const activationFunctions = {
  relu: { fn: x => Math.max(0, x), derivative: x => x > 0 ? 1 : 0, name: 'ReLU', color: '#00D4FF' },
  sigmoid: { fn: x => 1 / (1 + Math.exp(-x)), derivative: x => { const s = 1 / (1 + Math.exp(-x)); return s * (1 - s) }, name: 'Sigmoid', color: '#7B61FF' },
  tanh: { fn: x => Math.tanh(x), derivative: x => 1 - Math.tanh(x) ** 2, name: 'Tanh', color: '#00FFB3' },
  gelu: { fn: x => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))), derivative: x => { /* approx */ const s = Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)); return 0.5 * (1 + s) + 0.5 * x * (1 - s * s) * Math.sqrt(2 / Math.PI) * (1 + 0.134145 * x * x) }, name: 'GELU', color: '#FF6B35' },
  swish: { fn: x => x / (1 + Math.exp(-x)), derivative: x => { const s = 1 / (1 + Math.exp(-x)); return s + x * s * (1 - s) }, name: 'Swish', color: '#FFD93D' },
}

// 生成范围数组
export function range(start, end, step = 1) {
  const arr = []
  for (let i = start; i <= end; i += step) {
    arr.push(parseFloat(i.toFixed(10)))
  }
  return arr
}

// 随机数
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

// 限制范围
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

// 线性插值
export function lerp(a, b, t) {
  return a + (b - a) * t
}

// 损失函数曲面（双碗形）
export function lossSurface(x, y) {
  return (x * x + y * y) / 4 + Math.sin(x * 2) * 0.3 + Math.cos(y * 2) * 0.3
}

// 损失函数梯度
export function lossGradient(x, y) {
  const dx = x / 2 + Math.cos(x * 2) * 0.6
  const dy = y / 2 - Math.sin(y * 2) * 0.6
  return { dx, dy }
}
