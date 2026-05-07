// 实验配置中心 —— 每个知识点一个实验配置

export function genCircle(n = 200, noise = 0.1) {
  const data = []
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2
    data.push({ input: [Math.cos(angle) * 0.4 + jitter(noise), Math.sin(angle) * 0.4 + jitter(noise)], target: [0] })
    data.push({ input: [Math.cos(angle) * 0.8 + jitter(noise), Math.sin(angle) * 0.8 + jitter(noise)], target: [1] })
  }
  return data
}
export function genXor(n = 50, noise = 0.08) {
  const data = []
  const centers = [[-0.5, -0.5, 0], [-0.5, 0.5, 1], [0.5, -0.5, 1], [0.5, 0.5, 0]]
  for (let i = 0; i < n; i++)
    for (const [cx, cy, t] of centers)
      data.push({ input: [cx + jitter(noise), cy + jitter(noise)], target: [t] })
  return data
}
export function genSpiral(n = 80, noise = 0.06) {
  const data = []
  for (let c = 0; c < 2; c++)
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2 + c * Math.PI, r = (i / n) * 1.0
      data.push({ input: [Math.cos(t) * r + jitter(noise), Math.sin(t) * r + jitter(noise)], target: [c] })
    }
  return data
}
export function genLinear(n = 30, slope = 2, intercept = 1, noise = 0.3) {
  return Array.from({ length: n }, () => {
    const x = (Math.random() - 0.5) * 4
    return { input: [x], target: [slope * x + intercept + jitter(noise)] }
  })
}
export function genSin(n = 40) {
  return Array.from({ length: n }, () => {
    const x = (Math.random() - 0.5) * 6
    return { input: [x], target: [Math.sin(x) + jitter(0.15)] }
  })
}
function jitter(s) { return (Math.random() - 0.5) * s * 2 }

// ── 实验类型定义 ──
// classification-2d: 二维分类决策边界
// regression-1d: 一维曲线拟合
// network-flow: 网络结构流图(着重权重/偏置)
// function-plot: 函数对比图(激活函数/损失函数)
// gradient-descent: 梯度下降轨迹

export const experimentConfigs = {
  // ── MLBasics ──
  'linear-models': {
    type: 'regression-1d',
    title: '线性回归实验',
    desc: '观察模型如何学习线性关系 y = wx + b',
    architecture: '1, 1',
    activations: ['linear'],
    loss: 'mse',
    datasets: [
      { name: 'y=2x+1', data: genLinear(30, 2, 1, 0.15) },
      { name: 'y=-0.5x+3', data: genLinear(30, -0.5, 3, 0.2) },
      { name: 'y=sin(x)', data: genSin(40) },
    ]
  },
  'bias-variance': {
    type: 'regression-1d',
    title: '偏差-方差实验',
    desc: '对比不同复杂度模型的拟合效果',
    architecture: '1, 8, 1', activations: ['relu', 'linear'], loss: 'mse',
    datasets: [
      { name: '正弦信号', data: genSin(25) },
    ]
  },
  'loss-functions': {
    type: 'function-plot',
    title: '损失函数实验',
    desc: '观察不同损失函数的形状和梯度',
    functions: ['mse', 'mae', 'bce', 'hinge']
  },
  'regularization': {
    type: 'regression-1d',
    title: '正则化实验',
    desc: '对比 L1/L2 正则化对权重的影响',
    architecture: '1, 16, 16, 1', activations: ['relu', 'relu', 'linear'], loss: 'mse',
    datasets: [{ name: '噪声正弦', data: genSin(30) }]
  },
  'svm': {
    type: 'classification-2d',
    title: 'SVM 分类边界',
    desc: '观察最大间隔分类器',
    architecture: '2, 1', activations: ['linear'], loss: 'bce',
    datasets: [
      { name: '线性可分', data: genGaussians(50, 0.8, 0.15) },
    ]
  },
  'decision-tree': {
    type: 'classification-2d',
    title: '决策树边界',
    desc: '观察轴对齐的决策边界',
    architecture: '2, 4, 1', activations: ['relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: 'XOR', data: genXor(40, 0.05) }]
  },
  'activation-functions': {
    type: 'function-plot',
    title: '激活函数对比',
    desc: 'ReLU / Sigmoid / Tanh / GELU 的形状与梯度',
    functions: ['relu', 'sigmoid', 'tanh', 'gelu']
  },
  'clustering': {
    type: 'classification-2d',
    title: '聚类实验',
    desc: '观察 K-Means 的效果',
    architecture: '2, 4, 3', activations: ['relu', 'softmax'], loss: 'bce',
    datasets: [{ name: '高斯混合', data: genGaussians(60, 0.5, 0.12) }]
  },
  'anomaly-detection': {
    type: 'classification-2d',
    title: '异常检测实验',
    desc: '高斯分布拟合正常数据，检测异常点',
    architecture: '2, 4, 1', activations: ['relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: '同心圆', data: genCircle(60, 0.06) }]
  },

  // ── DeepLearning ──
  'deep-nn': {
    type: 'classification-2d',
    title: '深层神经网络',
    desc: '训练 MLP，观察决策边界形成',
    architecture: '2, 8, 8, 1', activations: ['relu', 'relu', 'sigmoid'], loss: 'bce',
    datasets: [
      { name: 'XOR', data: genXor(60, 0.08) },
      { name: '同心圆', data: genCircle(80, 0.1) },
      { name: '螺旋', data: genSpiral(60, 0.06) },
    ]
  },
  'backpropagation': {
    type: 'network-flow',
    title: '反向传播实验',
    desc: '观察前向与反向传播中梯度流动',
    architecture: '2, 4, 4, 1', activations: ['relu', 'relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: 'XOR', data: genXor(20, 0.04) }]
  },
  'gradient-problems': {
    type: 'network-flow',
    title: '梯度问题实验',
    desc: '观察深层网络中梯度消失/爆炸现象',
    architecture: '2, 8, 8, 8, 8, 1', activations: ['sigmoid', 'sigmoid', 'sigmoid', 'sigmoid', 'sigmoid'], loss: 'mse',
    datasets: [{ name: '简单数据', data: genLinear(20, 1, 0, 0.1).map(d => ({ input: [d.input[0], 0], target: [d.input[0] > 0 ? 1 : 0] })) }]
  },
  'optimizers': {
    type: 'regression-1d',
    title: '优化器对比',
    desc: 'SGD / Momentum / Adam 在损失曲面上的轨迹',
    architecture: '1, 12, 12, 1', activations: ['relu', 'relu', 'linear'], loss: 'mse',
    datasets: [{ name: '正弦', data: genSin(30) }]
  },
  'batchnorm': {
    type: 'network-flow',
    title: 'BatchNorm 实验',
    desc: '观察 BN 如何稳定各层激活分布',
    architecture: '2, 6, 6, 1', activations: ['relu', 'relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: 'XOR', data: genXor(40, 0.06) }]
  },
  'lr-schedule': {
    type: 'regression-1d',
    title: '学习率调度实验',
    desc: '对比固定/阶梯/余弦学习率衰减',
    architecture: '1, 8, 1', activations: ['relu', 'linear'], loss: 'mse',
    datasets: [{ name: '正弦', data: genSin(25) }]
  },
  'weight-init': {
    type: 'network-flow',
    title: '权重初始化实验',
    desc: '对比 Xavier / He / 随机初始化的激活分布',
    architecture: '4, 8, 8, 4', activations: ['relu', 'relu', 'linear'], loss: 'mse',
    datasets: [{ name: '测试', data: [{ input: [1, 0, 1, 0], target: [1, 0, 1, 0] }] }]
  },
  'hyperparameter': {
    type: 'classification-2d',
    title: '超参数调优实验',
    desc: '调节学习率、层数、宽度看效果变化',
    architecture: '2, 8, 4, 1', activations: ['relu', 'relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: 'XOR', data: genXor(50, 0.1) }]
  },
  'data-split': {
    type: 'classification-2d',
    title: '数据划分实验',
    desc: '对比不同 train/val/test 划分的效果',
    architecture: '2, 6, 1', activations: ['relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: '高斯', data: genGaussians(80, 0.6, 0.15) }]
  },

  // ── CNN ──
  'convolution': {
    type: 'function-plot',
    title: '卷积核效果',
    desc: '不同卷积核提取边缘/模糊/锐化特征',
    functions: ['sobel-x', 'sobel-y', 'sharpen', 'gaussian']
  },
  'classic-cnn': {
    type: 'classification-2d',
    title: 'CNN 分类实验',
    desc: '观察特征提取后的决策边界',
    architecture: '2, 8, 4, 1', activations: ['relu', 'relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: '螺旋', data: genSpiral(50, 0.05) }]
  },
  'object-detection': {
    type: 'classification-2d',
    title: '目标检测实验',
    desc: 'IoU 与 NMS 交互演示',
    architecture: '2, 6, 1', activations: ['relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: '高斯', data: genGaussians(50, 0.5, 0.1) }]
  },
  'semantic-segmentation': {
    type: 'classification-2d',
    title: '分割实验',
    desc: '逐像素分类的决策区域',
    architecture: '2, 8, 6, 2', activations: ['relu', 'relu', 'softmax'], loss: 'bce',
    datasets: [{ name: '螺旋', data: genSpiral(40, 0.04) }]
  },

  // ── RNN ──
  'why-rnn': {
    type: 'network-flow',
    title: 'RNN 序列实验',
    desc: '观察序列数据在 RNN 中的流动',
    architecture: '2, 4, 4, 1', activations: ['tanh', 'tanh', 'sigmoid'], loss: 'bce',
    datasets: [{ name: '序列数据', data: [{ input: [1, 0], target: [1] }, { input: [0, 1], target: [0] }] }]
  },
  'lstm': {
    type: 'network-flow',
    title: 'LSTM 门控实验',
    desc: '观察遗忘门/输入门/输出门的动态',
    architecture: '2, 3, 3, 1', activations: ['sigmoid', 'tanh', 'sigmoid'], loss: 'bce',
    datasets: [{ name: 'XOR', data: genXor(30, 0.04) }]
  },

  // ── Transformer ──
  'self-attention': {
    type: 'network-flow',
    title: '自注意力实验',
    desc: '观察 QKV 计算和注意力权重',
    architecture: '3, 6, 3', activations: ['relu', 'linear'], loss: 'mse',
    datasets: [{ name: '简单序列', data: [{ input: [1, 0.5, 0], target: [0.5, 0, 1] }] }]
  },
  'positional-encoding': {
    type: 'function-plot',
    title: '位置编码实验',
    desc: '正弦位置编码的多频率可视化',
    functions: ['positional-sin']
  },

  // ── Generative ──
  'gan': {
    type: 'classification-2d',
    title: 'GAN 生成实验',
    desc: '生成器试图拟合数据分布',
    architecture: '2, 6, 4, 2', activations: ['relu', 'relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: '真实分布', data: genCircle(40, 0.05) }]
  },
  'vae': {
    type: 'network-flow',
    title: 'VAE 隐空间实验',
    desc: '观察编码器→隐变量→解码器的流动',
    architecture: '2, 4, 2, 4, 2', activations: ['relu', 'linear', 'relu', 'sigmoid'], loss: 'mse',
    datasets: [{ name: '高斯', data: genGaussians(30, 0.5, 0.08) }]
  },
  'diffusion': {
    type: 'regression-1d',
    title: '扩散过程实验',
    desc: '前向加噪 → 反向去噪的过程',
    architecture: '1, 8, 8, 1', activations: ['relu', 'relu', 'linear'], loss: 'mse',
    datasets: [{ name: '正弦', data: genSin(20) }]
  },

  // ── Practice ──
  'hyperparameter-search': {
    type: 'regression-1d',
    title: '超参数搜索实验',
    desc: 'LR Finder：观察学习率对 Loss 的影响',
    architecture: '1, 8, 1', activations: ['relu', 'linear'], loss: 'mse',
    datasets: [{ name: '正弦', data: genSin(30) }]
  },
  'model-compression': {
    type: 'network-flow',
    title: '剪枝实验',
    desc: '观察剪枝前后权重的稀疏化',
    architecture: '4, 8, 6, 3', activations: ['relu', 'relu', 'sigmoid'], loss: 'bce',
    datasets: [{ name: '测试', data: [{ input: [1, 0, 1, 0], target: [1, 0, 0] }] }]
  },

  // ── Frontier ──
  'gnn': {
    type: 'network-flow',
    title: 'GNN 消息传递',
    desc: '观察图节点间的消息聚合过程',
    architecture: '2, 4, 4, 2', activations: ['relu', 'relu', 'sigmoid'], loss: 'mse',
    datasets: [{ name: '图数据', data: [{ input: [1, 0], target: [0, 1] }] }]
  },
  'reinforcement-learning': {
    type: 'regression-1d',
    title: 'RL Q值实验',
    desc: '观察 Q-Learning 中 Q 值的更新',
    architecture: '1, 4, 2', activations: ['relu', 'linear'], loss: 'mse',
    datasets: [{ name: '奖励信号', data: genLinear(20, 1, 0, 0.2) }]
  },
}

export function genGaussians(n, distance, noise) {
  const data = []
  for (let i = 0; i < n; i++) {
    data.push({ input: [-distance/2 + gauss(noise), gauss(noise)], target: [0] })
    data.push({ input: [distance/2 + gauss(noise), gauss(noise)], target: [1] })
  }
  return data
}
function gauss(s) { let u=0,v=0; while(u===0) u=Math.random(); while(v===0) v=Math.random(); return s*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v) }
