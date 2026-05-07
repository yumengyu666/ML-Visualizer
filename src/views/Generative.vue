<template>
  <div class="generative-page module-content">
    <FloatingToc />
    <h1>🎨 生成模型</h1>
    <p class="module-intro">从 GAN 到扩散模型，理解生成式 AI 的核心原理</p>

    <KnowledgeCard title="生成模型的核心问题" icon="❓">
      <h2 id="why-generative">为什么需要生成模型？</h2>

      <h3>图形直觉：学规则 vs 学分布</h3>
      <p>判别模型学的是"分类边界"——把不同类别分开。生成模型学的是"数据长什么样"——学习数据的完整分布，然后从这个分布中采样出新样本。</p>
      <div class="visual-hint">
        <strong>🎨 图形理解："学边界 vs 学分布"</strong>：<strong>判别模型</strong>像鉴定师——只关心"这条线左边是猫，右边是狗"，画一条决策边界就够了。<strong>生成模型</strong>像画家——必须彻底理解"猫长什么样"（毛的纹理、耳朵的形状、眼睛的位置），才能画出新猫。判别模型学的是 P(y|x)（给定图片判断类别），生成模型学的是 P(x)（图片本身的概率分布）。为什么生成模型更难？因为判别模型只需学数据的"分界线"（低维），而生成模型需要学<strong>数据的完整分布</strong>（高维空间中的概率密度面），这是指数级更难的问题。
      </div>
      <p>生成模型的三大范式：</p>
      <ul>
        <li><strong>对抗式（GAN）</strong>：两个网络对抗博弈</li>
        <li><strong>变分式（VAE）</strong>：学习隐空间结构，编码+解码</li>
        <li><strong>扩散式（Diffusion）</strong>：先加噪再去噪</li>
      </ul>
    </KnowledgeCard>

    <KnowledgeCard title="生成对抗网络" icon="⚔️" :experiment="experimentConfigs['gan']">
      <h2 id="gan">GAN（Generative Adversarial Network）</h2>

      <h3>图形直觉：伪造者 vs 鉴定师</h3>
      <p>GAN 就像一个伪造者（生成器）和鉴定师（判别器）的博弈：</p>
      <div class="visual-hint">
        <strong>🎨 图形理解："伪造者 vs 鉴定师"博弈</strong>：Goodfellow (2014) 的洞见——让两个网络<strong>对抗博弈</strong>，而不是直接教生成器怎么画。生成器 G 像伪造者，不断精进造假技术；判别器 D 像鉴定师，不断升级鉴别能力。训练过程就像一个军备竞赛：第 1 轮 G 画得很差→D 轻松识破→G 从 D 的反馈中学习改进→第 10 轮 G 有了点水平→D 需要更仔细看→…→理想终点，D 只能随机猜（50%），意味着 G 的造假能力已经完美。Ian Goodfellow 在酒吧想出的这个框架，简单优雅却极难训练——D 太强 G 没法学，G 太强 D 崩了 G 也没方向。
      </div>

      <FormulaBlock formula="\min_G \max_D \mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]" />
      <p><strong>生成器 G</strong>：将随机噪声 z 映射为生成样本，目标是欺骗判别器。</p>
      <p><strong>判别器 D</strong>：区分真实样本和生成样本，目标是正确分类。</p>

      <h3>训练中的关键挑战</h3>
      <div class="visual-hint">
        <strong>🔍 模式崩塌的直觉</strong>：模式崩塌（Mode Collapse）是 GAN 最臭名昭著的问题——生成器发现"画一种姿势的猫就够骗过判别器了"，于是永远只画那个姿势，失去了多样性。根本原因：GAN 的损失函数（JS 散度）在 G 和 D 的分布不重叠时提供<strong>零梯度信号</strong>——G 不知道"该往哪个方向改进"。WGAN 用 Wasserstein 距离替代 JS 散度解决了这个问题：即使两个分布不重叠，Wasserstein 距离也能提供有意义的梯度信号，告诉 G"还有多远的路要走"。
      </div>

      <h3>GAN 的改进变体</h3>
      <div class="visual-hint">
        <strong>🔍 WGAN 的直觉："推土机距离"</strong>：原始 GAN 用 JS 散度衡量真假分布的距离——但 JS 散度在两个分布不重叠时恒为 log2（梯度为零）。WGAN 改用 Wasserstein 距离，形象地叫"推土机距离"——把一堆土（假分布）推到另一堆土（真分布）的位置，移动土的最小工作量就是距离。这个距离在任何情况下都是连续的，提供了有意义的梯度。约束条件：判别器必须是 1-Lipschitz 的（函数不能变化太快），通过权重裁剪或梯度惩罚实现。
      </div>
      <p><strong>DCGAN</strong>：用卷积替代全连接，提出架构设计指南（用步长卷积替代池化、用 BatchNorm、用 LeakyReLU）。</p>
      <p><strong>条件 GAN（CGAN）</strong>：给生成器和判别器都加上条件标签 y，实现可控生成——"请生成一只猫"。</p>
      <p><strong>StyleGAN</strong>：引入风格注入机制，在不同层注入不同的风格向量——粗层控制姿势/脸型，细层控制发色/肤色。实现了前所未有的生成质量和可控性。</p>
      <p><strong>WGAN</strong>：用 Wasserstein 距离替代 JS 散度，解决训练不稳定问题。关键：判别器变为"评论家"（不输出概率，而是输出评分），且需要梯度惩罚或权重裁剪来满足 Lipschitz 约束。</p>

      <CodeBlock lang="python" :code="ganCode" />
    </KnowledgeCard>

    <KnowledgeCard title="变分自编码器" icon="🔮" :experiment="experimentConfigs['vae']">
      <h2 id="vae">VAE（Variational Autoencoder）</h2>

      <h3>图形直觉：压缩 + 解压 + 规则化</h3>
      <p>想象你要把一张图片"压缩"成几个数字（隐变量），然后从这些数字"解压"还原图片。普通自编码器可能把隐空间搞得很乱——相近的数字可能对应完全不同的图片。VAE 的关键创新：<strong>让隐空间变得有规则</strong>——每个隐变量都服从高斯分布，空间中的点平滑过渡。</p>
      <div class="visual-hint">
        <strong>🎨 图形理解："有序压缩空间"</strong>：普通自编码器把图片压缩成几个数再解压——但隐空间乱成一团，相近的两个隐向量可能解压出完全不同的图。VAE 的革新：<strong>不是把图片编码成确定的点，而是编码成一个高斯分布 N(μ, σ²)</strong>——"这张猫图大概在隐空间的这个区域，周围也都是猫"。从分布中随机采样 z = μ + σ·ε，然后解码。这迫使<strong>邻近的隐向量都映射到相似的图片</strong>（因为从同一个分布区域采样），创造了<strong>连续的隐空间</strong>——在隐空间中沿着任意方向走，生成的图片会平滑过渡（猫→虎→狮子）。这种连续性是 GAN 难以保证的。
      </div>

      <FormulaBlock formula="\mathcal{L}_{\text{VAE}} = \mathbb{E}_{q(z|x)}[\log p(x|z)] - D_{\text{KL}}(q(z|x) \| p(z))" />
      <p><strong>重建项</strong>：让解码器尽量还原原始输入。</p>
      <p><strong>KL 散度项</strong>：让编码器输出的分布 q(z|x) 接近标准正态 p(z)=N(0,I)。直觉：把隐空间"推向"一个规则的形状。</p>

      <h3>重参数化技巧</h3>
      <div class="visual-hint">
        <strong>🔍 重参数化的直觉："把随机挡在梯度路径外面"</strong>：从分布 N(μ, σ²) 中采样 z 是一个<strong>随机操作</strong>——梯度不能穿过随机节点反向传播！重参数化技巧的妙招：z = μ + σ·ε，其中 ε ~ N(0,1) 是外部注入的随机变量，μ 和 σ 是网络输出。反向传播时 ε 被当成常数，梯度直接通过 μ 和 σ 回传——本质上把采样操作的随机性"外包"给了 ε，保持了计算图的可微性。
      </div>
      <FormulaBlock formula="z = \mu + \sigma \odot \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)" />

      <h3>VAE 的优势与局限</h3>
      <ul>
        <li>优势：隐空间结构化，支持插值和语义操作；训练稳定</li>
        <li>局限：生成图像往往比 GAN 模糊——因为 KL 散度项使隐空间过于平滑，损失了细节</li>
      </ul>
    </KnowledgeCard>

    <KnowledgeCard title="扩散模型" icon="🌊" :experiment="experimentConfigs['diffusion']">
      <h2 id="diffusion">扩散模型（Diffusion Model）</h2>

      <h3>图形直觉：墨水扩散与逆向提取</h3>
      <p>想象一滴墨水滴入清水：逐步扩散，最终均匀分布（信息丢失）。扩散模型学会<strong>逆向</strong>这个过程——从均匀的浑水中，逐步把墨水"收回来"。</p>
      <div class="visual-hint">
        <strong>🎨 图形理解："从噪声中还原图像"</strong>：扩散模型的核心直觉——<strong>破坏容易，修复难</strong>。前向过程（加噪）是确定的：往原图上逐步加高斯噪声，T 步后变成纯噪声——就像一滴墨水滴入清水，不可逆地扩散。扩散模型训练一个神经网络来<strong>逆转</strong>这个过程——给定带噪声的图 x_t，预测"上一步加了什么噪声"，然后减去。关键是：模型不需要一步还原到原图，只需要预测<strong>每一步加了多少噪声 ε</strong>！这是个简单的回归任务（MSE），比 GAN 的对抗博弈稳定得多。这也是为什么扩散模型从不模式崩塌——它学的是整个分布的得分函数，而不是和判别器玩猫鼠游戏。
      </div>

      <p><strong>前向过程（加噪）</strong>：逐步向数据添加高斯噪声，直到变为纯噪声。这是一个马尔可夫链：</p>
      <FormulaBlock formula="q(x_t|x_{t-1}) = \mathcal{N}(x_t; \sqrt{1-\beta_t}x_{t-1}, \beta_t I)" />
      <p>可以一步到位：x_t = √ᾱ_t · x_0 + √(1-ᾱ_t) · ε，其中 ᾱ_t = ∏(1-β_i)</p>

      <p><strong>反向过程（去噪）</strong>：训练神经网络预测每一步添加的噪声，然后减去：</p>
      <FormulaBlock formula="p_\theta(x_{t-1}|x_t) = \mathcal{N}(x_{t-1}; \mu_\theta(x_t, t), \sigma_t^2 I)" />
      <p>关键发现：模型不需要预测原始图片，只需要预测<strong>噪声 ε</strong>！这就是"去噪"的直觉——识别并去除噪声。</p>

      <h3>为什么扩散模型超越了 GAN？</h3>
      <div class="visual-hint">
        <strong>💡 训练简单性胜出</strong>：GAN 需要精心平衡 G 和 D 的训练——两个网络的"军备竞赛"极易失控（一方太强另一方没信号）。扩散模型训练只有一个目标：<strong>MSE 预测噪声</strong>——本质上是个回归任务，稳定得像普通的分类/回归网络。代价是<strong>推理慢</strong>——DDPM 需要 1000 步去噪，每步跑一次网络。但 DDIM（50 步）、渐进式蒸馏（4-8 步）、一致性模型（1 步）等技术已大幅缩短。加上理论优雅（与能量模型、分数匹配、SDE/ODE 等价），扩散模型已成为生成模型的"新标准"。
      </div>
    </KnowledgeCard>

    <KnowledgeCard title="扩散模型进阶" icon="🚀">
      <h2 id="diffusion-advanced">扩散模型进阶技术</h2>

      <h3>DDIM：加速采样</h3>
      <p>DDPM 需要 1000 步采样，DDIM 将其减少到 50-100 步。核心思想：跳过中间步骤，直接在子序列上做确定性采样（去掉随机性）。直觉：不用每步都加随机噪声，走一条确定性的"近路"。</p>

      <h3>Classifier-Free Guidance（无分类器引导）</h3>
      <div class="visual-hint">
        <strong>🔍 CFG 的直觉："指南针式引导"</strong>：普通条件扩散模型根据文本 c 去噪，生成"大致符合描述"的图像。CFG 更进一步——同时训练条件模型 ε(x_t, c) 和无条件模型 ε(x_t, ∅)，然后用两者的<strong>差异</strong>作为"方向"来增强条件信号：ε̂ = ε(∅) + s·(ε(c) - ε(∅))。可以理解为：无条件模型告诉你"通用好看的图"往哪去噪，条件模型告诉你"符合文本c的图"往哪去噪，两者的差值就是"文本特有的方向"，乘以 s>1 来放大。s=7.5 是 Stable Diffusion 的默认值——s 越大图像越符合描述，但色彩可能过饱和、多样性降低。
      </div>
      <FormulaBlock formula="\hat{\epsilon}_\theta(x_t, c) = \epsilon_\theta(x_t, \varnothing) + s \cdot (\epsilon_\theta(x_t, c) - \epsilon_\theta(x_t, \varnothing))" />
      <p>s > 1 时增强条件引导，s=1 即标准条件生成。s 越大图像越符合文本描述，但多样性降低。</p>

      <h3>隐空间扩散模型（LDM / Stable Diffusion）</h3>
      <p>图形直觉：在像素空间做扩散就像在一张 512×512 的画布上逐像素去噪——太慢了！Stable Diffusion 先用 VAE 把图片压缩到 64×64 的隐空间，在隐空间做扩散，最后用 VAE 解码回像素空间。速度提升 64 倍！</p>
      <div class="visual-hint">
        <strong>🔍 隐空间扩散的直觉："先压缩再扩散"</strong>：在 512×512×3=786,432 维的像素空间做扩散，每一步都要处理近百万个数值——太慢了！Stable Diffusion 的洞见：先用 VAE 把图像压缩到 64×64×4=16,384 维的隐空间（压缩比 48:1），在隐空间做扩散，最后 VAE 解码回像素。流程：图片→VAE编码→隐向量→扩散加噪/去噪→隐向量→VAE解码→图片。关键是：隐空间已经去除了像素级的冗余信息（高频噪声、人眼不敏感的细节），模型可以专注于语义级别的生成。这是为什么 SD 能在消费级 GPU 上运行。
      </div>

      <h3>文本到图像的完整管线</h3>
      <p>Stable Diffusion 的架构：文本 → CLIP文本编码器 → 条件向量 c → 与 UNet 交叉注意力 → 引导去噪方向。UNet 在去噪的每一步都用 c 来指导"朝哪个方向去噪"。</p>

      <CodeBlock lang="python" :code="diffusionCode" />
    </KnowledgeCard>

    <KnowledgeCard title="其他生成模型" icon="🔄">
      <h2 id="other-generative">其他生成范式</h2>

      <h3>自回归模型</h3>
      <div class="visual-hint">
        <strong>🔍 自回归生成的直觉："逐个像素画图"</strong>：自回归模型把图像生成看作序列生成——左上角第一个像素→第二个→…→右下角最后一个。每个像素的分布条件于之前已生成的所有像素（P(x_i | x_1,...,x_{i-1})）。PixelCNN 用掩码卷积（遮住未来像素）实现这个机制。优势：概率框架严格（精确似然），理论上最优；劣势：生成速度慢到不可用（512×512 需串行生成 262,144 次），且生成顺序（光栅扫描）不符合人类视觉感知。GPT 也是自回归模型（预测下一个 token），但在文本领域这很自然——人类说话写字本来就是串行的。
      </div>

      <h3>归一化流（Normalizing Flows）</h3>
      <div class="visual-hint">
        <strong>🔍 归一化流的直觉："捏橡皮泥"</strong>：从规则的简单分布（如标准高斯——一个球）出发，通过一系列<strong>可逆变换</strong>（像捏橡皮泥——拉伸、扭曲、压缩），最终变成目标复杂分布（如所有猫的图片分布）。因为变换可逆，可以精确计算任意点的概率密度（通过变量替换公式和雅可比行列式）。优势：精确似然计算、无损可逆。劣势：可逆性限制极大——每一层变换的雅可比行列式必须高效计算（通常用三角矩阵或分裂结构），限制了模型容量。归一化流在密度估计（异常检测）领域有独特价值，但在生成质量上被扩散模型超越。
      </div>
      <FormulaBlock formula="p_X(x) = p_Z(f^{-1}(x)) \left|\det\frac{\partial f^{-1}}{\partial x}\right|" />
      <p>优点：精确的似然计算，可逆性保证无信息损失。缺点：可逆变换限制了模型容量，需要特殊设计。</p>
    </KnowledgeCard>

    <PaperReference :paper="{
      title: 'Generative Adversarial Networks',
      authors: 'Goodfellow, I., Pouget-Abadie, J., Mirza, M., et al.',
      venue: 'NeurIPS',
      year: '2014',
      url: 'https://arxiv.org/abs/1406.2661'
    }" />
    <PaperReference :paper="{
      title: 'Denoising Diffusion Probabilistic Models',
      authors: 'Ho, J., Jain, A. & Abbeel, P.',
      venue: 'NeurIPS',
      year: '2020',
      url: 'https://arxiv.org/abs/2006.11239'
    }" />
    <PaperReference :paper="{
      title: 'High-Resolution Image Synthesis with Latent Diffusion Models (Stable Diffusion)',
      authors: 'Rombach, R., Blattmann, A., Lorenz, D., Esser, P. & Ommer, B.',
      venue: 'CVPR',
      year: '2022',
      url: 'https://arxiv.org/abs/2112.10752'
    }" />

    <WritingGuide>
      <h3>生成模型评估指标</h3>
      <ul>
        <li><strong>FID（Fréchet Inception Distance）</strong>：衡量生成图像与真实图像在 Inception 特征空间的分布距离，越低越好。直觉：两个分布的"中心距离"和"形状差异"</li>
        <li><strong>IS（Inception Score）</strong>：衡量生成图像的类别清晰度和多样性，越高越好。但无法检测模式崩塌</li>
        <li><strong>LPIPS</strong>：感知相似度，比像素级指标更符合人类判断</li>
        <li><strong>CLIP Score</strong>：图文一致性，衡量生成图像与输入文本的匹配程度</li>
        <li><strong>引用规范</strong>：报告 FID 时需说明使用的 Inception 模型版本和采样数量（至少 50K）</li>
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
onMounted(() => progressStore.markVisited('generative'))

const ganCode = `import torch
import torch.nn as nn

# 简单 GAN 实现
class Generator(nn.Module):
    def __init__(self, latent_dim=100, img_dim=784):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(latent_dim, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, img_dim),
            nn.Tanh()
        )
    def forward(self, z): return self.net(z)

class Discriminator(nn.Module):
    def __init__(self, img_dim=784):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(img_dim, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )
    def forward(self, x): return self.net(x)

# WGAN-GP 训练（更稳定）
def gradient_penalty(D, real, fake):
    alpha = torch.rand(real.size(0), 1)
    interpolated = alpha * real + (1 - alpha) * fake
    d_interpolated = D(interpolated)
    grad = torch.autograd.grad(
        outputs=d_interpolated, inputs=interpolated,
        grad_outputs=torch.ones_like(d_interpolated),
        create_graph=True
    )[0]
    return ((grad.norm(2, dim=1) - 1) ** 2).mean()`

const diffusionCode = `import torch
import torch.nn as nn

# 简化的扩散模型训练
class SimpleDiffusion:
    def __init__(self, T=1000, beta_start=1e-4, beta_end=0.02):
        self.T = T
        self.betas = torch.linspace(beta_start, beta_end, T)
        self.alphas = 1 - self.betas
        self.alpha_bars = torch.cumprod(self.alphas, dim=0)

    def add_noise(self, x_0, t, noise=None):
        """前向过程：一步加噪到时刻 t"""
        if noise is None:
            noise = torch.randn_like(x_0)
        alpha_bar_t = self.alpha_bars[t].view(-1, 1, 1, 1)
        return torch.sqrt(alpha_bar_t) * x_0 + torch.sqrt(1 - alpha_bar_t) * noise

    def training_loss(self, model, x_0):
        """训练：让模型预测噪声"""
        t = torch.randint(0, self.T, (x_0.size(0),))
        noise = torch.randn_like(x_0)
        x_t = self.add_noise(x_0, t, noise)
        predicted_noise = model(x_t, t)
        return nn.functional.mse_loss(predicted_noise, noise)

# 使用 HuggingFace Diffusers 库（推荐）
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16
)
pipe = pipe.to("cuda")

image = pipe("A cat wearing sunglasses, digital art", num_inference_steps=50).images[0]
image.save("output.png")`
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
