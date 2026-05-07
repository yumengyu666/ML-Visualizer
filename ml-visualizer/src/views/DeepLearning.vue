<template>
  <div class="deep-learning module-content">
    <FloatingToc />
    <h1>🧠 深度学习核心</h1>
    <p class="module-intro">深入理解深度学习的核心算法与训练技巧</p>

    <KnowledgeCard title="深层神经网络" icon="🏗️" :experiment="experimentConfigs['deep-nn']">
      <h2 id="deep-nn">深层神经网络架构</h2>
      <p>吴恩达在深度学习课程中从浅层网络逐步过渡到深层网络，强调深度带来的表示能力提升。深层网络可以逐层提取从低级到高级的特征——浅层学习边缘和纹理，深层学习语义和概念。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：想象一条"信息加工流水线"——原始像素进入第一层，工人提取边缘（横线/竖线/斜线）；第二层把边缘组合成形状（角/圆弧）；第三层把形状组合成部件（眼睛/轮子）；最后一层把部件组合成概念（人脸/汽车）。每层都在前一层的基础上构建更抽象的表示——这就是"深度"的含义。
      </div>

      <p><strong>前向传播</strong>：逐层计算激活值，从输入到输出：</p>
      <FormulaBlock formula="z^{[l]} = W^{[l]}a^{[l-1]} + b^{[l]}, \quad a^{[l]} = g^{[l]}(z^{[l]})" />
      <p>其中 l 为层数索引，W 为权重矩阵，b 为偏置向量，g 为激活函数。</p>

      <div class="visual-hint">
        <strong>🔍 前向传播的直觉</strong>：每层做两件事——(1) 线性变换 z=Wa+b：对输入进行旋转、缩放、平移；(2) 非线性激活 a=g(z)：引入"弯曲"能力。没有第(2)步，不管多少层都等价于一个线性变换！
      </div>

      <p><strong>维度检查</strong>：吴恩达特别强调通过维度检查来避免 Bug。若第 l 层有 n_l 个神经元，batch 大小为 m：</p>
      <FormulaBlock formula="W^{[l]}: (n_l, n_{l-1}), \quad b^{[l]}: (n_l, 1), \quad z^{[l]}, a^{[l]}: (n_l, m)" />

      <div class="visual-hint">
        <strong>💡 维度检查速查</strong>：记住口诀"W 的行=本层神经元数，W 的列=上层神经元数"。如果矩阵乘法维度不匹配，立刻报错。吴恩达建议：写代码时先确认每层的维度，能避免 90% 的 shape bug。
      </div>

      <h3>为什么深度有效？</h3>
      <p>吴恩达用电路理论解释：某些函数用浅层网络表示需要指数级神经元，但用深层网络仅需线性级。例如计算 x₁ XOR x₂ XOR ... XOR xₙ，深度 O(log n) 的网络每层用 O(1) 个神经元即可，但浅层网络需要 O(2ⁿ) 个神经元。</p>
      <p>周志华从表示学习的角度指出，深度结构的本质优势在于特征的重用和逐层抽象——每一层都在前一层的基础上构建更抽象的表示。</p>

      <div class="visual-hint">
        <strong>🔍 深度 vs 宽度的直觉</strong>：深度就像"分工"——每层只做简单的工作，但层层递进完成复杂任务。宽度就像"堆人"——每层人多，但每人都得干复杂活。现实中，分工（深度）远比堆人（宽度）高效。就像造一辆汽车：一条流水线（深）比 1000 个全能工匠（宽）更高效。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="反向传播算法" icon="🔗" :experiment="experimentConfigs['backpropagation']">
      <h2 id="backpropagation">反向传播（Backpropagation）</h2>
      <p>反向传播是训练神经网络的核心算法，基于链式法则（Chain Rule）高效计算损失函数对各层参数的梯度。吴恩达在课程中用计算图逐步演示了前向和反向的计算过程。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：想象一条流水线——原材料（输入）经过多道工序（各层计算）变成成品（输出），质检员发现成品有缺陷（损失），然后逆向追溯：最后一道工序的问题导致了多少缺陷？倒数第二道呢？一直追溯到源头。每道工序根据自己该负的"责任"（梯度）来调整操作（更新参数）。
      </div>

      <h3>计算图与链式法则</h3>
      <p>计算图中的每个节点接收上游梯度，乘以本地梯度后传递给下游：</p>
      <FormulaBlock formula="\frac{\partial \mathcal{L}}{\partial w^{[l]}} = \frac{\partial \mathcal{L}}{\partial z^{[l]}} \cdot \frac{\partial z^{[l]}}{\partial w^{[l]}} = \delta^{[l]} \cdot a^{[l-1]T}" />
      <FormulaBlock formula="\delta^{[l]} = \frac{\partial \mathcal{L}}{\partial z^{[l]}} = (W^{[l+1]T}\delta^{[l+1]}) \odot g'^{[l]}(z^{[l]})" />

      <div class="visual-hint">
        <strong>🔍 链式法则的教学拆解</strong>：
        <br/>1️⃣ <strong>前向传播</strong>：像写数学作业——x → z=Wx+b → a=ReLU(z) → L=Loss(a,y)，一步步代入计算。
        <br/>2️⃣ <strong>反向传播</strong>：像对作业"倒推检查"——先算 ∂L/∂a（损失对输出的敏感度），再算 ∂L/∂z = ∂L/∂a · ∂a/∂z（乘以 ReLU 导数），再算 ∂L/∂W = ∂L/∂z · ∂z/∂W（乘以输入的转置）。
        <br/>3️⃣ <strong>关键洞察</strong>：每层的梯度只需要"上游传来的梯度"和"本层的输入/激活值"就能计算，不需要重新做前向传播！这就是反向传播高效的原因。
      </div>

      <h3>完整反向传播步骤</h3>
      <ol>
        <li>输出层梯度：δ[L] = ∂L/∂z[L] = a[L] - y（交叉熵 + Softmax 情况）</li>
        <li>逐层反传：δ[l] = (W[l+1]ᵀ δ[l+1]) ⊙ g'[l](z[l])</li>
        <li>计算参数梯度：∂L/∂W[l] = (1/m) δ[l] a[l-1]ᵀ，∂L/∂b[l] = (1/m) Σδ[l]</li>
        <li>参数更新：W[l] ← W[l] - α·∂L/∂W[l]</li>
      </ol>

      <div class="visual-hint">
        <strong>🔍 δ 的直觉</strong>：δ[l] 是"第 l 层对最终损失的责任大小"。δ 越大，说明这层参数的微小变化会显著影响损失，因此这层需要更大的更新。反向传播的精髓：信息正向流动计算输出，误差反向流动计算"谁该负责多少"。
      </div>

      <p>神经网络信息流动过程：正向传播计算输出，反向传播计算梯度。</p>
      <NeuralFlowAnimation />
      <CodeBlock lang="python" :code="backpropCode" />
    </KnowledgeCard>

    <KnowledgeCard title="梯度消失与梯度爆炸" icon="💥" :experiment="experimentConfigs['gradient-problems']">
      <h2 id="gradient-problems">梯度消失与梯度爆炸</h2>
      <p>深层网络训练中最核心的数值稳定性问题。吴恩达在课程中详细分析了其成因和解决方案。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：想象你在一个长走廊里传话——每个人只听到前一个人声音的一部分。如果每传一次声音就弱一半（梯度消失），传到第 50 个人时已经听不见了——前面的层几乎学不到东西。如果每传一次声音就大一倍（梯度爆炸），到后面就变成了噪声轰鸣——参数更新幅度剧烈震荡。
      </div>

      <h3>问题分析</h3>
      <p>在反向传播中，梯度需要经过多次矩阵乘法。若每层梯度的范数 > 1，梯度会指数级增长（爆炸）；若 < 1，则指数级衰减（消失）：</p>
      <FormulaBlock formula="\left\|\frac{\partial \mathcal{L}}{\partial W^{[1]}}\right\| \propto \prod_{l=1}^{L}\left\|\frac{\partial z^{[l]}}{\partial z^{[l-1]}}\right\| = \prod_{l=1}^{L}\left\|W^{[l]} \odot g'^{[l]}\right\|" />

      <div class="visual-hint">
        <strong>🔍 数学直觉</strong>：假设 L=100 层，每层梯度范数=0.9，那第 1 层收到的梯度 ≈ 0.9¹⁰⁰ ≈ 2.7×10⁻⁵——几乎为零！反之如果每层=1.1，1.1¹⁰⁰ ≈ 1.38×10⁴——爆炸了！<strong>连乘的威力</strong>就是梯度问题的根源。Sigmoid 的导数最大值才 0.25，所以用 Sigmoid 的深层网络几乎必然梯度消失。
      </div>

      <h3>解决方案</h3>
      <ul>
        <li><strong>合理的权重初始化</strong>：Xavier 初始化（tanh/sigmoid）、Kaiming 初始化（ReLU），使每层梯度的方差保持在合理范围</li>
        <li><strong>ReLU 激活函数</strong>：ReLU 在正区间的梯度恒为 1，避免了 Sigmoid/Tanh 的梯度饱和问题</li>
        <li><strong>残差连接（Skip Connection）</strong>：提供梯度的"高速公路"，使梯度可以直接流向前层</li>
        <li><strong>批归一化（Batch Normalization）</strong>：稳定每层输入的分布，减少内部协变量偏移</li>
        <li><strong>梯度裁剪（Gradient Clipping）</strong>：在 RNN 中常用，将梯度范数裁剪到阈值以内</li>
      </ul>

      <div class="visual-hint">
        <strong>🔍 各解决方案的直觉对比</strong>：
        <br/>• <strong>初始化</strong>：打好地基——让起步的梯度就在合理范围，但训练过程中可能漂移。
        <br/>• <strong>ReLU</strong>：换材料——用不会饱和的激活函数，从根本上解决梯度消失（但可能死亡 ReLU）。
        <br/>• <strong>残差连接</strong>：修高速——给梯度一条"直达通道"，不经过中间层的连乘。
        <br/>• <strong>BatchNorm</strong>：每层校准——每步训练后重新校准分布，防止漂移。
        <br/>• <strong>梯度裁剪</strong>：装限速器——不解决根因，但至少不会"翻车"。
      </div>

      <CodeBlock lang="python" :code="gradientClipCode" />
    </KnowledgeCard>

    <KnowledgeCard title="优化器深度解析" icon="⚡" :experiment="experimentConfigs['optimizers']">
      <h2 id="optimizers">优化器对比</h2>
      <p>吴恩达在深度学习课程中系统比较了各种优化器，并提供了选择建议。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：优化器就是"下山策略"——损失函数是一座山，优化器决定你怎么走才能最快到达谷底。SGD 是蒙眼直走、Momentum 是带惯性滚球、RMSProp 是自动调步幅、Adam 是带惯性+自动调步幅的全能选手。
      </div>

      <p><strong>SGD</strong>：最朴素的梯度下降，沿着负梯度方向更新参数。简单但收敛慢，容易陷入局部最优。</p>
      <FormulaBlock formula="\theta_{t+1} = \theta_t - \eta \nabla_\theta \mathcal{L}" />

      <div class="visual-hint">
        <strong>🔍 SGD 的图形理解</strong>：损失曲面的等高线如果是细长的椭圆（像山谷），SGD 会在谷壁之间来回震荡（沿短轴方向反复横跳），而在谷底方向（长轴方向）前进很慢。这就是为什么需要 Momentum。
      </div>

      <p><strong>SGD + Momentum</strong>：引入动量项，积累历史梯度方向，加速收敛并减少震荡。吴恩达用"球从山坡滚下"的比喻解释动量的物理直觉。</p>
      <FormulaBlock formula="v_t = \beta v_{t-1} + (1-\beta)\nabla_\theta \mathcal{L}, \quad \theta_{t+1} = \theta_t - \eta v_t" />
      <p>β 通常设为 0.9。注意这里使用了修正的动量公式（与吴恩达课程一致），与某些文献中的 v_t = βv_{t-1} + η∇L 略有不同。</p>

      <div class="visual-hint">
        <strong>🔍 Momentum 的直觉</strong>：想象一个球滚下山——球有惯性，即使某一步碰到了上坡（梯度方向反转），惯性也会带着球继续往下冲一段。这让它：(1) 穿过小的局部最优；(2) 在谷壁间震荡减弱（惯性抵消了来回摆动）；(3) 在一致方向上加速。β=0.9 意味着"最近 10 步的平均方向"。
      </div>

      <p><strong>RMSProp</strong>：自适应学习率，根据梯度的历史平方和调整每个参数的学习率。</p>
      <FormulaBlock formula="s_t = \beta_2 s_{t-1} + (1-\beta_2)g_t^2, \quad \theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{s_t}+\epsilon}g_t" />

      <div class="visual-hint">
        <strong>🔍 RMSProp 的直觉</strong>：梯度一直很大的方向（谷壁）→ s_t 大 → 学习率自动缩小 → 不再震荡；梯度一直很小的方向（谷底）→ s_t 小 → 学习率自动放大 → 加速前进。RMSProp 就是"自动调步幅"——陡的地方小步走，平的地方大步跑。
      </div>

      <p><strong>Adam</strong>：结合 Momentum（一阶动量）和 RMSProp（二阶动量）的自适应学习率方法，是目前最常用的优化器。</p>
      <FormulaBlock formula="m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t, \quad v_t = \beta_2 v_{t-1} + (1-\beta_2)g_t^2" />
      <FormulaBlock formula="\hat{m}_t = \frac{m_t}{1-\beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1-\beta_2^t}, \quad \theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{v}_t}+\epsilon}\hat{m}_t" />

      <div class="visual-hint">
        <strong>🔍 Adam 的教学拆解</strong>：
        <br/>• m_t 是"平均梯度方向"（Momentum 部分）→ 告诉你往哪走
        <br/>• v_t 是"平均梯度大小²"（RMSProp 部分）→ 告诉你步幅多大
        <br/>• hat 项是偏差校正——训练初期 m_t 和 v_t 都偏小（因为从 0 开始），校正后更准确
        <br/>• 最终更新 = 方向/步幅自适应 = 又稳又快的下山方式
      </div>

      <p>偏差校正（hat 项）很重要：初期 m_t 和 v_t 偏向于 0，校正使其无偏。推荐默认参数：β₁=0.9, β₂=0.999, ε=10⁻⁸。</p>

      <p><strong>AdamW</strong>：Adam 的改进版本，将权重衰减与梯度更新解耦，正则化效果更好。Loshchilov & Hutter (2019) 证明解耦的权重衰减比 L2 正则化在 Adam 中更有效。</p>
      <FormulaBlock formula="\theta_{t+1} = \theta_t - \eta\left(\frac{\hat{m}_t}{\sqrt{\hat{v}_t}+\epsilon} + \lambda \theta_t\right)" />

      <div class="visual-hint">
        <strong>🔍 Adam vs AdamW 的区别</strong>：Adam 中的 L2 正则会被自适应学习率"吞掉"——正则化梯度大的参数恰好被 v_t 大的分母抵消，导致正则无效。AdamW 把权重衰减独立出来，直接从参数中减去 λθ，不受自适应学习率影响。Transformer 训练标配用 AdamW。
      </div>

      <p><strong>优化器选择建议</strong>：吴恩达推荐 Adam 作为默认选择；如果对收敛速度不敏感，SGD + Momentum + 好的学习率调度往往能达到更好的泛化性能。</p>
      <GradientDescent3D />
      <CodeBlock lang="python" :code="optimizerCode" />
    </KnowledgeCard>

    <KnowledgeCard title="批归一化" icon="📐" :experiment="experimentConfigs['batchnorm']">
      <h2 id="batch-norm">批归一化（Batch Normalization）</h2>
      <p>批归一化通过标准化每层的输入分布，加速训练并提供正则化效果。吴恩达在课程中详细解释了其动机和实现。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：想象一条流水线——如果每个工位收到的零件尺寸差异很大（内部协变量偏移），后面的工人就得不断调整操作方式。BatchNorm 就是在每个工位上加一个"标准化器"，让每个工人收到的零件尺寸始终在标准范围内，工作效率大大提高。
      </div>

      <FormulaBlock formula="\hat{x}_i = \frac{x_i - \mu_\mathcal{B}}{\sqrt{\sigma_\mathcal{B}^2 + \epsilon}}, \quad y_i = \gamma \hat{x}_i + \beta" />
      <p>其中 μ_B 和 σ_B 是当前 mini-batch 的均值和方差，γ 和 β 是可学习参数。</p>

      <div class="visual-hint">
        <strong>🔍 为什么要 γ 和 β？</strong>：标准化把数据变成均值=0、方差=1，但这可能不是最优的分布——也许这层需要均值=5、方差=3 才能学得最好。γ 和 β 就是让网络自己学"最优的均值和方差"，所以 BatchNorm 不是简单地强制 N(0,1)，而是"先归一再学最优分布"。
      </div>

      <h3>训练与推理的差异</h3>
      <p><strong>训练时</strong>：使用当前 mini-batch 的统计量计算均值和方差。</p>
      <p><strong>推理时</strong>：使用训练过程中累积的全局均值和方差（通常使用指数移动平均估计）：</p>
      <FormulaBlock formula="\mu_{\text{running}} = (1-\alpha)\mu_{\text{running}} + \alpha \cdot \mu_\mathcal{B}, \quad \sigma^2_{\text{running}} = (1-\alpha)\sigma^2_{\text{running}} + \alpha \cdot \sigma^2_\mathcal{B}" />

      <div class="visual-hint">
        <strong>🔍 为什么推理不能用 batch 统计量？</strong>：推理时可能只有一个样本（batch=1），均值=自身、方差=0，标准化后全变零！所以推理必须用训练时积累的全局统计量。这也是 BatchNorm 在小 batch 时效果差的原因——batch 太小，统计量不稳定。
      </div>

      <h3>为什么 BatchNorm 有效？</h3>
      <ul>
        <li><strong>减少内部协变量偏移</strong>：每层输入分布更稳定，允许使用更大的学习率</li>
        <li><strong>正则化效果</strong>：mini-batch 的统计量引入了随机噪声，类似 Dropout</li>
        <li><strong>平滑损失地形</strong>：使梯度更可靠，优化更稳定</li>
      </ul>

      <div class="visual-hint">
        <strong>💡 BatchNorm 的替代品速查</strong>：
        <br/>• <strong>LayerNorm</strong>：在单个样本的所有特征上归一化（不看 batch 维度）→ Transformer/NLP 标配
        <br/>• <strong>GroupNorm</strong>：把特征分组后归一化 → 小 batch 场景的救星
        <br/>• <strong>InstanceNorm</strong>：在每个通道上独立归一化 → 风格迁移常用
        <br/>• 选择原则：大 batch 用 BatchNorm，小 batch/序列模型用 LayerNorm/GroupNorm
      </div>

      <p>注意：BatchNorm 在小 batch 或序列模型中效果不佳，可使用 LayerNorm、GroupNorm 或 InstanceNorm 替代。</p>
    </KnowledgeCard>

    <KnowledgeCard title="学习率调度" icon="📅" :experiment="experimentConfigs['lr-schedule']">
      <h2 id="lr-schedule">学习率调度策略</h2>
      <p>吴恩达强调，学习率是最重要的超参数，合适的学习率调度可以显著提升训练效果。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：学习率就是"下山速度"——开始时你离谷底很远，可以大步快跑（高学习率）；快到谷底时要减速（低学习率），否则会冲过去。Warmup 是"热身"——刚起步时还没站稳，先小步试探；Cosine Decay 是"逐渐减速"——像汽车刹车一样平滑减速；OneCycleLR 是"先加速再减速"——先冲到高速再慢慢刹停，居然比一直慢走更快到达。
      </div>

      <p><strong>Warmup</strong>：训练初期使用较小学习率，逐步增加至目标值，避免初期梯度不稳定。在大模型训练中几乎成为标配。</p>
      <FormulaBlock formula="\eta_t = \eta_{\max} \cdot \min\left(1, \frac{t}{T_{\text{warmup}}}\right)" />

      <div class="visual-hint">
        <strong>🔍 Warmup 为什么有效？</strong>：训练初期参数是随机的，梯度方向不可靠——如果直接用大学习率，参数会在随机方向上大幅跳动，甚至破坏好的初始化。Warmup 让模型先用小学习率找到大致正确的方向，再逐步加速。大模型训练中，Warmup 几乎是"不用就训不动"的关键。
      </div>

      <p><strong>Step Decay</strong>：每过固定 epoch 数将学习率乘以衰减因子。</p>
      <FormulaBlock formula="\eta_t = \eta_0 \cdot \gamma^{\lfloor t / T_{\text{step}}\rfloor}" />

      <p><strong>Cosine Decay</strong>：学习率按余弦曲线衰减，平滑过渡。SGDR（带热重启的余弦退火）在衰减到底后重新重启。</p>
      <FormulaBlock formula="\eta_t = \eta_{\min} + \frac{1}{2}(\eta_{\max} - \eta_{\min})\left(1 + \cos\left(\frac{t}{T}\pi\right)\right)" />

      <div class="visual-hint">
        <strong>🔍 Cosine Decay vs Step Decay</strong>：Step Decay 像"台阶式降速"——突然降一大截，训练曲线上能看到明显的抖动；Cosine Decay 像"滑梯式降速"——平滑缓慢降低，训练更稳定。实际效果两者差不多，但 Cosine Decay 不需要调 step 超参数，所以更受欢迎。
      </div>

      <p><strong>OneCycleLR</strong>：Smith (2018) 提出的策略，先从低学习率升到高，再降回低。可以在较少 epoch 内达到更好的效果。</p>

      <div class="visual-hint">
        <strong>🔍 OneCycleLR 的直觉</strong>：OneCycle 的哲学是"先快速穿越损失地形，再精细定位"——升到高学习率让模型跳出局部最优（探索），再慢慢降回来精确收敛（利用）。神奇的是，这个"冲过头再回来"的策略比一直小心翼翼走得更快更好。
      </div>

      <p><strong>学习率查找器（LR Finder）</strong>：从极小学习率开始逐步增大，绘制 loss-lr 曲线，选择 loss 下降最快处的学习率。这是吴恩达推荐的实用方法。</p>
      <CodeBlock lang="python" :code="lrScheduleCode" />
    </KnowledgeCard>

    <KnowledgeCard title="权重初始化" icon="🎲" :experiment="experimentConfigs['weight-init']">
      <h2 id="weight-init">权重初始化</h2>
      <p>好的初始化是训练成功的关键第一步。吴恩达强调，初始化不当会导致梯度消失或爆炸。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：初始化就像建房子的地基——地基不好，上面盖再漂亮也会塌。如果权重全初始化为0，所有神经元学到一样的特征（对称性问题）；如果权重太大，前向传播时激活值爆炸；如果权重太小，激活值消失到零。好的初始化让每层输出的方差≈输入的方差，信息不放大也不缩小。
      </div>

      <p><strong>Xavier 初始化（Glorot 初始化）</strong>：适用于 tanh/sigmoid 激活函数，保持每层方差不变。核心思想：要求正向传播时方差不变，反向传播时方差也不变。</p>
      <FormulaBlock formula="W \sim \mathcal{U}\left[-\sqrt{\frac{6}{n_{in}+n_{out}}}, \sqrt{\frac{6}{n_{in}+n_{out}}}\right]" />
      <FormulaBlock formula="\text{或} \quad W \sim \mathcal{N}\left(0, \sqrt{\frac{2}{n_{in}+n_{out}}}\right)" />

      <div class="visual-hint">
        <strong>🔍 Xavier 初始化的推导直觉</strong>：假设输入 x 有 n_in 个特征，每个 w ~ N(0, σ²)，输出 y = Σwᵢxᵢ。如果 xᵢ 的方差为 1，那 Var(y) = n_in × σ²。要让 Var(y) ≈ Var(x) = 1，就需要 σ² = 1/n_in。正向和反向传播都满足的话，取折中 σ² = 2/(n_in + n_out)。
      </div>

      <p><strong>Kaiming 初始化（He 初始化）</strong>：适用于 ReLU 及其变体，考虑 ReLU 使一半神经元输出为零、方差减半的效应。</p>
      <FormulaBlock formula="W \sim \mathcal{N}\left(0, \sqrt{\frac{2}{n_{in}}}\right)" />

      <div class="visual-hint">
        <strong>🔍 Kaiming 为什么比 Xavier 大？</strong>：ReLU 把负半轴截断为零，相当于"扔掉一半信号"——输出方差只有原来的一半。Kaiming 在 Xavier 基础上乘以 √2 来补偿这个损失：σ² = 2/n_in。经验法则：用 ReLU/GELU/LeakyReLU → Kaiming；用 Tanh/Sigmoid → Xavier。
      </div>

      <p><strong>零初始化的陷阱</strong>：若所有权重初始化为零，同一层的所有神经元将学习到相同的特征（对称性问题）。偏置可以安全地初始化为零。</p>

      <div class="visual-hint">
        <strong>🔍 对称性问题的直觉</strong>：如果所有 w=0，同一层每个神经元收到相同的输入、计算相同的输出、得到相同的梯度、做相同的更新——永远学不到不同的特征。打破对称性的方法：随机初始化权重（哪怕很小），让不同神经元从不同的"起点"出发。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="超参数调优策略" icon="🎛️" :experiment="experimentConfigs['hyperparameter']">
      <h2 id="hyperparameter-tuning">超参数调优策略</h2>
      <p>吴恩达在深度学习课程中提供了系统化的超参数调优方法论。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：超参数调优就像调收音机——有好多旋钮（学习率、batch大小、层数等），但只有一两个对音质影响最大。吴恩达的建议是：先调最重要的旋钮（学习率），再调次要的，别在无关紧要的旋钮上浪费时间。
      </div>

      <h3>超参数重要性排序</h3>
      <p>吴恩达按重要性将超参数排序：</p>
      <ol>
        <li><strong>最重要</strong>：学习率 α</li>
        <li><strong>其次</strong>：Momentum β、mini-batch 大小、隐藏单元数</li>
        <li><strong>再次</strong>：层数、学习率衰减</li>
        <li><strong>不太重要</strong>：Adam 的 β₁、β₂、ε</li>
      </ol>

      <h3>搜索策略</h3>
      <p><strong>由粗到细（Coarse-to-Fine）</strong>：先在大范围内粗略搜索，找到好区域后缩小范围精细搜索。</p>
      <p><strong>随机搜索优于网格搜索</strong>：在超参数重要性不均匀时，随机搜索能更有效地探索关键超参数。</p>

      <div class="visual-hint">
        <strong>🔍 为什么随机搜索更好？</strong>：想象学习率很重要但 β 不重要。网格搜索会在每个 β 值上都试一遍学习率，浪费大量试验；随机搜索每次都随机选 (α, β)，更可能在不同的 α 值上采样，从而更高效地找到好区域。Bergstra & Bengio (2012) 用理论证明了这一点。
      </div>

      <p><strong>对数尺度搜索</strong>：学习率等超参数应在对数尺度上搜索，而非线性尺度：</p>
      <FormulaBlock formula="\alpha = 10^r, \quad r \in [-4, 0] \Rightarrow \alpha \in [10^{-4}, 1]" />

      <div class="visual-hint">
        <strong>🔍 为什么用对数尺度？</strong>：学习率从 0.001 改到 0.01（10倍）的效果远大于从 0.9 改到 0.91（1%差异）。如果线性采样，大部分试验都集中在 0~1 的"无聊"区域，而对数采样能均匀覆盖 0.0001~1 的每个量级。
      </div>

      <h3>Pandas vs Caviar 策略</h3>
      <p><strong>Pandas（ babysitting）</strong>：计算资源有限时，训练一个模型，观察学习曲线后调整超参数继续训练。像照顾熊猫一样精心照料一个模型。</p>
      <p><strong>Caviar</strong>：计算资源充足时，同时训练多个不同超参数的模型，选择最好的。像鱼产卵一样同时尝试多种可能。</p>

      <div class="visual-hint">
        <strong>💡 实战建议</strong>：学术界用 Caviar 多（GPU 多、追求 SOTA），工业界用 Pandas 多（线上模型不能随便换、需要稳定迭代）。吴恩达本人更推荐 Caviar——"多试几次比精心调一次更靠谱"。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="数据划分与误差分析" icon="📊" :experiment="experimentConfigs['data-split']">
      <h2 id="data-split">数据划分与系统化误差分析</h2>
      <p>吴恩达在"Structuring Machine Learning Projects"课程中提出了面向工程实践的数据划分和误差分析方法论。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：数据划分就像学校考试——训练集=平时练习题（用来学习），dev 集=模拟考（用来调策略），test 集=高考（最终评估）。关键是：模拟考和高考的题型必须一样（同分布），而且高考不能用平时练过的原题（不能泄露）。
      </div>

      <h3>现代数据划分策略</h3>
      <p>小数据集（< 10K）：经典 70/30 或 60/20/20 划分。</p>
      <p>大数据集（> 1M）：训练集可以占 98% 甚至 99%，dev/test 各 0.5%-1% 就足够评估。</p>
      <p><strong>关键原则</strong>：dev 和 test 集必须来自同一分布，且应反映未来真实应用场景的数据分布。</p>

      <h3>数据分布不匹配</h3>
      <p>当训练集与 dev/test 分布不同时（如训练用网上图片，部署用手机拍照），吴恩达建议将 dev 集再分为 train-dev 和 dev：</p>
      <ul>
        <li><strong>训练误差 vs train-dev 误差</strong>：差值反映方差问题</li>
        <li><strong>train-dev 误差 vs dev 误差</strong>：差值反映数据分布不匹配问题</li>
        <li><strong>dev 误差 vs test 误差</strong>：差值反映 dev 集过拟合问题</li>
      </ul>

      <div class="visual-hint">
        <strong>🔍 数据分布不匹配的诊断直觉</strong>：吴恩达的"误差分解法"——
        <br/>训练误差高 → 偏差问题（模型太简单）
        <br/>训练误差低但 train-dev 误差高 → 方差问题（过拟合训练集）
        <br/>train-dev 误差低但 dev 误差高 → 分布不匹配（训练数据不代表真实场景）
        <br/>dev 误差低但 test 误差高 → dev 过拟合（反复调参导致 dev 泄露）
        <br/><br/>
        <strong>解决方案对应</strong>：偏差→加模型复杂度；方差→加数据/正则化；分布不匹配→人工合成/收集更多真实数据；dev过拟合→加大 dev 集。
      </div>

      <h3>系统化误差分析</h3>
      <p>吴恩达的误差分析框架：在 dev 集上收集 100 个错误样本，人工标注错误类型，计算每类错误的占比，优先解决占比最大的问题。</p>

      <div class="visual-hint">
        <strong>🔍 误差分析的实操步骤</strong>：
        <br/>1️⃣ 收集 dev 集上 100 个错误样本
        <br/>2️⃣ 人工逐个检查，按错误原因分类（如：模糊、遮挡、光照不足、同类混淆…）
        <br/>3️⃣ 统计每类占比——如果 60% 是模糊导致的，解决模糊问题就能减少 60% 的错误
        <br/>4️⃣ 优先解决占比最大的问题——这比花同样时间优化一个只占 5% 的问题 ROI 高得多
        <br/><br/>
        <strong>吴恩达金句</strong>："做对方向比走快更重要"——先做误差分析确定方向，再决定投入资源。
      </div>

      <p>例如：若 60% 的错误来自猫被误识别为狗，那么改进猫-狗区分比其他优化更有价值。</p>
    </KnowledgeCard>

    <KnowledgeCard title="混合精度训练与梯度累积" icon="🔥">
      <h2 id="mixed-precision">混合精度训练与梯度累积</h2>
      <p>现代深度学习训练中常用的工程技巧，可以显著加速训练或突破显存限制。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：混合精度就像"用简笔画起草，用工笔画定稿"——FP16 是简笔画（快、省纸但不精确），FP32 是工笔画（慢、费纸但精确）。混合精度用 FP16 做大部分计算（快），但保留 FP32 副本做关键步骤（准）。梯度累积就像"分期付款"——一次付不起大额，就分 4 次小额支付，效果一样。
      </div>

      <h3>混合精度训练（Mixed Precision Training）</h3>
      <p>使用 FP16（半精度）存储权重和计算前向/反向传播，用 FP32（单精度）维护主权重副本。好处：</p>
      <ul>
        <li>显存占用减少约 50%，可用更大的 batch 或模型</li>
        <li>计算速度在支持 Tensor Core 的 GPU 上提升 2-3 倍</li>
        <li>FP32 主权重保证数值稳定性，避免精度损失</li>
      </ul>
      <p>关键技术：<strong>损失缩放（Loss Scaling）</strong>——将损失乘以一个大数（如 2¹⁶），防止小梯度在 FP16 中下溢为零；更新前再除回来。</p>

      <div class="visual-hint">
        <strong>🔍 损失缩放的直觉</strong>：FP16 能表示的最小正数约 6×10⁻⁵。如果梯度是 10⁻⁶，FP16 直接截断为 0——梯度就"消失"了！损失缩放把 loss 乘 2¹⁶ = 65536，梯度也放大 65536 倍变成 0.065536，FP16 就能表示了。更新前再除回来，数值和全精度一样。
      </div>

      <h3>梯度累积（Gradient Accumulation）</h3>
      <p>当显存不够使用大 batch 时，将大 batch 分成多个 micro-batch，累积梯度后再更新参数：</p>
      <FormulaBlock formula="g_{\text{accum}} = \frac{1}{K}\sum_{k=1}^{K}\nabla_\theta \mathcal{L}(x_{k}, y_{k}), \quad \theta \leftarrow \theta - \eta \cdot g_{\text{accum}}" />
      <p>其中 K 为累积步数。效果等价于使用 K 倍大的 batch，但显存只需 micro-batch 的量。</p>

      <div class="visual-hint">
        <strong>💡 注意事项</strong>：梯度累积在数学上等价于大 batch，但 BatchNorm 的统计量仍然是 micro-batch 级别的。如果 batch=4 累积 8 次，BN 看到的 batch 是 4 而不是 32。需要 BN 同步（SyncBN）或换用 GroupNorm/LayerNorm 才能真正等价。
      </div>

      <CodeBlock lang="python" :code="mixedPrecisionCode" />
    </KnowledgeCard>

    <PaperReference :paper="{
      title: 'Adam: A Method for Stochastic Optimization',
      authors: 'Kingma, D.P. & Ba, J.',
      venue: 'ICLR',
      year: '2015',
      url: 'https://arxiv.org/abs/1412.6980'
    }" />
    <PaperReference :paper="{
      title: 'Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift',
      authors: 'Ioffe, S. & Szegedy, C.',
      venue: 'ICML',
      year: '2015',
      url: 'https://arxiv.org/abs/1502.03167'
    }" />
    <PaperReference :paper="{
      title: 'Decoupled Weight Decay Regularization (AdamW)',
      authors: 'Loshchilov, I. & Hutter, F.',
      venue: 'ICLR',
      year: '2019',
      url: 'https://arxiv.org/abs/1711.05101'
    }" />
    <PaperReference :paper="{
      title: 'Understanding the Difficulty of Training Deep Feedforward Neural Networks',
      authors: 'Glorot, X. & Bengio, Y.',
      venue: 'AISTATS',
      year: '2010',
      url: 'http://proceedings.mlr.press/v9/glorot10a.html'
    }" />

    <WritingGuide>
      <h3>消融实验（Ablation Study）设计规范</h3>
      <ul>
        <li><strong>逐个移除</strong>：每次移除一个组件，观察性能变化</li>
        <li><strong>控制变量</strong>：确保每次实验只改变一个因素</li>
        <li><strong>定量分析</strong>：报告每个变体的具体数值，而非仅定性描述</li>
        <li><strong>统计显著性</strong>：多次实验报告均值和标准差</li>
        <li><strong>分析原因</strong>：不仅报告"去掉X后性能下降"，还要分析为什么——吴恩达强调，好的消融实验应该能揭示各组件的贡献机制</li>
        <li><strong>渐进式添加</strong>：除了移除实验，还可以从基线开始逐步添加组件，展示每个改进的增量贡献</li>
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
import NeuralFlowAnimation from '@/components/animations/NeuralFlowAnimation.vue'
import GradientDescent3D from '@/components/animations/GradientDescent3D.vue'
import { experimentConfigs } from '@/experiments/configs'

const progressStore = useProgressStore()
onMounted(() => progressStore.markVisited('deep-learning'))

const backpropCode = `import torch

# PyTorch 自动微分演示
x = torch.tensor([1.0, 2.0, 3.0], requires_grad=False)
W = torch.randn(3, 2, requires_grad=True)
b = torch.randn(2, requires_grad=True)

# 正向传播
y = torch.relu(x @ W + b)
loss = y.sum()

# 反向传播 - 自动计算梯度
loss.backward()

print(f"W的梯度: {W.grad}")
print(f"b的梯度: {b.grad}")

# 手动实现反向传播（理解原理）
def manual_backprop(x, W, b, y_true):
    # 前向传播
    z = x @ W + b
    a = torch.relu(z)
    loss = ((a - y_true) ** 2).sum()

    # 反向传播
    da = 2 * (a - y_true)           # dL/da
    dz = da * (z > 0).float()       # dL/dz (ReLU导数)
    dW = x.unsqueeze(1) @ dz.unsqueeze(0)  # dL/dW
    db = dz.sum(dim=0)              # dL/db
    return dW, db`

const gradientClipCode = `import torch

# 梯度裁剪（防止梯度爆炸）
model = torch.nn.Linear(10, 5)
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

for data, target in dataloader:
    optimizer.zero_grad()
    output = model(data)
    loss = criterion(output, target)
    loss.backward()

    # 梯度裁剪：将梯度范数限制在 max_norm 以内
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

    optimizer.step()`

const optimizerCode = `import torch
import torch.optim as optim

model = MyModel()

# SGD + Momentum
optimizer_sgd = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

# Adam（最常用的默认选择）
optimizer_adam = optim.Adam(model.parameters(), lr=0.001, betas=(0.9, 0.999))

# AdamW（解耦权重衰减，Transformer 训练标配）
optimizer_adamw = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)

# 不同层使用不同学习率
optimizer = optim.Adam([
    {'params': model.base.parameters(), 'lr': 1e-5},   # 预训练层
    {'params': model.head.parameters(), 'lr': 1e-3},   # 新增层
], weight_decay=0.01)`

const lrScheduleCode = `from torch.optim.lr_scheduler import (
    CosineAnnealingLR, StepLR, OneCycleLR, LambdaLR
)

# 余弦退火
scheduler = CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6)

# Step 衰减
scheduler = StepLR(optimizer, step_size=30, gamma=0.1)

# OneCycleLR（快速训练的利器）
scheduler = OneCycleLR(
    optimizer, max_lr=0.01, total_steps=1000,
    pct_start=0.3,  # 30% 步数用于 warmup
    anneal_strategy='cos'
)

# 自定义 Warmup + Cosine Decay
def warmup_cosine(epoch):
    if epoch < warmup_epochs:
        return epoch / warmup_epochs
    progress = (epoch - warmup_epochs) / (total_epochs - warmup_epochs)
    return 0.5 * (1 + math.cos(math.pi * progress))

scheduler = LambdaLR(optimizer, lr_lambda=warmup_cosine)

# 训练循环中使用
for epoch in range(num_epochs):
    train_one_epoch()
    scheduler.step()  # 在 epoch 结束后调整学习率`

const mixedPrecisionCode = `import torch
from torch.cuda.amp import autocast, GradScaler

# 混合精度训练
model = MyModel().cuda()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
scaler = GradScaler()  # 损失缩放器

for data, target in dataloader:
    data, target = data.cuda(), target.cuda()
    optimizer.zero_grad()

    # 使用 FP16 前向传播
    with autocast():
        output = model(data)
        loss = criterion(output, target)

    # 缩放损失 → 反向传播 → 反缩放梯度 → 更新参数
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()

# 梯度累积
accumulation_steps = 4  # 等效 batch = 4 * micro_batch
optimizer.zero_grad()
for i, (data, target) in enumerate(dataloader):
    output = model(data)
    loss = criterion(output, target) / accumulation_steps
    loss.backward()
    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()`

// ── 实验配置 ──
const deepNNExperiment = {
  title: '深层神经网络实验',
  description: '训练一个 MLP，观察决策边界如何形成',
  architecture: '2, 8, 8, 1',
  activations: ['relu', 'sigmoid'],
  loss: 'bce',
  learningRate: 0.1,
  datasets: [
    { name: 'XOR 问题', data: [{ input: [0, 0], target: [0] }, { input: [0, 1], target: [1] }, { input: [1, 0], target: [1] }, { input: [1, 1], target: [0] }] },
    { name: 'AND 问题', data: [{ input: [0, 0], target: [0] }, { input: [0, 1], target: [0] }, { input: [1, 0], target: [0] }, { input: [1, 1], target: [1] }] },
    { name: 'OR 问题', data: [{ input: [0, 0], target: [0] }, { input: [0, 1], target: [1] }, { input: [1, 0], target: [1] }, { input: [1, 1], target: [1] }] },
  ]
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
