# ML-Visualizer

## 机器学习与深度学习交互式可视化平台

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-000000?logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

ML-Visualizer 是一个交互式机器学习知识可视化平台，通过动态动画、3D 可视化和代码实践，帮助学习者直观理解机器学习和深度学习的核心概念。

---

## 功能特性

### 核心可视化

| # | 名称 | 技术 | 说明 |
|---|------|------|------|
| 1 | 神经网络信息流 | Canvas/SVG | 正向/反向传播过程，节点发光 + 光点流动 |
| 2 | 梯度下降 3D | Three.js | 三维损失曲面，支持 SGD/Momentum/Adam/RMSProp 轨迹对比 |
| 3 | 卷积操作动画 | Canvas | 卷积核滑动实时演示，支持修改卷积核数值 |
| 4 | 注意力热力图 | D3.js | Self-Attention 权重矩阵可视化，悬停高亮连线 |
| 5 | 激活函数对比 | D3.js | ReLU/Sigmoid/Tanh/GELU/Swish 五函数交互对比 |
| 6 | 训练仪表盘 | Chart.js | 损失/准确率曲线实时模拟，过拟合自动检测 |

### 知识模块

1. **机器学习基础** — 学习范式、偏差-方差权衡、损失函数、正则化
2. **深度学习核心** — 反向传播、优化器、批归一化、学习率调度
3. **卷积神经网络** — 卷积/池化、经典架构演进、残差连接、迁移学习
4. **循环神经网络** — RNN 梯度消失/爆炸、LSTM/GRU 门控、Seq2Seq
5. **Transformer 与大模型** — Self-Attention、多头注意力、BERT/GPT/ViT
6. **生成模型** — GAN 训练博弈、VAE 隐空间、扩散模型
7. **实践与工程** — 项目流程、超参数调优、模型可解释性
8. **前沿研究** — 图神经网络、对比学习、强化学习、联邦学习

### 交互功能

- 全局搜索（Ctrl+K）
- 学习进度追踪（localStorage 持久化）
- 知识图谱（D3.js Force Graph）
- 浮动目录（随滚动自动高亮）
- 深色/浅色主题切换
- LaTeX 公式渲染（KaTeX）

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 + Vite 5 |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia |
| 3D 渲染 | Three.js |
| 图表 | D3.js / Chart.js |
| 动画 | GSAP |
| 公式 | KaTeX |
| 样式 | Tailwind CSS |

---

## 快速开始

```bash
cd ml-visualizer
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

---

## 项目结构

```
ML-Visualizer/
├── ml-visualizer/
│   ├── src/
│   │   ├── views/              # 页面组件（8 个知识模块 + 首页 + 知识图谱）
│   │   ├── components/
│   │   │   ├── animations/     # 核心可视化组件
│   │   │   ├── content/        # 知识内容（卡片、代码、公式、文献）
│   │   │   ├── experiment/     # 交互实验组件
│   │   │   ├── layout/         # 布局组件
│   │   │   └── ui/             # 通用 UI 组件
│   │   ├── composables/        # Vue 组合式函数
│   │   ├── stores/             # Pinia 状态（主题、进度、搜索）
│   │   ├── router/             # 路由配置
│   │   ├── utils/              # 工具函数
│   │   └── styles/             # 全局样式
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md
└── .gitignore
```

---

## 浏览器兼容性

| 浏览器 | 状态 |
|--------|------|
| Chrome | ✅ |
| Edge | ✅ |
| Firefox | ✅ |
| Safari | ✅ |

分辨率：1366×768 至 2560×1440

---

## 许可证

MIT
