# ML-Visualizer — 机器学习与深度学习交互式知识可视化平台

## 项目简介

ML-Visualizer 是一个面向研究生水平的机器学习知识可视化 Web 平台，通过动态可视化、交互式动画与代码实践，帮助学习者深入理解机器学习与深度学习的核心概念。

## 功能特性

### 🎯 6 大核心可视化动画
- **神经网络信息流** — 正向/反向传播动态过程，节点发光+光点流动
- **梯度下降 3D** — Three.js 渲染损失曲面，4 种优化器轨迹对比
- **卷积操作** — 卷积核滑动动画，支持修改卷积核数值实时重算
- **注意力热力图** — Self-Attention 权重可视化，悬停高亮连线
- **激活函数对比** — 5 种激活函数曲线交互对比，显示函数值与导数值
- **训练仪表盘** — 模拟训练过程，损失/准确率曲线，自动检测过拟合

### 📚 8 大知识模块
1. 机器学习基础 — 学习范式、偏差-方差、损失函数、正则化
2. 深度学习核心 — 反向传播、优化器、批归一化、学习率调度
3. 卷积神经网络 — 卷积/池化、经典架构、残差连接、迁移学习
4. 循环神经网络 — RNN梯度问题、LSTM门控、GRU、Seq2Seq
5. Transformer与大模型 — Self-Attention、BERT/GPT、ViT
6. 生成模型 — GAN、VAE、扩散模型
7. 实践与工程 — 项目流程、超参数调优、模型可解释性
8. 前沿研究方向 — GNN、对比学习、强化学习、联邦学习

### 🔧 交互功能
- 全局搜索（Ctrl+K）
- 学习进度追踪（localStorage 持久化）
- 知识图谱（D3.js Force Graph）
- 浮动目录（随滚动高亮）
- 深色/浅色主题切换
- 公式渲染（KaTeX）

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 + Vite | 核心框架与构建工具 |
| Vue Router 4 | SPA 路由 |
| Pinia | 状态管理 |
| Three.js | 3D 可视化（梯度下降曲面） |
| D3.js | 自定义图表与知识图谱 |
| GSAP | 补间动画 |
| KaTeX | 数学公式渲染 |
| Chart.js / ECharts | 训练曲线图表 |
| Tailwind CSS | 样式系统 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
ml-visualizer/
├── src/
│   ├── views/           # 各模块页面
│   ├── components/
│   │   ├── animations/  # 6大核心动画组件
│   │   ├── content/     # 知识内容组件
│   │   ├── layout/      # 布局组件
│   │   └── ui/          # 通用UI组件
│   ├── stores/          # Pinia 状态管理
│   ├── router/          # 路由配置
│   ├── utils/           # 工具函数
│   └── styles/          # 全局样式
├── public/
└── package.json
```

## 浏览器兼容性

- Microsoft Edge (Chromium) ✅
- Google Chrome ✅
- Firefox ✅
- 测试分辨率：1366×768 至 2560×1440
