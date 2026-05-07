<template>
  <div class="knowledge-graph-page module-content">
    <h1>🕸️ 知识图谱</h1>
    <p class="module-intro">探索各知识点之间的依赖与关联关系，点击节点跳转对应章节</p>
    <div ref="containerRef" class="graph-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const containerRef = ref(null)
const router = useRouter()
let svg = null
let simulation = null

const nodes = [
  // 模块1: 机器学习基础
  { id: 'supervised', label: '监督学习', group: 1, path: '/ml-basics' },
  { id: 'unsupervised', label: '无监督学习', group: 1, path: '/ml-basics' },
  { id: 'reinforcement', label: '强化学习', group: 1, path: '/frontier' },
  { id: 'bias-variance', label: '偏差-方差', group: 1, path: '/ml-basics' },
  { id: 'loss', label: '损失函数', group: 1, path: '/ml-basics' },
  { id: 'regularization', label: '正则化', group: 1, path: '/ml-basics' },
  { id: 'linear-model', label: '线性模型', group: 1, path: '/ml-basics' },
  { id: 'evaluation', label: '模型评估', group: 1, path: '/ml-basics' },
  { id: 'svm', label: 'SVM', group: 1, path: '/ml-basics' },
  { id: 'decision-tree', label: '决策树', group: 1, path: '/ml-basics' },
  { id: 'bayesian', label: '贝叶斯分类器', group: 1, path: '/ml-basics' },
  { id: 'ensemble', label: '集成学习', group: 1, path: '/ml-basics' },
  { id: 'clustering', label: '聚类与降维', group: 1, path: '/ml-basics' },

  // 模块2: 深度学习核心
  { id: 'deep-nn', label: '深层神经网络', group: 2, path: '/deep-learning' },
  { id: 'backprop', label: '反向传播', group: 2, path: '/deep-learning' },
  { id: 'gradient-problems', label: '梯度问题', group: 2, path: '/deep-learning' },
  { id: 'optimizers', label: '优化器', group: 2, path: '/deep-learning' },
  { id: 'batch-norm', label: '批归一化', group: 2, path: '/deep-learning' },
  { id: 'lr-schedule', label: '学习率调度', group: 2, path: '/deep-learning' },
  { id: 'weight-init', label: '权重初始化', group: 2, path: '/deep-learning' },
  { id: 'hyper-tuning', label: '超参数调优', group: 2, path: '/deep-learning' },
  { id: 'mixed-precision', label: '混合精度训练', group: 2, path: '/deep-learning' },

  // 模块3: CNN
  { id: 'convolution', label: '卷积', group: 3, path: '/cnn' },
  { id: 'pooling', label: '池化', group: 3, path: '/cnn' },
  { id: 'advanced-conv', label: '高级卷积', group: 3, path: '/cnn' },
  { id: 'resnet', label: 'ResNet', group: 3, path: '/cnn' },
  { id: 'densenet', label: 'DenseNet', group: 3, path: '/cnn' },
  { id: 'mobilenet', label: 'MobileNet', group: 3, path: '/cnn' },
  { id: 'convnext', label: 'ConvNeXt', group: 3, path: '/cnn' },
  { id: 'transfer', label: '迁移学习', group: 3, path: '/cnn' },
  { id: 'data-aug', label: '数据增强', group: 3, path: '/cnn' },

  // 模块4: RNN
  { id: 'rnn', label: 'RNN', group: 4, path: '/rnn' },
  { id: 'lstm', label: 'LSTM', group: 4, path: '/rnn' },
  { id: 'gru', label: 'GRU', group: 4, path: '/rnn' },
  { id: 'birnn', label: '双向RNN', group: 4, path: '/rnn' },
  { id: 'seq2seq', label: 'Seq2Seq', group: 4, path: '/rnn' },
  { id: 'word-embed', label: '词嵌入', group: 4, path: '/rnn' },
  { id: 'text-gen', label: '文本生成', group: 4, path: '/rnn' },

  // 模块5: Transformer
  { id: 'attention', label: 'Self-Attention', group: 5, path: '/transformer' },
  { id: 'multi-head', label: '多头注意力', group: 5, path: '/transformer' },
  { id: 'transformer-arch', label: 'Transformer架构', group: 5, path: '/transformer' },
  { id: 'positional', label: '位置编码', group: 5, path: '/transformer' },
  { id: 'bert', label: 'BERT', group: 5, path: '/transformer' },
  { id: 'gpt', label: 'GPT', group: 5, path: '/transformer' },
  { id: 'rlhf', label: 'RLHF', group: 5, path: '/transformer' },
  { id: 'moe', label: 'MoE', group: 5, path: '/transformer' },
  { id: 'vit', label: 'ViT', group: 5, path: '/transformer' },

  // 模块6: 生成模型
  { id: 'gan', label: 'GAN', group: 6, path: '/generative' },
  { id: 'stylegan', label: 'StyleGAN', group: 6, path: '/generative' },
  { id: 'vae', label: 'VAE', group: 6, path: '/generative' },
  { id: 'diffusion', label: '扩散模型', group: 6, path: '/generative' },
  { id: 'stable-diffusion', label: 'Stable Diffusion', group: 6, path: '/generative' },
  { id: 'cfg', label: 'Classifier-Free Guidance', group: 6, path: '/generative' },

  // 模块7: 实践与工程
  { id: 'data-eng', label: '数据工程', group: 7, path: '/practice' },
  { id: 'model-comp', label: '模型压缩', group: 7, path: '/practice' },
  { id: 'interpretability', label: '可解释性', group: 7, path: '/practice' },
  { id: 'mlops', label: 'MLOps', group: 7, path: '/practice' },
  { id: 'deployment', label: '模型部署', group: 7, path: '/practice' },

  // 模块8: 前沿方向
  { id: 'gnn', label: 'GNN', group: 8, path: '/frontier' },
  { id: 'contrastive', label: '对比学习', group: 8, path: '/frontier' },
  { id: 'self-supervised', label: '自监督学习', group: 8, path: '/frontier' },
  { id: 'federated', label: '联邦学习', group: 8, path: '/frontier' },
  { id: 'semi-supervised', label: '半监督学习', group: 8, path: '/frontier' },
  { id: 'causal', label: '因果推断', group: 8, path: '/frontier' },
  { id: 'continual', label: '持续学习', group: 8, path: '/frontier' },
  { id: 'nas', label: 'NAS', group: 8, path: '/frontier' },
]

const links = [
  // 模块1内部
  { source: 'supervised', target: 'loss' },
  { source: 'supervised', target: 'bias-variance' },
  { source: 'supervised', target: 'linear-model' },
  { source: 'supervised', target: 'evaluation' },
  { source: 'loss', target: 'backprop' },
  { source: 'loss', target: 'regularization' },
  { source: 'linear-model', target: 'svm' },
  { source: 'linear-model', target: 'bayesian' },
  { source: 'decision-tree', target: 'ensemble' },
  { source: 'unsupervised', target: 'clustering' },
  { source: 'evaluation', target: 'bias-variance' },

  // 模块2内部
  { source: 'backprop', target: 'optimizers' },
  { source: 'backprop', target: 'weight-init' },
  { source: 'backprop', target: 'gradient-problems' },
  { source: 'optimizers', target: 'lr-schedule' },
  { source: 'optimizers', target: 'batch-norm' },
  { source: 'batch-norm', target: 'weight-init' },
  { source: 'gradient-problems', target: 'weight-init' },
  { source: 'deep-nn', target: 'backprop' },
  { source: 'deep-nn', target: 'gradient-problems' },
  { source: 'hyper-tuning', target: 'lr-schedule' },

  // 模块3内部
  { source: 'convolution', target: 'pooling' },
  { source: 'convolution', target: 'advanced-conv' },
  { source: 'convolution', target: 'resnet' },
  { source: 'resnet', target: 'densenet' },
  { source: 'advanced-conv', target: 'mobilenet' },
  { source: 'resnet', target: 'convnext' },
  { source: 'resnet', target: 'transfer' },
  { source: 'convolution', target: 'data-aug' },
  { source: 'transfer', target: 'data-aug' },

  // 模块4内部
  { source: 'rnn', target: 'lstm' },
  { source: 'lstm', target: 'gru' },
  { source: 'rnn', target: 'birnn' },
  { source: 'rnn', target: 'seq2seq' },
  { source: 'rnn', target: 'word-embed' },
  { source: 'seq2seq', target: 'attention' },
  { source: 'word-embed', target: 'text-gen' },

  // 模块5内部
  { source: 'attention', target: 'multi-head' },
  { source: 'attention', target: 'positional' },
  { source: 'attention', target: 'transformer-arch' },
  { source: 'multi-head', target: 'bert' },
  { source: 'multi-head', target: 'gpt' },
  { source: 'gpt', target: 'rlhf' },
  { source: 'transformer-arch', target: 'moe' },
  { source: 'positional', target: 'vit' },
  { source: 'convolution', target: 'vit' },

  // 模块6内部
  { source: 'gan', target: 'stylegan' },
  { source: 'vae', target: 'diffusion' },
  { source: 'gan', target: 'diffusion' },
  { source: 'diffusion', target: 'stable-diffusion' },
  { source: 'diffusion', target: 'cfg' },
  { source: 'vae', target: 'stable-diffusion' },

  // 模块7内部
  { source: 'data-eng', target: 'mlops' },
  { source: 'model-comp', target: 'deployment' },
  { source: 'interpretability', target: 'mlops' },
  { source: 'mlops', target: 'deployment' },

  // 模块8内部
  { source: 'unsupervised', target: 'contrastive' },
  { source: 'contrastive', target: 'self-supervised' },
  { source: 'reinforcement', target: 'federated' },
  { source: 'supervised', target: 'semi-supervised' },
  { source: 'gnn', target: 'attention' },
  { source: 'semi-supervised', target: 'self-supervised' },
  { source: 'self-supervised', target: 'vit' },
  { source: 'contrastive', target: 'vit' },

  // 跨模块连接
  { source: 'regularization', target: 'batch-norm' },
  { source: 'regularization', target: 'model-comp' },
  { source: 'gpt', target: 'rlhf' },
  { source: 'gpt', target: 'diffusion' },
  { source: 'ensemble', target: 'mobilenet' },
  { source: 'ensemble', target: 'model-comp' },
  { source: 'clustering', target: 'gnn' },
  { source: 'bayesian', target: 'causal' },
  { source: 'mixed-precision', target: 'deployment' },
  { source: 'moe', target: 'deployment' },
  { source: 'continual', target: 'transfer' },
  { source: 'nas', target: 'convnext' },
]

const groupColors = {
  1: '#00D4FF', 2: '#7B61FF', 3: '#00FFB3',
  4: '#FF6B35', 5: '#FFD93D', 6: '#FF4757',
  7: '#45B7D1', 8: '#FF9FF3'
}

async function initGraph() {
  const container = containerRef.value
  if (!container) return

  const d3 = await import('d3')
  const width = container.clientWidth
  const height = 550

  svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Zoom & Pan
  const g = svg.append('g')

  const zoom = d3.zoom()
    .scaleExtent([0.3, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
    })

  svg.call(zoom)
  // Prevent wheel scroll from bubbling to page (use native DOM, don't override D3's wheel.zoom)
  container.addEventListener('wheel', (e) => {
    e.preventDefault()
  }, { passive: false })

  // Arrow marker
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .append('path')
    .attr('d', 'M 0,-5 L 10,0 L 0,5')
    .attr('fill', 'rgba(255,255,255,0.2)')

  const link = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', 'rgba(255,255,255,0.1)')
    .attr('stroke-width', 1.5)
    .attr('marker-end', 'url(#arrowhead)')

  const node = g.append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(d3.drag()
      .on('start', (event, d) => {
        // Stop zoom drag when dragging a node
        event.sourceEvent.stopPropagation()
        dragstarted(event, d)
      })
      .on('drag', dragged)
      .on('end', dragended))
    .style('cursor', 'pointer')

  node.append('circle')
    .attr('r', 14)
    .attr('fill', d => groupColors[d.group] || '#999')
    .attr('fill-opacity', 0.8)
    .attr('stroke', d => groupColors[d.group] || '#999')
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.3)

  node.append('text')
    .text(d => d.label)
    .attr('font-size', '10px')
    .attr('fill', '#e5e7eb')
    .attr('text-anchor', 'middle')
    .attr('dy', 28)

  node.on('click', (event, d) => {
    router.push(d.path)
  })

  node.on('mouseover', function(event, d) {
    d3.select(this).select('circle')
      .transition().duration(200)
      .attr('r', 18)
      .attr('stroke-opacity', 0.8)
    link.attr('stroke', l => 
      (l.source.id === d.id || l.target.id === d.id) ? groupColors[d.group] : 'rgba(255,255,255,0.1)'
    ).attr('stroke-width', l => 
      (l.source.id === d.id || l.target.id === d.id) ? 2.5 : 1.5
    )
  }).on('mouseout', function() {
    d3.select(this).select('circle')
      .transition().duration(200)
      .attr('r', 14)
      .attr('stroke-opacity', 0.3)
    link.attr('stroke', 'rgba(255,255,255,0.1)').attr('stroke-width', 1.5)
  })

  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(80))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(30))
    .on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x; d.fy = d.y
  }
  function dragged(event, d) { d.fx = event.x; d.fy = event.y }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null; d.fy = null
  }
}

onMounted(initGraph)
onUnmounted(() => { if (simulation) simulation.stop() })
</script>

<style scoped>
.knowledge-graph-page { position: relative; z-index: 1; }
h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; }
.module-intro { color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 2rem; }
.graph-container {
  width: 100%; min-height: 550px;
  background: rgba(10,14,26,0.6); border-radius: 16px;
  border: 1px solid var(--border-color); overflow: hidden;
}
.graph-container svg { display: block; }
</style>
