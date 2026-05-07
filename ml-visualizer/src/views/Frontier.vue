<template>
  <div class="frontier-page module-content">
    <FloatingToc />
    <h1>🚀 前沿研究方向</h1>
    <p class="module-intro">探索机器学习的前沿领域，了解最新研究趋势</p>

    <KnowledgeCard title="图神经网络" icon="🕸️" :experiment="experimentConfigs['gnn']">
      <h2 id="gnn">图神经网络（GNN）</h2>

      <h3>图形直觉：朋友的朋友</h3>
      <p>想象你在社交网络中：你不认识某人，但你们有共同好友。GNN 的核心思想——<strong>从邻居收集信息，更新自己的认识</strong>。每一轮"消息传递"，你都能了解到更远的朋友的信息。</p>
      <div class="visual-hint">
        <strong>🎨 图形理解："社交网络的消息传递"</strong>：图神经网络的核心操作：每一轮，每个节点<strong>从邻居收集信息，汇总更新自己的表示</strong>。第 0 轮每个节点只知道自己的特征（"我是搞 ML 的"），第 1 轮知道直接邻居（"我的朋友做 CV 和 NLP"），第 2 轮知道邻居的邻居（"朋友的朋友做机器人"）——感受野像涟漪一样逐层扩大。GCN 是最基础的版本：每个节点的新表示 = <strong>所有邻居表示的平均 × 可学习的变换矩阵</strong>。GAT 的改进：不是所有邻居平等对待——加注意力权重，让节点自己决定"哪个邻居的意见更重要"。GraphSAGE 的工程化改进：大规模图不可能用全部邻居，随机采样固定数量的邻居做 mini-batch 训练。
      </div>

      <FormulaBlock formula="h_v^{(k+1)} = \text{UPDATE}^{(k)}\left(h_v^{(k)}, \text{AGGREGATE}^{(k)}\left(\{h_u^{(k)} : u \in \mathcal{N}(v)\}\right)\right)" />

      <h3>经典模型</h3>
      <p><strong>GCN</strong>：谱方法的简化，用归一化邻接矩阵做消息传递：</p>
      <FormulaBlock formula="H^{(l+1)} = \sigma\left(\tilde{D}^{-\frac{1}{2}}\tilde{A}\tilde{D}^{-\frac{1}{2}}H^{(l)}W^{(l)}\right)" />
      <p>直觉：每个节点的新表示 = 邻居表示的平均 × 变换矩阵。</p>

      <p><strong>GraphSAGE</strong>：采样+聚合，适合大规模图。不是用所有邻居，而是随机采样固定数量的邻居。三种聚合器：均值、LSTM、最大池化。</p>
      <p><strong>GAT</strong>：给不同邻居分配不同权重（注意力），GCN 中所有邻居权重相同。直觉：不是所有朋友的话都同样重要——有的朋友更靠谱，应该更重视他们的意见。</p>
      <FormulaBlock formula="\alpha_{ij} = \frac{\exp(\text{LeakyReLU}(a^T[Wh_i || Wh_j]))}{\sum_{k \in \mathcal{N}(i)}\exp(\text{LeakyReLU}(a^T[Wh_i || Wh_k]))}" />

      <div class="visual-hint">
        <strong>🔍 GCN 的谱方法直觉</strong>：GCN 的原理源头是<strong>图信号处理</strong>——把节点特征看作图上的信号，图拉普拉斯矩阵 L = D - A 的特征向量类似于傅里叶变换的基函数（低频=平滑变化，高频=剧烈变化）。GCN 的 D̃^{-½}ÃD̃^{-½}H 本质是<strong>图上的低通滤波器</strong>——平滑邻居特征，去除高频噪声。这也是为什么 GCN 只能堆 2-3 层：过度平滑（Over-smoothing）——多轮邻居平均后所有节点表达趋于相同，无法区分不同节点。
      </div>

      <div class="visual-hint">
        <strong>💡 为什么 GNN 这么少层？</strong>CNN 可以堆 152 层（ResNet），GNN 通常只堆 2-4 层。根本原因：CNN 的"邻居"是空间局部（最多 3×3=9 个邻居），GNN 的"邻居"通过图连接——社交网络的平均路径长度约 6（六度分隔）。堆 6 层 GNN 意味着每个节点已经"看到"了几乎整个图，所有节点的感受野高度重叠。解决方向：残差连接（延缓过平滑）、DropEdge（随机丢弃边）、深度图网络用跳跃知识网络（JK-Net）融合各层表达。
      </div>

      <h3>大规模图训练</h3>
      <p><strong>GraphSAINT</strong>：通过子图采样解决大图训练的内存问题。不是在全图上训练，而是随机采样子图做 mini-batch 训练。</p>

      <CodeBlock lang="python" :code="gnnCode" />
    </KnowledgeCard>

    <KnowledgeCard title="对比学习与自监督学习" icon="⚖️">
      <h2 id="contrastive">对比学习与自监督学习</h2>

      <h3>图形直觉：物以类聚</h3>
      <p>想象你在人群中找朋友：你会和兴趣相似的人靠近（正例），和完全不同的人保持距离（负例）。对比学习就是让模型学会这个——<strong>拉近相似的，推远不相似的</strong>。</p>
      <div class="visual-hint">
        <strong>🎨 图形理解："拉近相似的，推开不同的"</strong>：对比学习的核心操作——对同一张图片做两次不同的增强（裁剪+颜色变换），这两张增强后的图片构成<strong>正例对</strong>——它们在嵌入空间应该很近（毕竟是同一张猫图）；与其他图片的增强版构成<strong>负例对</strong>——应该很远（猫和狗不同）。InfoNCE 损失就是实现这个目标——正例对的相似度要尽可能高（分子大），负例对的相似度要尽可能低（分母小）。关键发现：增强策略越强（更多样的裁剪、更剧烈的色彩变换），学到的特征越好——因为模型被迫忽略表面变化，抓住本质特征（猫的形状）。
      </div>

      <FormulaBlock formula="\mathcal{L}_{\text{InfoNCE}} = -\log\frac{\exp(\text{sim}(z_i, z_j)/\tau)}{\sum_{k=1}^{2N}\mathbb{1}_{[k\neq i]}\exp(\text{sim}(z_i, z_k)/\tau)}" />

      <h3>三大方法</h3>
      <p><strong>SimCLR</strong>：用数据增强构造正例对，大 batch 提供负例。关键发现：增强策略越强（颜色+裁剪+模糊），效果越好；投影头很重要。</p>
      <div class="visual-hint">
        <strong>🔍 SimCLR 为什么需要大 batch？</strong>：InfoNCE 损失以 batch 内其他所有样本为负例。如果 batch_size=256，每个正例对就有 2×256-2=510 个负例。batch 越大→负例越多→对比信号越强→学到的特征越好（SimCLR 用 batch_size=4096）。但大 batch 需要大量 GPU 显存。<strong>MoCo 的解决方案</strong>：不扩大 batch，而是维护一个<strong>动量更新的负例队列</strong>（存最近的几千个样本的编码）。动量编码器的参数更新极慢（θ_k ← m·θ_k + (1-m)·θ_q, m=0.999），保证队列中负例的一致性——不会因为编码器快速变化导致新旧负例不可比。
      </div>
      <p><strong>CLIP</strong>：图文对比学习——同一对图片-文本是正例，不同对是负例。实现零样本分类：输入"一张猫的照片"，模型直接找到最匹配的图片。</p>

      <h3>自监督学习全貌</h3>
      <p>周志华指出，自监督学习的核心是设计<strong>代理任务（Pretext Task）</strong>：</p>
      <ul>
        <li><strong>对比式</strong>：SimCLR, MoCo, CLIP（拉近/推远）</li>
        <li><strong>生成式</strong>：MAE, BEiT（遮盖+重建）</li>
        <li><strong>预测式</strong>：旋转预测、拼图重组、色彩预测</li>
      </ul>
      <p><strong>MAE（Masked Autoencoder）</strong>：遮盖 75% 的图像 Patch，只用 25% 编码，然后解码重建。极高效率——编码器只处理可见的 Patch。</p>

      <div class="visual-hint">
        <strong>🔍 MAE 的直觉："只算有用的"</strong>：普通自编码器编码全部像素再解码，计算浪费在"无聊的背景像素"上。MAE 把 75% 的图像 Patch 直接扔掉（加掩码），编码器<strong>只处理剩下的 25%</strong>，解码器从这 25% 的信息和掩码 token 重建整张图。这迫使编码器学到<strong>语义理解</strong>而非像素复制——你必须理解"这里被遮住的应该是一扇窗户，因为旁边有墙和窗帘"，而不是死记硬背。效率极高：如果 ViT 有 196 个 Patch，MAE 只编码 49 个，推理快了 4 倍！这就是为什么 MAE 能用 ViT-Huge 在 ImageNet 上做高效自监督预训练。
      </div>

      <CodeBlock lang="python" :code="contrastiveCode" />
    </KnowledgeCard>

    <KnowledgeCard title="强化学习" icon="🎮" :experiment="experimentConfigs['reinforcement-learning']">
      <h2 id="rl">强化学习</h2>

      <div class="visual-hint">
        <strong>🎨 图形理解："训练宠物学技能"</strong>：强化学习的本质是<strong>试错学习</strong>——智能体在环境中选择动作，环境返回奖励（或惩罚），智能体据此调整策略最大化长期累积奖励。核心要素：(1) <strong>状态 S</strong>——当前局面（小狗看到的场景）；(2) <strong>动作 A</strong>——可选操作（坐/跑/叫）；(3) <strong>奖励 R</strong>——即时反馈（坐下给零食）；(4) <strong>策略 π</strong>——"给定状态应该做什么"（小狗学到的行为规则）。有两种学习方式：<strong>基于价值</strong>（Q-Learning/DQN）——学"这个状态下做这个动作值多少钱"，选择值最高的动作；<strong>基于策略</strong>（Policy Gradient/PPO）——直接学"这个状态下应该做什么的概率分布"，用梯度上升优化。PPO 是 RLHF 训练 ChatGPT 的核心算法——限制策略更新幅度，防止一步改太多导致胡乱输出。
      </div>

      <p>核心要素是马尔可夫决策过程（MDP）：</p>
      <FormulaBlock formula="\text{MDP} = (\mathcal{S}, \mathcal{A}, P, R, \gamma)" />

      <h3>基于价值的方法</h3>
      <p><strong>Q-Learning</strong>：学习每个状态下每个动作的"价值" Q(s,a)，选择价值最高的动作。</p>
      <FormulaBlock formula="Q(s,a) \leftarrow Q(s,a) + \alpha\left[r + \gamma \max_{a'}Q(s',a') - Q(s,a)\right]" />
      <p>直觉：更新 Q 值 = 当前估计 + 新信息的修正。如果实际回报比预期好，就提高 Q 值。</p>
      <p><strong>DQN</strong>：用神经网络近似 Q 函数。两个关键创新：经验回放（打破数据相关性）和目标网络（稳定训练）。</p>

      <h3>基于策略的方法</h3>
      <p><strong>策略梯度（Policy Gradient）</strong>：直接学习策略 π(a|s)，用梯度上升最大化期望回报：</p>
      <FormulaBlock formula="\nabla_\theta J(\theta) = \mathbb{E}\left[\sum_{t=0}^{T}\nabla_\theta \log \pi_\theta(a_t|s_t) \cdot G_t\right]" />
      <p>直觉：增大导致好结果的动作的概率，降低导致坏结果的动作的概率。</p>

      <p><strong>PPO（Proximal Policy Optimization）</strong>：限制策略更新幅度，防止一步走太远导致性能崩溃。直觉：每次只小幅调整策略，确保稳定进步。RLHF 中训练语言模型的核心算法。</p>
      <FormulaBlock formula="L^{\text{CLIP}}(\theta) = \mathbb{E}\left[\min\left(r_t(\theta)\hat{A}_t, \text{clip}(r_t(\theta), 1\pm\epsilon)\hat{A}_t\right)\right]" />

      <div class="visual-hint">
        <strong>🔍 探索与利用的经典困境</strong>：RL 的核心矛盾——<strong>利用（Exploitation）</strong>：做已知最好的事（去你常去的餐厅）vs <strong>探索（Exploration）</strong>：尝试可能更好的未知选项（试试新开的餐厅）。DQN 用 <strong>ε-greedy</strong>——以 ε 概率随机选择动作（探索），以 1-ε 概率选 Q 值最高的动作（利用）。ε 通常从 1.0 逐渐衰减到 0.01——先大量探索，后稳定利用。更高级的方法：<strong>UCB（置信上界）</strong>——给不确定的动作更高的"乐观估值"，鼓励探索不确定性高的选择。
      </div>

      <div class="visual-hint">
        <strong>🔍 PPO Clip 的直觉："不要大步跳悬崖"</strong>：策略梯度的危险——如果某个动作带来了意外高回报，策略会大幅增加这个动作的概率，可能导致策略<strong>突然崩溃</strong>（训到一半性能掉到零）。PPO 的 clip 机制：如果新旧策略的概率比 r_t(θ) 偏离 1 太远（超过 1±ε），就把这个更新的梯度截断（clip）。直觉：每次最多允许策略改变 20%（ε=0.2），像在悬崖边走——小步稳走不会摔，大跨一步可能直接掉下去。这就是为什么 PPO 成为 RLHF 训练语言模型的首选——ChatGPT 的"说话"策略每步只能微调，不能突然变成胡说八道。
      </div>

      <CodeBlock lang="python" :code="rlCode" />
    </KnowledgeCard>

    <KnowledgeCard title="联邦学习" icon="🌍">
      <h2 id="federated">联邦学习（Federated Learning）</h2>

      <h3>图形直觉：团队协作不上交数据</h3>
      <p>想象多个医院想联合训练一个疾病诊断模型，但患者的隐私数据不能离开医院。联邦学习的解决方案：<strong>数据不动模型动</strong>——每个医院用本地数据训练，只把模型更新上传到服务器聚合。</p>
      <div class="visual-hint">
        <strong>🎨 图形理解："数据不出门，模型满天飞"</strong>：传统 ML 把所有数据上传到中心服务器训练——但医院不能上传患者数据（隐私），银行不能泄露用户交易记录（法规）。联邦学习的解法：(1) 服务器下发全局模型给各客户端（医院/手机）；(2) 各客户端用本地数据训练（数据不出门）；(3) 客户端只上传模型更新（梯度/参数）给服务器；(4) 服务器聚合（FedAvg 按数据量加权平均）得到新全局模型；(5) 循环。核心挑战：不同客户端数据分布不同（A 医院多心脏病患者，B 医院多糖尿病患者），非独立同分布（Non-IID）导致 FedAvg 可能不收敛——FedProx 加近端项限制本地模型与全局模型的距离，SCAFFOLD 用控制变量修正客户端漂移。
      </div>

      <p><strong>FedAvg 算法</strong>：按样本量加权平均各客户端的模型参数：</p>
      <FormulaBlock formula="w_{t+1} = \sum_{k=1}^{K}\frac{n_k}{n}w_t^k" />

      <h3>核心挑战</h3>
      <ul>
        <li><strong>数据异构（Non-IID）</strong>：不同客户端数据分布差异大，FedAvg 可能不收敛</li>
        <li><strong>通信效率</strong>：模型参数量大时通信开销高</li>
        <li><strong>隐私保护</strong>：梯度可能泄露原始数据信息</li>
      </ul>

      <div class="visual-hint">
        <strong>🔍 Non-IID 为什么致命？</strong>：FedAvg 每一步对客户端模型参数做加权平均。如果 A 医院全是心脏病数据、B 医院全是糖尿病数据，分别训练后 A 的模型学到"全是心脏病"\→B 学到"全是糖尿病"\→服务器一平均——<strong>平均出一个既不会看心脏病也不会看糖尿病的废物</strong>。<strong>FedProx</strong> 在客户端损失函数上加一个近端项：||θ_k - θ_global||²，强制本地模型不要偏离全局模型太远，像"给每个客户端拴一根绳子"。<strong>SCAFFOLD</strong> 用控制变量修正客户端漂移——计算全局和本地的梯度差异作为修正信号，理论上保证收敛。
      </div>

      <div class="visual-hint">
        <strong>💡 联邦学习的隐私本质</strong>：联邦学习本身<strong>不是隐私保护技术</strong>——它只是"数据不出门"。但上传的梯度/参数更新可能被逆向工程还原出原始数据（梯度泄漏攻击）。真正的隐私需要额外技术：<strong>差分隐私（DP）</strong>——在梯度上加噪声，数学上保证任何个体的贡献不可区分；<strong>安全聚合</strong>——用安全多方计算让服务器只能看到聚合结果，看不到单个客户端的更新。联邦学习 + DP + 安全聚合 = 真正意义上的隐私保护机器学习。
      </div>

      <CodeBlock lang="python" :code="federatedCode" />
    </KnowledgeCard>

    <KnowledgeCard title="半监督学习与概率图模型" icon="🔗">
      <h2 id="semi-supervised">半监督学习与概率图模型</h2>
      <p>周志华在西瓜书中专门讨论了这些方向，它们在实际场景中非常重要。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解："用未标注数据辅助学习"</strong>：标注数据贵（医学影像需要专家标注），未标注数据便宜（互联网上无数图片）。半监督学习的三大假设：(1) <strong>平滑假设</strong>——输入空间相近的样本，标签也应相近（两个长得差不多的细胞，病理类型应该相同）；(2) <strong>聚类假设</strong>——同簇的样本同标签（无标签图自己聚成几堆，每堆大概率同类别）；(3) <strong>流形假设</strong>——高维数据实际分布在低维流形上（手写数字的 784 维像素空间其实只在少数几个"变形维度"上变化）。经典方法 <strong>FixMatch</strong>：弱增强（翻转）产生伪标签，强增强（RandAugment）做一致性检查——两者预测必须一致，否则惩罚模型。理念简单但效果极强——用很少的标注样本达到接近全监督的性能。
      </div>

      <h3>半监督学习三大假设</h3>
      <ul>
        <li><strong>平滑假设</strong>：相近的样本倾向于有相同标签</li>
        <li><strong>聚类假设</strong>：同一聚类中的样本倾向于有相同标签</li>
        <li><strong>流形假设</strong>：高维数据分布在低维流形上</li>
      </ul>

      <h3>代表性方法</h3>
      <div class="visual-hint">
        <strong>🔍 FixMatch 为什么这么强？</strong>：FixMatch 的三个核心设计：(1) <strong>弱增强→强增强 一致性</strong>——弱增强（简单的翻转）产生一个"干净"预测作为伪标签，强增强（RandAugment 剧烈变换）迫使模型在极大扰动下仍做出一致预测。(2) <strong>高置信度阈值过滤</strong>——只保留置信度大于阈值（如 0.95）的伪标签，低置信度的直接丢弃——"不确定的答案宁可不用"。(3) <strong>按比例混合</strong>——每轮输入是 μ 倍的无标签数据 + 1 倍的有标签数据，确保模型不会"忘记"有标签样本。关键哲学：<strong>不确定的未标注样本不是噪声，而是"还没准备好的学习材料"</strong>——等模型变强后自然会给出高置信度预测。
      </div>
      <p><strong>伪标签（Pseudo-Labeling）</strong>：用模型对未标注数据做预测，把高置信度的预测当作标签加入训练。</p>
      <p><strong>一致性正则化</strong>：同一输入的不同扰动应该产生一致的输出（Π-Model, Mean Teacher）。</p>
      <p><strong>FixMatch</strong>：结合伪标签和一致性正则化——弱增强产生伪标签，强增强做一致性检查。</p>

      <h3>概率图模型</h3>
      <p><strong>隐马尔可夫模型（HMM）</strong>：序列数据建模的经典方法，三个基本问题：评估（前向算法）、解码（Viterbi算法）、学习（EM算法）。</p>
      <p><strong>贝叶斯网络</strong>：有向无环图表示变量间的条件依赖关系。推理使用精确推理（变量消元）或近似推理（MCMC、变分推断）。</p>
      <FormulaBlock formula="P(X_1, ..., X_n) = \prod_{i=1}^{n}P(X_i | \text{Pa}(X_i))" />
      <p>其中 Pa(X_i) 是 X_i 在图中的父节点。</p>
    </KnowledgeCard>

    <KnowledgeCard title="因果推断与持续学习" icon="🔬">
      <h2 id="causal-continual">因果推断与持续学习</h2>

      <h3>因果推断基础</h3>
      <p>图形直觉：相关不等于因果——冰淇淋销量和溺水人数正相关，但禁止卖冰淇淋不会减少溺水。它们都由"夏天天气热"这个共同原因导致。</p>
      <p>因果推断的核心框架——<strong>结构因果模型（SCM）</strong>和<strong>do-演算</strong>：</p>
      <FormulaBlock formula="P(Y | \text{do}(X=x)) \neq P(Y | X=x)" />
      <p>do(X=x) 表示主动干预 X 为 x，与观察到 X=x 本质不同。这是因果推断与统计学习的根本区别。</p>

      <h3>持续学习（Continual Learning）</h3>
      <p>图形直觉：人可以不断学新知识而不忘记旧知识（你会学微积分但不会忘记加减法）。但神经网络学新任务时会"灾难性遗忘"——新知识覆盖旧知识。</p>
      <div class="visual-hint">
        <strong>🎨 图形理解："相关不等于因果"</strong>：夏天冰淇淋销量和溺水人数高度正相关——但禁止冰淇淋不会减少溺水。它们都由"天气热"这个<strong>共同原因</strong>导致。因果推断的核心操作是 <strong>do-演算</strong>——P(Y|X) 是观测到 X 时 Y 的概率（相关），P(Y|do(X)) 是主动干预 X 后 Y 的概率（因果）。统计学习只能解决前者，因果推断需要额外假设（因果图、工具变量、随机对照实验）。<strong>持续学习</strong>的挑战：神经网络学新任务 B 时，会灾难性地覆盖掉任务 A 的知识（因为你不再训练 A 的数据）。EWC 的解法：对旧任务重要的参数（Fisher 信息矩阵对角线大的参数）加大正则化约束，学新任务时不让他们变化太大——相当于"给重要知识上锁"。
      </div>

      <h3>持续学习三大策略</h3>
      <div class="visual-hint">
        <strong>🔍 EWC 的 Fisher 信息直觉</strong>：Fisher 信息矩阵对角线 F_i 衡量<strong>参数 θ_i 对旧任务 A 的损失有多敏感</strong>。如果 θ₃ 一微调 A 的性能就暴跌——F₃ 很大（重要参数，锁死）；如果 θ₇ 怎么调 A 都不受影响——F₇ 很小（可以自由调整）。EWC 损失 = L_new + λ/2 Σ F_i(θ_i - θ_i*)^2——对新任务学习的"推力"和对旧任务重要参数的"拉力"之间的平衡。本质是<strong>贝叶斯视角下的持续学习</strong>：用旧任务的后验作为新任务的先验。
      </div>
      <ul>
        <li><strong>回放（Replay）</strong>：保留少量旧任务数据，训练新任务时混入复习</li>
        <li><strong>正则化</strong>：EWC（弹性权重巩固）——给重要参数加约束，学新任务时不允许修改对旧任务重要的参数</li>
        <FormulaBlock formula="\mathcal{L}_{\text{EWC}} = \mathcal{L}_{\text{new}}(θ) + \frac{\lambda}{2}\sum_i F_i(\theta_i - \theta_i^*)^2" />
        <li><strong>架构方法</strong>：为每个任务分配独立的子网络或模块（PackNet、Progressive Networks）</li>
      </ul>

      <h3>神经架构搜索（NAS）</h3>
      <div class="visual-hint">
        <strong>🔍 DARTS 的直觉："把离散选择变成连续权重"</strong>：传统 NAS 在离散的架构空间搜索（选 3×3 卷积还是 5×5 卷积？选跳跃连接还是不选？），每评估一个架构需要完整训练一次（太贵）。DARTS 的妙招：定义<strong>超网络</strong>——每层不是固定的操作，而是所有候选操作的<strong>加权混合</strong>。每条边 i→j 上的输出 = Σ α_k · op_k(x)，其中 α_k 是软的架构参数。现在架构搜索变成了：训练 α（选择哪种操作好）+ 训练 θ（让网络表现好），两者交替进行。搜索结束后，每条边选 α 最大的操作。关键风险：<strong>搜索容易塌缩到跳跃连接</strong>——因为 skip 让前期训练最快，但不一定是最终最优。RobustDARTS 等变体试图解决这个问题。
      </div>
    </KnowledgeCard>

    <PaperReference :paper="{
      title: 'Semi-Supervised Classification with Graph Convolutional Networks',
      authors: 'Kipf, T.N. & Welling, M.',
      venue: 'ICLR',
      year: '2017',
      url: 'https://arxiv.org/abs/1609.02907'
    }" />
    <PaperReference :paper="{
      title: 'A Simple Framework for Contrastive Learning of Visual Representations',
      authors: 'Chen, T., Kornblith, S., Norouzi, M. & Hinton, G.',
      venue: 'ICML',
      year: '2020',
      url: 'https://arxiv.org/abs/2002.05709'
    }" />
    <PaperReference :paper="{
      title: 'Proximal Policy Optimization Algorithms',
      authors: 'Schulman, J., Wolski, F., Dhariwal, P., Radford, A. & Klimov, O.',
      venue: 'arXiv',
      year: '2017',
      url: 'https://arxiv.org/abs/1707.06347'
    }" />

    <WritingGuide>
      <h3>综述论文与相关工作章节</h3>
      <ul>
        <li><strong>综述结构</strong>：引言→问题定义→方法分类→对比分析→挑战与展望→结论</li>
        <li><strong>相关工作章节</strong>：按方法类别组织（不要按论文逐篇列举），每类总结核心思想和代表性工作</li>
        <li><strong>引用管理</strong>：使用 BibTeX 管理参考文献，确保引用格式统一</li>
        <li><strong>对比表格</strong>：用表格总结不同方法的关键特征、优势和局限</li>
        <li><strong>时间线</strong>：对快速发展的领域，提供关键里程碑的时间线</li>
      </ul>
    </WritingGuide>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'
import FloatingToc from '@/components/ui/FloatingToc.vue'
import KnowledgeCard from '@/components/content/KnowledgeCard.vue'
import CodeBlock from '@/components/content/CodeBlock.vue'
import FormulaBlock from '@/components/content/FormulaBlock.vue'
import PaperReference from '@/components/content/PaperReference.vue'
import WritingGuide from '@/components/content/WritingGuide.vue'
import { experimentConfigs } from '@/experiments/configs'

const progressStore = useProgressStore()
onMounted(() => progressStore.markVisited('frontier'))

const gnnCode = `import torch
import torch.nn as nn
import torch.nn.functional as F

# GCN 层实现
class GCNLayer(nn.Module):
    def __init__(self, in_features, out_features):
        super().__init__()
        self.linear = nn.Linear(in_features, out_features)

    def forward(self, x, adj):
        # x: [N, in_features], adj: [N, N] (归一化邻接矩阵)
        support = self.linear(x)          # 特征变换
        output = torch.spmm(adj, support) # 邻居聚合
        return output

# GAT 层实现（带注意力）
class GATLayer(nn.Module):
    def __init__(self, in_features, out_features, n_heads=4):
        super().__init__()
        self.W = nn.Parameter(torch.randn(in_features, out_features * n_heads))
        self.a = nn.Parameter(torch.randn(out_features * 2, n_heads))
        self.n_heads = n_heads

    def forward(self, x, adj):
        Wh = x @ self.W  # [N, out_features * n_heads]
        # 计算注意力分数...
        alpha = F.leaky_relu(attention_scores)
        alpha = F.softmax(alpha, dim=-1)
        out = alpha @ Wh  # 加权聚合
        return out

# 使用 PyTorch Geometric
import torch_geometric
from torch_geometric.nn import GCNConv, GATConv
conv = GCNConv(in_channels=64, out_channels=128)
conv_gat = GATConv(in_channels=64, out_channels=128, heads=4)`

const contrastiveCode = `import torch
import torch.nn as nn
import torch.nn.functional as F

# SimCLR 对比学习
class SimCLR(nn.Module):
    def __init__(self, backbone, projection_dim=128, temperature=0.5):
        super().__init__()
        self.backbone = backbone
        self.projector = nn.Sequential(
            nn.Linear(backbone_dim, 512),
            nn.ReLU(),
            nn.Linear(512, projection_dim)
        )
        self.temperature = temperature

    def contrastive_loss(self, z_i, z_j):
        batch_size = z_i.size(0)
        z = torch.cat([z_i, z_j], dim=0)  # [2N, dim]
        z = F.normalize(z, dim=-1)
        sim = torch.mm(z, z.T) / self.temperature  # [2N, 2N]
        # 正例对：(i, i+N) 和 (i+N, i)
        labels = torch.cat([torch.arange(batch_size) + batch_size,
                           torch.arange(batch_size)])
        mask = ~torch.eye(2 * batch_size, dtype=torch.bool)
        sim = sim[mask].view(2 * batch_size, -1)
        loss = F.cross_entropy(sim, labels)
        return loss`

const rlCode = `import torch
import torch.nn as nn
import torch.nn.functional as F

# DQN 实现
class DQN(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 128), nn.ReLU(),
            nn.Linear(128, 128), nn.ReLU(),
            nn.Linear(128, action_dim)
        )

    def forward(self, x):
        return self.net(x)  # 输出每个动作的 Q 值

# PPO 实现（简化版）
class PPOAgent(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.actor = nn.Sequential(
            nn.Linear(state_dim, 64), nn.Tanh(),
            nn.Linear(64, action_dim), nn.Softmax(dim=-1)
        )
        self.critic = nn.Sequential(
            nn.Linear(state_dim, 64), nn.Tanh(),
            nn.Linear(64, 1)
        )

    def get_action(self, state):
        probs = self.actor(state)
        value = self.critic(state)
        dist = torch.distributions.Categorical(probs)
        action = dist.sample()
        return action, dist.log_prob(action), value

# PPO 损失函数
def ppo_loss(old_logprobs, new_logprobs, advantages, clip_eps=0.2):
    ratio = torch.exp(new_logprobs - old_logprobs)
    surr1 = ratio * advantages
    surr2 = torch.clamp(ratio, 1 - clip_eps, 1 + clip_eps) * advantages
    return -torch.min(surr1, surr2).mean()`

const federatedCode = `import copy

class FedAvgServer:
    def __init__(self, global_model, num_clients):
        self.global_model = global_model
        self.num_clients = num_clients

    def aggregate(self, client_weights, client_sizes):
        """FedAvg: 按样本量加权平均"""
        total_size = sum(client_sizes)
        new_weights = {}
        for key in client_weights[0].keys():
            new_weights[key] = sum(
                client_sizes[i] / total_size * client_weights[i][key]
                for i in range(self.num_clients)
            )
        return new_weights

    def round(self, client_data_loaders, local_epochs=5):
        # 1. 下发全局模型
        global_weights = copy.deepcopy(self.global_model.state_dict())

        # 2. 客户端本地训练
        client_weights, client_sizes = [], []
        for loader in client_data_loaders:
            local_model = copy.deepcopy(self.global_model)
            for _ in range(local_epochs):
                train_one_epoch(local_model, loader)
            client_weights.append(copy.deepcopy(local_model.state_dict()))
            client_sizes.append(len(loader.dataset))

        # 3. 服务器聚合
        new_weights = self.aggregate(client_weights, client_sizes)
        self.global_model.load_state_dict(new_weights)`
</script>

<style scoped>
.module-content { position: relative; z-index: 1; }
h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; }
.module-intro { color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 2rem; }
.visual-hint {
  border-left: 4px solid var(--accent-blue, #3b82f6);
  background: rgba(59, 130, 246, 0.06);
  padding: 0.85rem 1.1rem;
  margin: 0.8rem 0;
  border-radius: 0 8px 8px 0;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-primary);
}
.visual-hint strong { color: var(--accent-blue, #3b82f6); }
</style>
