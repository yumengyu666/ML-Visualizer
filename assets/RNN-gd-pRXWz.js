import{_ as m,u as a,o as _,c as f,d as o,a as t,w as i,e as n,p as d,g as N}from"./index-CbXlNRuf.js";import{F as r,e as p,K as s,C as u,W as v,a as T,P as e}from"./configs-y3mOB0wl.js";const b={class:"rnn-page module-content"},x=`import torch
import torch.nn as nn

# LSTM 在 PyTorch 中的使用
lstm = nn.LSTM(
    input_size=128,   # 输入特征维度
    hidden_size=256,  # 隐藏状态维度
    num_layers=2,     # LSTM 层数
    batch_first=True,
    dropout=0.3,      # 层间 Dropout
    bidirectional=True  # 双向 LSTM
)

# 前向传播
output, (h_n, c_n) = lstm(x)
# output: [batch, seq_len, hidden_size * 2]  (双向则 ×2)
# h_n: [num_layers * 2, batch, hidden_size]
# c_n: [num_layers * 2, batch, hidden_size]

# 梯度裁剪（防止梯度爆炸）
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=5.0)`,R=`import torch.nn as nn

# 双向 LSTM
bilstm = nn.LSTM(
    input_size=128, hidden_size=256,
    bidirectional=True, batch_first=True
)
# 输出维度: hidden_size * 2 = 512 (前向+后向拼接)

# 深层双向 LSTM
deep_bilstm = nn.LSTM(
    input_size=128, hidden_size=256,
    num_layers=3,          # 3 层
    bidirectional=True,
    dropout=0.3,           # 层间 dropout
    batch_first=True
)

# 典型应用：命名实体识别 (NER)
class NERModel(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_size, num_tags):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.bilstm = nn.LSTM(embed_dim, hidden_size,
                              bidirectional=True, batch_first=True)
        self.classifier = nn.Linear(hidden_size * 2, num_tags)

    def forward(self, x):
        embeds = self.embedding(x)
        lstm_out, _ = self.bilstm(embeds)
        tags = self.classifier(lstm_out)
        return tags`,k=`import torch
import torch.nn.functional as F

def generate_with_temperature(model, prompt, temperature=1.0, max_len=100):
    """温度采样生成"""
    input_ids = tokenizer.encode(prompt)
    for _ in range(max_len):
        with torch.no_grad():
            logits = model(torch.tensor([input_ids]))[0][-1] / temperature
            probs = F.softmax(logits, dim=-1)
            next_token = torch.multinomial(probs, num_samples=1)
            input_ids.append(next_token.item())
    return tokenizer.decode(input_ids)

def generate_top_k(model, prompt, k=50, temperature=1.0):
    """Top-k 采样"""
    input_ids = tokenizer.encode(prompt)
    for _ in range(max_len):
        with torch.no_grad():
            logits = model(torch.tensor([input_ids]))[0][-1] / temperature
            # 只保留概率最高的 k 个词
            top_k_logits, top_k_indices = torch.topk(logits, k)
            probs = F.softmax(top_k_logits, dim=-1)
            next_token = top_k_indices[torch.multinomial(probs, 1)]
            input_ids.append(next_token.item())
    return tokenizer.decode(input_ids)

def generate_top_p(model, prompt, p=0.9, temperature=1.0):
    """核采样 (Nucleus Sampling)"""
    input_ids = tokenizer.encode(prompt)
    for _ in range(max_len):
        with torch.no_grad():
            logits = model(torch.tensor([input_ids]))[0][-1] / temperature
            sorted_logits, sorted_indices = torch.sort(logits, descending=True)
            sorted_probs = F.softmax(sorted_logits, dim=-1)
            cumulative_probs = torch.cumsum(sorted_probs, dim=-1)
            # 移除累积概率超过 p 之后的词
            sorted_indices_to_remove = cumulative_probs > p
            sorted_logits[sorted_indices_to_remove] = float('-inf')
            probs = F.softmax(sorted_logits, dim=-1)
            next_token = sorted_indices[torch.multinomial(probs, 1)]
            input_ids.append(next_token.item())
    return tokenizer.decode(input_ids)`,S={__name:"RNN",setup(z){const g=a();return _(()=>g.markVisited("rnn")),(L,l)=>(N(),f("div",b,[o(T),l[80]||(l[80]=t("h1",null,"🔄 循环神经网络与序列模型",-1)),l[81]||(l[81]=t("p",{class:"module-intro"},"理解序列建模的核心架构，从RNN到LSTM到Attention",-1)),o(s,{title:"为什么需要 RNN",icon:"❓",experiment:d(p)["why-rnn"]},{default:i(()=>[l[0]||(l[0]=t("h2",{id:"why-rnn"},"为什么需要 RNN？",-1)),l[1]||(l[1]=t("p",null,"传统的前馈网络假设输入之间相互独立——但语言、语音、时序数据中，前后文强相关。吴恩达用一个简单的例子说明：",-1)),l[2]||(l[2]=t("p",null,[n('"I grew up in France... I speak fluent ___" —— 你需要记住前面的"France"才能预测"French"。这就是序列建模的核心需求：'),t("strong",null,"利用上下文信息"),n("。")],-1)),l[3]||(l[3]=t("h3",null,"图形直觉：信息流对比",-1)),l[4]||(l[4]=t("div",{class:"visual-hint"},[t("strong",null,"🎨 图形理解"),n("：想象一条河流——"),t("strong",null,"前馈网络"),n("像是一个水槽，水从一端进、另一端出，中间没有存留；"),t("strong",null,"RNN"),n("像是有回流的池塘，每一步水不仅流入，还会和之前的水混合。更重要的是，RNN 的每个时间步都使用"),t("strong",null,"同一套权重参数"),n('（W_hh, W_xh, W_hy），就像同一个"处理单元"反复应用于序列的每个位置——这是 RNN 能处理变长序列的关键设计。 ')],-1)),l[5]||(l[5]=t("div",{class:"visual-hint"},[t("strong",null,"🔍 时间展开的直觉"),n("：RNN 的循环连接在训练时会被"),t("strong",null,"沿时间展开"),n("（unfold）——把循环结构展平成一个深度等于序列长度的前馈网络，每一层对应一个时间步，所有层共享参数。这就是 BPTT（Back-Propagation Through Time）的本质：在展开的计算图上进行反向传播。这也解释了为什么长序列训练会慢——展开 1000 步就相当于训练一个 1000 层的共享权重网络！ ")],-1)),o(r,{formula:"h_t = \\tanh(W_{hh}h_{t-1} + W_{xh}x_t + b_h), \\quad y_t = W_{hy}h_t + b_y"}),l[6]||(l[6]=t("p",null,'关键区别：h_t 不仅依赖当前的 x_t，还依赖上一步的 h_{t-1}——这就是"记忆"。',-1))]),_:1},8,["experiment"]),o(s,{title:"RNN 梯度问题",icon:"📉"},{default:i(()=>[l[7]||(l[7]=t("h2",{id:"rnn-gradient"},"梯度消失与梯度爆炸",-1)),l[8]||(l[8]=t("h3",null,"图形直觉：信号衰减",-1)),l[9]||(l[9]=t("div",{class:"visual-hint"},[t("strong",null,'🎨 图形理解："传话游戏"比喻'),n('：你和 50 个朋友围成一圈玩传话游戏——每个人听到后小声复述给下一个人。如果每个人只保留 80% 的信息，50 轮后信息只剩 0.8⁵⁰ ≈ 0.00001，最初说的"明天聚餐"变成了"呃……"。这就是'),t("strong",null,"梯度消失"),n("——反向传播时，早期的梯度被反复乘以小于 1 的权重导数，指数级衰减到零，导致 RNN 无法学习长距离依赖。反向情况（每个人放大 1.2 倍）导致"),t("strong",null,"梯度爆炸"),n("——0.8⁵⁰ 变成 1.2⁵⁰ ≈ 9100，梯度值大到溢出。 ")],-1)),l[10]||(l[10]=t("p",null,"标准RNN在长序列上训练时，梯度在时间步间反复乘以相同的权重矩阵：",-1)),o(r,{formula:"\\frac{\\partial \\mathcal{L}}{\\partial W} = \\sum_{t=1}^{T}\\frac{\\partial \\mathcal{L}}{\\partial h_T}\\prod_{k=t+1}^{T}\\frac{\\partial h_k}{\\partial h_{k-1}}\\frac{\\partial h_t}{\\partial W}"}),l[11]||(l[11]=t("p",null,'连乘项 ∏(∂h_k/∂h_{k-1}) 就是那个"传话衰减"——每一步乘以一个 W，如果 W 的最大特征值 < 1 就衰减，> 1 就爆炸。',-1)),l[12]||(l[12]=t("div",{class:"visual-hint"},[t("strong",null,"🔍 为什么 RNN 特别容易梯度消失？"),n("标准 RNN 使用 tanh 激活函数，tanh 的导数范围是 (0, 1]，在饱和区（输入很大或很小）接近 0。每一步反向传播都要乘以 tanh' 和 W_hh，如果 |W_hh|·|tanh'| < 1（大概率如此），梯度指数衰减。相比之下，CNN 的深度是层数（50-100 层），而 RNN 的时间展开相当于把序列长度变成了深度（每个时间步一层）——处理 1000 个词的文本等于训练 1000 层的网络！这就是为什么标准 RNN 很难学习超过 ~10 步的依赖。 ")],-1)),l[13]||(l[13]=t("h3",null,"梯度裁剪：防爆阀",-1)),l[14]||(l[14]=t("p",null,"吴恩达推荐的实用技巧——当梯度范数超过阈值时，等比缩放回来：",-1)),o(r,{formula:"\\text{if } \\|\\nabla\\| > \\theta, \\quad \\nabla \\leftarrow \\frac{\\theta}{\\|\\nabla\\|}\\nabla"}),l[15]||(l[15]=t("p",null,'直觉：给梯度装一个"限速器"，不允许它超过某个最大值。',-1)),o(u,{lang:"python",code:x})]),_:1}),o(s,{title:"LSTM 门控机制",icon:"🚪",experiment:d(p).lstm},{default:i(()=>[l[16]||(l[16]=t("h2",{id:"lstm"},"长短期记忆网络（LSTM）",-1)),l[17]||(l[17]=t("h3",null,"图形直觉：工厂传带",-1)),l[18]||(l[18]=t("div",{class:"visual-hint"},[t("strong",null,'🎨 图形理解："工厂传送带"比喻'),n("：想象工厂里一条水平的传送带 C_t 贯穿整条生产线——信息（货物）在上面平滑流动，只有被特定操作员（门控）允许时才会被修改。三个操作员各司其职："),t("strong",null,"遗忘门"),n("像橡皮擦，决定擦除传送带上的哪些旧信息；"),t("strong",null,"输入门"),n("像笔，决定在传送带上写什么新信息；"),t("strong",null,"输出门"),n("像滤镜，决定此刻从传送带上读取多少信息作为输出 h_t。这个设计的核心天才在于："),t("strong",null,"C_t 的更新是加法操作"),n("（C_t = f·C_{t-1} + i·C̃_t），梯度反向传播时 ∂C_t/∂C_{t-1} = f_t（遗忘门的输出，Sigmoid 后的值），如果 f_t ≈ 1 则梯度几乎无损地回传——完美解决了 RNN 乘法连乘导致的梯度衰减！ ")],-1)),l[19]||(l[19]=t("p",null,[t("strong",null,"第一步：遗忘门——擦除旧信息")],-1)),l[20]||(l[20]=t("p",null,'想象传送带上有些区域被"橡皮擦"擦掉了。遗忘门决定擦除多少：f_t 接近 0 就全擦，接近 1 就全保留。',-1)),o(r,{formula:"f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)"}),l[21]||(l[21]=t("p",null,'直觉：看到新主语"她"时，遗忘门会擦除之前的"他"相关信息。',-1)),l[22]||(l[22]=t("p",null,[t("strong",null,"第二步：输入门——写入新信息")],-1)),l[23]||(l[23]=t("p",null,'想象用笔在传送带上写新内容。输入门控制"写不写"，候选值 C̃_t 控制"写什么"。',-1)),o(r,{formula:"i_t = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i)"}),o(r,{formula:"\\tilde{c}_t = \\tanh(W_c \\cdot [h_{t-1}, x_t] + b_c)"}),l[24]||(l[24]=t("p",null,'直觉：看到新词"北京"，输入门打开，写入"地点=北京"到传带上。',-1)),l[25]||(l[25]=t("p",null,[t("strong",null,"第三步：更新传带")],-1)),l[26]||(l[26]=t("p",null,"旧的被擦掉一部分，新的被写上一部分——纯加法操作，梯度不被反复乘！",-1)),o(r,{formula:"c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t"}),l[27]||(l[27]=t("p",null,[n("这就是 LSTM 解决梯度消失的关键："),t("strong",null,"加法操作保留了梯度流"),n("，而标准 RNN 是乘法操作会衰减梯度。")],-1)),l[28]||(l[28]=t("p",null,[t("strong",null,"第四步：输出门——决定说什么")],-1)),l[29]||(l[29]=t("p",null,"传带上有很多信息，但此刻只需要输出一部分。输出门像一个滤镜，决定读取传带上多少信息作为当前隐藏状态。",-1)),o(r,{formula:"o_t = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o)"}),o(r,{formula:"h_t = o_t \\odot \\tanh(c_t)"}),l[30]||(l[30]=t("p",null,'直觉：虽然传带上记着"地点=北京，时间=昨天，天气=晴"，但在输出"天气"时只需关注天气信息。',-1)),l[31]||(l[31]=t("h3",null,"为什么 LSTM 能记住长期信息？",-1)),l[32]||(l[32]=t("div",{class:"visual-hint"},[t("strong",null,"💡 核心洞察"),n("：如果遗忘门 f_t ≈ 1 且输入门 i_t ≈ 0，则 C_t ≈ C_{t-1}——信息原封不动地流过！梯度反向传播时，∂C_t/∂C_{t-1} = f_t ≈ 1，"),t("strong",null,"梯度几乎无损地跨越任意长度的时间步"),n("。这就是 LSTM 解决梯度消失的数学本质——不是靠技巧（梯度裁剪），而是靠"),t("strong",null,"结构创新"),n('（加法更新路径）。Hochreiter & Schmidhuber (1997) 的洞见：让网络学会"选择性遗忘"和"选择性记忆"，而不是像 RNN 那样每步都强制全部更新状态。 ')],-1))]),_:1},8,["experiment"]),o(s,{title:"GRU",icon:"⚡"},{default:i(()=>[l[33]||(l[33]=t("h2",{id:"gru"},"门控循环单元（GRU）",-1)),l[34]||(l[34]=t("h3",null,"图形直觉：LSTM 的简化版",-1)),l[35]||(l[35]=t("div",{class:"visual-hint"},[t("strong",null,"🎨 图形理解"),n("：如果 LSTM 是一台有 3 个独立旋钮（遗忘、输入、输出）的精密仪器，GRU 就是只有 2 个旋钮的简约版——把遗忘门和输入门"),t("strong",null,"合并"),n('成一个"更新门" z_t，再搭配一个"重置门" r_t。关键简化：'),t("strong",null,"GRU 合并了隐藏状态和细胞状态"),n("（只有一个 h_t），而 LSTM 保有分离的 h_t 和 C_t。结果：参数减少约 25%，训练更快，但 LSTM 的 C_t+h_t 双轨设计在极其复杂的长期依赖任务上略占优势。Cho et al. (2014) 提出 GRU 的动机：让门控机制更轻量，在机器翻译等任务上不输 LSTM。 ")],-1)),l[36]||(l[36]=t("p",null,[t("strong",null,"重置门"),n("：决定在计算候选隐藏状态时，忽略多少过去的隐藏状态。")],-1)),o(r,{formula:"r_t = \\sigma(W_r \\cdot [h_{t-1}, x_t])"}),l[37]||(l[37]=t("p",null,'直觉：r_t 接近 0 时，就好像"假装之前什么都没发生过"，从零开始思考。',-1)),l[38]||(l[38]=t("p",null,[t("strong",null,"更新门"),n("：控制新旧信息的混合比例。")],-1)),o(r,{formula:"z_t = \\sigma(W_z \\cdot [h_{t-1}, x_t])"}),o(r,{formula:"h_t = (1-z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t"}),l[39]||(l[39]=t("p",null,'直觉：z_t 是一个"混合旋钮"——z_t=0 时完全用旧信息，z_t=1 时完全用新信息。注意 1-z_t 意味着"记住旧信息"和"接受新信息"是互补的。',-1)),l[40]||(l[40]=t("div",{class:"visual-hint"},[t("strong",null,"🔍 GRU 的简洁之美"),n("：GRU 把 LSTM 的两个独立决策（遗忘+f 写什么 vs 写多少）合并成一个连续调节——z_t 同时控制保留多少旧信息和接受多少新信息（因为是互补的）。这个设计的代价是"),t("strong",null,"灵活性降低"),n('——你不能同时"保持旧信息"又"大量写入新信息"（因为 1-z_t + z_t 恒等于 1），但实践中这个限制很少成为瓶颈。GRU 的流行证明了"够用就好"的设计哲学。 ')],-1)),l[41]||(l[41]=t("h3",null,"LSTM vs GRU 如何选？",-1)),l[42]||(l[42]=t("ul",null,[t("li",null,[t("strong",null,"GRU"),n("：参数更少（少一个门），训练更快，适合数据量较少的场景")]),t("li",null,[t("strong",null,"LSTM"),n("：更灵活（遗忘和输入可以独立控制），在复杂任务上通常略胜")]),t("li",null,"吴恩达建议：两者都试试，用验证集性能决定")],-1))]),_:1}),o(s,{title:"双向 RNN 与深层 RNN",icon:"↔️"},{default:i(()=>[l[43]||(l[43]=t("h2",{id:"birnn-deep"},"双向 RNN 与深层 RNN",-1)),l[44]||(l[44]=t("h3",null,"图形直觉：双向 = 前看 + 后看",-1)),l[45]||(l[45]=t("div",{class:"visual-hint"},[t("strong",null,'🎨 图形理解："同时读左右"'),n(`：想象你拿到一个填空题"我___在巴黎"——如果只能从左往右读（单向RNN），读到"在巴黎"时已经填完了，来不及修正；如果你能从右往左再读一遍，看到"在巴黎"后回推——"哦，应该是'长大'或'生活'"。双向RNN 就是`),t("strong",null,"同时从左到右和从右到左跑两个 RNN"),n("，然后把两个方向的隐藏状态拼接——h_t = [前向; 后向]，使每一步都同时拥有"),t("strong",null,"上文和下文"),n('信息。在命名实体识别（NER）中，判断"Washington"是人名还是地名时，需要同时看到前面的"President"和后面的"State"才能决定。 ')],-1)),o(r,{formula:"\\overrightarrow{h}_t = \\text{RNN}(x_t, \\overrightarrow{h}_{t-1}), \\quad \\overleftarrow{h}_t = \\text{RNN}(x_t, \\overleftarrow{h}_{t+1})"}),o(r,{formula:"h_t = [\\overrightarrow{h}_t; \\overleftarrow{h}_t]"}),l[46]||(l[46]=t("p",null,[n("注意：双向 RNN 只能用在"),t("strong",null,"能看到完整序列"),n('的场景（如文本分类），不适合实时生成（因为你不知道"未来"的 token）。')],-1)),l[47]||(l[47]=t("div",{class:"visual-hint"},[t("strong",null,"💡 双向RNN的适用场景"),n("："),t("strong",null,"能用"),n("——文本分类、命名实体识别、机器翻译的编码器（可以看完整个输入再编码）；"),t("strong",null,"不能用"),n("——语言模型（预测下一个词时不能看到未来）、实时语音识别（不能等整句话说完）。Transformer 的解决方案：用"),t("strong",null,"因果注意力掩码"),n("（Casual Mask）——允许看左边，遮住右边，在单向生成任务中替代双向机制。 ")],-1)),l[48]||(l[48]=t("h3",null,"深层 RNN",-1)),l[49]||(l[49]=t("div",{class:"visual-hint"},[t("strong",null,"🔍 为什么深层 RNN 很少超过 3 层？"),n("CNN 可以轻松堆 50-152 层，但 RNN 传统上不超过 3-4 层。原因：(1) RNN 已经在"),t("strong",null,"时间维度上很深"),n("了——处理 500 个词的句子，即使只有 1 层 RNN，展开后也是 500 步的计算图；(2) 每一层 RNN 的序列计算是"),t("strong",null,"串行"),n("的（必须先算完 t-1 才能算 t），多层 RNN 加剧了计算瓶颈；(3) 梯度在时间维和深度维上双重累积，极易消失。现代方案：用 Transformer（并行计算序列）彻底绕开了这个问题。 ")],-1)),o(u,{lang:"python",code:R})]),_:1}),o(s,{title:"Seq2Seq + Attention",icon:"🎯"},{default:i(()=>[l[50]||(l[50]=t("h2",{id:"seq2seq"},"序列到序列模型",-1)),l[51]||(l[51]=t("h3",null,"图形直觉：翻译官的两步工作",-1)),l[52]||(l[52]=t("p",null,[n("Seq2Seq 就像翻译官的工作流程："),t("strong",null,"编码器"),n('先完整听完一句话，浓缩成一个"意思向量"（上下文向量 c）；'),t("strong",null,"解码器"),n('再根据这个"意思"逐词输出翻译。')],-1)),l[53]||(l[53]=t("div",{class:"visual-hint"},[t("strong",null,'🎨 图形理解："翻译官的两步工作"'),n("：Seq2Seq 就像翻译官的工作——"),t("strong",null,"编码器"),n('先完整听完一句英语，在脑中浓缩成一个"意思摘要"（上下文向量 c）；'),t("strong",null,"解码器"),n("再从这个摘要逐词还原成中文。但问题来了：如果输入是 50 个词的英文句子，所有信息被死压到一个固定长度的向量 c 里（比如 256 维），必然丢失大量细节——就像你把一部小说的概要写在便利贴上，只够写核心剧情，细节全丢了。这就是 Seq2Seq 的"),t("strong",null,"信息瓶颈"),n("：编码器最后一步的隐藏状态承载了整句话的全部信息。 ")],-1)),l[54]||(l[54]=t("h3",null,'注意力机制：让解码器"回头看"',-1)),l[55]||(l[55]=t("div",{class:"visual-hint"},[t("strong",null,'🔍 注意力的直觉："选择性回顾"'),n("：注意力机制的核心思想——解码器在生成每个词时，不是只看一个压缩的 c，而是"),t("strong",null,'可以"扫描"所有编码器的隐藏状态，动态决定此刻最该关注输入序列的哪个位置'),n('。翻译"I love you"为"我爱你"时：生成"我"→注意力聚焦在"I"；生成"爱"→注意力移到"love"；生成"你"→注意力移到"you"。这种'),t("strong",null,"软对齐"),n('（soft alignment）是端到端学出来的——模型自己学会"翻译到哪就看到哪"。 ')],-1)),o(r,{formula:"e_{t,i} = \\text{score}(h_t^{\\text{dec}}, h_i^{\\text{enc}}), \\quad \\alpha_{t,i} = \\frac{\\exp(e_{t,i})}{\\sum_j\\exp(e_{t,j})}"}),o(r,{formula:"c_t = \\sum_i \\alpha_{t,i} h_i^{\\text{enc}}"}),l[56]||(l[56]=t("p",null,"α_{t,i} 就是注意力权重——解码器第 t 步对编码器第 i 个词的关注程度。所有 α 加起来等于 1（softmax 归一化）。",-1)),l[57]||(l[57]=t("h3",null,"打分函数",-1)),l[58]||(l[58]=t("ul",null,[t("li",null,[t("strong",null,"加性注意力（Bahdanau）"),n("：e = vᵀtanh(W₁h_dec + W₂h_enc)，参数多但灵活")]),t("li",null,[t("strong",null,"乘性注意力（Luong）"),n("：e = h_decᵀ W h_enc，计算更快")]),t("li",null,[t("strong",null,"点积注意力"),n("：e = h_decᵀ h_enc，最简单，Transformer 使用缩放点积")])],-1))]),_:1}),o(s,{title:"文本生成策略",icon:"✍️"},{default:i(()=>[l[59]||(l[59]=t("h2",{id:"text-generation"},"文本生成策略",-1)),l[60]||(l[60]=t("p",null,"吴恩达在 Sequence Models 课程中详细讲解了从语言模型生成文本的各种策略。",-1)),l[61]||(l[61]=t("h3",null,"图形直觉：厨师选食材",-1)),l[62]||(l[62]=t("div",{class:"visual-hint"},[t("strong",null,"🎨 图形理解"),n("：语言模型每一步输出的是所有词的概率分布（比如词表 50000 个词，每个有一个概率）。不同生成策略就是"),t("strong",null,'不同的"选词"方式'),n('——贪心搜索每次挑最贵的食材（最高概率词），但可能做成一道"平淡但安全"的菜；束搜索保留多条候选菜谱，挑整体最美味的那条；温度/Top-k/Top-p 则是在安全与创意之间找平衡——太安全则无聊（"今天天气很好"），太随机则混乱（"天气狗粮香蕉好"）。 ')],-1)),l[63]||(l[63]=t("p",null,[t("strong",null,"贪心搜索（Greedy）"),n("：每步选概率最高的词。问题：局部最优 ≠ 全局最优，可能错过更好的句子。")],-1)),l[64]||(l[64]=t("div",{class:"visual-hint"},[t("strong",null,"🔍 贪心 vs 束搜索的直觉"),n('：贪心搜索像"只看下一步的象棋选手"——可能走出一步看起来最优但锁死了后续好棋的坏棋。束搜索（B=5）像"同时推演 5 种下法，每步剪掉不好的分支"。但吴恩达提醒：'),t("strong",null,"B 不是越大越好"),n('——B 过大（如 B=50）时，模型倾向于选择"安全但平淡"的候选（所有候选都浓缩到高概率词上），生成的文本缺乏多样性。B=3~5 通常是最佳平衡。 ')],-1)),l[65]||(l[65]=t("p",null,[t("strong",null,"温度采样（Temperature）"),n('：调整概率分布的"尖锐程度"：')],-1)),o(r,{formula:"P(w_i) = \\frac{\\exp(\\logit_i / T)}{\\sum_j \\exp(\\logit_j / T)}"}),l[66]||(l[66]=t("ul",null,[t("li",null,"T → 0：分布变得极其尖锐，接近贪心搜索（确定性输出）"),t("li",null,"T = 1：原始概率分布"),t("li",null,"T → ∞：分布变得均匀，随机选择（混乱输出）")],-1)),l[67]||(l[67]=t("p",null,[t("strong",null,"Top-k 采样"),n("：只在概率最高的 k 个词中采样，其余词概率设为零。k=50 是常用值。")],-1)),l[68]||(l[68]=t("div",{class:"visual-hint"},[t("strong",null,"🔍 Top-k vs Top-p 的互补"),n("：Top-k 的问题是"),t("strong",null,"固定的 k 不适应变化的概率分布"),n('——如果模型很确定（"The capital of France is ___"有 95% 在"Paris"上），Top-k=50 会包括很多极低概率的垃圾词；如果模型很不确定（"I feel ___ today"的概率分散在成百上千个词上），Top-k=50 可能只覆盖了 40% 的概率质量。Top-p（核采样）解决了这个问题——'),t("strong",null,"动态调整候选集大小"),n("，确定性高时自动缩小（可能只选 2-3 个词），不确定性高时自动扩大（可能选 100+ 个词）。实践中 Top-p=0.9 配合温度 T=0.8 是最常用的组合。 ")],-1)),o(u,{lang:"python",code:k})]),_:1}),o(s,{title:"词嵌入",icon:"💬"},{default:i(()=>[l[69]||(l[69]=t("h2",{id:"word-embedding"},"词嵌入（Word Embedding）",-1)),l[70]||(l[70]=t("p",null,"吴恩达在 Sequence Models 课程的第一周就介绍了词嵌入，它是处理文本的基础。",-1)),l[71]||(l[71]=t("h3",null,"图形直觉：语义地图",-1)),l[72]||(l[72]=t("div",{class:"visual-hint"},[t("strong",null,'🎨 图形理解："词语的GPS坐标"'),n('：传统的 one-hot 编码把每个词表示成一个 V 维向量（V=词汇量，如 50000），只有一个位置是 1，其余全是 0——"苹果"和"香蕉"在空间中的距离跟"苹果"和"量子力学"一样远！词嵌入的洞见：'),t("strong",null,"把词映射到稠密的低维空间（如 300 维），让语义相近的词在空间中距离近"),n('——"国王"靠近"女王"，"苹果"靠近"香蕉"，"跑步"靠近"走路"。更重要的是，嵌入空间的方向有意义——"国王 - 男人 + 女人 ≈ 女王"，说明学到了性别维度；"巴黎 - 法国 + 意大利 ≈ 罗马"，说明学到了首都-国家关系。'),t("strong",null,"这些关系是模型从未被显式教过的——是数据中自然涌现的规律。")],-1)),l[73]||(l[73]=t("p",null,[t("strong",null,"经典例子：向量运算")],-1)),o(r,{formula:"\\vec{King} - \\vec{Man} + \\vec{Woman} \\approx \\vec{Queen}"}),l[74]||(l[74]=t("p",null,'直觉：从"国王"减去"男性"特征，加上"女性"特征，得到"女王"——这说明嵌入空间学到了性别维度的语义。',-1)),l[75]||(l[75]=t("h3",null,"学习词嵌入",-1)),l[76]||(l[76]=t("div",{class:"visual-hint"},[t("strong",null,"🔍 Word2Vec vs GloVe 的直觉"),n("："),t("strong",null,"Word2Vec"),n('（Mikolov et al., 2013）基于分布式假设——"一个词的含义由它的上下文决定"。Skip-gram 像玩"猜邻居"游戏：给定中心词"苹果"，猜周围的词（"吃""红色""水果"），学到的嵌入能捕捉语义关系。CBOW 反过来——给定周围的词预测中心词。'),t("strong",null,"GloVe"),n("（Pennington et al., 2014）利用了全局"),t("strong",null,"共现统计"),n('——"苹果"和"水果"在整个语料库中共同出现的次数远多于"苹果"和"火箭"，这种全局信息是 Word2Vec 的局部窗口方法难以捕捉的。实践中两者效果接近，GloVe 对大语料更稳定。 ')],-1)),o(r,{formula:"J = \\sum_{i,j=1}^{V} f(X_{ij})(w_i^T \\tilde{w}_j + b_i + \\tilde{b}_j - \\log X_{ij})^2"}),l[77]||(l[77]=t("h3",null,"处理未知词",-1)),l[78]||(l[78]=t("p",null,[n("吴恩达建议使用"),t("strong",null,"子词嵌入"),n("（如 BPE、WordPiece）来处理 OOV（Out-of-Vocabulary）问题——把未见过的词拆分成已知的子词单元。")],-1))]),_:1}),o(e,{paper:{title:"Long Short-Term Memory",authors:"Hochreiter, S. & Schmidhuber, J.",venue:"Neural Computation",year:"1997",url:"https://www.bioinf.jku.at/publications/older/2604.pdf"}}),o(e,{paper:{title:"Attention Is All You Need",authors:"Vaswani, A., Shazeer, N., Parmar, N., et al.",venue:"NeurIPS",year:"2017",url:"https://arxiv.org/abs/1706.03762"}}),o(e,{paper:{title:"Neural Machine Translation by Jointly Learning to Align and Translate",authors:"Bahdanau, D., Cho, K. & Bengio, Y.",venue:"ICLR",year:"2015",url:"https://arxiv.org/abs/1409.0473"}}),o(v,null,{default:i(()=>[...l[79]||(l[79]=[t("h3",null,"序列任务的评估指标",-1),t("ul",null,[t("li",null,[t("strong",null,"BLEU"),n("：机器翻译常用，基于 n-gram 精度，范围 0-1（越高越好）。注意 BLEU 只看精确匹配，不考虑语义等价")]),t("li",null,[t("strong",null,"ROUGE"),n("：文本摘要常用，基于召回率，变体包括 ROUGE-1/2/L")]),t("li",null,[t("strong",null,"Perplexity（困惑度）"),n('：语言模型的核心指标，越低越好。直觉：模型平均在每个词上有多少个"等可能的选择"')]),t("li",null,[t("strong",null,"引用规范"),n("：报告指标时需说明使用哪个变体和工具包，不同实现可能有微小差异")])],-1)])]),_:1})]))}},C=m(S,[["__scopeId","data-v-bfc9229e"]]);export{C as default};
