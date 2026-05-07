<template>
  <div class="ml-basics module-content">
    <FloatingToc />
    <h1>📊 机器学习基础</h1>
    <p class="module-intro">从学习范式到核心概念，构建机器学习的理论基础</p>

    <KnowledgeCard title="监督学习、无监督学习与强化学习" icon="🎯">
      <h2 id="learning-paradigms">三大学习范式</h2>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：想象你是一个老师——监督学习就像"有答案的练习册"，每道题都有标准答案，学生对照答案纠错；无监督学习像"自由探索博物馆"，没有讲解词，你要自己发现展品之间的关联和分组；强化学习像"学骑自行车"，没有直接答案，只有"摔了疼"和"骑稳了爽"的反馈信号。
      </div>

      <h3>监督学习：从标注数据中学习映射</h3>
      <p><strong>监督学习（Supervised Learning）</strong>：从带标签的数据中学习映射函数。分类和回归是两大核心任务。模型通过最小化预测值与真实标签之间的损失来优化参数。吴恩达指出，监督学习的本质是找到一个函数 f，使得 f(x) ≈ y，其中 x 是输入特征，y 是标签。</p>

      <div class="visual-hint">
        <strong>🔍 直觉拆解</strong>：想象你在学画地图——输入 x 是城市的经纬度坐标，输出 y 是城市名。监督学习就是给你一堆"坐标→城市名"的对照表，你要从中学会规律，以便对新的坐标也能正确命名。回归是预测连续值（如房价），分类是预测离散类别（如猫/狗）。
      </div>

      <FormulaBlock formula="\text{监督学习: } \min_{\theta} \frac{1}{N}\sum_{i=1}^{N} \mathcal{L}(f_\theta(x_i), y_i)" />

      <h3>无监督学习：发现数据中的隐含结构</h3>
      <p><strong>无监督学习（Unsupervised Learning）</strong>：在没有标签的数据中发现隐含结构。典型任务包括聚类（K-Means、DBSCAN、层次聚类）和降维（PCA、t-SNE、UMAP）。周志华在西瓜书中强调，无监督学习的核心挑战在于如何定义"好的结构"——不同的目标函数会导致不同的聚类结果。</p>

      <div class="visual-hint">
        <strong>🔍 直觉拆解</strong>：想象一堆散落的书——聚类是把相似的书归到同一书架（但没人告诉你该分几架、每架放什么）；降维是把厚厚一摞书浓缩成几本精华摘要，尽量不丢核心信息。注意：聚类结果取决于你用什么"相似性"标准——按颜色分？按主题分？按厚度分？不同的标准会得到完全不同的分组。
      </div>

      <h3>强化学习：从奖励信号中学习策略</h3>
      <p><strong>强化学习（Reinforcement Learning）</strong>：智能体通过与环境交互获得奖励信号来学习策略。核心要素包括状态、动作、奖励和策略。吴恩达在课程中特别强调了探索与利用的权衡：智能体需要在已知的高奖励动作（利用）和可能发现更好策略的新动作（探索）之间取得平衡。</p>

      <div class="visual-hint">
        <strong>🔍 直觉拆解</strong>：想象你走进一家新餐厅——<strong>利用</strong>是点你已知最好吃的菜，<strong>探索</strong>是尝试没吃过的新菜。只利用可能永远找不到更好的菜，只探索可能每次都踩雷。ε-greedy 策略就是：以 ε 的概率随机探索，1-ε 的概率选当前最优。折扣因子 γ 则决定了你是"及时行乐"（γ小）还是"深谋远虑"（γ大）。
      </div>

      <FormulaBlock formula="\pi^* = \arg\max_\pi \mathbb{E}\left[\sum_{t=0}^{\infty} \gamma^t r_t\right]" />

      <h3>半监督学习</h3>
      <p><strong>半监督学习</strong>：利用少量标注数据和大量未标注数据联合训练。周志华指出，半监督学习的两个基本假设是平滑假设（相近的样本倾向于有相同标签）和聚类假设（同一聚类中的样本倾向于有相同标签）。</p>

      <div class="visual-hint">
        <strong>🔍 直觉拆解</strong>：想象你是老师，班上50个学生但只认识5个。半监督学习的思路是——如果两个学生总坐在一起（平滑假设），那他们很可能是同一类人；如果一个圈子里大多数人都是"学霸"（聚类假设），那圈子里不认识的人大概率也是学霸。这就是用少量标签"传染"大量无标签数据的核心思想。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="线性模型" icon="📏" :experiment="experimentConfigs['linear-models']">
      <h2 id="linear-models">线性模型</h2>
      <p>线性模型是机器学习最基础的模型族，形式简单但内涵丰富。吴恩达在 ML 课程中以线性回归和逻辑回归作为入门，周志华在西瓜书中则将线性模型视为理解更复杂模型的基石。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：线性模型就是"用直线（或超平面）来拟合数据"。线性回归是在二维平面上画一条直线穿过数据点；逻辑回归是在数据中间画一条直线把两类分开；LDA 是找一条投影方向，让投影后两类"尽量远、各自尽量紧凑"。所有线性模型的共同特征：决策边界是直的（超平面）。
      </div>

      <h3>线性回归</h3>
      <p>线性回归用线性函数拟合数据，目标是找到最优参数使预测值与真实值之间的均方误差最小化。吴恩达详细推导了从梯度下降到正规方程的完整求解过程。</p>

      <div class="visual-hint">
        <strong>🔍 直觉拆解</strong>：想象你要预测房价——输入特征是面积、房龄、楼层等，线性回归就是在多维空间中找一个"最合适"的超平面，让所有数据点到这个超平面的距离之和最小。两种求解方式对比：
        <br/>• <strong>梯度下降</strong>：像蒙眼下山——每步沿最陡的方向走，慢慢接近谷底。优点：适合大数据集；缺点：需要选学习率、需要多次迭代。
        <br/>• <strong>正规方程</strong>：像直接算出谷底坐标——一步到位，但需要计算矩阵的逆，O(n³)复杂度，特征数很大时不可行。
      </div>

      <FormulaBlock formula="\hat{y} = w^T x + b = \sum_{j=1}^{d}w_j x_j + b" />
      <p><strong>梯度下降求解</strong>：沿负梯度方向迭代更新参数。</p>
      <FormulaBlock formula="w_j := w_j - \alpha \frac{\partial}{\partial w_j}J(w) = w_j - \alpha \frac{1}{N}\sum_{i=1}^{N}(\hat{y}_i - y_i)x_{ij}" />

      <div class="visual-hint">
        <strong>📐 梯度下降的图形理解</strong>：损失函数 J(w) 是一个碗状曲面（凸函数），梯度指向最陡的上升方向，负梯度就是最陡的下降方向。学习率 α 决定步长：太大会在谷底来回震荡甚至发散，太小则收敛极慢。吴恩达建议绘制 J(w) 随迭代次数的曲线来监控是否正常收敛。
      </div>

      <p><strong>正规方程（Normal Equation）</strong>：解析求解最优参数，无需选择学习率，但计算 O(n³) 矩阵求逆。</p>
      <FormulaBlock formula="w^* = (X^TX)^{-1}X^Ty" />

      <h3>逻辑回归</h3>
      <p>逻辑回归是线性回归的扩展，通过 Sigmoid 函数将输出映射到 [0,1]，用于二分类问题。吴恩达强调，逻辑回归虽然名字含"回归"，但本质是分类算法。</p>

      <div class="visual-hint">
        <strong>🔍 直觉拆解</strong>：Sigmoid 函数就像一个"概率门"——它把直线 wᵀx+b 的输出（可以是任意实数）压缩到 0~1 之间，解释为"属于正类的概率"。当 wᵀx+b = 0 时概率为 0.5（决策边界），正值越大概率越接近 1，负值越大概率越接近 0。交叉熵损失衡量的是预测概率分布与真实标签分布的"距离"——如果真实标签是 1 但预测概率是 0.01，损失就非常大；预测概率是 0.99，损失就接近 0。
      </div>

      <FormulaBlock formula="h_\theta(x) = \sigma(w^T x + b) = \frac{1}{1 + e^{-(w^T x + b)}}" />
      <FormulaBlock formula="\mathcal{L}(w) = -\sum_{i=1}^{N}\left[y_i \log h_\theta(x_i) + (1-y_i)\log(1 - h_\theta(x_i))\right]" />
      <p>逻辑回归的决策边界是线性的：wᵀx + b = 0。对于非线性可分问题，可以通过多项式特征映射来构造非线性决策边界。</p>

      <div class="visual-hint">
        <strong>💡 教学提示</strong>：多项式特征映射的直觉——如果原始空间中两类是"月牙形"交错的，直线分不开，但加入 x₁²、x₂²、x₁x₂ 等高阶特征后，在高维空间中就能用超平面分开了。这其实就是 SVM 核技巧的"手动版本"。
      </div>

      <h3>线性判别分析（LDA）</h3>
      <p>周志华在西瓜书中介绍的 LDA 是一种经典的线性分类方法，其核心思想是：将样本投影到一条直线上，使得同类样本尽可能近、异类样本尽可能远。</p>

      <div class="visual-hint">
        <strong>🔍 直觉拆解</strong>：想象两类数据像两团云——LDA 就是找一束"手电筒光"，把两团云都投影到光柱上，使得投影后两类云尽量不重叠。最好的投影方向是让"类间距离大、类内散布小"的方向。数学上，这就是最大化广义瑞利商 J = 类间散度/类内散度，直觉就是"分得开、聚得拢"。
      </div>

      <FormulaBlock formula="J = \frac{w^T S_b w}{w^T S_w w}" />
      <p>其中 S_b 是类间散度矩阵，S_w 是类内散度矩阵。最优投影方向 w 使广义瑞利商 J 最大化。</p>

      <CodeBlock lang="python" :code="linearModelCode" />
    </KnowledgeCard>

    <KnowledgeCard title="偏差-方差权衡" icon="⚖️" :experiment="experimentConfigs['bias-variance']">
      <h2 id="bias-variance">偏差-方差权衡（Bias-Variance Tradeoff）</h2>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：想象你练习射箭——<strong>偏差高</strong>是箭都偏到靶子的同一侧（系统误差，总是打偏），<strong>方差高</strong>是箭散得到处都是（随机误差，不稳定）。理想模型是"低偏差+低方差"——箭都密集在靶心。偏差-方差权衡就是：越复杂的模型（弓越灵活）偏差越低但方差越高，越简单的模型偏差越高但方差越低。
      </div>

      <p>模型的泛化误差可分解为三部分：</p>
      <FormulaBlock formula="\text{泛化误差} = \text{偏差}^2 + \text{方差} + \text{噪声}" />

      <div class="visual-hint">
        <strong>🔍 逐步拆解</strong>：
        <br/>• <strong>偏差</strong> = 你的平均预测与真相的差距 → "我总体上差多远？" → 高偏差 = 欠拟合（模型太简单，学不到规律）
        <br/>• <strong>方差</strong> = 不同训练集上预测的波动 → "换个训练集我会差多少？" → 高方差 = 过拟合（模型太复杂，学了噪声）
        <br/>• <strong>噪声</strong> = 数据本身的随机性 → 任何模型都消除不了的天花板
        <br/><br/>
        <strong>诊断口诀</strong>：训练误差高 + 验证误差高 → 高偏差（欠拟合）→ 加特征、加模型复杂度；训练误差低 + 验证误差高 → 高方差（过拟合）→ 加数据、加正则化。
      </div>

      <p><strong>偏差（Bias）</strong>：模型预测值与真实值的平均偏差，反映模型的拟合能力。高偏差意味着欠拟合——模型太简单，无法捕捉数据的真实规律。</p>
      <p><strong>方差（Variance）</strong>：模型对不同训练集的敏感程度。高方差意味着过拟合——模型太复杂，学到了训练数据中的噪声。</p>
      <p><strong>噪声（Noise）</strong>：数据本身的固有误差，任何模型都无法消除。</p>
      <p>随着模型复杂度增加，偏差降低但方差升高，两者存在权衡。最优模型在偏差和方差之间取得平衡。吴恩达在课程中用具体的诊断方法来区分二者：</p>
      <ul>
        <li><strong>高偏差（欠拟合）</strong>：训练误差高，验证误差也高 → 增加模型复杂度、增加特征</li>
        <li><strong>高方差（过拟合）</strong>：训练误差低，验证误差高 → 增加训练数据、正则化、减少特征</li>
      </ul>

      <div class="visual-hint">
        <strong>💡 学习曲线诊断法</strong>：吴恩达推荐画"学习曲线"——横轴是训练集大小，纵轴是误差。如果训练误差和验证误差都高且接近 → 高偏差（加数据没用，要加特征/复杂度）；如果训练误差低但验证误差高且差距大 → 高方差（加数据有帮助）。
      </div>

      <p>周志华从更理论的角度指出，偏差-方差分解揭示了"没有免费的午餐"定理的深层含义：不存在在所有问题上都最优的学习算法，选择算法本质上是选择假设空间的归纳偏好。</p>
    </KnowledgeCard>

    <KnowledgeCard title="模型评估与选择" icon="📋">
      <h2 id="model-evaluation">模型评估与选择</h2>
      <p>周志华在西瓜书中将模型评估视为机器学习的关键环节。不恰当的评估方法会导致对模型性能的错误估计。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：评估模型就像考试——<strong>留出法</strong>是一次期末考试（一套题测完）；<strong>交叉验证</strong>是多次小测取平均（更可靠）；<strong>自助法</strong>是随机抽题组卷（适合题库很小的情况）。关键是：绝不能用训练题来考试，否则就是"开卷考试"，分数虚高。
      </div>

      <h3>评估方法</h3>
      <p><strong>留出法（Hold-out）</strong>：直接将数据集划分为互斥的训练集和测试集。吴恩达推荐的比例：小数据集 70/30，大数据集 98/1/1（train/dev/test）。</p>

      <div class="visual-hint">
        <strong>🔍 吴恩达的现代划分策略</strong>：
        <br/>• 小数据（&lt;10K）：70/30 或 60/20/20
        <br/>• 中等数据（10K~1M）：90/5/5 或 95/2.5/2.5
        <br/>• 大数据（&gt;1M）：98/1/1 甚至 99.5/0.25/0.25
        <br/><strong>核心原则</strong>：dev 和 test 必须来自同一分布，且反映真实应用场景。吴恩达举例：如果你的系统要在手机拍照上运行，那 dev/test 应该用手机拍的照片，而不是网上的高清图。
      </div>

      <p><strong>交叉验证法（Cross-Validation）</strong>：将数据集等分为 k 份，每次用 k-1 份训练、1 份测试，重复 k 次取平均。常用 k=5 或 k=10。</p>

      <div class="visual-hint">
        <strong>🔍 交叉验证的图形理解</strong>：想象把数据切成 5 块蛋糕——第 1 轮用第 1 块做测试、其余做训练；第 2 轮用第 2 块做测试……5 轮下来每块蛋糕都当过一次"考题"，最终成绩取 5 次平均，比单次考试更稳定。缺点是计算量是 k 倍。
      </div>

      <p><strong>自助法（Bootstrap）</strong>：对数据集进行有放回采样产生训练集，未采到的样本（约 36.8%）作为测试集。适合小数据集场景。</p>
      <FormulaBlock formula="P(\text{样本未被采到}) = \left(1 - \frac{1}{m}\right)^m \xrightarrow{m \to \infty} \frac{1}{e} \approx 0.368" />

      <h3>性能度量</h3>
      <p><strong>分类任务核心指标</strong>：</p>

      <div class="visual-hint">
        <strong>🔍 混淆矩阵的直觉</strong>：想象你是一个医生诊断癌症——TP 是"真有病且诊断有病"（救命），FN 是"真有病但诊断没病"（要命！），FP 是"没病但诊断有病"（虚惊），TN 是"没病且诊断没病"（安心）。召回率 = "宁可错杀不可放过"的程度，精确率 = "报出来的有多少是真的"。
        <br/><br/>
        <strong>F1 的直觉</strong>：精确率和召回率的调和平均。为什么用调和平均而非算术平均？因为调和平均惩罚"偏科"——如果精确率=1.0、召回率=0.01，算术平均=0.505看着还行，但调和平均=0.02暴露了严重偏科。
      </div>

      <FormulaBlock formula="\text{Precision（精确率）} = \frac{TP}{TP + FP}, \quad \text{Recall（召回率）} = \frac{TP}{TP + FN}" />
      <FormulaBlock formula="F1 = \frac{2 \times \text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2TP}{2TP + FP + FN}" />
      <p>当需要对精确率和召回率有不同偏好时，使用更一般的 Fβ 度量：</p>
      <FormulaBlock formula="F_\beta = (1 + \beta^2) \frac{\text{Precision} \times \text{Recall}}{(\beta^2 \times \text{Precision}) + \text{Recall}}" />
      <p>β > 1 时召回率影响更大，β < 1 时精确率影响更大。</p>

      <p><strong>ROC 与 AUC</strong>：ROC 曲线以假正例率（FPR）为横轴、真正例率（TPR）为纵轴绘制。AUC 是 ROC 曲线下的面积，值越大模型越好。周志华指出，ROC 曲线对类别不平衡不敏感，相比 Precision-Recall 曲线更适合类别分布均匀的场景。</p>

      <div class="visual-hint">
        <strong>🔍 ROC 曲线的图形理解</strong>：想象你有一个旋钮可以调节分类阈值——从最严格（几乎不判正类）到最宽松（几乎全判正类）。每个阈值对应 ROC 上的一个点，转动旋钮就画出一条曲线。AUC=1.0 是完美分类器（曲线紧贴左上角），AUC=0.5 是随机猜（对角线）。AUC 的概率解释：随机取一个正样本和一个负样本，模型给正样本更高分数的概率就等于 AUC。
      </div>

      <FormulaBlock formula="\text{TPR} = \frac{TP}{TP + FN}, \quad \text{FPR} = \frac{FP}{FP + TN}" />
      <FormulaBlock formula="\text{AUC} = \frac{1}{2}\sum_{i=1}^{m-1}(x_{i+1} - x_i)(y_i + y_{i+1})" />

      <CodeBlock lang="python" :code="evaluationCode" />
    </KnowledgeCard>

    <KnowledgeCard title="计算学习理论" icon="🧮">
      <h2 id="learning-theory">计算学习理论（西瓜书核心）</h2>
      <p>周志华在西瓜书第 12 章深入讨论了计算学习理论——它回答了一个根本问题：<strong>机器学习为什么可能？</strong>我们凭什么相信一个在有限样本上学到的模型能在未见数据上表现好？</p>

      <div class="visual-hint">
        <strong>🎨 图形理解："抽检炮弹"</strong>：工厂每天生产 10000 枚炮弹，你只能抽检 100 枚。如果这 100 枚都合格，你能说"整批炮弹的合格率在 95% 以上"吗？<strong>PAC 学习理论（Probably Approximately Correct）</strong>给出的答案是：如果训练样本数 m 足够大，那么以高概率（Probably），模型在训练集上的低误差意味着在新数据上的误差也低（Approximately Correct）。核心公式：
      </div>
      <FormulaBlock formula="m \geq \frac{1}{\epsilon}\left(\ln |\mathcal{H}| + \ln \frac{1}{\delta}\right)" />
      <p>其中 ε 是允许的泛化误差，δ 是失败概率，|H| 是假设空间的复杂程度。直觉：假设空间越大（模型越复杂）→需要更多样本；要求精度越高（ε 越小）→需要更多样本；要求置信度越高（δ 越小）→需要更多样本。</p>

      <h3>VC 维：衡量模型复杂度</h3>
      <div class="visual-hint">
        <strong>🔍 VC 维的直觉："能打散多少点"</strong>：VC 维（Vapnik-Chervonenkis Dimension）衡量一个假设空间的<strong>表达能力</strong>——它能"打散"（shatter，即完美分类所有可能标签组合）的最大样本数。二维平面上，<strong>线性分类器的 VC 维 = 3</strong>——你可以用一条直线把 3 个点的任意标签组合分开，但 4 个点就做不到了（异或问题）。VC 维越大→模型越复杂→需要的训练样本越多才能保证泛化。<strong>这就是过拟合的理论根源</strong>——VC 维太高而样本太少时，模型可以完美拟合训练数据（打散所有训练点），但泛化能力差。
      </div>
      <FormulaBlock formula="P\left(L(h) - \hat{L}(h) > \epsilon\right) \leq 4 \cdot m_{\mathcal{H}}(2m) \cdot e^{-m\epsilon^2/8}" />

      <div class="visual-hint">
        <strong>💡 理论指导实践的直觉</strong>：计算学习理论很少直接用于计算（m 的 bound 通常过于悲观），但提供了关键洞察：(1) <strong>奥卡姆剃刀原则</strong>——复杂度惩罚不是可有可无，而是泛化的必要条件；(2) <strong>偏差-方差权衡的理论基础</strong>——VC 维高=方差高，VC 维低=偏差高；(3) <strong>深度学习为什么可行？</strong>——理论预测过参数化会严重过拟合，但实践中深度网络泛化很好。这个"过参数化之谜"至今仍未完全解决，相关研究包括双下降现象（Double Descent）和隐式正则化。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="损失函数全景" icon="📉" :experiment="experimentConfigs['loss-functions']">
      <h2 id="loss-functions">损失函数</h2>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：损失函数是"惩罚函数"——模型预测越错，惩罚越大。选损失函数就像选计价方式：MSE 是"差多少罚多少的平方"（大错重罚）、MAE 是"差多少罚多少"（一视同仁）、Huber 是"小错按 MSE 罚、大错按 MAE 罚"（兼顾两者）。分类问题用交叉熵——它衡量"预测分布与真相分布的差距"。
      </div>

      <p><strong>均方误差（MSE）</strong>：回归任务最常用的损失函数，对异常值敏感。</p>

      <div class="visual-hint">
        <strong>🔍 为什么 MSE 对异常值敏感？</strong>：因为误差取了平方——如果真实值=10，预测值=100，MSE 惩罚=(100-10)²=8100，而 MAE 只罚=90。一个离群点就能把 MSE 拉歪，导致拟合线被异常值"拽走"。如果你数据有噪声/离群点，优先考虑 Huber 或 MAE。
      </div>

      <FormulaBlock formula="\mathcal{L}_{\text{MSE}} = \frac{1}{N}\sum_{i=1}^{N}(y_i - \hat{y}_i)^2" />
      <p><strong>平均绝对误差（MAE）</strong>：对异常值更鲁棒，但在零点处不可导。</p>
      <FormulaBlock formula="\mathcal{L}_{\text{MAE}} = \frac{1}{N}\sum_{i=1}^{N}|y_i - \hat{y}_i|" />
      <p><strong>Huber Loss</strong>：MSE 和 MAE 的结合，在小误差时等价于 MSE（平滑），大误差时等价于 MAE（鲁棒）。</p>
      <FormulaBlock formula="\mathcal{L}_\delta(y, \hat{y}) = \begin{cases} \frac{1}{2}(y-\hat{y})^2 & |y-\hat{y}| \leq \delta \\ \delta|y-\hat{y}| - \frac{1}{2}\delta^2 & \text{otherwise} \end{cases}" />

      <div class="visual-hint">
        <strong>🔍 Huber 的直觉</strong>：想象一个"弹性绳"——小范围内它像弹簧（MSE，二次增长），但拉到一定长度后就变成绳子（MAE，线性增长）。δ 就是"弹性极限"。这样正常样本享受 MSE 的平滑梯度，离群点不会产生过大的梯度导致训练爆炸。
      </div>

      <p><strong>交叉熵损失（Cross-Entropy）</strong>：分类任务的标准选择，衡量预测分布与真实分布的差异。</p>

      <div class="visual-hint">
        <strong>🔍 交叉熵的信息论直觉</strong>：交叉熵 = "用模型 Q 去编码真实分布 P 所需的平均比特数"。如果模型 Q 和真实 P 完全一致，交叉熵最小（等于 P 的熵）；如果 Q 和 P 差异大，编码效率低，交叉熵大。所以最小化交叉熵 = 让模型分布尽可能接近真实分布。
      </div>

      <FormulaBlock formula="\mathcal{L}_{\text{CE}} = -\sum_{i=1}^{N}\sum_{c=1}^{C} y_{i,c} \log(\hat{y}_{i,c})" />
      <p><strong>Focal Loss</strong>：解决类别不平衡问题，降低易分类样本的权重，让模型更关注难分类样本。Lin 等人在 RetinaNet 中提出。</p>
      <FormulaBlock formula="\mathcal{L}_{\text{Focal}} = -\alpha_t(1-p_t)^\gamma \log(p_t)" />

      <div class="visual-hint">
        <strong>🔍 Focal Loss 的直觉</strong>：在目标检测中，绝大多数区域都是背景（easy negative），模型轻松把它们分类对，但它们的数量太多淹没了少数难样本的信号。Focal Loss 的调制因子 (1-p_t)^γ 就是"自动降权"——p_t 越大（越容易），权重越小。γ=2 时，一个 p_t=0.9 的简单样本权重被压到原来的 1%，而 p_t=0.3 的难样本几乎不受影响。
      </div>

      <p>当 γ=0 时退化为标准交叉熵。γ 越大，对易分类样本的抑制越强。</p>
      <p><strong>对比损失（Contrastive Loss）</strong>：用于度量学习和对比学习，拉近相似样本、推远不相似样本。</p>
      <FormulaBlock formula="\mathcal{L}_{\text{Contrastive}} = (1-y)\frac{1}{2}d^2 + y\frac{1}{2}\max(0, m-d)^2" />
      <p>其中 y=0 表示相似对，y=1 表示不相似对，d 为嵌入距离，m 为间隔阈值。</p>

      <div class="visual-hint">
        <strong>🔍 对比损失的直觉</strong>：想象一个房间——你要把朋友拉到自己身边（相似对距离小），把陌生人推到至少 m 米以外（不相似对距离>m）。但超过 m 之后就不必再推了（max(0, m-d)），否则会浪费力气。间隔 m 就是"安全距离"。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="正则化" icon="🛡️" :experiment="experimentConfigs['regularization']">
      <h2 id="regularization">正则化技术</h2>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：正则化就是给模型"上缰绳"——不加正则，模型可以随意弯曲成任何形状（过拟合）；加了正则，模型被约束在"简单"的范围内，不能过度扭曲。L1 正则像方形的缰绳（倾向于把某些维度完全拉到零），L2 正则像圆形的缰绳（倾向于让所有维度都小一点但不归零）。
      </div>

      <p><strong>L1 正则化（Lasso）</strong>：促进稀疏性，可实现特征选择。周志华从优化角度解释：L1 正则的约束区域是菱形，目标函数等高线更容易与菱形顶点相切，而这些顶点恰好对应某些维度为零。</p>
      <FormulaBlock formula="\mathcal{L}_{L1} = \mathcal{L}_0 + \lambda \sum_{i}|w_i|" />

      <div class="visual-hint">
        <strong>🔍 L1 稀疏性的几何直觉</strong>：想象你在二维空间中，L1 的约束区域是菱形（顶点在坐标轴上），L2 的约束区域是圆形。损失函数的等高线是椭圆形，从原点向外扩展——等高线最先碰到菱形的地方大概率是顶点（某个 w=0），但最先碰到圆形的地方通常不在轴上。这就是为什么 L1 产生稀疏解而 L2 不会。
      </div>

      <p><strong>L2 正则化（Ridge）</strong>：收缩权重，防止过拟合。约束区域为圆形，等高线与圆相切更可能在非轴上，因此倾向于让所有权重都小而非为零。吴恩达在课程中强调，L2 正则化使得权重衰减（Weight Decay），降低了模型对个别特征的依赖。</p>
      <FormulaBlock formula="\mathcal{L}_{L2} = \mathcal{L}_0 + \lambda \sum_{i}w_i^2" />

      <div class="visual-hint">
        <strong>🔍 L2 的权重衰减直觉</strong>：每次梯度更新时，L2 相当于先把权重缩小一点 (1-αλ/m)，再沿梯度走。所以权重永远不可能太大——模型不会把赌注押在单一特征上，而是"雨露均沾"。吴恩达比喻：L2 正则让模型从"死记硬背"变成"抓住规律"。
      </div>

      <p><strong>Elastic Net</strong>：L1 与 L2 的结合，兼有特征选择和权重收缩的优点。</p>
      <FormulaBlock formula="\mathcal{L}_{\text{EN}} = \mathcal{L}_0 + \lambda_1 \sum_{i}|w_i| + \lambda_2 \sum_{i}w_i^2" />

      <div class="visual-hint">
        <strong>💡 选型指南</strong>：L1（特征很多但只有少数有用→自动选特征）；L2（大部分特征都有用→整体收缩）；Elastic Net（特征多且可能成组相关→L1 会随机选一个，Elastic Net 会整组保留）。
      </div>

      <p><strong>Dropout</strong>：训练时以概率 p 随机将神经元输出置零，等价于隐式地训练了 2ⁿ 个子网络的集成。推理时不使用 Dropout，但输出需乘以 (1-p) 缩放（inverted dropout 方式则训练时除以 (1-p)，推理不变）。吴恩达指出，Dropout 的直觉类似于 L2 正则化——它阻止了网络对任何单一特征的过度依赖。</p>

      <div class="visual-hint">
        <strong>🔍 Dropout 的直觉</strong>：想象一个公司不能只依赖任何一个员工——如果每个员工都有 50% 的概率请假，公司就必须让每个人的能力更全面（权重分散），不能出现"只有小王懂这个技术"的情况。Dropout 让每个神经元都不能偷懒——它必须在同事可能缺席的情况下独立完成工作，这就迫使每个神经元学到更鲁棒的特征。
      </div>

      <p><strong>早停（Early Stopping）</strong>：当验证集损失不再下降时停止训练，等价于对参数空间的隐式约束。吴恩达推荐绘制训练/验证损失曲线来决定停止时机。</p>

      <div class="visual-hint">
        <strong>🔍 早停的直觉</strong>：训练损失会一直下降，但验证损失先降后升——升的那一刻模型开始过拟合（在训练集上"死记硬背"了）。早停就是在验证损失最低点及时刹车。它本质上是"走了 T 步梯度下降的 L2 正则"——步数越少，参数离初始点越近，正则效果越强。
      </div>

      <CodeBlock lang="python" :code="dropoutCode" />
    </KnowledgeCard>

    <KnowledgeCard title="特征选择与稀疏学习" icon="🔬">
      <h2 id="feature-selection">特征选择与稀疏学习</h2>
      <p>周志华在西瓜书第 11 章讨论了特征选择——在大数据时代，"数据维度爆炸"比"样本不够"更常见。特征选择的目标：<strong>从原始特征中选出最有用的子集</strong>，降低维度、减少过拟合、提高可解释性。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解："淘金"</strong>：你有 10000 个特征（泥沙），但只有 50 个真正对预测有用（金子）。特征选择就是<strong>淘金的过程</strong>——把无用的沙石筛掉，留下金子。三种淘法：(1) <strong>过滤式（Filter）</strong>——先独立评估每个特征的重要性（不看模型），挑出高分特征再训练模型；(2) <strong>包裹式（Wrapper）</strong>——用模型的性能作为"裁判"，选择让模型效果最好的特征子集；(3) <strong>嵌入式（Embedded）</strong>——把特征选择融入模型训练过程本身，如 L1 正则化自动产生稀疏解。
      </div>

      <h3>过滤式：先筛后学</h3>
      <div class="visual-hint">
        <strong>🔍 三大过滤指标的直觉</strong>：<strong>信息增益</strong>——"知道这个特征后，标签的不确定性减少了多少？"；<strong>卡方检验</strong>——"特征和标签的关联度偏离随机多少？"偏离越大越有用；<strong>相关系数</strong>——"特征和标签线性相关吗？"强相关=好特征，但只能检测线性关系。过滤式优点：快（不训模型），与模型无关。缺点：可能漏掉"单个无用但组合有用"的特征（异或问题的两个输入单独看都和标签无关，组合起来完美预测）。
      </div>

      <h3>包裹式：以模型效果为圭臬</h3>
      <div class="visual-hint">
        <strong>🔍 包裹式的两种策略</strong>：<strong>前向搜索</strong>——从空集开始，每轮加入一个最能提升性能的特征（贪心，O(n²)）；<strong>后向搜索</strong>——从全集开始，每轮删除一个最不重要的特征（适合特征数不太多时）；<strong>递归特征消除（RFE）</strong>——反复训练模型，每轮删除权重最小的特征，直到剩下 k 个。包裹式准确但计算昂贵——每评估一个子集就要训练一次模型。
      </div>

      <h3>嵌入式：边学边选</h3>
      <div class="visual-hint">
        <strong>🔍 L1 正则化的稀疏魔法</strong>：L2 正则化把权重"压小"（平方惩罚），L1 正则化把权重"压到零"（绝对值惩罚）。为什么？梯度下降在 L1 等值线（菱形）角落停止——那里某些坐标正好为零。直觉：L2 让所有特征都"有但不重要"，L1 让某些特征的权重精确为零，等价于<strong>自动特征选择</strong>。LASSO（L1 正则化的线性回归）是最经典的嵌入式方法，但它的选择可能不稳定（高度相关特征间会随机选一个）。
      </div>

      <div class="visual-hint">
        <strong>💡 实践建议</strong>：数据维度极高时（基因/文本），先用过滤式快速筛到几千维，再用嵌入式（L1）精确选择。注意：特征选择<strong>必须在训练集上做</strong>，不能在全部数据上提前选——否则信息泄漏。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="支持向量机" icon="📐" :experiment="experimentConfigs['svm']">
      <h2 id="svm">支持向量机（SVM）</h2>
      <p>SVM 是周志华西瓜书中重点讨论的经典模型，吴恩达在 ML 课程中也有详尽讲解。SVM 的核心思想是找到使分类间隔最大的超平面。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：想象你面前有一条马路，两边分别是红点和蓝点。你要在马路中间画一条分隔线——SVM 不是随便画一条能分开的线，而是要画一条<strong>最宽的马路线</strong>，让离分界线最近的点（支持向量）离分界线越远越好。这条最宽的"安全带"就是最大间隔。
      </div>

      <h3>最大间隔与支持向量</h3>

      <div class="visual-hint">
        <strong>🔍 直觉拆解</strong>：为什么选最大间隔？想象你训练了一个分类器部署到现实世界——未来的新数据可能出现在已有数据附近但位置稍有偏移。如果分界线紧贴着数据（间隔小），稍微偏一点就会分错；但如果分界线离两边数据都很远（间隔大），小的偏移就不会导致误分类。<strong>最大间隔 = 最大容错空间</strong>。
        <br/><br/>
        <strong>支持向量</strong>：离分界线最近的那些点。它们"支撑"起了分界线的位置——其他点离得远，即使删掉它们也不影响分界线。但只要移动任何一个支持向量，分界线就会跟着变。所以 SVM 的决策只依赖少数关键样本，计算效率高。
      </div>

      <p>给定训练集 D，SVM 旨在找到一个超平面 wᵀx + b = 0，使得离超平面最近的样本点（支持向量）到超平面的距离最大化：</p>
      <FormulaBlock formula="\max_{w,b} \frac{2}{\|w\|} \quad \text{s.t.} \quad y_i(w^T x_i + b) \geq 1, \quad i=1,...,N" />
      <p>等价于凸优化问题：</p>
      <FormulaBlock formula="\min_{w,b} \frac{1}{2}\|w\|^2 \quad \text{s.t.} \quad y_i(w^T x_i + b) \geq 1" />

      <h3>对偶问题与 KKT 条件</h3>
      <p>通过拉格朗日乘子法转化为对偶问题，可以自然地引入核函数：</p>

      <div class="visual-hint">
        <strong>🔍 为什么需要对偶？</strong>：原始问题中优化变量是 w（维度=特征数），对偶问题中优化变量是 α（维度=样本数）。当特征数远大于样本数时，对偶问题更容易求解。更重要的是，对偶问题中样本只以内积 xᵢᵀxⱼ 的形式出现——这正是核技巧的入口！
      </div>

      <FormulaBlock formula="\max_\alpha \sum_{i=1}^{N}\alpha_i - \frac{1}{2}\sum_{i=1}^{N}\sum_{j=1}^{N}\alpha_i \alpha_j y_i y_j x_i^T x_j" />
      <FormulaBlock formula="\text{s.t.} \quad \sum_{i=1}^{N}\alpha_i y_i = 0, \quad \alpha_i \geq 0" />

      <h3>核技巧（Kernel Trick）</h3>
      <p>当数据线性不可分时，通过核函数将数据映射到高维空间，使其线性可分。核函数避免显式计算高维映射：</p>
      <FormulaBlock formula="\kappa(x_i, x_j) = \phi(x_i)^T \phi(x_j)" />

      <div class="visual-hint">
        <strong>🔍 核技巧的"魔法"直觉</strong>：想象二维空间中红蓝两类数据形成一个同心圆（内圆红、外圈蓝），直线根本分不开。但如果你把每个点映射到三维 (x₁, x₂, x₁²+x₂²)，"碗面"就把两类数据分到不同高度了——用一个水平面就能切开。核技巧的绝妙之处：你不需要真的去算三维坐标，只需要知道高维空间中两点的内积（核函数），就能等价地完成分类。
        <br/><br/>
        <strong>核函数的选择直觉</strong>：
        <br/>• 线性核：数据本身就近似线性可分（简单安全）
        <br/>• 多项式核：数据有特征组合效应（如 x₁×x₂ 有意义）
        <br/>• RBF 核：不知道数据结构时的默认选择（万能近似器）
        <br/>• σ 小 → 每个样本只影响近邻（可能过拟合）；σ 大 → 影响范围广（可能欠拟合）
      </div>

      <p>常用核函数：</p>
      <ul>
        <li><strong>线性核</strong>：κ(xᵢ, xⱼ) = xᵢᵀxⱼ</li>
        <li><strong>多项式核</strong>：κ(xᵢ, xⱼ) = (xᵢᵀxⱼ + c)ᵈ</li>
        <li><strong>RBF 核（高斯核）</strong>：κ(xᵢ, xⱼ) = exp(-‖xᵢ - xⱼ‖² / 2σ²)</li>
        <li><strong>Sigmoid 核</strong>：κ(xᵢ, xⱼ) = tanh(αxᵢᵀxⱼ + c)</li>
      </ul>
      <p>周志华指出，RBF 核是最常用的核函数，σ 参数控制了局部性：σ 小则每个样本只影响近邻，可能导致过拟合；σ 大则影响范围广，可能导致欠拟合。</p>

      <h3>软间隔与松弛变量</h3>
      <p>当数据存在噪声或离群点时，允许部分样本不满足约束，引入松弛变量 ξᵢ：</p>
      <FormulaBlock formula="\min_{w,b,\xi} \frac{1}{2}\|w\|^2 + C\sum_{i=1}^{N}\xi_i \quad \text{s.t.} \quad y_i(w^T x_i + b) \geq 1 - \xi_i, \quad \xi_i \geq 0" />

      <div class="visual-hint">
        <strong>🔍 软间隔的直觉</strong>：现实中数据不可能完美分开——总有几个"刺头"跑到对面去。软间隔就是允许一些点"越界"（ξᵢ > 0），但每越界一个点就要付 C 元"罚款"。C 越大→罚款越重→越不容忍越界→间隔窄但误分少；C 越小→罚款轻→允许更多越界→间隔宽但误分多。C 本质上是"间隔宽度"和"分类错误"之间的权衡参数。
      </div>

      <p>C 是正则化参数，C 越大对误分类的惩罚越重，C 越小允许更多的间隔违例。吴恩达建议 C 的选择需要通过交叉验证来确定。</p>

      <CodeBlock lang="python" :code="svmCode" />
    </KnowledgeCard>

    <KnowledgeCard title="决策树" icon="🌳" :experiment="experimentConfigs['decision-tree']">
      <h2 id="decision-tree">决策树</h2>
      <p>决策树是周志华西瓜书中重点讨论的基础模型，其树形结构天然具有可解释性。吴恩达在课程中指出，决策树及其集成方法（随机森林、GBDT）在许多实际任务中表现优异。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：决策树就像"20个问题游戏"——从根节点开始，每个节点问一个特征问题（"面积>100㎡吗？"），根据回答走向不同分支，最终到达叶节点得出结论。关键问题：每个节点应该问什么？这就是划分标准要解决的问题——ID3 问"哪个特征让我最确定？"，C4.5 问"哪个特征的信息增益率最高？"，CART 问"哪个特征让基尼不纯度降最多？"。
      </div>

      <h3>信息增益（ID3 算法）</h3>
      <p>使用信息熵度量数据的纯度，选择使信息增益最大的属性进行划分：</p>

      <div class="visual-hint">
        <strong>🔍 信息熵的直觉</strong>：想象一箱水果——如果全是苹果，熵=0（最纯，没有不确定性）；如果苹果橘子香蕉各占 1/3，熵最大（最混乱，不确定性最大）。信息增益 = "划分前的不确定性 - 划分后的平均不确定性"。选择信息增益最大的特征 = 选择"最能消除不确定性"的问题来问。
      </div>

      <FormulaBlock formula="\text{Ent}(D) = -\sum_{k=1}^{|\mathcal{Y}|}p_k \log_2 p_k" />
      <FormulaBlock formula="\text{Gain}(D, a) = \text{Ent}(D) - \sum_{v=1}^{V}\frac{|D^v|}{|D|}\text{Ent}(D^v)" />

      <div class="visual-hint">
        <strong>⚠️ ID3 的缺陷</strong>：信息增益偏好取值多的属性。极端例子：如果用"样本ID"作为特征，每个 ID 值只对应一个样本，划分后每个子集都纯（熵=0），信息增益最大——但这个划分毫无泛化能力！这就是 C4.5 引入增益率的原因。
      </div>

      <h3>增益率（C4.5 算法）</h3>
      <p>信息增益偏好取值数目多的属性。C4.5 使用增益率来克服此偏好的问题：</p>
      <FormulaBlock formula="\text{Gain\_ratio}(D, a) = \frac{\text{Gain}(D, a)}{\text{IV}(a)}, \quad \text{IV}(a) = -\sum_{v=1}^{V}\frac{|D^v|}{|D|}\log_2\frac{|D^v|}{|D|}" />

      <div class="visual-hint">
        <strong>🔍 增益率的直觉</strong>：IV(a) 叫"固有值"——属性取值越多，IV 越大。增益率 = 信息增益/固有值，相当于对取值多的属性打了个"折扣"。但 C4.5 又走向另一个极端——增益率偏好取值少的属性。所以 C4.5 的实际做法是：先从候选属性中找出信息增益高于平均水平的，再从中选增益率最高的。
      </div>

      <h3>基尼指数（CART 算法）</h3>
      <p>CART 使用基尼指数来选择划分属性，基尼指数反映了从数据集中随机抽取两个样本其类别不一致的概率：</p>
      <FormulaBlock formula="\text{Gini}(D) = \sum_{k=1}^{|\mathcal{Y}|}\sum_{k'\neq k}p_k p_{k'} = 1 - \sum_{k=1}^{|\mathcal{Y}|}p_k^2" />
      <FormulaBlock formula="\text{Gini\_index}(D, a) = \sum_{v=1}^{V}\frac{|D^v|}{|D|}\text{Gini}(D^v)" />

      <div class="visual-hint">
        <strong>🔍 基尼指数的直觉</strong>：基尼指数 = "随机抽两个样本，类别不同的概率"。如果数据集纯（全是一类），抽到不同类的概率=0；如果混乱，概率就高。与信息熵相比，基尼指数计算更快（不需要 log 运算），是 sklearn 决策树的默认标准。
      </div>

      <h3>剪枝策略</h3>
      <p>决策树容易过拟合，需要剪枝来控制复杂度：</p>
      <ul>
        <li><strong>预剪枝</strong>：在划分前评估是否提升验证集精度，若不提升则停止划分。简单高效但可能欠拟合。</li>
        <li><strong>后剪枝</strong>：先构建完整树，再自底向上评估是否将子树替换为叶节点。通常效果更好但计算量更大。</li>
      </ul>

      <div class="visual-hint">
        <strong>🔍 剪枝的直觉</strong>：决策树过拟合就像学生"死记硬背"——把训练集中每个细节都记住（叶子节点极细粒度），反而对新的问题不会做了。剪枝就是"遗忘细节，抓住规律"——把细枝末节合并成更粗的规则。预剪枝是"边学边判断要不要继续学"，可能学不够；后剪枝是"先全学，再精简"，通常效果更好。
      </div>

      <CodeBlock lang="python" :code="treeCode" />
    </KnowledgeCard>

    <KnowledgeCard title="贝叶斯分类器" icon="🎲">
      <h2 id="bayesian">贝叶斯分类器</h2>
      <p>贝叶斯分类器基于贝叶斯定理，是周志华西瓜书中的重要内容。其核心思想是利用先验概率和似然来计算后验概率。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：贝叶斯的思想就是"根据新证据更新信念"。想象医生看病——<strong>先验 P(c)</strong> 是"没看病人之前，这个病在人群中的发病率"；<strong>似然 P(x|c)</strong> 是"如果得了这个病，出现这些症状的概率"；<strong>后验 P(c|x)</strong> 是"看到这些症状后，病人得这个病的概率"。贝叶斯定理就是用先验和似然算后验的"更新公式"。
      </div>

      <h3>贝叶斯最优分类器</h3>
      <p>贝叶斯最优分类器选择后验概率最大的类别，其期望风险最小化：</p>
      <FormulaBlock formula="h^*(x) = \arg\max_{c \in \mathcal{Y}} P(c|x) = \arg\max_{c \in \mathcal{Y}} P(c) \cdot P(x|c)" />

      <div class="visual-hint">
        <strong>🔍 为什么用 argmax 而不是完整后验？</strong>：因为分类只需要知道"哪类概率最大"，不需要知道精确概率值。所以分母 P(x) 可以省略（对所有类别相同）。这就大大简化了计算——我们只需要比较 P(c)·P(x|c) 的大小。
      </div>

      <h3>朴素贝叶斯</h3>
      <p>朴素贝叶斯假设所有属性条件独立，大幅简化计算：</p>
      <FormulaBlock formula="P(c|x) = \frac{P(c)P(x|c)}{P(x)} = \frac{P(c)}{P(x)}\prod_{j=1}^{d}P(x_j|c)" />

      <div class="visual-hint">
        <strong>🔍 朴素贝叶斯的"朴素"在哪？</strong>：条件独立假设意味着 P(x₁,x₂|c) = P(x₁|c)·P(x₂|c)——"在已知疾病的情况下，发烧和咳嗽互不影响"。这显然不对（发烧和咳嗽通常一起出现），但朴素贝叶斯在文本分类等任务上依然表现很好，为什么？周志华解释：因为分类只比较后验的<strong>相对大小</strong>——即使绝对概率估错了，只要排序对了，分类结果就正确。这就像考试——你不需要考满分，只需要比别人分高。
      </div>

      <p>虽然属性条件独立假设在现实中很少成立，但朴素贝叶斯在许多任务上仍然表现良好。周志华指出，这是因为分类只需比较后验概率的相对大小，而不需要精确估计。</p>
      <p><strong>拉普拉斯修正</strong>：为了避免某个属性值在训练集中未出现导致概率为零的问题，对先验和条件概率进行平滑：</p>
      <FormulaBlock formula="\hat{P}(c) = \frac{|D_c| + 1}{|D| + |\mathcal{Y}|}, \quad \hat{P}(x_j|c) = \frac{|D_{c,x_j}| + 1}{|D_c| + N_j}" />

      <div class="visual-hint">
        <strong>🔍 拉普拉斯修正的直觉</strong>：如果训练集中"有发烧症状的流感患者"人数=0，P(发烧|流感) 就会算出 0，导致整个后验归零——这显然不合理，只是因为没见过不代表不可能。拉普拉斯修正在分子+1、分母+类别数，相当于假设"每个可能的情况至少出现一次"。这是最简单的平滑方法，也是正则化思想的一种体现。
      </div>

      <h3>EM 算法</h3>
      <p>当存在隐变量时，使用 EM 算法迭代求解参数的极大似然估计：</p>
      <ul>
        <li><strong>E 步</strong>：以当前参数估计隐变量的后验分布</li>
        <li><strong>M 步</strong>：用隐变量的期望替代隐变量的真实值，最大化似然函数</li>
      </ul>
      <FormulaBlock formula="\theta^{(t+1)} = \arg\max_\theta \sum_{Z} P(Z|X, \theta^{(t)}) \log P(X, Z|\theta)" />

      <div class="visual-hint">
        <strong>🔍 EM 算法的直觉</strong>：想象你在鸡和蛋之间有一个谜题——你知道鸡下蛋的规律，但不知道哪些蛋是哪只鸡下的（隐变量）。EM 的做法是：E 步先猜一个"每只鸡下了哪些蛋"的概率分布，M 步根据这个猜想来更新"鸡下蛋的规律"，然后反复迭代直到收敛。每一轮都比上一轮更接近真相。EM 保证单调递增似然函数，但可能收敛到局部最优。
      </div>

      <CodeBlock lang="python" :code="bayesCode" />
    </KnowledgeCard>

    <KnowledgeCard title="集成学习" icon="🏗️">
      <h2 id="ensemble">集成学习</h2>
      <p>集成学习通过构建并结合多个学习器来提升性能，是周志华西瓜书的重要章节。吴恩达也强调，集成方法在实践中往往能带来显著的性能提升。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：集成学习的核心道理就是"三个臭皮匠顶个诸葛亮"——单个模型可能有偏见或盲区，但多个模型的"民主投票"往往更准确。前提是：<strong>每个个体不能太差</strong>（准确性），<strong>个体之间要有差异</strong>（多样性）。如果 5 个模型完全一样，投票等于没投。
      </div>

      <h3>Bagging</h3>
      <p>Bagging（Bootstrap AGGregatING）通过对训练集进行自助采样，训练多个基学习器，最后对预测结果进行投票（分类）或平均（回归）。</p>

      <div class="visual-hint">
        <strong>🔍 Bagging 的直觉</strong>：想象 100 个学生做同一套卷子，但每个学生只看了题库的随机子集（有放回抽样）就去做题。每个学生都有一部分题没见过，所以个别学生会犯错，但大部分学生的答案趋势是对的——最终投票取多数，个别错误就被淹没了。Bagging 降低<strong>方差</strong>：多棵树各自过拟合的方向不同，平均后互相抵消。
      </div>

      <p><strong>随机森林（Random Forest）</strong>：Bagging 的扩展，在决策树训练时引入随机属性选择——每个节点只从随机选取的 k 个属性中选择最优划分。周志华指出，随机森林的"多样性"来自样本扰动和属性扰动两方面，简单但极其有效。</p>

      <div class="visual-hint">
        <strong>🔍 随机森林为什么比普通 Bagging 更好？</strong>：普通 Bagging 的树每次分裂都看所有特征——如果有一个"超级特征"主导一切，所有树都会选它，导致所有树长得很像（多样性不足）。随机森林强制每个节点只看 k 个随机特征，逼迫不同的树走不同的路，增加多样性。经验上 k = √(总特征数) 通常效果最好。
      </div>

      <h3>Boosting</h3>
      <p>Boosting 是一族将弱学习器提升为强学习器的算法。核心思想：每个基学习器重点关注前一个学习器犯错的样本。</p>

      <div class="visual-hint">
        <strong>🔍 Boosting 的直觉</strong>：想象一个补考班——第一次考试有 30% 的人不及格。Boosting 的做法是：对不及格的人加大关注（增加权重），让下一次考试更针对他们的薄弱点。逐步迭代，每次重点解决上一次最薄弱的环节。Boosting 降低<strong>偏差</strong>：每棵新树都在修正前面所有树的残差，越来越逼近真相。
      </div>

      <p><strong>AdaBoost</strong>：自适应地调整样本权重，被错误分类的样本权重增大：</p>
      <FormulaBlock formula="\alpha_t = \frac{1}{2}\ln\frac{1-\epsilon_t}{\epsilon_t}, \quad D_{t+1}(x_i) = \frac{D_t(x_i)}{Z_t}\exp(-\alpha_t y_i h_t(x_i))" />

      <div class="visual-hint">
        <strong>🔍 AdaBoost 权重更新的直觉</strong>：α_t 是第 t 个弱分类器的"话语权"——准确率越高（ε_t 越小），话语权越大。权重更新规则：如果弱分类器把某样本分对了 → 降权（下次不用太管它）；分错了 → 升权（下次重点攻克它）。最终结果是所有弱分类器的加权投票。
      </div>

      <p><strong>梯度提升（Gradient Boosting）</strong>：将提升问题视为函数空间中的梯度下降，每棵新树拟合当前模型的负梯度（残差）：</p>
      <FormulaBlock formula="F_t(x) = F_{t-1}(x) + \eta \cdot h_t(x), \quad h_t = \arg\min_h \sum_{i=1}^{N}\left[-\frac{\partial \mathcal{L}(y_i, F_{t-1}(x_i))}{\partial F_{t-1}(x_i)} - h(x_i)\right]^2" />

      <div class="visual-hint">
        <strong>🔍 梯度提升的核心直觉</strong>：每棵新树不是随意训练的，而是专门拟合当前模型的<strong>残差方向</strong>。如果当前模型预测值=3 而真实值=5，残差=2，那新树就要学会输出≈2。把新树加上去，预测值变成 3+η·2≈5。η（学习率）控制步长——小步走更稳定（需要更多树），大步走更快但容易过拟合。
      </div>

      <p>GBDT、XGBoost、LightGBM、CatBoost 是梯度提升的代表算法，在结构化数据的预测任务中广泛使用。</p>

      <h3>多样性增强</h3>
      <p>集成学习的理论基础表明：个体学习器准确性越高、多样性越大，集成效果越好。周志华总结了常见的多样性增强策略：</p>
      <ul>
        <li><strong>数据样本扰动</strong>：Bagging 的自助采样</li>
        <li><strong>输入属性扰动</strong>：随机森林的随机属性选择</li>
        <li><strong>输出表示扰动</strong>：翻转标签、输出变换</li>
        <li><strong>算法参数扰动</strong>：不同的超参数、初始化</li>
      </ul>

      <div class="visual-hint">
        <strong>💡 Bagging vs Boosting 速查表</strong>：
        <br/>• Bagging：并行训练、降低方差、适合高方差模型（深决策树）、不容易过拟合
        <br/>• Boosting：串行训练、降低偏差、适合高偏差模型（浅决策树）、容易过拟合需调参
        <br/>• 实战建议：结构化数据优先试 XGBoost/LightGBM，图像/文本用深度学习+Bagging 思路
      </div>

      <CodeBlock lang="python" :code="ensembleCode" />
    </KnowledgeCard>

    <KnowledgeCard title="聚类与降维" icon="🎯" :experiment="experimentConfigs['clustering']">
      <h2 id="clustering">聚类与降维</h2>
      <p>聚类和降维是无监督学习的两大核心任务，吴恩达和周志华都有深入讨论。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：聚类是"把相似的东西归到一起"（分堆），降维是"用更少的维度描述数据"（压缩）。聚类关注"分组"，降维关注"压缩"。两者常常配合使用——先降维去噪，再聚类分组。
      </div>

      <h3>K-Means 聚类</h3>
      <p>K-Means 是最经典的聚类算法，吴恩达在课程中作为无监督学习的入门算法详细讲解：</p>
      <ol>
        <li>随机初始化 k 个聚类中心 μ₁, μ₂, ..., μₖ</li>
        <li>将每个样本分配到最近的聚类中心：c⁽ⁱ⁾ = argminⱼ ‖x⁽ⁱ⁾ - μⱼ‖²</li>
        <li>更新聚类中心为该类样本均值：μⱼ = (1/|Cⱼ|) Σx∈Cⱼ x</li>
        <li>重复步骤 2-3 直至收敛</li>
      </ol>
      <FormulaBlock formula="J = \sum_{j=1}^{k}\sum_{x_i \in C_j}\|x_i - \mu_j\|^2" />

      <div class="visual-hint">
        <strong>🔍 K-Means 的图形理解</strong>：想象 k 个磁铁放在桌子上，铁屑（数据点）被最近的磁铁吸引——步骤 2 就是"铁屑向磁铁聚拢"，步骤 3 就是"把磁铁移到它吸引的铁屑的中心"。反复迭代，磁铁和铁屑逐渐稳定。K-Means 的局限：只能发现球形簇、需要预设 k、对初始化敏感。
        <br/><br/>
        <strong>吴恩达的初始化建议</strong>：用 k-means++ 初始化——第一个中心随机选，后续每个中心选离已有中心最远的点（概率正比于距离²）。多次运行（通常 50-100 次）取 J 最小的结果。
      </div>

      <h3>DBSCAN</h3>
      <p>基于密度的聚类方法，无需预先指定簇数，能发现任意形状的簇，并能识别噪声点。周志华详细介绍了其 ε-邻域和 MinPts 参数的含义。</p>

      <div class="visual-hint">
        <strong>🔍 DBSCAN 的直觉</strong>：想象你在人群中找人团——如果一个人周围 ε 范围内至少有 MinPts 个人，他就是"核心人物"（核心点）；核心点之间如果互相在 ε 范围内就连成一个团（簇）；单独一个人周围不够 MinPts 又不在任何核心点 ε 范围内的就是"路人"（噪声点）。优点：不需要预设簇数，能发现任意形状的簇；缺点：密度不均匀时效果差，ε 和 MinPts 的选择对结果影响大。
      </div>

      <h3>主成分分析（PCA）</h3>
      <p>PCA 是最经典的线性降维方法，吴恩达在课程中有完整的推导。核心思想：找到数据方差最大的投影方向。</p>
      <FormulaBlock formula="\max_{w} w^T S w \quad \text{s.t.} \quad \|w\| = 1" />
      <p>其中 S 是数据的协方差矩阵。最优 w 是 S 的最大特征值对应的特征向量。</p>

      <div class="visual-hint">
        <strong>🔍 PCA 的图形理解</strong>：想象一群数据点形成一个椭圆形分布——PCA 就是找到椭圆的长轴（方差最大方向，第一主成分）和短轴（第二主成分），然后只保留长轴，就实现了降维。保留的方差比例 = 特征值之比。如果前 2 个主成分贡献了 95% 的方差，那 2D 投影就几乎不丢信息。
        <br/><br/>
        <strong>⚠️ 吴恩达警告的 PCA 误用</strong>：
        <br/>1. <strong>不要用 PCA 防过拟合</strong>——应该用正则化！PCA 丢掉的特征可能恰好对分类有用。
        <br/>2. <strong>先试不用 PCA</strong>——只有在原始维度太大导致训练太慢时才用。
        <br/>3. <strong>PCA 在训练集上拟合</strong>，然后变换验证/测试集——不能在全部数据上做 PCA 再划分！
      </div>

      <h3>t-SNE 与 UMAP</h3>
      <p>t-SNE 使用 t 分布度量低维空间中的相似度，高维空间使用高斯分布，通过 KL 散度最小化两者差异。常用于高维数据的二维可视化。</p>
      <p>UMAP 是 t-SNE 的更快替代，在保持局部结构的同时更好地保留全局结构。</p>

      <div class="visual-hint">
        <strong>🔍 t-SNE 的直觉</strong>：高维空间中近的点在低维中也应该近，高维中远的点在低维中也应该远。为什么用 t 分布而不是高斯？因为高维到低维的降维必然导致"拥挤"——很多点被挤在一起。t 分布的"长尾巴"让低维空间中远距离的点排斥力更大，从而把不同的簇推开，形成清晰的分群效果。注意：t-SNE 中簇间距离不可信，只有簇内结构有意义。
      </div>

      <CodeBlock lang="python" :code="clusterCode" />
    </KnowledgeCard>

    <KnowledgeCard title="异常检测" icon="🔔" :experiment="experimentConfigs['anomaly-detection']">
      <h2 id="anomaly-detection">异常检测（Anomaly Detection）</h2>
      <p>吴恩达在 ML 课程第九周专门讲了异常检测——与监督学习不同，异常检测的负样本（异常）极少、种类极多、可能完全未知。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解："正常模式之外的都算异常"</strong>：你开了一家网店，每天有 10000 笔交易——其中 9995 笔是正常购物，5 笔是欺诈。问题在于：<strong>你不知道下一种欺诈长什么样</strong>（骗子总是在换手法）。异常检测不学"欺诈长什么样"，而是学<strong>"正常交易长什么样"</strong>——任何偏离正常模式太远的都标记为可疑。这和监督学习的二元分类本质不同：分类需要大量正负样本，异常检测只需要大量正常样本。
      </div>

      <h3>高斯分布异常检测</h3>
      <div class="visual-hint">
        <strong>🔍 高斯异常检测的直觉："画一个圈"</strong>：假设所有正常样本的每个特征都服从高斯分布。对于新样本，计算它在每个特征上的概率密度的乘积——如果这个联合概率特别小（意味着这个样本的某些特征值极其罕见），就标记为异常。本质是：在特征空间中<strong>给正常数据画一个高概率的"正常区域"</strong>，落在区域外的就是异常。
      </div>
      <FormulaBlock formula="p(x) = \prod_{j=1}^{n} p(x_j; \mu_j, \sigma_j^2) = \prod_{j=1}^{n} \frac{1}{\sqrt{2\pi}\sigma_j} \exp\left(-\frac{(x_j - \mu_j)^2}{2\sigma_j^2}\right)" />
      <p>如果 p(x) < ε，则判定为异常。ε 的选择——在验证集上调整阈值，通常用 F1-score 或查准率/查全率权衡。</p>

      <h3>多元高斯：捕捉特征相关性</h3>
      <div class="visual-hint">
        <strong>🔍 普通高斯 vs 多元高斯的直觉</strong>：普通高斯假设特征独立——如果 CPU 使用率正常、内存使用率也正常，它不会报警。但如果 CPU 使用率正常而<strong>内存使用率异常高</strong>——这种组合在正常数据中从未出现——普通高斯检测不到，因为它分别看两个特征。多元高斯考虑<strong>特征间的协方差</strong>——它能捕捉到"CPU 低+内存高"这种异常模式。代价：需要更多样本估计协方差矩阵（n×n，样本数必须 > n）。
      </div>
      <FormulaBlock formula="p(x) = \frac{1}{(2\pi)^{n/2} |\Sigma|^{1/2}} \exp\left(-\frac{1}{2}(x - \mu)^T \Sigma^{-1}(x - \mu)\right)" />

      <div class="visual-hint">
        <strong>💡 异常检测 vs 监督学习的选型</strong>：用<strong>异常检测</strong>——负样本极少（如 0-20 个），正样本很多且未来异常可能完全不同（欺诈检测、生产线缺陷检测）；用<strong>监督学习</strong>——正负样本都充足且均衡，未来异常和过去类似。关键判断：<strong>你能否收集到足够多的代表性异常样本？</strong>不能→异常检测。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="推荐系统" icon="💡">
      <h2 id="recommender">推荐系统</h2>
      <p>吴恩达在 ML 课程中用了整整一周讲推荐系统——它是机器学习最赚钱的商业应用之一（Netflix 推荐引擎贡献了 80% 以上的观看时长）。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解："猜你喜欢"</strong>：推荐系统的核心问题——给定用户对部分物品的评分（极其稀疏——用户通常只评价了 < 1% 的物品），预测他们对未评分物品的偏好，然后推荐预测评分最高的物品。两种思路：(1) <strong>协同过滤</strong>——找相似用户或相似物品，"和你口味类似的人也喜欢这个"；(2) <strong>基于内容</strong>——分析物品本身的特征，"因为你喜欢科幻片，这部新科幻片你可能喜欢"。
      </div>

      <h3>协同过滤：矩阵分解的直觉</h3>
      <div class="visual-hint">
        <strong>🔍 矩阵分解的直觉："拆成两部分"</strong>：评分矩阵 R（用户×物品）极其稀疏。如果把每个用户和每个物品都映射到同一个 k 维隐空间（如 k=10），那么用户 u 对物品 i 的预测评分 = u 的隐向量与 i 的隐向量的点积：R̂_{ui} = θ_uᵀ x_i。θ_u 捕捉了用户的偏好风格（"喜欢深度剧情"、"偏好视觉特效"），x_i 捕捉了物品的属性（"诺兰式叙事"、"IMAX 动作"）。训练时，只对已知评分计算 MSE 损失，并加上 L2 正则化防止过拟合。
      </div>
      <FormulaBlock formula="J = \frac{1}{2}\sum_{(u,i):r_{ui}\neq ?} (r_{ui} - \theta_u^T x_i)^2 + \frac{\lambda}{2}\left(\sum_u \|\theta_u\|^2 + \sum_i \|x_i\|^2\right)" />

      <div class="visual-hint">
        <strong>🔍 协同过滤的两条路线</strong>：<strong>基于用户</strong>——找到和用户 u 评分模式最像的 k 个用户（IUF 相似度），推荐他们喜欢但 u 没看过的物品。"跟你口味一样的人也爱看这个"。<strong>基于物品</strong>——找到和物品 i 被同一批用户喜欢的 k 个物品，推荐给喜欢 i 的用户。"喜欢《盗梦空间》的人也喜欢《星际穿越》"。实践中基于物品的效果更好——物品比用户更"稳定"（一部电影的类型不变，一个人的口味会变）。
      </div>

      <h3>内容推荐与冷启动</h3>
      <div class="visual-hint">
        <strong>🔍 冷启动问题的直觉</strong>：新用户来了没有任何评分记录——协同过滤完全失效（没有历史数据）。<strong>基于内容的推荐</strong>可以缓解：利用用户注册时填的兴趣标签、浏览行为、人口统计信息来推荐。但真正的新用户冷启动仍然极难——这就是为什么 Netflix 新用户首先看到的是"热门排行"而非个性化推荐。本质是<strong>信息论的限制</strong>：你不知道用户的偏好之前，最优策略是推荐"最普遍受欢迎"的内容（先验最优）。
      </div>

      <div class="visual-hint">
        <strong>💡 推荐系统的本质洞察</strong>：传统 ML 是你有明确的标签（猫/狗），推荐系统是你要同时<strong>学习用户的"品味函数"和物品的"属性函数"</strong>——两者都未知！这就是为什么矩阵分解要交替优化 θ_u 和 x_i。更深一层：推荐的本质是<strong>填补一个极其稀疏的矩阵</strong>，你对这个世界只观测到了极少极少的交互，却要推断出完整的偏好图谱。这需要强先验（协同过滤的核心假设：相似用户有相似品味）。
      </div>

      <CodeBlock lang="python" :code="recommenderCode" />
    </KnowledgeCard>

    <KnowledgeCard title="激活函数" icon="📈" :experiment="experimentConfigs['activation-functions']">
      <h2 id="activation-functions">激活函数</h2>
      <p>激活函数引入非线性，使神经网络能够学习复杂的映射关系。吴恩达在深度学习课程中详细对比了各种激活函数的优缺点。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：没有激活函数，多层网络等价于单层线性变换——不管你堆多少层，输出的还是 y=Wx+b。激活函数就是给网络"弯曲"的能力。Sigmoid 把输出压到 (0,1)，Tanh 压到 (-1,1)，ReLU 把负数截断为零、正数原样输出，GELU 是"温柔版 ReLU"——不是硬截断而是平滑过渡。
      </div>

      <div class="visual-hint">
        <strong>🔍 各激活函数的教学理解</strong>：
        <br/>• <strong>Sigmoid</strong>：像"软开关"——输入很大时输出≈1（开），很小时≈0（关），中间平滑过渡。致命弱点：两端梯度≈0（梯度消失），且输出非零中心（导致梯度更新zigzag）。
        <br/>• <strong>Tanh</strong>：零中心的 Sigmoid——输出范围 (-1,1)，解决了 Sigmoid 的非零中心问题，但梯度消失依然存在。
        <br/>• <strong>ReLU</strong>：最简单的分段函数——负数→0，正数→自身。梯度要么0要么1，不会消失！但有"死亡ReLU"问题：一旦输出<0，梯度=0，这个神经元永远不会再被更新。
        <br/>• <strong>Leaky ReLU</strong>：给负区间一个小斜率（如0.01x），防止神经元"死亡"。
        <br/>• <strong>GELU</strong>：ReLU 的概率化版本——不是硬截断，而是按输入的大小"概率性"地乘以自身。Transformer 的标配。
      </div>

      <p><strong>选型建议</strong>：</p>
      <ul>
        <li>隐藏层首选 ReLU 及其变体（Leaky ReLU、GELU），避免 Sigmoid/Tanh 导致的梯度消失</li>
        <li>二分类输出层使用 Sigmoid，多分类输出层使用 Softmax</li>
        <li>GELU 是当前 Transformer 架构的默认选择</li>
      </ul>
      <ActivationFunctionChart />
    </KnowledgeCard>

    <KnowledgeCard title="训练过程" icon="📊">
      <h2 id="training-process">训练过程可视化</h2>

      <div class="visual-hint">
        <strong>🔍 训练过程的直觉</strong>：训练就像学骑自行车——一开始摇摇晃晃（损失高），不断调整平衡（参数更新），逐渐找到感觉（损失下降），最后稳定骑行（收敛）。关键观察点：
        <br/>• 损失是否在稳步下降？如果不降，检查学习率和数据。
        <br/>• 训练损失和验证损失是否同步下降？如果训练降但验证升 → 过拟合。
        <br/>• 训练损失本身就不降 → 欠拟合或 bug。
      </div>

      <p>观察模型训练过程中损失和准确率的变化，理解过拟合现象。吴恩达强调，通过学习曲线（Learning Curve）可以直观诊断偏差-方差问题。</p>
      <TrainingDashboard />
    </KnowledgeCard>

    <PaperReference :paper="{
      title: 'Dropout: A Simple Way to Prevent Neural Networks from Overfitting',
      authors: 'Srivastava, N., Hinton, G., Krizhevsky, A., et al.',
      venue: 'JMLR',
      year: '2014',
      url: 'https://jmlr.org/papers/v15/srivastava14a.html'
    }" />
    <PaperReference :paper="{
      title: 'A Training Algorithm for Optimal Margin Classifiers (SVM)',
      authors: 'Boser, B.E., Guyon, I.M. & Vapnik, V.N.',
      venue: 'COLT',
      year: '1992',
      url: 'https://dl.acm.org/doi/10.1145/130385.130401'
    }" />
    <PaperReference :paper="{
      title: 'Random Forests',
      authors: 'Breiman, L.',
      venue: 'Machine Learning',
      year: '2001',
      url: 'https://link.springer.com/article/10.1023/A:1010933404324'
    }" />
    <PaperReference :paper="{
      title: 'Focal Loss for Dense Object Detection',
      authors: 'Lin, T.Y., Goyal, P., Girshick, R., He, K. & Dollar, P.',
      venue: 'ICCV',
      year: '2017',
      url: 'https://arxiv.org/abs/1708.02002'
    }" />

    <WritingGuide>
      <h3>如何在论文中描述实验设置</h3>
      <ul>
        <li><strong>数据集</strong>：明确数据集名称、规模、划分方式（train/val/test），说明数据分布是否平衡</li>
        <li><strong>基线选择</strong>：选择与任务相关且性能可比的方法作为基线，避免"稻草人"基线</li>
        <li><strong>评估指标</strong>：根据任务类型选择合适的指标（Accuracy、F1、AUC等），并说明选择理由。周志华建议同时报告多个指标</li>
        <li><strong>超参数</strong>：列出关键超参数及其选择依据（网格搜索/经验/文献推荐）</li>
        <li><strong>实验环境</strong>：硬件配置、软件版本、随机种子</li>
        <li><strong>统计显著性</strong>：多次实验报告均值和标准差，必要时做显著性检验</li>
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
import ActivationFunctionChart from '@/components/animations/ActivationFunctionChart.vue'
import TrainingDashboard from '@/components/animations/TrainingDashboard.vue'
import { experimentConfigs } from '@/experiments/configs'

const progressStore = useProgressStore()
onMounted(() => progressStore.markVisited('ml-basics'))

const linearModelCode = `import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

# 线性回归
lr = LinearRegression()
lr.fit(X_train, y_train)
print(f"系数: {lr.coef_}, 截距: {lr.intercept_}")

# 逻辑回归
clf = LogisticRegression(C=1.0, penalty='l2', max_iter=1000)
clf.fit(X_train, y_train)
print(f"训练精度: {clf.score(X_train, y_train):.4f}")

# 线性判别分析 (LDA)
lda = LinearDiscriminantAnalysis(n_components=1)
X_lda = lda.fit_transform(X_train, y_train)
print(f"LDA投影后类别可分性: {lda.explained_variance_ratio_}")`

const evaluationCode = `from sklearn.metrics import (
    precision_score, recall_score, f1_score,
    roc_auc_score, roc_curve, confusion_matrix
)
from sklearn.model_selection import cross_val_score, KFold

# 分类评估指标
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_prob)
print(f"Precision: {precision:.4f}, Recall: {recall:.4f}")
print(f"F1: {f1:.4f}, AUC: {auc:.4f}")

# ROC曲线
fpr, tpr, thresholds = roc_curve(y_test, y_prob)

# 5折交叉验证
cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"CV准确率: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")`

const dropoutCode = `import torch
import torch.nn as nn

# Dropout 在 PyTorch 中的使用
class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.dropout = nn.Dropout(p=0.5)  # 50% dropout
        self.fc2 = nn.Linear(256, 10)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)  # 训练时随机置零，推理时自动关闭
        x = self.fc2(x)
        return x

# 早停 (Early Stopping) 实现
class EarlyStopping:
    def __init__(self, patience=5, min_delta=0):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = None

    def __call__(self, val_loss):
        if self.best_loss is None:
            self.best_loss = val_loss
        elif val_loss > self.best_loss - self.min_delta:
            self.counter += 1
            if self.counter >= self.patience:
                return True  # 停止训练
        else:
            self.best_loss = val_loss
            self.counter = 0
        return False`

const svmCode = `from sklearn.svm import SVC, SVR
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import StandardScaler

# SVM 对特征尺度敏感，必须标准化！
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# SVM 分类（RBF核）
svm = SVC(kernel='rbf', C=1.0, gamma='scale')
svm.fit(X_train_scaled, y_train)

# 交叉验证选择 C 和 gamma
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 0.001, 0.01, 0.1, 1],
    'kernel': ['rbf']
}
grid = GridSearchCV(SVC(), param_grid, cv=5, scoring='accuracy')
grid.fit(X_train_scaled, y_train)
print(f"最佳参数: {grid.best_params_}")
print(f"最佳精度: {grid.best_score_:.4f}")`

const treeCode = `from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.ensemble import RandomForestClassifier
import matplotlib.pyplot as plt

# 决策树（CART，使用基尼指数）
tree = DecisionTreeClassifier(
    max_depth=5,           # 限制最大深度（预剪枝）
    min_samples_split=5,   # 节点最小分裂样本数
    min_samples_leaf=2,    # 叶节点最小样本数
    ccp_alpha=0.01         # 后剪枝参数（成本复杂度剪枝）
)
tree.fit(X_train, y_train)

# 可视化决策树
plt.figure(figsize=(12, 8))
plot_tree(tree, feature_names=feature_names, class_names=class_names, filled=True)
plt.savefig('decision_tree.png', dpi=150)

# 随机森林
rf = RandomForestClassifier(
    n_estimators=100,  # 树的数量
    max_depth=10,
    max_features='sqrt',  # 每次分裂考虑 sqrt(n_features) 个特征
    random_state=42
)
rf.fit(X_train, y_train)
print(f"特征重要性: {rf.feature_importances_}")`

const bayesCode = `from sklearn.naive_bayes import GaussianNB, MultinomialNB

# 高斯朴素贝叶斯（连续特征）
gnb = GaussianNB()
gnb.fit(X_train, y_train)
print(f"预测精度: {gnb.score(X_test, y_test):.4f}")

# 多项式朴素贝叶斯（文本分类）
mnb = MultinomialNB(alpha=1.0)  # alpha=1.0 即拉普拉斯修正
mnb.fit(X_train_counts, y_train)

# EM 算法示例（高斯混合模型）
from sklearn.mixture import GaussianMixture
gmm = GaussianMixture(n_components=3, max_iter=100, random_state=42)
gmm.fit(X)
labels = gmm.predict(X)
print(f"均值: \\n{gmm.means_}")
print(f"协方差: \\n{gmm.covariances_}")`

const ensembleCode = `from sklearn.ensemble import (
    RandomForestClassifier, GradientBoostingClassifier,
    AdaBoostClassifier, VotingClassifier
)

# 随机森林
rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)

# AdaBoost
ada = AdaBoostClassifier(n_estimators=50, learning_rate=1.0, random_state=42)

# GBDT
gbdt = GradientBoostingClassifier(
    n_estimators=100, learning_rate=0.1,
    max_depth=3, subsample=0.8, random_state=42
)

# 投票集成
voting = VotingClassifier(
    estimators=[('rf', rf), ('ada', ada), ('gbdt', gbdt)],
    voting='soft'  # 软投票：使用概率平均
)
voting.fit(X_train, y_train)

# XGBoost（需要安装 xgboost）
# import xgboost as xgb
# xgb_clf = xgb.XGBClassifier(n_estimators=100, max_depth=3, learning_rate=0.1)
# xgb_clf.fit(X_train, y_train)`

const clusterCode = `from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# 数据标准化（PCA 和 K-Means 对尺度敏感）
X_scaled = StandardScaler().fit_transform(X)

# K-Means
kmeans = KMeans(n_clusters=3, init='k-means++', n_init=10, random_state=42)
labels = kmeans.fit_predict(X_scaled)
print(f"轮廓系数: {silhouette_score(X_scaled, labels):.4f}")

# DBSCAN（基于密度的聚类）
dbscan = DBSCAN(eps=0.5, min_samples=5)
labels_db = dbscan.fit_predict(X_scaled)
n_clusters = len(set(labels_db)) - (1 if -1 in labels_db else 0)
print(f"发现 {n_clusters} 个簇，噪声点 {sum(labels_db == -1)} 个")

# PCA 降维
pca = PCA(n_components=0.95)  # 保留 95% 方差
X_pca = pca.fit_transform(X_scaled)
print(f"原始维度: {X_scaled.shape[1]}, 降维后: {X_pca.shape[1]}")
print(f"各主成分方差贡献: {pca.explained_variance_ratio_}")

# t-SNE 可视化
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)`

const recommenderCode = `import numpy as np
from scipy.sparse.linalg import svds

# 协同过滤 — 矩阵分解（简化版交替最小二乘）
def matrix_factorization(R, K=10, steps=100, alpha=0.001, beta=0.02):
    """R: 评分矩阵(用户×物品), K: 隐向量维度"""
    n_users, n_items = R.shape
    U = np.random.normal(scale=1./K, size=(n_users, K))  # 用户隐向量
    V = np.random.normal(scale=1./K, size=(n_items, K))  # 物品隐向量

    for step in range(steps):
        for i in range(n_users):
            for j in range(n_items):
                if R[i, j] > 0:  # 只对有评分的位置计算梯度
                    eij = R[i, j] - np.dot(U[i, :], V[j, :].T)
                    U[i, :] += alpha * (eij * V[j, :] - beta * U[i, :])
                    V[j, :] += alpha * (eij * U[i, :] - beta * V[j, :])
        # 计算总损失
        loss = np.sum((R[R > 0] - np.sum(U @ V.T, axis=1)[R > 0 > 0])**2)
        if step % 10 == 0:
            print(f"Step {step}, Loss: {loss:.2f}")
    return U, V

# 基于内容的推荐（物品特征相似度）
from sklearn.metrics.pairwise import cosine_similarity

def content_based_recommend(item_features, item_idx, top_k=5):
    """推荐与给定物品最相似的 top_k 个物品"""
    sim = cosine_similarity(item_features)
    similar_items = np.argsort(sim[item_idx])[::-1][1:top_k+1]
    return similar_items, sim[item_idx][similar_items]

# 推荐系统评估
from sklearn.model_selection import train_test_split

# 留出法：隐藏部分评分，用 RMSE 评估
def evaluate_rmse(U, V, test_ratings):
    pred = np.sum(U[test_ratings['user']] * V[test_ratings['item']], axis=1)
    rmse = np.sqrt(np.mean((test_ratings['rating'] - pred)**2))
    return rmse`

const linearExperiment = {
  title: '线性回归实验',
  description: '观察线性模型的数据拟合',
  architecture: '2, 1',
  activations: ['linear'],
  loss: 'mse',
  learningRate: 0.05,
  datasets: [
    { name: 'y = 2x + 1', data: [{ input: [0], target: [1] }, { input: [1], target: [3] }, { input: [2], target: [5] }, { input: [3], target: [7] }] },
    { name: 'y = 0.5x + 2', data: [{ input: [0], target: [2] }, { input: [2], target: [3] }, { input: [4], target: [4] }, { input: [6], target: [5] }] },
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
