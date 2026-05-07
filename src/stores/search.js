import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const isSearchOpen = ref(false)
  const searchQuery = ref('')
  const searchResults = ref([])

  // 知识点索引（搜索用）
  const knowledgeIndex = [
    { id: 'ml-supervised', title: '监督学习', module: '/ml-basics', keywords: ['监督', 'supervised', '分类', '回归', '标签'] },
    { id: 'ml-unsupervised', title: '无监督学习', module: '/ml-basics', keywords: ['无监督', 'unsupervised', '聚类', '降维'] },
    { id: 'ml-reinforcement', title: '强化学习', module: '/ml-basics', keywords: ['强化', 'reinforcement', '奖励', '策略'] },
    { id: 'bias-variance', title: '偏差-方差权衡', module: '/ml-basics', keywords: ['偏差', '方差', 'bias', 'variance', '过拟合', '欠拟合'] },
    { id: 'loss-functions', title: '损失函数', module: '/ml-basics', keywords: ['损失', 'MSE', '交叉熵', 'cross-entropy', 'focal loss'] },
    { id: 'regularization', title: '正则化', module: '/ml-basics', keywords: ['正则化', 'L1', 'L2', 'dropout', '稀疏'] },
    { id: 'backpropagation', title: '反向传播', module: '/deep-learning', keywords: ['反向传播', 'backpropagation', '链式法则', '梯度'] },
    { id: 'optimizers', title: '优化器', module: '/deep-learning', keywords: ['SGD', 'Adam', 'Momentum', 'RMSProp', '优化器'] },
    { id: 'batch-norm', title: '批归一化', module: '/deep-learning', keywords: ['批归一化', 'batch normalization', 'BN'] },
    { id: 'lr-schedule', title: '学习率调度', module: '/deep-learning', keywords: ['学习率', 'warmup', 'cosine decay', 'scheduler'] },
    { id: 'weight-init', title: '权重初始化', module: '/deep-learning', keywords: ['Xavier', 'Kaiming', '初始化', 'weight initialization'] },
    { id: 'convolution', title: '卷积操作', module: '/cnn', keywords: ['卷积', 'convolution', '卷积核', 'kernel', '滤波器'] },
    { id: 'pooling', title: '池化', module: '/cnn', keywords: ['池化', 'pooling', '最大池化', '平均池化'] },
    { id: 'resnet', title: 'ResNet', module: '/cnn', keywords: ['ResNet', '残差', 'skip connection', '残差连接'] },
    { id: 'transfer-learning', title: '迁移学习', module: '/cnn', keywords: ['迁移学习', 'transfer learning', '微调', 'fine-tuning'] },
    { id: 'rnn', title: 'RNN', module: '/rnn', keywords: ['RNN', '循环', 'recurrent', '序列'] },
    { id: 'lstm', title: 'LSTM', module: '/rnn', keywords: ['LSTM', '长短期记忆', '门控', 'gate'] },
    { id: 'gru', title: 'GRU', module: '/rnn', keywords: ['GRU', '门控循环单元'] },
    { id: 'seq2seq', title: 'Seq2Seq', module: '/rnn', keywords: ['seq2seq', '序列到序列', '编码器', '解码器'] },
    { id: 'self-attention', title: 'Self-Attention', module: '/transformer', keywords: ['self-attention', '自注意力', 'Q', 'K', 'V'] },
    { id: 'multi-head', title: '多头注意力', module: '/transformer', keywords: ['multi-head', '多头', 'attention'] },
    { id: 'positional-encoding', title: '位置编码', module: '/transformer', keywords: ['位置编码', 'positional encoding', '正弦'] },
    { id: 'bert', title: 'BERT', module: '/transformer', keywords: ['BERT', '预训练', 'MLM', 'NSP'] },
    { id: 'gpt', title: 'GPT', module: '/transformer', keywords: ['GPT', '生成式', '自回归', 'autoregressive'] },
    { id: 'vit', title: 'ViT', module: '/transformer', keywords: ['ViT', 'Vision Transformer', 'patch', '图像'] },
    { id: 'gan', title: 'GAN', module: '/generative', keywords: ['GAN', '生成对抗', '判别器', '生成器'] },
    { id: 'vae', title: 'VAE', module: '/generative', keywords: ['VAE', '变分自编码器', '隐空间', 'latent'] },
    { id: 'diffusion', title: '扩散模型', module: '/generative', keywords: ['diffusion', '扩散', '去噪', 'denoising', 'DDPM'] },
    { id: 'hyperparameter', title: '超参数调优', module: '/practice', keywords: ['超参数', '网格搜索', '贝叶斯优化', 'hyperparameter'] },
    { id: 'interpretability', title: '模型可解释性', module: '/practice', keywords: ['可解释性', 'Grad-CAM', 'SHAP', 'interpretability'] },
    { id: 'gnn', title: '图神经网络', module: '/frontier', keywords: ['GNN', '图神经网络', '消息传递', 'message passing'] },
    { id: 'contrastive', title: '对比学习', module: '/frontier', keywords: ['对比学习', 'contrastive', 'SimCLR', '表示学习'] },
    { id: 'federated', title: '联邦学习', module: '/frontier', keywords: ['联邦学习', 'federated', '分布式', '隐私'] },
  ]

  function openSearch() {
    isSearchOpen.value = true
  }

  function closeSearch() {
    isSearchOpen.value = false
    searchQuery.value = ''
    searchResults.value = []
  }

  function search(query) {
    searchQuery.value = query
    if (!query.trim()) {
      searchResults.value = []
      return
    }
    const q = query.toLowerCase()
    searchResults.value = knowledgeIndex.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q))
    )
  }

  return {
    isSearchOpen,
    searchQuery,
    searchResults,
    openSearch,
    closeSearch,
    search
  }
})
