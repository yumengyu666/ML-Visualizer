import { reactive, ref } from 'vue'

/**
 * 纯 JS 前馈神经网络引擎
 * 暴露训练过程中的权重/偏置/激活值 供可视化
 */
export function useSimpleNN() {
  const layers = reactive([])     // { weights, biases, activations, preActivation, weightGrads, biasGrads }
  const metrics = reactive({
    loss: 0,
    epoch: 0,
    trainLoss: [],
    valLoss: [],
    isTraining: false
  })

  let layerSizes = []
  let activationFns = []
  let lossFn = null
  let lossFnGrad = null
  let learningRate = 0.01

  // ── 激活函数 ──
  function sigmoid(x) { return 1 / (1 + Math.exp(-x)) }
  function sigmoidGrad(x) { const s = sigmoid(x); return s * (1 - s) }
  function relu(x) { return Math.max(0, x) }
  function reluGrad(x) { return x > 0 ? 1 : 0 }
  function tanh(x) { return Math.tanh(x) }
  function tanhGrad(x) { const t = Math.tanh(x); return 1 - t * t }
  function linear(x) { return x }
  function linearGrad() { return 1 }

  const activationMap = {
    sigmoid: [sigmoid, sigmoidGrad],
    relu: [relu, reluGrad],
    tanh: [tanh, tanhGrad],
    linear: [linear, linearGrad]
  }

  // ── 损失函数 ──
  function mseLoss(pred, target) { return 0.5 * (pred - target) ** 2 }
  function mseLossGrad(pred, target) { return pred - target }
  function bceLoss(pred, target) { return -(target * Math.log(pred + 1e-8) + (1 - target) * Math.log(1 - pred + 1e-8)) }
  function bceLossGrad(pred, target) { return (pred - target) / (pred * (1 - pred) + 1e-8) }

  // ── 初始化网络 ──
  function initNetwork(config) {
    layerSizes = config.layers          // [inputSize, hidden1, hidden2, ..., outputSize]
    activationFns = config.activations  // ['relu', 'relu', 'sigmoid']
    learningRate = config.learningRate || 0.01

    if (config.loss === 'bce') {
      lossFn = bceLoss; lossFnGrad = bceLossGrad
    } else {
      lossFn = mseLoss; lossFnGrad = mseLossGrad
    }

    layers.length = 0
    for (let i = 1; i < layerSizes.length; i++) {
      const fanIn = layerSizes[i - 1]
      const fanOut = layerSizes[i]
      const weights = Array.from({ length: fanOut }, () =>
        Array.from({ length: fanIn }, () => 0.1 * (Math.random() * 2 - 1))
      )
      const biases = Array.from({ length: fanOut }, () => 0)
      layers.push({
        id: `layer_${i}`,
        name: i === layerSizes.length - 1 ? '输出层' : `隐藏层 ${i}`,
        weights,
        biases,
        activations: Array(fanOut).fill(0),
        preActivation: Array(fanOut).fill(0),
        weightGrads: Array.from({ length: fanOut }, () => Array(fanIn).fill(0)),
        biasGrads: Array(fanOut).fill(0),
        activationFn: activationFns[i - 1] || 'relu',
        size: fanOut
      })
    }
    // reset metrics
    metrics.epoch = 0
    metrics.loss = 0
    metrics.trainLoss = []
    metrics.valLoss = []
  }

  // ── 前向传播 ──
  function forward(input) {
    let current = input.slice()
    layers.forEach((layer, idx) => {
      const [actFn] = activationMap[layer.activationFn]
      const preAct = []
      const act = []
      for (let j = 0; j < layer.size; j++) {
        let z = layer.biases[j]
        for (let k = 0; k < current.length; k++) {
          z += layer.weights[j][k] * current[k]
        }
        preAct.push(z)
        act.push(actFn(z))
      }
      layer.preActivation = preAct
      layer.activations = act
      current = act
    })
    return layers[layers.length - 1].activations
  }

  // ── 反向传播 ──
  function backward(input, target) {
    const L = layers.length - 1
    const deltas = Array(layers.length).fill(null)
    const inputActivations = [input, ...layers.slice(0, -1).map(l => l.activations)]

    // 输出层 delta
    const outputLayer = layers[L]
    const [, gradFn] = activationMap[outputLayer.activationFn]
    deltas[L] = Array(outputLayer.size).fill(0)
    for (let j = 0; j < outputLayer.size; j++) {
      deltas[L][j] = lossFnGrad(outputLayer.activations[j], target[j]) * gradFn(outputLayer.preActivation[j])
    }

    // 隐藏层 delta (从后往前)
    for (let l = L - 1; l >= 0; l--) {
      const layer = layers[l]
      const nextLayer = layers[l + 1]
      const [, gradFn] = activationMap[layer.activationFn]
      deltas[l] = Array(layer.size).fill(0)
      for (let j = 0; j < layer.size; j++) {
        let sum = 0
        for (let k = 0; k < nextLayer.size; k++) {
          sum += nextLayer.weights[k][j] * deltas[l + 1][k]
        }
        deltas[l][j] = sum * gradFn(layer.preActivation[j])
      }
    }

    // 梯度累积
    for (let l = 0; l < layers.length; l++) {
      const prevAct = inputActivations[l]
      for (let j = 0; j < layers[l].size; j++) {
        for (let k = 0; k < prevAct.length; k++) {
          layers[l].weightGrads[j][k] = deltas[l][j] * prevAct[k]
        }
        layers[l].biasGrads[j] = deltas[l][j]
      }
    }
  }

  // ── SGD 更新 ──
  function updateWeights() {
    for (const layer of layers) {
      for (let j = 0; j < layer.size; j++) {
        for (let k = 0; k < layer.weights[j].length; k++) {
          layer.weights[j][k] -= learningRate * layer.weightGrads[j][k]
        }
        layer.biases[j] -= learningRate * layer.biasGrads[j]
      }
    }
  }

  // ── 单步训练 ──
  function trainStep(input, target) {
    const output = forward(input)
    const loss = computeLoss(output, target)
    backward(input, target)
    updateWeights()
    return { output, loss }
  }

  function computeLoss(output, target) {
    let total = 0
    for (let i = 0; i < output.length; i++) {
      total += lossFn(output[i], target[i])
    }
    return total / output.length
  }

  // ── 批量训练 ──
  function trainEpoch(dataset) {
    let totalLoss = 0
    dataset.forEach(({ input, target }) => {
      const { loss } = trainStep(input, target)
      totalLoss += loss
    })
    return totalLoss / dataset.length
  }

  // ── 预测 ──
  function predict(input) {
    return forward(input)
  }

  // ── 获取网络状态（完整快照供可视化） ──
  function getNetworkState() {
    return {
      layers: layers.map(l => ({
        id: l.id,
        name: l.name,
        activationFn: l.activationFn,
        size: l.size,
        weights: l.weights.map(row => [...row]),
        biases: [...l.biases],
        activations: [...l.activations],
        preActivation: [...l.preActivation],
        weightGrads: l.weightGrads.map(row => [...row]),
        biasGrads: [...l.biasGrads]
      })),
      metrics: { ...metrics }
    }
  }

  return {
    layers, metrics, learningRate,
    initNetwork, forward, trainStep, trainEpoch,
    predict, getNetworkState, computeLoss
  }
}
