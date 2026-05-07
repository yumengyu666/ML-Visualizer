<template>
  <div class="cnn-page module-content">
    <FloatingToc />
    <h1>🔍 卷积神经网络</h1>
    <p class="module-intro">从卷积操作到经典架构，理解CNN的核心设计思想</p>

    <KnowledgeCard title="卷积操作" icon="🔲" :experiment="experimentConfigs['convolution']">
      <h2 id="convolution">卷积（Convolution）</h2>
      <p>卷积是CNN的核心操作，通过卷积核在输入上滑动，提取局部特征。吴恩达在 CNN 课程中详细讲解了卷积的数学原理和直觉——卷积核本质上是特征检测器，不同的核检测不同的模式（边缘、纹理等）。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：卷积操作就像"手电筒扫描"——卷积核是手电筒，在图像上逐格滑动，每到一个位置就照出该区域的某种特征（亮度/边缘/纹理），汇总成一张"特征响应图"。手电筒越小看得越细（细节特征），越大看得越全局（语义特征）。
      </div>

      <p>关键参数包括：<strong>步长（stride）</strong>、<strong>填充（padding）</strong>和<strong>卷积核大小（kernel size）</strong>。</p>
      <FormulaBlock formula="输出尺寸 = \lfloor\frac{输入尺寸 - 卷积核大小 + 2 \times 填充}{步长}\rfloor + 1" />

      <div class="visual-hint">
        <strong>🔍 输出尺寸公式的直觉</strong>：想象在 7×7 的棋盘上放 3×3 的框——从左上角开始，每次移 1 格（stride=1），横竖各能走 5 步，输出就是 5×5。加 1 格 padding（棋盘扩大到 9×9），同样的操作得到 7×7。步长改为 2，每次跳 2 格，输出变成 3×3。公式就是把这些情况统一起来。
      </div>

      <p><strong>填充的意义</strong>：Valid padding（不填充）使输出尺寸缩小；Same padding（填充使输出尺寸不变）保留边缘信息。吴恩达建议：通常使用奇数大小的卷积核（3×3, 5×5），便于对称填充。</p>

      <div class="visual-hint">
        <strong>🔍 为什么用小卷积核？</strong>：两个 3×3 卷积层的感受野 = 一个 5×5 的感受野，但参数更少（2×3×3=18 vs 5×5=25），还多了一次非线性激活。VGG 的核心洞察：用多层小核替代一层大核——同样感受野，更少参数，更强表达力。这是"深度换宽度"的典型例子。
      </div>

      <p><strong>参数量计算</strong>：一个卷积层的参数量 = (卷积核高 × 卷积核宽 × 输入通道数 + 1) × 输出通道数。例如 3×3 卷积、64 输入通道、128 输出通道的参数量为 (3×3×64+1)×128 = 73,856。</p>

      <div class="visual-hint">
        <strong>💡 参数量的直觉</strong>：注意"+1"是偏置项，每个输出通道一个偏置。1×1 卷积虽然"视野"只有 1 个像素，但它的作用是改变通道数（降维/升维）——参数量 = (1×1×C_in+1)×C_out，远小于 3×3 卷积。GoogLeNet 和 ResNet 大量使用 1×1 卷积做"通道压缩"。
      </div>

      <ConvolutionAnimation />
    </KnowledgeCard>

    <KnowledgeCard title="池化操作" icon="⬇️">
      <h2 id="pooling">池化（Pooling）</h2>
      <p>池化用于降低特征图的空间尺寸，减少参数量和计算量，同时增强平移不变性。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：池化就像"看图缩略"——把 4×4 的图缩成 2×2，只保留每个区域最关键的信息。最大池化像"取亮点"——每个区域只留最亮的那颗星（最强特征）；平均池化像"取平均亮度"——每个区域算平均（整体感觉）。
      </div>

      <p><strong>最大池化（Max Pooling）</strong>：取区域内最大值，保留最显著特征。吴恩达指出，最大池化在实践中效果最好的原因是——它保留了每个区域中最强的激活信号。</p>

      <div class="visual-hint">
        <strong>🔍 最大池化为什么有效？</strong>：直觉上，如果某个区域内检测到了"猫耳朵"的特征（某个位置激活值很高），最大池化就把这个信号传下去——位置不重要（猫在图的哪边都行），"有没有"才重要。这就是<strong>平移不变性</strong>的来源——特征稍微移动几个像素，最大池化仍然能选到它。
      </div>

      <p><strong>平均池化（Average Pooling）</strong>：取区域平均值，保留整体信息。常用在全局平均池化（GAP），替换全连接层。</p>
      <p><strong>全局平均池化（Global Average Pooling）</strong>：将每个通道的整个特征图压缩为一个值。Network in Network (Lin et al., 2014) 提出此方法，取代全连接层可大幅减少参数量并防止过拟合。</p>

      <div class="visual-hint">
        <strong>🔍 GAP 替代全连接层的直觉</strong>：全连接层把 7×7×512 的特征图展平成 25088 个数，再用 25088×1000 的权重矩阵分类——仅这一层就 2500 万参数！GAP 的做法更聪明：对每个通道的 7×7 取平均，得到 512 个数，再用 512×1000 分类——只有 51 万参数。GAP 强制每个通道对应一个类别，天然的正则化。
      </div>

      <CodeBlock lang="python" :code="poolingCode" />
    </KnowledgeCard>

    <KnowledgeCard title="高级卷积类型" icon="🧩">
      <h2 id="advanced-conv">高级卷积类型</h2>
      <p>现代 CNN 架构中使用了多种卷积变体以提升效率和表达能力。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：标准卷积像"全才"——一个核同时看所有通道的所有位置；深度可分离卷积像"专才组合"——先每个人看自己的通道（深度卷积），再汇总信息（逐点卷积）；分组卷积像"分组讨论"——几人一组独立讨论，最后汇总；空洞卷积像"隔位观察"——每隔几个位置看一次，看得更远但不增加人手。
      </div>

      <h3>深度可分离卷积（Depthwise Separable Convolution）</h3>
      <p>将标准卷积分解为两步：先逐通道卷积（Depthwise），再逐点卷积（1×1 Pointwise）。MobileNet 的核心创新，计算量大幅降低：</p>
      <FormulaBlock formula="\text{标准卷积计算量} = K^2 \times C_{in} \times C_{out} \times H \times W" />
      <FormulaBlock formula="\text{深度可分离卷积计算量} = (K^2 \times C_{in} + C_{in} \times C_{out}) \times H \times W" />

      <div class="visual-hint">
        <strong>🔍 深度可分离卷积的直觉</strong>：标准 3×3 卷积做两件事：(1) 空间聚合——看 3×3 区域；(2) 通道融合——把 C_in 个通道混合成 C_out 个。深度可分离卷积把这两步拆开——深度卷积只做空间聚合（每个通道独立 3×3），逐点卷积只做通道融合（1×1 混合通道）。分工更高效！代价：逐通道卷积学不到跨通道的空间特征，但实践中精度损失很小（<2%）而速度提升巨大。
      </div>

      <p>计算量比值约为 1/C_out + 1/K²，当 C_out=256、K=3 时仅为标准卷积的约 1/9。</p>

      <h3>分组卷积（Grouped Convolution）</h3>
      <p>将输入通道分为 g 组，每组独立卷积。g=C_in 时即深度卷积。ResNeXt 证明分组卷积是增加"基数"（cardinality）的有效方式，比单纯增加深度或宽度更有效。</p>

      <div class="visual-hint">
        <strong>🔍 分组卷积的直觉</strong>：想象 12 个人一起画一幅画——全在一起画可能互相干扰（标准卷积），分成 3 组各画一部分再拼接（分组卷积），效率更高且每组风格多样。ResNeXt 的发现：增加分组数（基数）比增加宽度或深度更能提升性能——"多条独立路径 > 一条更宽的路径"。
      </div>

      <h3>空洞卷积（Dilated/Atrous Convolution）</h3>
      <p>在卷积核元素之间插入空洞（rate r），在不增加参数量的情况下扩大感受野：</p>
      <FormulaBlock formula="\text{有效卷积核大小} = K + (K-1)(r-1) = K \cdot r - (r-1)" />
      <p>广泛用于语义分割（DeepLab 系列），替代池化来扩大感受野，避免信息损失。</p>

      <div class="visual-hint">
        <strong>🔍 空洞卷积的直觉</strong>：想象你站在高处看风景——普通卷积像站在 1 楼看（视野有限），池化像坐电梯到 3 楼看（视野大但丢了一半细节），空洞卷积像站在 1 楼但用望远镜每隔几格看一次（视野大且不丢细节）。rate=2 的 3×3 空洞卷积实际采样范围是 5×5，但参数量仍是 3×3。
      </div>

      <h3>可变形卷积（Deformable Convolution）</h3>
      <p>卷积核的采样位置不是固定的网格，而是通过额外的偏移量网络学习得到。使卷积能自适应目标形状，在目标检测和分割中效果显著。</p>

      <div class="visual-hint">
        <strong>🔍 可变形卷积的直觉</strong>：普通卷积的采样点是固定方格——如果目标是不规则形状（比如弯腰的人），固定方格会采到很多背景。可变形卷积让采样点"跟着目标走"——如果目标是弯腰的人，采样点也会弯过去，更贴合目标轮廓。就像"智能橡皮筋"自动贴合物体形状。
      </div>

      <CodeBlock lang="python" :code="advancedConvCode" />
    </KnowledgeCard>

    <KnowledgeCard title="经典架构演进" icon="🏛️" :experiment="experimentConfigs['classic-cnn']">
      <h2 id="architectures">架构演进</h2>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：CNN 架构的演进就像"建筑设计的进化史"——LeNet 是单层平房（奠定地基：卷积→池化→全连接），AlexNet 是钢筋混凝土楼房（深度突破+ReLU+GPU并行），VGG 是标准化公寓（统一用3×3小砖块，结构极度规整），GoogleNet 是多展厅博物馆（Inception多分支并行），ResNet 是带高速匝道的摩天大楼（残差连接让152层也能训），DenseNet 是每一层都通全楼电梯（密集连接极致特征重用），MobileNet 是轻便移动板房（深度可分离卷积节能），EfficientNet 是智能节能建筑（深度/宽度/分辨率联合缩放找最优），ConvNeXt 是融合了现代设计理念的经典建筑（证明好的设计原则大于材料选择）。<strong>核心教训：每一代都在解决前一代的瓶颈</strong>——LeNet太浅→加深；深了退化→残差；残差层多了太慢→轻量化；轻量损失精度→系统缩放。
      </div>

      <div class="timeline">
        <div class="timeline-item" v-for="arch in architectures" :key="arch.name">
          <span class="timeline-year">{{ arch.year }}</span>
          <div class="timeline-content">
            <h4>{{ arch.name }}</h4>
            <p>{{ arch.desc }}</p>
          </div>
        </div>
      </div>

      <div class="visual-hint">
        <strong>🔍 关键转折点的直觉</strong>：<br>
        <strong>AlexNet (2012)</strong>：第一次证明"深层CNN+大数据+GPU"可行。两个关键技巧——ReLU替代Sigmoid（解决梯度饱和）、Dropout防止过拟合。ImageNet 错误率从 26% 降到 15%，震撼了整个CV界。<br>
        <strong>VGG (2014)</strong>：证明了<strong>深度比大卷积核更重要</strong>——两个3×3感受野=一个5×5，但参数少+多一次非线性。结构极其统一，后来成了所有任务的标准backbone。<br>
        <strong>ResNet (2015)</strong>：震惊发现——56层网络错误率反而高于20层！这不是过拟合（训练误差也高），而是<strong>退化问题</strong>（优化变难）。残差连接 F(x)+x 让梯度直接流过去，152层轻松训练。<br>
        <strong>EfficientNet (2019)</strong>：深度d、宽度w、分辨率r形成"不可能三角"吗？不——它们可以联合缩放：d增大需要更大的感受野（w↑），也需要更高分辨率（r↑）。论文用NAS搜索出了三者最优比例。<br>
        <strong>ConvNeXt (2022)</strong>：别急着抛弃CNN——把Swin Transformer的设计原则逐个用到ResNet上（大核、深度可分离、GELU、LayerNorm），纯CNN也能达到Transformer的精度。启示：好的设计比注意力机制本身更重要。
      </div>

      <div class="visual-hint">
        <strong>💡 选型指南（安德鲁·吴实用法则）</strong>：学术研究/打Kaggle → ResNet-50 或 EfficientNet-B4（标准基线）；移动端/IoT设备 → MobileNet V3-Small 或 ShuffleNet V2；追求极致精度且GPU充裕 → ConvNeXt-Base 或 Swin-B；快速原型验证想法 → ResNet-18（轻量、训练快、代码到处都是）。另外记住：<strong>先跑通ResNet-50做基线，再考虑换结构</strong>——大部分情况下，数据质量和训练技巧（学习率、增强）比架构选择更重要。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="残差连接" icon="🔗">
      <h2 id="residual">残差连接（Skip Connection）</h2>
      <p>ResNet 提出的核心创新，通过跳跃连接解决深层网络的退化问题：</p>
      <FormulaBlock formula="y = \mathcal{F}(x, \{W_i\}) + x" />

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：残差连接就像"高速公路匝道"——普通网络的信息只能在"地方道路"上逐层行驶，遇到堵车（梯度消失）就走不动了；残差连接修了一条"直达高速"，信息可以直接跳过中间层到达前方。不管中间层学得好不好，至少 x 可以原封不动地传过去——"至少不会比没有这些层更差"。
      </div>

      <p>残差连接使得梯度可以直接流向前层，有效缓解了梯度消失问题。</p>
      <p>吴恩达在课程中深入解释了残差连接的直觉：网络只需学习残差 F(x) = H(x) - x，当恒等映射是最优时，只需让 F(x)→0 即可，比从零学习 H(x)=x 容易得多。</p>

      <div class="visual-hint">
        <strong>🔍 残差学习的直觉</strong>：假设最优函数是 H(x)=x（恒等映射）。普通网络要学的是从 x 变成 x——一堆参数恰好抵消，很难学；残差网络要学的是 F(x)=H(x)-x=0——把所有参数推到零就行，简单多了！更一般地，如果最优函数接近恒等映射（大部分情况），残差只需学一个小的修正量，比学整个函数容易得多。
      </div>

      <p><strong>Pre-activation ResNet</strong>：He 等人后续提出将 BN+ReLU 放在卷积之前（而非之后），使信息流更顺畅：</p>
      <FormulaBlock formula="y = x + \mathcal{F}(\text{BN}(\text{ReLU}(x)))" />

      <div class="visual-hint">
        <strong>🔍 Pre-activation 为什么更好？</strong>：原始 ResNet 的 y = ReLU(F(x) + x)，如果 F(x)+x 是负数会被 ReLU 截断——信息丢失！Pre-activation 把 ReLU 放在 F 内部，保证 x 可以无损传递：y = F(BN(ReLU(x))) + x。这就像高速公路不设限速——匝道可以限速，但主路永远畅通。
      </div>

      <h3>DenseNet 密集连接</h3>
      <p>DenseNet 将残差连接的思想推向极致——每层与前面所有层直接连接：</p>
      <FormulaBlock formula="x_l = H_l([x_0, x_1, ..., x_{l-1}])" />
      <p>优点：特征重用、梯度传播更顺畅、参数更少。缺点：显存消耗大（可用 DenseNet-BC 稀疏连接缓解）。</p>

      <div class="visual-hint">
        <strong>🔍 DenseNet vs ResNet 的直觉</strong>：ResNet 是"加法"——y = F(x) + x，只传递一个和；DenseNet 是"拼接"——y = H([x₀, x₁, ..., xₗ₋₁])，把之前所有层的特征都保留下来。好处是特征重用（前面的特征可以被后面的层反复使用），坏处是通道数线性增长（显存爆炸）。DenseNet 用 1×1 卷积做"瓶颈层"来控制通道数。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="轻量级架构" icon="📱">
      <h2 id="lightweight">轻量级架构</h2>
      <p>移动端和边缘设备的需求催生了一系列轻量级 CNN 架构。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：轻量级架构的核心矛盾是"精度 vs 速度"——就像手机既要拍照好看又要轻薄。解决方案就是"聪明地省"：不在不必要的地方浪费计算（深度可分离卷积），不在低维空间做非线性（线性瓶颈），让不同组的信息交叉流动（通道混洗）。
      </div>

      <h3>MobileNet 系列</h3>
      <p><strong>MobileNet V1</strong>：使用深度可分离卷积替代标准卷积，计算量降低约 8-9 倍。</p>
      <p><strong>MobileNet V2</strong>：引入倒残差结构（Inverted Residual）——先用 1×1 卷积升维，再 3×3 深度卷积，最后 1×1 降维。还提出线性瓶颈（Linear Bottleneck），在低维空间不用 ReLU 避免信息损失。</p>

      <div class="visual-hint">
        <strong>🔍 倒残差结构的直觉</strong>：普通 ResNet 是"沙漏形"（高→低→高），MobileNet V2 是"纺锤形"（低→高→低）。为什么？因为在低维空间做深度卷积没多少信息可提取——就像在狭窄的管道里做精密手术。先升维到高维空间，信息更丰富，深度卷积效果更好；再降维回来，保持轻量。最后一步不用 ReLU（线性瓶颈）——因为低维空间经 ReLU 会丢失太多信息（ReLU 把负值全变零，低维空间每个维度都很珍贵）。
      </div>

      <p><strong>MobileNet V3</strong>：结合 NAS 搜索和人工优化，使用 h-swish 和 h-sigmoid 激活函数（更高效的 Swish/Sigmoid 近似）。</p>

      <h3>ShuffleNet</h3>
      <p>使用分组卷积 + 通道混洗（Channel Shuffle），在保持分组卷积效率的同时允许跨组信息流动。V2 版本提出四个轻量化设计原则：</p>
      <ul>
        <li>同通道宽度使输入/输出计算量平衡</li>
        <li>过量使用分组卷积会增加 MAC（内存访问成本）</li>
        <li>网络碎片化（多分支）会降低并行度</li>
        <li>元素级操作（ReLU、Add）不可忽略</li>
      </ul>

      <div class="visual-hint">
        <strong>🔍 通道混洗的直觉</strong>：分组卷积的问题是——组与组之间永远不交流，就像 4 个小组各自讨论永远汇总不出统一结论。通道混洗就是"打乱座位"——每过一层就把各组的成员重新分配，让信息交叉流动。方法出奇简单：把通道 reshape 成 (g, C/g)，转置，再 flatten——O(1) 操作，信息就能跨组流动了。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="现代 CNN：ConvNeXt" icon="🔮">
      <h2 id="convnext">ConvNeXt：纯 CNN 的反击</h2>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：ConvNeXt 的故事就像"传统武术用现代科学重新训练后击败了新式格斗术"——Transformer 带着注意力机制横扫 CV 领域，大家都觉得 CNN 过时了。但 ConvNeXt 团队不信邪：他们把 Swin Transformer 的每个设计决策都拆开来看——"这个好，但真的是注意力让这个变好的吗？"——结果发现：<strong>把同样的设计原则用到 ResNet 上，纯 CNN 不仅不输 Transformer，甚至更好！</strong>核心洞察：Transformer 的优势不在于"注意力"机制本身，而在于一系列好的架构设计原则——这些原则 CNN 完全可以借鉴。
      </div>

      <p>Liu 等人 (2022) 将 Transformer 的设计理念迁移到标准 ResNet 架构上，通过一系列修改使纯 CNN 达到了与 Swin Transformer 相当甚至更好的性能：</p>
      <ul>
        <li><strong>宏观比例</strong>：调整各 stage 的 block 数量（类似 Swin-T/S/B/L 的比例）</li>
        <li><strong>深度可分离卷积</strong>：用 7×7 深度卷积替代 3×3 标准卷积</li>
        <li><strong>倒残差结构</strong>：类似 MobileNet V2，先升维再降维</li>
        <li><strong>GELU 激活</strong>：替代 ReLU</li>
        <li><strong>LayerNorm</strong>：替代 BatchNorm</li>
        <li><strong>更少的激活和归一化层</strong>：只在残差块的开头和中间各用一次</li>
      </ul>

      <div class="visual-hint">
        <strong>🔍 逐项改造的深层直觉</strong>：<br>
        <strong>① 7×7 深度可分离卷积</strong>：Transformer 的窗口自注意力有全局感受野——CNN 能否也有大感受野？改用 7×7 大核，但用深度可分离卷积（MobileNet 的方式）让参数不爆炸。结果：感受野从 3×3 扩大到 7×7，精度涨了，证明<strong>大感受野不是注意力专属优势</strong>。<br>
        <strong>② 倒残差结构</strong>：Swin Transformer 的 MLP 先升维再降维（expansion ratio=4）。CNN 也这么干——先用 1×1 把通道升 4 倍（高维空间非线性能量强），3×3 深度卷积做空间变换，再用 1×1 降回。效果拔群。<br>
        <strong>③ GELU + LayerNorm 替代 ReLU + BatchNorm</strong>：GELU 是 ReLU 的平滑版（负值不完全截断），梯度更流畅；LayerNorm 不依赖 batch 统计量（BN 在小 batch/分布式训练时不稳定），更"干净"。但最重要的不是具体选哪个——而是这两个操作放的位置（只在残差块的特定位置用）。<br>
        <strong>④ 减少激活/归一化</strong>：ResNet 一个 block 里有 ReLU→Conv→BN→ReLU→Conv→BN（2 次激活+2 次归一化）。ConvNeXt 把中间多余的去掉，变成 1 次归一化+1 次激活。每经过一次非线性都是一次信息丢失——<strong>少即是多</strong>。
      </div>

      <div class="visual-hint">
        <strong>💡 深层启示</strong>：ConvNeXt 最大的贡献不是"又一个 SOTA 模型"，而是它的<strong>方法论</strong>——把竞争对手（Transformer）的设计逐项"搬"到自己（CNN）身上，通过消融实验分离出哪些是真正有用的大原则（大感受野、倒残差、标准化位置），哪些是"注意力"带来的特殊效果（其实没有特殊效果）。这启发了整个领域：<strong>别迷信技术标签，相信好的工程设计</strong>。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="感受野与特征金字塔" icon="🔭">
      <h2 id="receptive-field">感受野与特征金字塔</h2>

      <h3>感受野（Receptive Field）</h3>
      <p>感受野是指输出特征图上一个像素对应的输入图像区域大小。对多尺度目标检测至关重要。</p>
      <FormulaBlock formula="RF_l = RF_{l-1} + (K_l - 1) \times \prod_{i=1}^{l-1}S_i" />
      <p>其中 RF_l 是第 l 层的感受野，K_l 是第 l 层卷积核大小，S_i 是第 i 层的步长。有效感受野通常远小于理论感受野，呈高斯分布。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：感受野就像"你站在不同楼层看风景"——1 楼（浅层/低层）只能看到脚下几块砖的纹理（边缘、色块），10 楼（中层）能看到整条街的店面招牌（局部物体部件），100 楼（深层/高层）能看到整个城市的轮廓（全局语义）。感受野越大，看到的"上下文"越多，但空间精度越低。<strong>但有个反直觉的事实：理论感受野 >> 有效感受野</strong>——虽然公式算出深层神经元对应输入的大片区域，但实际起作用的只有中心的一小部分（呈高斯分布衰减），就像你站在 100 楼看城市，真正能看清的只有正下方那块。
      </div>

      <div class="visual-hint">
        <strong>🔍 感受野计算的直觉</strong>：想象你在看一张 224×224 的图片。第一层 3×3 卷积（stride=1），每个输出像素看了输入 3×3 = 9 个像素。到了第二层，虽然还是 3×3 卷积，但第一层的每个点已经"代表"了 3×3 区域，所以第二层每个点实际覆盖了输入 5×5 的区域（3+2）。公式 RF_l = RF_{l-1} + (K_l - 1) × ∏S_i 就是这种"层层累加"的数学表达。如果中间插了 stride=2 的池化层，信息被"隔行采样"，每个输出点代表的范围立刻翻倍！这就是为什么深层 CNN 的感受野增长非常快——stride 的累积效应是乘性的。
      </div>

      <h3>特征金字塔网络（FPN）</h3>
      <p>FPN 是目标检测中的关键组件，构建多尺度特征金字塔：自底向上（逐步下采样）、自顶向下（逐步上采样）、横向连接（融合不同分辨率的特征）。</p>

      <div class="visual-hint">
        <strong>🔍 FPN 的"多焦段相机"比喻</strong>：FPN 本质上解决了目标检测的核心矛盾——<strong>小目标需要高分辨率（位置准确），大目标需要强语义（类别准确）</strong>。用摄影师打比方：拍远景（大目标）用长焦镜头，语义清晰但看不清细节；拍微距（小目标）用广角镜头，细节丰富但不知道拍的是什么。FPN 的做法：给每层都配"多焦段镜头"——自底向上正常拍摄（不同分辨率），自顶向下把语义信息"广播"回低层，横向连接确保语义和空间信息精确对齐。结果：<strong>每一层都同时拥有强语义和精确位置</strong>。小目标检测因此受益巨大：本来在 1/32 分辨率的高层，一个 16×16 的目标只剩下 0.5×0.5 像素（彻底消失！），但有了 FPN，在 1/4 分辨率的低层它还有 4×4 像素，且融入了高层语义，可以被检测到。
      </div>

      <div class="visual-hint">
        <strong>💡 小目标检测为什么难？</strong>本质是<strong>分辨率退化</strong>：ResNet-50 经过 5 次 stride-2 下采样，原始 640×640 的图像特征图只剩 20×20。一个 32×32 的小目标（比如远处的人脸）在特征图上只剩 1×1——一个像素！FPN 通过多尺度融合，让低层保留了较高分辨率（80×80），小目标有 4×4 的特征区域，勉强可以检测。更极端的方案包括：不做最后的下采样（Dilated ResNet）、超分辨率增强小目标特征、专门的小目标检测头。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="目标检测" icon="🎯" :experiment="experimentConfigs['object-detection']">
      <h2 id="object-detection">目标检测（Object Detection）</h2>
      <p>目标检测是 CNN 最重要的应用之一——不仅要知道图片里有什么（分类），还要知道物体在哪（定位），是理解和类别两个任务的结合。吴恩达在 CNN 课程第三周详细讲解了检测算法的演进。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解："找不同 + 贴标签"</strong>：图像分类像"这张图里有猫吗？"——回答是或否。目标检测像"在图里找出所有猫，每个画个框标出来"——不仅要找到，还要说出每只猫在哪、是什么。历史上这条路线走了三个阶段：(1) <strong>滑动窗口 + 分类器</strong>——用不同大小的窗口在全图上滑动，每个窗口跑分类器——慢到不可用；(2) <strong>两阶段检测器</strong>（R-CNN系列）——先快速提名候选区域（可能是物体的位置），再对每个区域精细分类——准确但慢；(3) <strong>单阶段检测器</strong>（YOLO/SSD）——把图一次分成网格，每个格直接预测框和类别——快但曾不如两阶段准。如今两者精度已接近。
      </div>

      <h3>R-CNN 家族的演进</h3>
      <div class="visual-hint">
        <strong>🔍 从 R-CNN 到 Faster R-CNN 的三次进化</strong>：<br>
        <strong>R-CNN (2014)</strong>：Selective Search 生成 2000 个候选区域→每个区域缩放到固定大小→送 CNN 提取特征→SVM 分类+边界框回归。问题：<strong>2000 次 CNN 前向</strong>，一张图要跑几分钟。<br>
        <strong>Fast R-CNN (2015)</strong>：整张图只跑一次 CNN→在特征图上用 RoI Pooling 提取每个候选区域的特征→全连接分类+回归。速度提升 25 倍！问题：Selective Search 本身慢（2 秒/图）。<br>
        <strong>Faster R-CNN (2015)</strong>：核心创新——<strong>RPN（区域提议网络）</strong>，用神经网络代替 Selective Search 来提名候选区域！在特征图上每个位置预设 9 个不同大小/比例的 Anchor Box，RPN 判断每个 Anchor 是前景还是背景并微调位置。整个系统（RPN+Fast R-CNN）共享同一个 CNN Backbone，端到端训练。这就是现代两阶段检测器的标准范式。
      </div>

      <h3>YOLO：单阶段检测</h3>
      <div class="visual-hint">
        <strong>🔍 YOLO 的直觉："一眼看完整张图"</strong>：YOLO（You Only Look Once）把检测变成<strong>回归问题</strong>——把图分成 S×S 网格（如 7×7），每个网格预测 B 个边界框（x, y, w, h, confidence）和 C 个类别概率。一整张图一次前向就出结果，快到 30 FPS（实时！）。核心思想：<strong>不看细节、直接判断</strong>——不像 R-CNN 先找候选区域再分类，YOLO 让每个网格"负责"它中心点落在这个网格的物体。缺点：对密集小目标和小物体群效果差（一个网格只能预测有限个框）。后续版本（YOLOv3→v8）通过多尺度预测、Anchor 优化、更好的 Backbone 大幅改进。
      </div>

      <h3>核心概念：IoU 与 NMS</h3>
      <div class="visual-hint">
        <strong>🔍 IoU 和 NMS 的直觉</strong>：<strong>IoU（交并比）</strong>——两个框重叠面积除以总面积。"猜的框"和"真值框"的 IoU > 0.5 通常算正确检测。但检测器可能对同一物体输出多个重叠的框（都认为自己是最准的），<strong>NMS（非极大值抑制）</strong>解决这个：按置信度排序→取最高分的框→删除和它 IoU > 0.5 的其他框→重复。直觉：一群人在指同一个猫，留下最自信的那个，把"说同一只猫的"其他人请走。
      </div>

      <FormulaBlock formula="\text{IoU} = \frac{\text{Area}(A \cap B)}{\text{Area}(A \cup B)}" />
      <p><strong>评估指标 mAP（mean Average Precision）</strong>：综合衡量检测精度——在不同 IoU 阈值下计算 Precision-Recall 曲线下面积，再对所有类别取平均。mAP@0.5 和 mAP@0.5:0.95 是 COCO 数据集的标准指标。</p>

      <CodeBlock lang="python" :code="detectionCode" />
    </KnowledgeCard>

    <KnowledgeCard title="语义分割" icon="🧩" :experiment="experimentConfigs['semantic-segmentation']">
      <h2 id="semantic-segmentation">语义分割（Semantic Segmentation）</h2>
      <p>比目标检测更进一步——不是画框，而是给<strong>每个像素</strong>分配一个类别标签。自动驾驶需要精确知道"哪个像素是路、哪个是车、哪个是行人"，不能只画个框。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解："逐像素上色"</strong>：分类是给整张图一个标签，检测是给物体画框，分割是给每个像素涂上不同的颜色——天空全蓝、道路全灰、汽车全红、行人全绿。核心矛盾：CNN 的分类网络通过池化/stride 把分辨率越压越低（语义越来越强、位置越来越模糊），但分割需要<strong>像素级输出</strong>——每个像素都要有精确的类别。所以分割网络必须解决"如何从低分辨率强语义恢复到高分辨率"的问题。
      </div>

      <h3>FCN：全卷积网络</h3>
      <div class="visual-hint">
        <strong>🔍 FCN 的直觉："扔掉全连接，全用卷积"</strong>：分类网络（如 VGG）最后是全连接层→输出 1000 维向量。FCN 把全连接层全部换成 1×1 卷积，保持空间结构。然后通过<strong>转置卷积（Transposed Convolution）</strong>——也叫"上采样"或"反卷积"——把低分辨率特征图逐步放大回原图大小。但直接上采样 32 倍（从 7×7 到 224×224）太粗糙——边缘模糊、细节丢失。FCN 的改进：<strong>跳跃连接</strong>——融合低层高分辨率特征（保留边缘信息）与高层强语义特征——这就是 FCN-8s（融合 3 个尺度的特征）。
      </div>

      <h3>U-Net：对称编解码</h3>
      <div class="visual-hint">
        <strong>🔍 U-Net 的"U 形对称"直觉</strong>：U-Net 的左半边是编码器（像标准 CNN 逐层下采样提取特征），右半边是解码器（逐层上采样恢复分辨率）。关键是：<strong>每层上采样后，都和编码器同层的特征图拼接</strong>（Skip Connection），再做卷积。这保证了低层的精确边缘信息和高层的语义类别信息在每一层都充分融合。U-Net 最早用于医学影像分割（生物医学图像 U-Net 是它的全名），因为医学图像边界模糊+训练数据少，需要极致的特征复用。
      </div>

      <FormulaBlock formula="\text{U-Net: } x_{\text{up}} = \text{Conv}(\text{Concat}(\text{Upsample}(x_{\text{high}}), x_{\text{low}}))" />

      <h3>评估指标：IoU / Dice</h3>
      <div class="visual-hint">
        <strong>💡 分割的评估直觉</strong>：分割不是看框准不准，而是看<strong>每个像素分对没有</strong>。最常用的指标是 <strong>mIoU（平均交并比）</strong>——对每个类别，计算"预测为该类且真的是该类的像素"除以"预测或真实为该类的所有像素"。直觉：预测区域和真实区域的重叠程度，0=完全不沾边，1=完美重合。医学影像常用 <strong>Dice 系数</strong>（本质上是 IoU 的 F1-score 版）：Dice = 2|A∩B|/(|A|+|B|)。
      </div>

      <CodeBlock lang="python" :code="segmentationCode" />
    </KnowledgeCard>

    <KnowledgeCard title="迁移学习" icon="🔄">
      <h2 id="transfer-learning">迁移学习</h2>
      <p>吴恩达在课程中强调，迁移学习是实践中最重要的技巧之一——当你的数据量不够时，利用在大数据集上预训练的模型几乎总能带来提升。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：迁移学习就像"学会弹钢琴的人学吉他快得多"——不是因为他们练过吉他，而是乐理、节奏感、手指灵活性这些<strong>底层通用技能</strong>已经内化了。ImageNet 预训练的 CNN 也是如此：它的前几层学会了检测边缘、角点、颜色对比（像视觉皮层的 V1 区域做的一样），中间层学会了识别纹理、形状、部件（像 V2/V4 区域），只有最后几层是专门针对 ImageNet 1000 类的分类逻辑。当你把这个网络用到医学影像分类时，前几层的"边缘检测器"一样好用——<strong>所有视觉任务都需要检测边缘</strong>！你只需要替换最后的分类头，告诉它"这些边缘+纹理组合起来是肿瘤还是正常组织"。
      </div>

      <p>将在大规模数据集上预训练的模型迁移到目标任务上，通常策略包括：</p>
      <ul>
        <li><strong>特征提取</strong>：冻结预训练模型的卷积层，只训练新的分类头。适合小数据集（< 1K 样本）</li>
        <li><strong>微调（Fine-tuning）</strong>：解冻部分或全部层，以较小学习率继续训练。适合中等数据集</li>
        <li><strong>渐进式解冻</strong>：先只训练顶层，然后逐步解冻底层。吴恩达称之为"小心谨慎"的策略</li>
      </ul>

      <div class="visual-hint">
        <strong>🔍 数据量 × 任务相似度 决策矩阵</strong>：<br>
        ① <strong>数据少 + 任务相似</strong>（如：ImageNet→猫狗分类，500 张图）：特征提取模式，冻结全部卷积层，只训练新的全连接分类头。因为底层特征完全可复用（猫还是猫），数据太少微调会过拟合。<br>
        ② <strong>数据多 + 任务相似</strong>（如：ImageNet→细粒度鸟类识别，10000 张图）：微调全部层，但顶层用较大学习率（需要重新学分类逻辑），底层用较小学习率（边缘检测不需要改变太多）。<br>
        ③ <strong>数据少 + 任务不同</strong>（如：ImageNet→医学 X 光片，500 张图）：尴尬区！冻结前半部分（通用边缘/纹理检测器还能用），微调后面几层（医学纹理和自然图像纹理不同）。数据太少的情况下可能需要专门的医学影像预训练模型（如 CheXNet）。<br>
        ④ <strong>数据多 + 任务不同</strong>（如：ImageNet→卫星遥感图像，50000 张图）：可以尝试从头训练或大规模微调。预训练仍有帮助（权重初始化比随机好），但需要大部分层都重新学习。
      </div>

      <div class="visual-hint">
        <strong>💡 为什么 CNN 的特征可迁移？</strong>吴恩达提出的"底层通用、顶层专用"原理：神经网络各层学到的特征是从通用到专用的递进——层 1-3 是 Gabor 滤波器式的边缘/颜色检测（所有视觉任务共享），层 4-7 是纹理/形状模式（大部分任务共享），层 8+ 是任务特定的语义组合（如"汽车轮胎+车窗+车身→汽车"）。这也是为什么微调时底层学率要更小——你不希望破坏那些来之不易的通用"视觉基元"。
      </div>

      <p><strong>关键原则</strong>：目标数据越多，可以解冻的层越多；目标数据与预训练数据越不同，越需要微调更多层。</p>
    </KnowledgeCard>

    <KnowledgeCard title="数据增强策略" icon="🎨">
      <h2 id="data-augmentation">数据增强策略</h2>
      <p>数据增强是提升 CNN 泛化能力的重要手段，吴恩达和周志华都强调其在小数据场景下的关键作用。</p>

      <div class="visual-hint">
        <strong>🎨 图形理解</strong>：数据增强是"最廉价的数据扩充方式"——标一张图要几毛到几块钱（人工标注成本），但翻转/旋转/调色几乎零成本。更重要的是，增强在<strong>教模型什么是"不变量"</strong>——猫翻过来还是猫（翻转不变性），猫变大变小还是猫（尺度不变性），猫在亮处暗处都是猫（光照不变性）。吴恩达强调：数据增强是小数据场景下性价比最高的提升手段，标注 100 张图 + 增强 ≈ 用 1000 张图训练的效果。周志华在西瓜书中也指出：增强本质是利用<strong>领域知识构造虚拟样本</strong>，是缓解过拟合的有效途径。
      </div>

      <h3>基础增强</h3>
      <ul>
        <li>几何变换：翻转、旋转、缩放、裁剪、平移</li>
        <li>颜色变换：亮度、对比度、饱和度、色调调整</li>
        <li>噪声注入：高斯噪声、椒盐噪声</li>
      </ul>

      <div class="visual-hint">
        <strong>🔍 基础增强的直觉</strong>：几何变换教会模型"位置/方向/尺度不变性"（猫在左边还是右边、歪头还是正脸、大猫还是小猫都是猫），颜色变换教会模型"光照/色温不变性"（白天黑夜阴天晴天都能认出猫），噪声注入教会模型"抗干扰能力"（低分辨率、运动模糊、传感器噪声下仍能识别）。这些都是人类视觉系统天生具备的鲁棒性，但 CNN 需要被显式训练才能获得——因为卷积本身<strong>不具备旋转/尺度不变性</strong>（不像人眼能自动矫正）。
      </div>

      <h3>高级增强</h3>
      <p><strong>CutMix</strong>：从一张图中裁剪矩形区域粘贴到另一张图上，标签按面积比例混合：</p>
      <FormulaBlock formula="y = \lambda y_A + (1-\lambda) y_B, \quad \lambda = \frac{\text{裁剪区域面积}}{\text{图像面积}}" />

      <div class="visual-hint">
        <strong>🔍 CutMix 的直觉："拼图式学习"</strong>：想象把猫的头剪下来贴到狗的身体上，标签变成"0.7 猫 + 0.3 狗"。这强迫模型不能只看整体轮廓（否则会被"猫头狗身"误导），必须学会识别局部特征（猫耳朵、狗尾巴、猫的胡须）。CutMix 比 MixUp 更自然——它保留了物体的<strong>局部结构</strong>（不是像素级半透明混合，而是区域级实体拼接），更接近真实世界的遮挡场景（一个人被树挡住下半身，你仍能认出这是人）。
      </div>

      <p><strong>MixUp</strong>：两张图像逐像素线性插值：</p>
      <FormulaBlock formula="\tilde{x} = \lambda x_A + (1-\lambda) x_B, \quad \tilde{y} = \lambda y_A + (1-\lambda) y_B" />

      <div class="visual-hint">
        <strong>🔍 MixUp 的直觉："插值式泛化"</strong>：MixUp 像是把两张照片半透明叠加——70% 猫 + 30% 狗的像素混合，标签也按比例 0.7 猫 + 0.3 狗。这迫使模型学习<strong>线性行为</strong>——在两个样本之间平滑过渡，而不是对每个训练样本"死记硬背"。核心好处：减少过拟合（模型不会说"这绝对是猫，概率 100%"，而是"这更像猫，概率 70%"），提升了<strong>对抗鲁棒性</strong>（输入微小变化不会导致预测剧烈翻转）。缺点是生成的图不自然（半透明叠加现实中不存在），但神经网络不在乎——它只在乎训练信号。
      </div>

      <p><strong>AutoAugment</strong>：使用强化学习自动搜索最优增强策略组合。</p>
      <p><strong>RandAugment</strong>：AutoAugment 的简化版，只需调节两个超参数（增强种类数 N 和幅度 M），更易使用。</p>

      <div class="visual-hint">
        <strong>🔍 RandAugment 的"两个旋钮"哲学</strong>：AutoAugment 像"请专家为每个数据集量身定制健身计划"——效果好但搜索成本极高（数千 GPU 小时）。RandAugment 说：不用那么复杂，你只需要调两个旋钮——N（随机选几种增强操作）和 M（增强强度多大）。实验发现 <strong>N=2, M=9</strong> 在大多数数据集上都能接近 AutoAugment 搜索出的最优策略。核心理念：<strong>增强的多样性（随机组合）比精确调优更重要</strong>——这是"简单即美"的又一次胜利。
      </div>

      <div class="visual-hint">
        <strong>💡 增强管道设计黄金法则</strong>：① <strong>训练时增强，验证/测试时只归一化</strong>——验证集要反映真实数据分布，不能在验证集上也随机翻转（那会让评估不准）。② 增强操作必须<strong>保持标签不变</strong>——水平翻转猫还是猫，但垂直翻转猫可能不像猫（猫倒立很少见），不是所有几何变换都适合所有任务。③ 医学影像/卫星图要小心——颜色抖动可能改变病理特征或地物类别。④ <strong>先确保数据加载正确，再加上增强</strong>——吴恩达建议从最简单的增强开始（随机水平翻转+随机裁剪），确认 pipeline 无误后再加复杂的。
      </div>

      <CodeBlock lang="python" :code="augmentationCode" />
    </KnowledgeCard>

    <PaperReference :paper="{
      title: 'Deep Residual Learning for Image Recognition',
      authors: 'He, K., Zhang, X., Ren, S. & Sun, J.',
      venue: 'CVPR',
      year: '2016',
      url: 'https://arxiv.org/abs/1512.03385'
    }" />
    <PaperReference :paper="{
      title: 'MobileNetV2: Inverted Residuals and Linear Bottlenecks',
      authors: 'Sandler, M., Howard, A., Zhu, M., Zhmoginov, A. & Chen, L.C.',
      venue: 'CVPR',
      year: '2018',
      url: 'https://arxiv.org/abs/1801.04381'
    }" />
    <PaperReference :paper="{
      title: 'A ConvNet for the 2020s (ConvNeXt)',
      authors: 'Liu, Z., Mao, H., Wu, C.Y., Feichtenhofer, C., Darrell, T. & Xie, S.',
      venue: 'CVPR',
      year: '2022',
      url: 'https://arxiv.org/abs/2201.03545'
    }" />

    <WritingGuide>
      <h3>如何撰写网络架构章节</h3>
      <ul>
        <li><strong>整体架构图</strong>：绘制清晰的网络结构图，标注各层类型和尺寸。使用标准化的可视化工具（draw.io、Figma、TikZ）</li>
        <li><strong>设计动机</strong>：说明每个设计选择的原因（为什么用3×3卷积？为什么加残差？），而非简单罗列</li>
        <li><strong>与已有架构的关系</strong>：明确说明你的架构与已有方法的异同，使用对比表格</li>
        <li><strong>实现细节</strong>：层间连接方式、激活函数位置、归一化方法等</li>
        <li><strong>消融验证</strong>：每个设计选择都应有消融实验支持其有效性</li>
        <li><strong>效率报告</strong>：参数量、FLOPs、推理延迟、显存占用——吴恩达建议这些指标与精度同等重要</li>
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
import ConvolutionAnimation from '@/components/animations/ConvolutionAnimation.vue'
import { experimentConfigs } from '@/experiments/configs'

const progressStore = useProgressStore()
onMounted(() => progressStore.markVisited('cnn'))

const architectures = [
  { year: '1998', name: 'LeNet-5', desc: '7层网络，开创卷积神经网络在图像识别中的应用。使用5×5卷积核和平均池化' },
  { year: '2012', name: 'AlexNet', desc: '8层网络，ReLU激活+Dropout+数据增强，ImageNet竞赛突破性成果。首次证明深层CNN的威力' },
  { year: '2014', name: 'VGGNet', desc: '16-19层，3×3小卷积核堆叠替代大卷积核，结构简洁统一。证明了"更深的网络=更好的性能"' },
  { year: '2015', name: 'ResNet', desc: '152层，残差连接解决退化问题，极深网络成为可能。ILSVRC 2015 冠军，Top-5 错误率 3.57%' },
  { year: '2017', name: 'DenseNet', desc: '密集连接：每层与前面所有层直接连接，特征重用，参数更少' },
  { year: '2017', name: 'MobileNet', desc: '深度可分离卷积，为移动端设计。V2引入倒残差结构，V3结合NAS优化' },
  { year: '2020', name: 'EfficientNet', desc: '复合缩放策略，同时平衡深度/宽度/分辨率，以更少参数达到SOTA' },
  { year: '2022', name: 'ConvNeXt', desc: '将Transformer设计理念迁移到纯CNN，达到Swin Transformer级别的性能' },
]

const detectionCode = `import torch
import torch.nn as nn

# Faster R-CNN 使用 torchvision
import torchvision
from torchvision.models.detection import FasterRCNN
from torchvision.models.detection.rpn import AnchorGenerator

# 轻量 Faster R-CNN 示例
backbone = torchvision.models.mobilenet_v2(pretrained=True).features
backbone.out_channels = 1280
anchor_sizes = ((32, 64, 128, 256, 512),) * 5
aspect_ratios = ((0.5, 1.0, 2.0),) * 5
rpn_anchor = AnchorGenerator(anchor_sizes, aspect_ratios)
model = FasterRCNN(backbone, num_classes=91, rpn_anchor_generator=rpn_anchor)

# YOLO 风格单阶段检测核心逻辑
class YOLOLayer(nn.Module):
    def __init__(self, anchors, num_classes):
        super().__init__()
        self.anchors = anchors
        self.num_classes = num_classes

    def forward(self, x):
        # x: [B, (5 + C) * n_anchors, H, W]
        B, _, H, W = x.shape
        n_anchors = len(self.anchors)
        x = x.view(B, n_anchors, 5 + self.num_classes, H, W)
        # 分离：box(tx,ty,tw,th,conf) + class_probs
        box = x[:, :, :5]
        cls = x[:, :, 5:]
        return box, cls

# NMS 实现
def nms(boxes, scores, iou_threshold=0.5):
    keep = []
    idx = torch.argsort(scores, descending=True)
    while idx.numel() > 0:
        keep.append(idx[0].item())
        if idx.numel() == 1: break
        ious = compute_iou(boxes[idx[0]], boxes[idx[1:]])
        idx = idx[1:][ious < iou_threshold]
    return keep

def compute_iou(box1, boxes):
    """计算一个框与多个框的 IoU"""
    inter_x1 = torch.max(box1[0], boxes[:, 0])
    inter_y1 = torch.max(box1[1], boxes[:, 1])
    inter_x2 = torch.min(box1[2], boxes[:, 2])
    inter_y2 = torch.min(box1[3], boxes[:, 3])
    inter = torch.clamp(inter_x2 - inter_x1, min=0) * torch.clamp(inter_y2 - inter_y1, min=0)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
    return inter / (area1 + area2 - inter + 1e-6)`

const segmentationCode = `import torch
import torch.nn as nn
import torch.nn.functional as F

# U-Net 风格的双层卷积块
class DoubleConv(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1), nn.BatchNorm2d(out_ch), nn.ReLU(),
            nn.Conv2d(out_ch, out_ch, 3, padding=1), nn.BatchNorm2d(out_ch), nn.ReLU(),
        )
    def forward(self, x): return self.conv(x)

# 简化 U-Net
class UNet(nn.Module):
    def __init__(self, in_channels=3, out_channels=1):
        super().__init__()
        # 编码器（下采样）
        self.enc1 = DoubleConv(in_channels, 64)
        self.enc2 = DoubleConv(64, 128)
        self.enc3 = DoubleConv(128, 256)
        self.pool = nn.MaxPool2d(2)
        # 瓶颈
        self.bottleneck = DoubleConv(256, 512)
        # 解码器（上采样 + 跳跃连接）
        self.up3 = nn.ConvTranspose2d(512, 256, 2, stride=2)
        self.dec3 = DoubleConv(512, 256)  # 256(up) + 256(skip) = 512
        self.up2 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.dec2 = DoubleConv(256, 128)
        self.up1 = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.dec1 = DoubleConv(128, 64)
        self.out = nn.Conv2d(64, out_channels, 1)

    def forward(self, x):
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool(e1))
        e3 = self.enc3(self.pool(e2))
        b = self.bottleneck(self.pool(e3))
        d3 = self.dec3(torch.cat([self.up3(b), e3], dim=1))
        d2 = self.dec2(torch.cat([self.up2(d3), e2], dim=1))
        d1 = self.dec1(torch.cat([self.up1(d2), e1], dim=1))
        return self.out(d1)

# 语义分割指标：Dice 系数
def dice_coeff(pred, target, eps=1e-6):
    pred = (pred > 0.5).float()
    intersection = (pred * target).sum()
    return (2. * intersection + eps) / (pred.sum() + target.sum() + eps)`

const poolingCode = `import torch.nn as nn

# PyTorch 池化层
max_pool = nn.MaxPool2d(kernel_size=2, stride=2)
avg_pool = nn.AvgPool2d(kernel_size=2, stride=2)

# 全局平均池化 - 常用于替换全连接层
global_pool = nn.AdaptiveAvgPool2d((1, 1))

# 自定义池化（如混合池化）
class MixedPool2d(nn.Module):
    def __init__(self, kernel_size, alpha=0.5):
        super().__init__()
        self.alpha = alpha
        self.max_pool = nn.MaxPool2d(kernel_size)
        self.avg_pool = nn.AvgPool2d(kernel_size)

    def forward(self, x):
        return self.alpha * self.max_pool(x) + (1 - self.alpha) * self.avg_pool(x)`

const advancedConvCode = `import torch
import torch.nn as nn

# 深度可分离卷积（MobileNet V1）
class DepthwiseSeparableConv(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1):
        super().__init__()
        self.depthwise = nn.Conv2d(
            in_ch, in_ch, kernel_size=3, stride=stride,
            padding=1, groups=in_ch  # groups=in_ch 即深度卷积
        )
        self.pointwise = nn.Conv2d(in_ch, out_ch, kernel_size=1)
        self.bn1 = nn.BatchNorm2d(in_ch)
        self.bn2 = nn.BatchNorm2d(out_ch)

    def forward(self, x):
        x = torch.relu(self.bn1(self.depthwise(x)))
        x = torch.relu(self.bn2(self.pointwise(x)))
        return x

# 倒残差结构（MobileNet V2）
class InvertedResidual(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1, expand_ratio=6):
        super().__init__()
        hidden_ch = in_ch * expand_ratio
        self.use_res_connect = stride == 1 and in_ch == out_ch
        self.conv = nn.Sequential(
            nn.Conv2d(in_ch, hidden_ch, 1),         # 升维
            nn.BatchNorm2d(hidden_ch), nn.ReLU6(),
            nn.Conv2d(hidden_ch, hidden_ch, 3, stride, 1, groups=hidden_ch),  # 深度卷积
            nn.BatchNorm2d(hidden_ch), nn.ReLU6(),
            nn.Conv2d(hidden_ch, out_ch, 1),        # 降维（线性瓶颈，不加 ReLU）
            nn.BatchNorm2d(out_ch),
        )

    def forward(self, x):
        if self.use_res_connect:
            return x + self.conv(x)
        return self.conv(x)

# 空洞卷积（DeepLab 风格）
dilated_conv = nn.Conv2d(256, 256, kernel_size=3, padding=2, dilation=2)`

const augmentationCode = `import torchvision.transforms as T

# 基础数据增强管线
train_transform = T.Compose([
    T.RandomResizedCrop(224, scale=(0.08, 1.0)),
    T.RandomHorizontalFlip(),
    T.ColorJitter(brightness=0.4, contrast=0.4, saturation=0.4, hue=0.1),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# CutMix 实现
def cutmix(data, targets, alpha=1.0):
    lam = np.random.beta(alpha, alpha)
    rand_index = torch.randperm(data.size(0))
    bbx1, bby1, bbx2, bby2 = rand_bbox(data.size(), lam)
    data[:, :, bbx1:bbx2, bby1:bby2] = data[rand_index, :, bbx1:bbx2, bby1:bby2]
    lam = 1 - ((bbx2 - bbx1) * (bby2 - bby1) / (data.size()[-1] * data.size()[-2]))
    targets = lam * targets + (1 - lam) * targets[rand_index]
    return data, targets

# MixUp 实现
def mixup(data, targets, alpha=0.2):
    lam = np.random.beta(alpha, alpha)
    rand_index = torch.randperm(data.size(0))
    mixed_data = lam * data + (1 - lam) * data[rand_index]
    targets_a, targets_b = targets, targets[rand_index]
    return mixed_data, targets_a, targets_b, lam

# RandAugment（PyTorch 内置）
rand_augment = T.RandAugment(num_ops=2, magnitude=9)`

const cnnExperiment = {
  title: '卷积操作实验',
  description: '观察不同卷积核提取特征的效果',
  architecture: '4, 3, 2',
  activations: ['relu', 'sigmoid'],
  loss: 'bce',
  learningRate: 0.05,
  datasets: [
    { name: '边缘检测', data: [{ input: [1, 0, 1, 0], target: [1, 0] }, { input: [0, 1, 0, 1], target: [0, 1] }] },
    { name: '简单模式', data: [{ input: [1, 1, 0, 0], target: [1, 0] }, { input: [0, 0, 1, 1], target: [0, 1] }] },
  ]
}
</script>

<style scoped>
.module-content { position: relative; z-index: 1; }
h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; }
.module-intro { color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 2rem; }
.timeline { position: relative; padding-left: 2rem; }
.timeline::before {
  content: ''; position: absolute; left: 0.5rem; top: 0; bottom: 0;
  width: 2px; background: linear-gradient(180deg, var(--accent-blue), var(--accent-violet));
}
.timeline-item { position: relative; margin-bottom: 1.25rem; }
.timeline-year {
  position: absolute; left: -2rem; top: 0.1rem;
  font-size: 0.75rem; font-weight: 600; color: var(--accent-blue);
  background: var(--bg-surface); padding: 0.1rem 0.4rem; border-radius: 4px;
}
.timeline-content h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem; }
.timeline-content p { font-size: 0.85rem; color: var(--text-secondary); }

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
