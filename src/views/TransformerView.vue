<template>
  <div class="transformer-page module-content">
    <FloatingToc />
    <h1>⚡ Transformer 与大模型</h1>
    <p class="module-intro">从 Self-Attention 到预训练语言模型，理解 Transformer 革命</p>

    <KnowledgeCard title="为什么 Transformer 取代了 RNN" icon="❓">
      <h2 id="why-transformer">为什么需要 Transformer？</h2>

      <h3>图形直觉：并行 vs 串行</h3>
      <div class="visual-hint">
        <strong>🎨 图形理解："流水线 vs 并行工作台"</strong>：RNN 像<strong>串行流水线</strong>——第 1 步完成才能做第 2 步，100 个词就要串行 100 步，每步都依赖上一步的隐藏状态。Transformer 像<strong>并行开放办公室</strong>——100 个词同时进入，每个词通过自注意力<strong>直接</strong>看到其他所有词（O(1) 路径长度），不需要等待。三大优势：(1) 训练并行化——GPU 满负荷运转；(2) 长距离依赖——任意两个词直接交流，不用经过中间词；(3) 无梯度衰减——路径长度固定为 1，不像 RNN 乘 100 次权重。
      </div>
      <p>RNN 的三大问题：</p>
      <ul>
        <li><strong>串行计算</strong>：无法利用 GPU 并行，训练慢</li>
        <li><strong>长距离依赖</strong>：信息要经过很多步才能传到远处，容易丢失</li>
        <li><strong>梯度问题</strong>：即使有 LSTM，超长序列的梯度仍然会衰减</li>
      </ul>
      <p>Transformer 的解决方案：<strong>用注意力替代递归</strong>——任何两个位置之间只需要一步计算就能建立联系，路径长度 O(1)。</p>
    </KnowledgeCard>

    <KnowledgeCard title="Self-Attention 机制" icon="🎯" :experiment="experimentConfigs['self-attention']">
      <h2 id="self-attention">自注意力机制</h2>

      <h3>图形直觉：图书馆检索</h3>
      <div class="visual-hint">
        <strong>🎨 图形理解："QKV 数据库类比"</strong>：想象你在图书馆找书——你心中有一个<strong>查询</strong>（Query："我想了解深度学习的历史"），每本书有一个<strong>键</strong>（Key：书名/目录/标签），还有<strong>值</strong>（Value：书的正文内容）。你拿 Query 去和所有书的 Key 做匹配（点积算相似度），得到每本书的"相关度分数"，然后按相关度加权读取各书的 Value（高相关度的书多参考，低相关度的略过）。最终你得到的是<strong>所有相关书籍内容的加权总结</strong>。Self-Attention 中 Q、K、V 全部来自同一个输入 X——每个词既是"提问者"（Q），也是"被检索者"（K/V）。
      </div>
      <FormulaBlock formula="\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V" />
      <p>其中 Q (Query)、K (Key)、V (Value) 由输入线性变换得到：</p>
      <FormulaBlock formula="Q = XW_Q, \quad K = XW_K, \quad V = XW_V" />

      <h3>为什么除以 √d_k？</h3>
      <div class="visual-hint">
        <strong>🔍 缩放的直觉</strong>：如果 d_k=512，Q 和 K 的每个元素都是独立的随机变量（假设均值 0，方差 1），点积 Q·K = Σq_i·k_i 的方差是 d_k=512，这意味着点积值可能在 -500~+500 之间剧烈波动（标准差≈22.6）。把这个不经缩放的分数送进 softmax，结果会极度<strong>one-hot 化</strong>——一个位置的概率接近 1，其余接近 0，梯度几乎为零。除以 √d_k 让方差回归到 1，softmax 输出更平滑，梯度流动健康。这就是"缩放点积注意力"名字的由来——除以 √d_k 是最简单但也最关键的 trick。
      </div>

      <h3>逐步计算过程</h3>
      <ol>
        <li>输入序列 X 乘以三个矩阵得到 Q, K, V</li>
        <li>Q × Kᵀ 得到注意力分数矩阵（每对词的匹配程度）</li>
        <li>除以 √d_k 缩放</li>
        <li>对每行做 softmax，得到注意力权重（每行加起来 = 1）</li>
        <li>权重矩阵 × V，得到加权聚合后的输出</li>
      </ol>
      <AttentionHeatmap />
    </KnowledgeCard>

    <KnowledgeCard title="多头注意力" icon="🔀">
      <h2 id="multi-head">多头注意力（Multi-Head Attention）</h2>

      <div class="visual-hint">
        <strong>🎨 图形理解："多个专家同时审阅"</strong>：想象一份重要的法律文件，你会找多个律师同时审阅——一位看合同条款，一位看财务风险，一位看知识产权条款。每位律师在自己的专业领域（子空间）打分，最后综合所有人的意见。多头注意力类似：<strong>每个头把输入投射到不同的低维子空间</strong>（d_k = d_model / h），在不同子空间里独立计算注意力，最后把所有头的结果拼接起来。不同头自然学到不同的注意力模式——有的头关注语法结构（主语-谓语），有的头关注语义相关（同义词），有的头关注位置邻近。
      </div>
      <FormulaBlock formula="\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1,...,\text{head}_h)W^O" />
      <FormulaBlock formula="\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)" />
      <p>每个头的维度为 d_k = d_model / h，例如 d_model=512, h=8 则 d_k=64。计算量与单头全维度注意力相当。</p>

      <h3>为什么多头优于单头？</h3>
      <div class="visual-hint">
        <strong>💡 计算量相等，表达能力翻倍</strong>：8 头各 64 维的注意力计算量与 1 头 512 维相当（8×64×64 ≈ 512×512），但 8 个头在不同子空间独立学习。单头只能学一种注意力模式，多头可以学 8 种不同的模式——就像 1 个全科医生 vs 8 个专科医生会诊。原论文 h=8，BERT 也用的 h=16（d_model=768, d_k=64）。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="Transformer 完整架构" icon="🏗️">
      <h2 id="transformer-arch">Transformer 完整架构</h2>

      <h3>图形直觉：信息处理工厂</h3>
      <div class="visual-hint">
        <strong>🎨 图形理解："双层车间设计"</strong>：Transformer 的每一层就像工厂的一个车间，每个车间有两个工位：<strong>工位 1 — 多头自注意力</strong>（"情报收集"——每个词看看其他词在说什么，加权汇总信息）；<strong>工位 2 — 前馈网络 FFN</strong>（"情报消化"——对汇集的上下文信息做非线性变换，提取特征）。每个工位后都有<strong>残差连接 + 层归一化（Add & Norm）</strong>——残差连接保证梯度畅通（x + Sublayer(x)），层归一化稳定训练。前馈网络的维度通常是 d_ff = 4×d_model（先升维再降维），在升维空间做非线性变换增强表达能力。
      </div>

      <h3>编码器（Encoder）</h3>
      <ol>
        <li>输入嵌入 + 位置编码</li>
        <li>多头自注意力 + Add & Norm</li>
        <li>前馈网络（FFN: 两层全连接，中间 ReLU/GELU）+ Add & Norm</li>
        <li>重复 N 次（原论文 N=6）</li>
      </ol>

      <h3>解码器（Decoder）</h3>
      <p>与编码器类似，但多了一个<strong>交叉注意力层</strong>——Q 来自解码器，K/V 来自编码器输出。还使用<strong>因果掩码（Causal Mask）</strong>防止看到未来的 token。</p>

      <h3>关键细节</h3>
      <ul>
        <li><strong>残差连接</strong>：每层的输出 = LayerNorm(x + Sublayer(x))，使梯度流顺畅</li>
        <li><strong>前馈网络维度</strong>：通常 d_ff = 4 × d_model（如 512 → 2048 → 512），先升维再降维</li>
        <li><strong>层归一化 vs 批归一化</strong>：Transformer 使用 LayerNorm（沿特征维度归一化），对序列长度不敏感</li>
      </ul>

      <div class="visual-hint">
        <strong>💡 Post-LN vs Pre-LN</strong>：原版 Transformer 使用 Post-LN（先 Sublayer 再加，再 LN），但训练不稳定——梯度从顶层传到低层时需要穿过 LN，在深层容易发散。现代大模型普遍改用 <strong>Pre-LN</strong>（先 LN 再 Sublayer）：x + Sublayer(LayerNorm(x))，梯度可以直接通过残差路径回传，不经过 LN，训练更稳定。这就是为什么 GPT-2/3、LLaMA 等大模型都用 Pre-LN——"先洗澡再进车间"比"进完车间再洗澡"更稳定。
      </div>

      <CodeBlock lang="python" :code="transformerCode" />
    </KnowledgeCard>

    <KnowledgeCard title="位置编码" icon="📍" :experiment="experimentConfigs['positional-encoding']">
      <h2 id="positional-encoding">位置编码（Positional Encoding）</h2>

      <h3>图形直觉：给每个座位贴编号</h3>
      <div class="visual-hint">
        <strong>🎨 图形理解："正弦波位置指纹"</strong>：自注意力是位置无关的——打乱输入顺序，输出只是相应重排，内容不变。这就像一群人围坐开会，如果没人有座位号，你就分不清谁先发言、谁是下一个。位置编码就是给每个词贴上<strong>唯一的"位置指纹"</strong>。正弦余弦编码的精妙之处：每个位置 pos 得到一个 d_model 维的向量，<strong>不同维度用不同频率的正弦波编码</strong>——低维度变化快（区分相邻位置："第 3 个"和"第 4 个"很不同），高维度变化慢（区分远距离位置："第 3 个"和"第 33 个"不同）。更妙的是，<strong>PE(pos+k) 可以用 PE(pos) 的线性变换表示</strong>——这意味着模型可以轻松学到相对位置关系。
      </div>

      <p>原始 Transformer 使用正弦-余弦编码：</p>
      <FormulaBlock formula="PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{model}}}\right), \quad PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{model}}}\right)" />
      <p>不同维度使用不同频率的正弦波——低维度变化快（区分相邻位置），高维度变化慢（区分远距离位置）。这就像一组不同精度的时钟，组合起来可以唯一确定时间。</p>

      <h3>旋转位置编码（RoPE）</h3>
      <div class="visual-hint">
        <strong>🔍 RoPE 的直觉："旋转角度编码位置"</strong>：RoPE（Rotary Position Embedding）是 LLaMA、Qwen 等大模型的首选。核心思想：<strong>不对位置编码做加法，而是对 Q 和 K 做旋转变换</strong>——把 Q 和 K 的每一对维度看成一个二维向量，按位置索引旋转不同的角度。效果：两个位置的注意力分数 <strong>Q_m^T·K_n 只依赖于它们的相对距离 (m-n)</strong>，不依赖绝对位置。这提供了天然的外推能力——训练时最大序列 2048，推理时绕到 4096，RoPE 仍能编码相对位置关系（虽然高频部分会退化）。
      </div>
      <FormulaBlock formula="q_m^T k_n = \sum_i R_{\Theta,i}^{m} q_i \cdot R_{\Theta,i}^{n} k_i = f(q, k, m-n)" />
      <p>直觉：在二维平面上旋转 q 和 k，旋转角度与位置成正比。内积只依赖旋转角度差（即相对位置）。</p>

      <h3>其他位置编码</h3>
      <ul>
        <li><strong>可学习位置编码</strong>：让模型自己学位置向量（BERT 使用）</li>
        <li><strong>ALiBi</strong>：在注意力分数上加线性偏置，简单有效，支持外推</li>
      </ul>
    </KnowledgeCard>

    <KnowledgeCard title="BERT 与 GPT" icon="🤖">
      <h2 id="bert-gpt">预训练语言模型</h2>

      <h3>图形直觉：填空 vs 续写</h3>
      <p><strong>BERT</strong>像做"完形填空"——遮住句子的某些词，根据上下文（双向）预测被遮的词。适合理解型任务（分类、问答、NER）。</p>
      <p><strong>GPT</strong>像"续写故事"——根据前面的词，预测下一个词（单向，从左到右）。适合生成型任务（对话、写作、代码）。</p>
      <div class="visual-hint">
        <strong>🎨 图形理解："完形填空 vs 续写故事"</strong>：BERT 和 GPT 代表了两种预训练范式——<strong>BERT（编码器）</strong>像做"完形填空"：遮住句中某些词，根据双向上下文预测被遮的词，适合理解型任务（分类、NER、阅读理解）。<strong>GPT（解码器）</strong>像"续写故事"：根据前文预测下一个词，只能看左边不能看右边（因果注意力），适合生成型任务（对话、写作、代码补全）。关键差异：BERT 是<strong>双向注意力</strong>（能看到全局），GPT 是<strong>因果注意力</strong>（只能看到过去）。这是由训练目标决定的设计选择——理解任务从全局上下文受益，生成任务必须保持自回归。
      </div>

      <h3>BERT 的预训练任务</h3>
      <ul>
        <li><strong>MLM（掩码语言模型）</strong>：随机遮盖 15% 的 token，预测被遮的词</li>
        <li><strong>NSP（下一句预测）</strong>：判断两个句子是否前后相邻（后移除，RoBERTa 证明 NSP 不必要）</li>
      </ul>

      <h3>GPT 的 Scaling Law</h3>
      <div class="visual-hint">
        <strong>🔍 Scaling Law 的直觉</strong>：Kaplan et al. (2020) 发现模型性能（损失 L）与参数量 N、数据量 D、计算量 C 之间呈<strong>幂律关系</strong>——L ∝ N⁻⁰·⁰⁷⁶，L ∝ D⁻⁰·⁰⁹⁵。这意味着：<strong>要减半损失，需要大约 10000 倍的参数或数据</strong>——效益递减极其严重！这解释了为什么从 GPT-3 的 175B 参数到 GPT-4（参数量未公开，传言为 MoE 架构），性能提升远低于参数增长。更关键的是 Chinchilla 定律（Hoffmann et al., 2022）纠正了 Scaling Law：Kaplan 低估了数据量的重要性——<strong>最优配置下，数据量应该与参数量成比例增长（约 20:1）</strong>。这也是为什么现在流行用更多数据训练较小模型（如 LLaMA-3 8B 用 15T tokens），而不是单纯堆参数。
      </div>
      <FormulaBlock formula="L(N) \propto N^{-0.076}, \quad L(D) \propto D^{-0.095}" />
      <p>其中 N 是参数量，D 是数据量，L 是损失。关键结论：模型越大、数据越多，效果越好，且增长可预测。</p>

      <CodeBlock lang="python" :code="bertCode" />
    </KnowledgeCard>

    <KnowledgeCard title="大模型训练技术" icon="🔬">
      <h2 id="llm-training">大模型训练关键技术</h2>

      <h3>RLHF：让模型学会"说什么好"</h3>
      <div class="visual-hint">
        <strong>🎨 图形理解："从会说话到说好话"</strong>：预训练让模型学会了"说话"（预测下一个 token 的概率），但它不知道什么是"好回答"——它可能输出有害内容、胡说八道、或拒绝回答。RLHF 的三步教学法：(1) <strong>SFT</strong>——用人类编写的高质量对话示范"什么是好回答"；(2) <strong>奖励模型</strong>——让人类对同一问题的多个回答排序，训练一个"评分员"模型预测人类偏好；(3) <strong>PPO 强化学习</strong>——用评分员的打分作为奖励信号，让模型生成的回答朝高分方向优化。关键挑战：<strong>奖励欺骗</strong>——模型可能学会说评分员爱听的话（长回答、礼貌用语），但不一定更准确。
      </div>
      <ol>
        <li><strong>SFT（监督微调）</strong>：用人工编写的高质量对话数据微调基座模型</li>
        <li><strong>奖励模型训练</strong>：人类对模型输出打分排序，训练一个"评分员"模型</li>
        <li><strong>PPO 强化学习</strong>：用奖励模型的评分作为信号，优化生成策略</li>
      </ol>

      <h3>KV Cache：推理加速</h3>
      <div class="visual-hint">
        <strong>🔍 KV Cache 的直觉："不要重算历史"</strong>：自回归生成时每步产生一个新 token，标准做法是对整个序列（包含新 token）重新跑一次 Transformer——这意味着之前算过的 K 和 V 每步都要重算！KV Cache 的想法：<strong>把每层的 K 和 V 缓存起来</strong>，新 token 只需计算自己的 Q/K/V，然后用 Q 去匹配缓存的 K 得到注意力权重，乘缓存的 V。计算量从 O(n²) 降到 O(n)。代价是显存——长序列的 KV Cache 可能比模型权重还大。优化包括 <strong>MQA</strong>（所有头共享 K/V，省显存但损精度）、<strong>GQA</strong>（分组共享 K/V，折中方案）。
      </div>

      <h3>MoE（混合专家模型）</h3>
      <div class="visual-hint">
        <strong>🔍 MoE 的直觉："大公司里的专业团队"</strong>：MoE 把一个大的 FFN 层拆成 N 个"专家"子网络（如 16 个专家），每个输入 token 只被<strong>路由（Router）</strong>派给 Top-K 个专家处理（通常 K=2）。总参数量可以非常大（所有专家之和），但每个 token 的激活参数只有一小部分——用大容量换低计算。技术难点：(1) <strong>负载均衡</strong>——如果所有 token 都选同样的专家，其他专家闲置浪费；(2) <strong>路由崩溃</strong>——某些专家可能始终不被选中，模型退化为少数专家工作，需要辅助损失函数鼓励均匀路由。Mixtral 8×7B（8 个专家，K=2）= 总参数量 47B，但推理计算 ≈ 13B 的密集模型。
      </div>
      <FormulaBlock formula="\text{MoE}(x) = \sum_{i=1}^{N} g_i(x) \cdot E_i(x), \quad g_i(x) = \text{TopK}(\text{softmax}(W_g \cdot x))" />
      <p>路由器 g(x) 选择 Top-K 个专家（通常 K=2），被选中的专家并行计算，结果加权求和。</p>

      <h3>Flash Attention</h3>
      <div class="visual-hint">
        <strong>🔍 Flash Attention 的直觉："在快缓中计算，不写回慢显存"</strong>：标准注意力的瓶颈不在计算量（O(n²) 矩阵乘法很快），而在<strong>显存读写</strong>——注意力矩阵 QKᵀ (n×n) 和 softmax 结果需要反复在 GPU HBM（高带宽显存）和计算单元之间搬运，HBM 带宽是真正的性能瓶颈。Flash Attention 把计算切成小块（tiling），在 SRAM（片上快缓存）中一次性完成小块的计算，只把最终结果写回 HBM。数学上完全等价于标准注意力，但显存读写减少为原来的 1/√N，训练速度提升 2-4 倍。这是<strong>算法-硬件协同设计</strong>的经典案例。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="Vision Transformer" icon="🖼️">
      <h2 id="vit">ViT：视觉 Transformer</h2>

      <h3>图形直觉：把图片切成拼图块</h3>
      <div class="visual-hint">
        <strong>🎨 图形理解："图像拼图 + 标准 Transformer"</strong>：CNN 用滑动窗口在图片上逐格扫描（局部特征提取），ViT 的做法截然不同——把 224×224 的图切成 196 个 16×16 的小方块（Patch），每个 Patch 展平成 256 维的向量，线性投影到 d_model 维，加上位置编码，直接送进标准 Transformer 编码器处理。每个 Patch 就像 NLP 中的一个"词"，Transformer 用自注意力学习 Patch 之间的关系。<strong>根本差异</strong>：CNN 的归纳偏置（局部性、平移等变性）是硬编码进结构里的；ViT 几乎没有结构先验，<strong>一切关系从数据中学习</strong>——这导致小数据集上 ViT 不如 CNN（没有足够数据学出 CNN 级别的特征），但在大规模数据（ImageNet-21K、JFT-300M）预训练后，ViT 可以超越 CNN。
      </div>
      <FormulaBlock formula="x_p = [x_p^1, x_p^2, ..., x_p^N], \quad N = \frac{HW}{P^2}" />
      <p>ViT 证明：在大规模数据上预训练后，纯 Transformer 架构可以在图像任务上超越 CNN。但小数据集上 ViT 不如 CNN（缺少归纳偏置）。</p>

      <h3>ViT vs CNN 的归纳偏置</h3>
      <div class="visual-hint">
        <strong>💡 归纳偏置的权衡</strong>：<strong>CNN 强归纳偏置</strong>——卷积的局部连接=假设邻近像素相关（几乎总是对），权重共享=假设平移等变性（同一个模式在图的各位置同等重要）。数据少时这些"先验知识"极其珍贵。但数据充足时，这些先验反而成了束缚——ViT 不受局部性限制，可以学习任意距离的 Patch 关系。<strong>Swin Transformer</strong> 折中了这个矛盾——引入层级结构（像 CNN 一样逐级下采样）和移动窗口注意力（限制自注意力在局部窗口内计算），既有 Transformer 的灵活性，又有 CNN 的层次化多尺度特征，能做密集预测任务（检测、分割）。
      </div>

      <h3>后续发展</h3>
      <p><strong>Swin Transformer</strong>：引入层级结构和移动窗口注意力，使 ViT 也能做密集预测任务（检测、分割），像 CNN 一样逐级下采样。</p>
      <p><strong>MAE（Masked Autoencoder）</strong>：遮盖 75% 的图像 Patch，让模型重建。ViT 版的自监督预训练，效率极高。</p>
    </KnowledgeCard>

    <PaperReference :paper="paper1" />
    <PaperReference :paper="paper2" />
    <PaperReference :paper="{
      title: 'Training language models to follow instructions with human feedback (InstructGPT)',
      authors: 'Ouyang, L., Wu, J., Jiang, X., et al.',
      venue: 'NeurIPS',
      year: '2022',
      url: 'https://arxiv.org/abs/2203.02155'
    }" />
    <PaperReference :paper="{
      title: 'Scaling Laws for Neural Language Models',
      authors: 'Kaplan, J., McCandlish, S., Henighan, T., et al.',
      venue: 'arXiv',
      year: '2020',
      url: 'https://arxiv.org/abs/2001.08361'
    }" />

    <WritingGuide>
      <h3>Transformer 变体论文的写法</h3>
      <ul>
        <li><strong>动机明确</strong>：说明原版 Transformer 的什么问题驱动了你的改进——效率？长序列？多模态？</li>
        <li><strong>理论分析</strong>：给出改进的数学推导或直觉解释，不仅是实验堆叠</li>
        <li><strong>效率对比</strong>：报告 FLOPs、参数量、推理延迟、显存占用等效率指标</li>
        <li><strong>常见创新点</strong>：高效注意力（线性注意力/稀疏注意力/Flash Attention）、位置编码改进、MoE 混合专家、长上下文处理</li>
        <li><strong>Scaling 实验</strong>：展示模型在不同规模下的表现趋势，而不仅仅是单一规模的对比</li>
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
import AttentionHeatmap from '@/components/animations/AttentionHeatmap.vue'
import { experimentConfigs } from '@/experiments/configs'

const progressStore = useProgressStore()
onMounted(() => progressStore.markVisited('transformer'))

const transformerCode = `import torch
import torch.nn as nn

class TransformerBlock(nn.Module):
    def __init__(self, d_model=512, n_heads=8, d_ff=2048, dropout=0.1):
        super().__init__()
        self.attention = nn.MultiheadAttention(d_model, n_heads, dropout=dropout)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout),
        )

    def forward(self, x, mask=None):
        # 多头自注意力 + 残差 + 层归一化
        attn_out, _ = self.attention(x, x, x, attn_mask=mask)
        x = self.norm1(x + attn_out)
        # 前馈网络 + 残差 + 层归一化
        x = self.norm2(x + self.ffn(x))
        return x`

const bertCode = `from transformers import BertTokenizer, BertForSequenceClassification
import torch

# 使用 HuggingFace Transformers 加载 BERT
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=2)

# 文本分类推理
inputs = tokenizer("ML-Visualizer is amazing!", return_tensors="pt")
with torch.no_grad():
    outputs = model(**inputs)
    pred = torch.argmax(outputs.logits, dim=-1)
    print(f"预测类别: {pred.item()}")

# GPT 风格生成
from transformers import GPT2LMHeadModel, GPT2Tokenizer
gpt_tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
gpt_model = GPT2LMHeadModel.from_pretrained('gpt2')

input_ids = gpt_tokenizer.encode("Machine learning is", return_tensors="pt")
output = gpt_model.generate(input_ids, max_length=50, temperature=0.7, top_p=0.9)
print(gpt_tokenizer.decode(output[0]))`

const paper1 = {
  title: 'Attention Is All You Need',
  authors: 'Vaswani, A., Shazeer, N., Parmar, N., et al.',
  venue: 'NeurIPS',
  year: '2017',
  url: 'https://arxiv.org/abs/1706.03762'
}

const paper2 = {
  title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
  authors: 'Dosovitskiy, A., Beyer, L., Kolesnikov, A., et al.',
  venue: 'ICLR',
  year: '2021',
  url: 'https://arxiv.org/abs/2010.11929'
}
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
