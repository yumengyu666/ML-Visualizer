# ML-Visualizer

## Machine Learning & Deep Learning Interactive Visualization Platform

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-000000?logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

ML-Visualizer is an interactive web platform for visualizing and learning machine learning concepts. Through dynamic animations, 3D visualizations, and hands-on code examples, it helps bridge the gap between theoretical understanding and intuitive grasp of ML/DL fundamentals.

---

## Features

### Core Visualizations

| # | Visualization | Technology | Description |
|---|--------------|-----------|-------------|
| 1 | Neural Network Flow | Canvas/SVG | Forward/backward propagation with glowing nodes and flowing light particles |
| 2 | Gradient Descent 3D | Three.js | 3D loss surface with optimizer trajectory comparison (SGD, Momentum, Adam, RMSProp) |
| 3 | Convolution Animation | Canvas | Real-time convolution kernel sliding with editable kernel values |
| 4 | Attention Heatmap | D3.js | Self-Attention weight matrix visualization with interactive token highlighting |
| 5 | Activation Functions | D3.js | Interactive comparison of ReLU, Sigmoid, Tanh, GELU, Swish with derivative display |
| 6 | Training Dashboard | Chart.js | Simulated training curves with overfitting detection |

### Knowledge Modules

1. **ML Basics** — Learning paradigms, bias-variance tradeoff, loss functions, regularization
2. **Deep Learning Core** — Backpropagation, optimizers, batch normalization, learning rate scheduling
3. **CNN** — Convolution/pooling, classic architectures (LeNet→ResNet→EfficientNet), transfer learning
4. **RNN & Sequence Models** — Gradient vanishing/exploding, LSTM/GRU gating, Seq2Seq
5. **Transformer & LLMs** — Self-Attention, Multi-Head Attention, BERT/GPT/ViT
6. **Generative Models** — GAN training dynamics, VAE latent space, Diffusion Models
7. **ML Engineering** — Project workflow, hyperparameter tuning, model interpretability (Grad-CAM, SHAP)
8. **Frontier Research** — GNN message passing, contrastive learning, reinforcement learning, federated learning

### Interactive Features

- Global search (Ctrl+K)
- Learning progress tracking (localStorage)
- Knowledge graph (D3.js Force Graph)
- Floating table of contents
- Dark/Light theme toggle
- LaTeX formula rendering (KaTeX)

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Vue 3 + Vite 5 |
| Routing | Vue Router 4 |
| State | Pinia |
| 3D | Three.js |
| Charts | D3.js / Chart.js |
| Animation | GSAP |
| Math | KaTeX |
| Styling | Tailwind CSS |

---

## Quick Start

```bash
# Install dependencies
cd ml-visualizer
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
ML-Visualizer/
├── ml-visualizer/
│   ├── src/
│   │   ├── views/              # Page components (8 knowledge modules + home + knowledge graph)
│   │   ├── components/
│   │   │   ├── animations/     # Core visualization components
│   │   │   ├── content/        # Knowledge content (cards, code, formulas, references)
│   │   │   ├── experiment/     # Interactive experiment components
│   │   │   ├── layout/         # App shell (navbar, sidebar, particle background)
│   │   │   └── ui/             # Reusable UI components
│   │   ├── composables/        # Vue composables
│   │   ├── stores/             # Pinia stores (theme, progress, search)
│   │   ├── router/             # Vue Router configuration
│   │   ├── utils/              # Utility functions (math, animation, storage)
│   │   └── styles/             # Global styles + CSS variables
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md
└── .gitignore
```

---

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome | ✅ |
| Edge (Chromium) | ✅ |
| Firefox | ✅ |
| Safari | ✅ |

Resolution: 1366×768 to 2560×1440

---

## License

MIT
