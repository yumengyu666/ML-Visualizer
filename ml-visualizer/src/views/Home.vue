<template>
  <div class="home-page module-content">
    <section class="hero">
      <div class="hero-badge">交互式学习平台</div>
      <h1 class="hero-title">
        <span class="text-gradient">机器学习</span>与<span class="text-gradient-green">深度学习</span>
        <br />交互式知识可视化
      </h1>
      <p class="hero-desc">
        通过动态可视化、交互式动画与代码实践，深入理解机器学习与深度学习的核心概念。从基础到前沿，构建完整的知识体系。
      </p>
      <div class="hero-actions">
        <router-link to="/ml-basics" class="btn-primary">开始学习 →</router-link>
        <router-link to="/knowledge-graph" class="btn-secondary">知识图谱</router-link>
      </div>
    </section>

    <section class="features" id="features">
      <h2 id="core-animations">核心可视化</h2>
      <p class="section-desc">6 大交互式动画，让抽象概念变得直观可见</p>
      <div class="feature-grid stagger-children scroll-reveal">
        <router-link to="/deep-learning" class="feature-card glass-card">
          <div class="feature-icon">🧠</div>
          <h3>神经网络信息流</h3>
          <p>观看信号在神经网络中正向传播与反向传播的动态过程</p>
          <span class="feature-tag">深度学习</span>
        </router-link>
        <router-link to="/deep-learning" class="feature-card glass-card">
          <div class="feature-icon">🏔️</div>
          <h3>梯度下降 3D</h3>
          <p>三维损失曲面上观察 SGD、Adam 等优化器的下降轨迹</p>
          <span class="feature-tag">优化器</span>
        </router-link>
        <router-link to="/cnn" class="feature-card glass-card">
          <div class="feature-icon">🔍</div>
          <h3>卷积操作</h3>
          <p>动态演示卷积核在特征图上滑动，实时计算输出</p>
          <span class="feature-tag">CNN</span>
        </router-link>
        <router-link to="/transformer" class="feature-card glass-card">
          <div class="feature-icon">⚡</div>
          <h3>注意力热力图</h3>
          <p>Self-Attention 权重热力图，悬停查看注意力连线</p>
          <span class="feature-tag">Transformer</span>
        </router-link>
        <router-link to="/ml-basics" class="feature-card glass-card">
          <div class="feature-icon">📈</div>
          <h3>激活函数对比</h3>
          <p>交互式对比 ReLU、Sigmoid、GELU 等激活函数及其导数</p>
          <span class="feature-tag">基础</span>
        </router-link>
        <router-link to="/deep-learning" class="feature-card glass-card">
          <div class="feature-icon">📊</div>
          <h3>训练仪表盘</h3>
          <p>模拟训练过程，实时损失与准确率曲线，自动检测过拟合</p>
          <span class="feature-tag">实践</span>
        </router-link>
      </div>
    </section>

    <section class="modules" id="modules">
      <h2 id="knowledge-modules">知识模块</h2>
      <p class="section-desc">8 大模块，从基础到前沿，循序渐进</p>
      <div class="module-grid scroll-reveal">
        <router-link v-for="mod in modules" :key="mod.path" :to="mod.path" class="module-card glass-card">
          <span class="module-number">{{ mod.num }}</span>
          <span class="module-icon">{{ mod.icon }}</span>
          <h3>{{ mod.title }}</h3>
          <p>{{ mod.desc }}</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { setupScrollReveal } from '@/utils/animation'

const progressStore = useProgressStore()
onMounted(() => {
  progressStore.markVisited('home')
  setupScrollReveal('.scroll-reveal')
})

const modules = [
  { path: '/ml-basics', num: '01', icon: '📊', title: '机器学习基础', desc: '监督/无监督/强化学习、偏差-方差权衡、损失函数、正则化' },
  { path: '/deep-learning', num: '02', icon: '🧠', title: '深度学习核心', desc: '反向传播、优化器、批归一化、学习率调度、权重初始化' },
  { path: '/cnn', num: '03', icon: '🔍', title: '卷积神经网络', desc: '卷积/池化动画、经典架构、残差连接、迁移学习' },
  { path: '/rnn', num: '04', icon: '🔄', title: '循环神经网络', desc: 'RNN梯度问题、LSTM门控、GRU、Seq2Seq+Attention' },
  { path: '/transformer', num: '05', icon: '⚡', title: 'Transformer与大模型', desc: 'Self-Attention、多头注意力、位置编码、BERT/GPT/ViT' },
  { path: '/generative', num: '06', icon: '🎨', title: '生成模型', desc: 'GAN对抗训练、VAE隐空间、扩散模型去噪过程' },
  { path: '/practice', num: '07', icon: '🛠️', title: '实践与工程', desc: '项目流程、超参数调优、模型可解释性、工具链' },
  { path: '/frontier', num: '08', icon: '🚀', title: '前沿研究方向', desc: '图神经网络、对比学习、强化学习、联邦学习' },
]
</script>

<style scoped>
.home-page { position: relative; z-index: 1; }
.hero {
  text-align: center; padding: 4rem 0 3rem; max-width: 700px; margin: 0 auto;
}
.hero-badge {
  display: inline-block; padding: 0.3rem 1rem; border-radius: 20px;
  background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2);
  color: var(--accent-blue); font-size: 0.8rem; font-weight: 500; margin-bottom: 1.5rem;
}
.hero-title {
  font-size: 2.8rem; font-weight: 800; line-height: 1.2; margin-bottom: 1.25rem;
}
.hero-desc { color: var(--text-secondary); font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem; }
.hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-primary {
  padding: 0.75rem 2rem; border-radius: 10px; font-weight: 600; font-size: 1rem;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-violet));
  color: #fff; text-decoration: none; transition: all 0.3s; border: none;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,212,255,0.3); }
.btn-secondary {
  padding: 0.75rem 2rem; border-radius: 10px; font-weight: 600; font-size: 1rem;
  background: transparent; border: 1px solid var(--border-color);
  color: var(--text-secondary); text-decoration: none; transition: all 0.3s;
}
.btn-secondary:hover { border-color: var(--accent-blue); color: var(--accent-blue); }
section { margin-bottom: 4rem; }
h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem; }
.section-desc { color: var(--text-secondary); margin-bottom: 2rem; }
.feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.625rem; }
.feature-card {
  padding: 1.5rem; text-decoration: none; color: inherit; cursor: pointer;
}
.feature-icon { font-size: 2rem; margin-bottom: 0.75rem; }
.feature-card h3 { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.5rem; }
.feature-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }
.feature-tag {
  display: inline-block; margin-top: 0.75rem; padding: 0.15rem 0.5rem;
  background: rgba(0,212,255,0.1); border-radius: 4px;
  color: var(--accent-blue); font-size: 0.7rem;
}
.module-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.5rem; }
.module-card {
  padding: 1.25rem; text-decoration: none; color: inherit;
  display: flex; flex-direction: column; position: relative;
}
.module-number {
  position: absolute; top: 0.75rem; right: 0.75rem;
  font-size: 2rem; font-weight: 800; color: rgba(0,212,255,0.1); line-height: 1;
}
.module-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
.module-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.4rem; }
.module-card p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }
@media (max-width: 768px) {
  .hero-title { font-size: 1.8rem; }
  .hero { padding: 2rem 0; }
}
</style>
