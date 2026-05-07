# ML-Visualizer 完整待完成任务清单

> 更新：2026-05-04（**全部完成！**）  
> 设计理念：**图形直觉/比喻 → 可视化理解 → 公式精确表达**（先理解再公式）  
> 知识来源：吴恩达 ML/DL/CNN/RNN/Sequence Models 课程 + 周志华《机器学习》

---

## 总览

| 模块 | 卡片数 | visual-hint 数 | 进度 |
|------|--------|---------------|------|
| MLBasics.vue | 17 | 79 | ✅ 100% |
| DeepLearning.vue | 10 | 38 | ✅ 100% |
| CNN.vue | 12 | 46 | ✅ 100% |
| RNN.vue | 8 | 18 | ✅ 100% |
| TransformerView.vue | 8 | 17 | ✅ 100% |
| Generative.vue | 6 | 12 | ✅ 100% |
| Practice.vue | 6 | 22 | ✅ 100% |
| Frontier.vue | 6 | 17 | ✅ 100% |
| **总计** | **73** | **249** | **✅ 100%** |

---

## ✅ 全部阶段完成 (2026-05-04)

### 阶段一：CNN.vue (10张卡片) ✅
- 经典架构演进、ConvNeXt、感受野与FPN、迁移学习、数据增强策略 + 5张原有卡片优化

### 阶段二：RNN.vue (8张卡片) ✅
- RNN传话游戏比喻、梯度消失等价1000层网络、LSTM工厂传送带+加法更新路径、GRU简洁之美、双向RNN+深层限制、Seq2Seq信息瓶颈+注意力选择性回顾、温度/Top-k/Top-p互补、词嵌入语义地图+Word2Vec/GloVe

### 阶段三：TransformerView.vue (8张卡片) ✅
- 并行vs串行、QKV数据库类比+√d_k缩放、多头多专家审阅、双层车间+Post-LN/Pre-LN、正弦位置指纹+RoPE旋转、BERT完形/GPT续写+Scaling Law+Chinchilla、RLHF三阶段+KV Cache+MoE+Flash Attention、ViT拼图+归纳偏置权衡

### 阶段四：Generative.vue (6张卡片) ✅
- 判别vs生成、GAN伪造鉴定师博弈+模式崩塌WGAN、VAE有序压缩空间+重参数化、扩散噪声还原+训练稳定性、CFG指南针+隐空间压缩、自回归逐像素+归一化流可逆变换

### 阶段五：Practice.vue (6张卡片) ✅
- 迭代飞轮+数据为中心AI、数据工程厨师食材、超参搜索雾中山地、可解释性X光透视、模型压缩剪枝量化蒸馏、MLOps养车+数据漂移+A/B测试

### 阶段六：Frontier.vue (6张卡片) ✅
- GNN社交网络消息传递、对比学习拉近推开、强化学习训练宠物+MDP+PPO、联邦学习数据不动模型动、半监督三大假设+FixMatch、因果推断相关≠因果+持续学习EWC

### 构建验证 ✅
- `npm run build` 成功，662 模块，6.85s，零错误
