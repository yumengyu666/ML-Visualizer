import{_ as S,u as A,o as C,c as g,d as s,a as l,w as r,F as T,r as _,e as t,p,g as m,t as e}from"./index-CbXlNRuf.js";import{K as o,F as i,C as u,e as f,W as b,a as L,P as v}from"./configs-y3mOB0wl.js";const P={class:"practice-page module-content"},M={class:"flow-steps"},k={class:"step-num"},I={class:"step-info"},F=`import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import StratifiedKFold

# 数据质量检查
def check_data_quality(df):
    print(f"缺失值:\\n{df.isnull().sum()}")
    print(f"\\n重复行: {df.duplicated().sum()}")
    print(f"\\n类别分布:\\n{df['label'].value_counts(normalize=True)}")
    print(f"\\n异常值 (Z-score > 3):")
    for col in df.select_dtypes(include=np.number).columns:
        z = np.abs((df[col] - df[col].mean()) / df[col].std())
        print(f"  {col}: {(z > 3).sum()} 个异常值")

# 特征工程
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)  # 只在训练集上 fit！

# 类别编码
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y_train)

# 分层 K 折交叉验证（保持每折类别比例一致）
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for fold, (train_idx, val_idx) in enumerate(skf.split(X, y)):
    X_tr, X_val = X[train_idx], X[val_idx]
    y_tr, y_val = y[train_idx], y[val_idx]`,B=`from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import uniform, randint
import optuna  # 贝叶斯优化框架

# 随机搜索
param_distributions = {
    'n_estimators': randint(100, 500),
    'max_depth': randint(3, 20),
    'learning_rate': uniform(0.01, 0.3),
}
search = RandomizedSearchCV(
    estimator=model, param_distributions=param_distributions,
    n_iter=50, cv=5, scoring='accuracy', random_state=42
)
search.fit(X_train, y_train)

# Optuna 贝叶斯优化
def objective(trial):
    lr = trial.suggest_float('lr', 1e-5, 1e-1, log=True)
    hidden = trial.suggest_int('hidden', 64, 512)
    dropout = trial.suggest_float('dropout', 0.1, 0.5)
    model = build_model(lr=lr, hidden=hidden, dropout=dropout)
    val_loss = train_and_evaluate(model)
    return val_loss

study = optuna.create_study(direction='minimize')
study.optimize(objective, n_trials=100)
print(f"最佳参数: {study.best_params}")`,N=`import torch
from captum.attr import GradCAM, IntegratedGradients, ShapleyValueSampling

# Grad-CAM 可视化
grad_cam = GradCAM(model, target_layer=model.layer4[-1])
attributions = grad_cam.compute_attr(input_image, target_class)

# Integrated Gradients（比 Grad-CAM 更精确）
ig = IntegratedGradients(model)
attr_ig = ig.attribute(input_image, target=target_class, n_steps=50)

# SHAP 值计算
shap = ShapleyValueSampling(model)
shap_values = shap.attribute(input_image, target=target_class)

# Transformer 注意力可视化
with torch.no_grad():
    outputs = model(input_ids, output_attentions=True)
    attentions = outputs.attentions  # [layer, batch, head, seq, seq]
    # 可视化最后一层的第一个头
    attn_map = attentions[-1][0, 0].cpu().numpy()`,X=`import torch

# 模型量化（PyTorch 内置）
quantized_model = torch.quantization.quantize_dynamic(
    model, {torch.nn.Linear}, dtype=torch.qint8
)

# 导出 ONNX 格式
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(model, dummy_input, "model.onnx",
                   opset_version=13, dynamic_axes={'input': {0: 'batch'}})

# ONNX Runtime 推理
import onnxruntime as ort
session = ort.InferenceSession("model.onnx")
outputs = session.run(None, {"input": input_numpy})

# 知识蒸馏
class DistillationLoss(nn.Module):
    def __init__(self, temperature=4.0, alpha=0.7):
        super().__init__()
        self.T = temperature
        self.alpha = alpha

    def forward(self, student_logits, teacher_logits, labels):
        soft_loss = F.kl_div(
            F.log_softmax(student_logits / self.T, dim=-1),
            F.softmax(teacher_logits / self.T, dim=-1),
            reduction='batchmean') * (self.T ** 2)
        hard_loss = F.cross_entropy(student_logits, labels)
        return self.alpha * soft_loss + (1 - self.alpha) * hard_loss`,G=`import wandb  # Weights & Biases 实验跟踪

# 初始化实验
wandb.init(project="my-project", config={
    "learning_rate": 0.001,
    "epochs": 100,
    "batch_size": 32,
})

# 训练循环中记录指标
for epoch in range(num_epochs):
    train_loss = train_one_epoch()
    val_loss, val_acc = evaluate()
    wandb.log({
        "train_loss": train_loss,
        "val_loss": val_loss,
        "val_accuracy": val_acc,
        "epoch": epoch,
    })

wandb.finish()

# 数据漂移监控（简单实现）
def check_data_drift(X_train, X_live, threshold=0.1):
    from scipy.stats import ks_2samp
    drift_detected = False
    for col in range(X_train.shape[1]):
        stat, p_value = ks_2samp(X_train[:, col], X_live[:, col])
        if p_value < 0.05:
            print(f"特征 {col} 发生漂移! p={p_value:.4f}")
            drift_detected = True
    return drift_detected`,h={__name:"Practice",setup(w){const y=A();C(()=>y.markVisited("practice"));const x=[{name:"定义问题",desc:'明确目标、成功标准、约束条件。吴恩达：先确定"什么算好"，再决定"怎么做"'},{name:"数据收集",desc:"确定数据来源，采集或爬取原始数据，检查数据质量"},{name:"数据预处理",desc:"清洗、特征工程、数据增强、数据划分"},{name:"建模训练",desc:"选择模型架构，设置超参数，训练并监控"},{name:"误差分析",desc:"系统化分析错误模式，决定下一步改进方向"},{name:"部署监控",desc:"模型压缩、服务化部署、A/B测试、持续监控数据漂移"}];return(z,n)=>(m(),g("div",P,[s(L),n[61]||(n[61]=l("h1",null,"🛠️ 实践与工程",-1)),n[62]||(n[62]=l("p",{class:"module-intro"},"从理论到实践，掌握机器学习项目的完整工作流",-1)),s(o,{title:"完整项目流程",icon:"📋"},{default:r(()=>[n[0]||(n[0]=l("h2",{id:"project-flow"},"项目工作流",-1)),n[1]||(n[1]=l("p",null,'吴恩达在"Structuring ML Projects"课程中强调：机器学习项目不是"训练模型就完了"，而是一个迭代优化的闭环。80% 的时间花在数据和问题上，不是模型上。',-1)),l("div",M,[(m(),g(T,null,_(x,(a,d)=>l("div",{key:d,class:"flow-step"},[l("span",k,e(d+1),1),l("div",I,[l("h4",null,e(a.name),1),l("p",null,e(a.desc),1)])])),64))]),n[2]||(n[2]=l("h3",null,"图形直觉：迭代飞轮",-1)),n[3]||(n[3]=l("div",{class:"visual-hint"},[l("strong",null,'🎨 图形理解："迭代飞轮"'),t("：吴恩达在 Structuring ML Projects 中反复强调——机器学习项目"),l("strong",null,"不是线性流水线，而是不断循环的飞轮"),t("。定义问题→收集数据→训练模型→误差分析→发现数据问题→收集更好的数据→重新训练。每一轮迭代都在缩小性能瓶颈。关键是："),l("strong",null,"80% 的时间花在数据上，不是模型"),t("——一个普通的 ResNet-50 配好数据，胜过最先进的架构配脏数据。确认偏差是最大的敌人：训练效果好≠实际效果好——必须用完全独立的测试集验证。 ")],-1)),n[4]||(n[4]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 正交化原则（Orthogonalization）"),t("：吴恩达的核心工程哲学——"),l("strong",null,"每次只修一个问题"),t("。如果你同时调学习率、加数据、改模型架构，效果变好了——但你不知道是哪个操作起了作用。好的 ML 工程像汽车设计：加速踏板只控制速度，方向盘只控制方向——互不干扰。在 ML 中：(1) 训练集表现不好→调模型/优化器；(2) 验证集表现不好→正则化/更多数据；(3) 测试集表现不好→更大的验证集；(4) 线上表现不好→改验证集分布或损失函数。"),l("strong",null,'每个问题对应一个独立的"旋钮"'),t("，不要一个旋钮影响多个环节。 ")],-1)),n[5]||(n[5]=l("div",{class:"visual-hint"},[l("strong",null,"💡 单一数字评估指标"),t('：不要用"精度提高了 0.5% 但召回率降了 1.2%"这种模糊描述。定义'),l("strong",null,"一个唯一数字"),t('来评判模型好坏——F1-score（查准率+查全率的调和平均）、或自定义加权指标。有了单一数字，你才能客观比较"调了 5 个超参的实验 vs 换了优化器的实验"哪个更好。没有单一指标，你就靠"感觉"做决策——这在 ML 工程中是灾难。 ')],-1))]),_:1}),s(o,{title:"数据工程",icon:"🗃️"},{default:r(()=>[n[6]||(n[6]=l("h2",{id:"data-engineering"},"数据工程",-1)),n[7]||(n[7]=l("p",null,'吴恩达提出"以数据为中心的 AI"（Data-Centric AI）——与其花时间调模型，不如花时间改善数据质量。',-1)),n[8]||(n[8]=l("div",{class:"visual-hint"},[l("strong",null,'🎨 图形理解："厨师与食材"'),t('：再好的厨师（模型），用烂食材（脏数据）也做不出好菜。吴恩达近年力推"以数据为中心的 AI"（Data-Centric AI）——与其花数周微调模型架构，不如花同时间改善数据质量。数据工程的三板斧：(1) '),l("strong",null,"清洗"),t("——去除重复、修正错误标签、处理缺失值；(2) "),l("strong",null,"增强"),t("——翻转/裁剪/噪声注入扩充数据；(3) "),l("strong",null,"特征工程"),t("——归一化、编码、时间特征提取，让数据更适合模型消化。关键教训："),l("strong",null,'模型架构是"通用"的（ResNet 到处用），数据才是你项目特有的"护城河"'),t("。 ")],-1)),n[9]||(n[9]=l("h3",null,"数据质量检查清单",-1)),n[10]||(n[10]=l("ul",null,[l("li",null,[l("strong",null,"标签一致性"),t("：同一个样本，不同标注者给的标签一致吗？")]),l("li",null,[l("strong",null,"数据分布"),t("：训练集和线上数据的分布是否一致？")]),l("li",null,[l("strong",null,"类别平衡"),t("：各类别样本数量是否严重不均？")]),l("li",null,[l("strong",null,"噪声与异常"),t("：是否有标注错误、格式异常的样本？")])],-1)),n[11]||(n[11]=l("h3",null,"特征工程实践",-1)),n[12]||(n[12]=l("p",null,'周志华在西瓜书中强调，特征工程是"决定性"的环节：',-1)),n[13]||(n[13]=l("ul",null,[l("li",null,[l("strong",null,"数值型特征"),t("：归一化（Min-Max）、标准化（Z-score）、对数变换（处理长尾分布）")]),l("li",null,[l("strong",null,"类别型特征"),t("：独热编码、标签编码、目标编码（Target Encoding）")]),l("li",null,[l("strong",null,"时间型特征"),t("：提取年/月/日/星期/小时、周期编码、时间差")]),l("li",null,[l("strong",null,"文本型特征"),t("：TF-IDF、词嵌入均值、预训练模型特征提取")])],-1)),n[14]||(n[14]=l("h3",null,"误差分析：发现瓶颈",-1)),n[15]||(n[15]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 吴恩达的误差分析流程"),t('：不要凭直觉猜"哪出了问题"，要'),l("strong",null,"数数"),t('。从验证集中随机取 100 个错误样本，逐个分析错误原因并归类——"20 个是标签错误，35 个是背景混淆，15 个是遮挡，30 个是其他"。这直接告诉你：'),l("strong",null,"修正标签能提升 20%，改进数据增强能提升 35%，修复遮挡问题能提升 15%"),t('。没有这个分析，你可能花三周调优化器——只影响了"其他"那 30%。误差分析决定了你的'),l("strong",null,"改进优先级"),t('——这是区分"会调参"和"会做 ML 项目"的分水岭。 ')],-1)),n[16]||(n[16]=l("h3",null,"类别不平衡处理",-1)),n[17]||(n[17]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 少数类不是噪声，是信号"),t("：欺诈检测中正样本可能只有 0.1%，但它们是整个系统的价值所在。处理策略：(1) "),l("strong",null,"重采样"),t("——过采样少数类（SMOTE 合成新样本）或欠采样多数类——但 SMOTE 可能引入噪声，欠采样可能丢失信息；(2) "),l("strong",null,"加权损失"),t('——给少数类样本更大的损失权重（class_weight），让模型"更在乎"少类样本；(3) '),l("strong",null,"阈值调整"),t("——不改变训练，只在推理时调整分类阈值——0.1% 的欺诈率意味着按 0.5 阈值几乎所有样本都是负类，降低阈值到 0.01 才能找出欺诈。 ")],-1)),s(i,{formula:"\\text{CV Score} = \\frac{1}{K}\\sum_{k=1}^{K}\\text{Score}(M_{-k}, D_k)"}),s(u,{lang:"python",code:F})]),_:1}),s(o,{title:"超参数调优",icon:"🎛️",experiment:p(f)["hyperparameter-search"]},{default:r(()=>[n[18]||(n[18]=l("h2",{id:"hyperparameter"},"超参数调优策略",-1)),n[19]||(n[19]=l("h3",null,"图形直觉：地图探索",-1)),n[20]||(n[20]=l("p",null,"想象你在雾天探索一片未知的山地寻找最高峰（最优超参数）：",-1)),n[21]||(n[21]=l("div",{class:"visual-hint"},[l("strong",null,'🎨 图形理解："雾中山地探险"'),t("：在浓雾中寻找山峰——这就是超参数搜索。三种搜索策略：(1) "),l("strong",null,"网格搜索"),t("像把山地画成均匀格点，每个交叉点都踩一遍——全面但愚蠢（如果一个参数不重要，它的 5 个候选值每个都浪费了计算）；(2) "),l("strong",null,"随机搜索"),t("像在地图上随机撒点——同等预算下，每个参数能尝试更多不同的值，找到高海拔区域的概率更大；(3) "),l("strong",null,"贝叶斯优化"),t('像根据已探索点推测"山形"——用高斯过程建模目标函数曲面，每次选最有可能是新高点的位置。但吴恩达提醒：'),l("strong",null,"不是所有超参同等重要"),t("——学习率最重要，其次是动量/β、batch size、隐藏层数，然后是学习率衰减、层大小。 ")],-1)),n[22]||(n[22]=l("p",null,[l("strong",null,"网格搜索（Grid Search）"),t("：穷举所有参数组合，简单但计算代价高。在超参数重要性不均匀时效率低。")],-1)),n[23]||(n[23]=l("p",null,[l("strong",null,"随机搜索（Random Search）"),t("：随机采样参数组合。Bergstra & Bengio (2012) 证明：在相同预算下随机搜索通常优于网格搜索，因为重要超参数只需少数几个好值就能大幅提升。")],-1)),n[24]||(n[24]=l("p",null,[l("strong",null,"贝叶斯优化"),t("：建立目标函数的概率代理模型（高斯过程），用采集函数（EI/UCB）选择下一个评估点。")],-1)),s(i,{formula:"\\alpha_{\\text{EI}}(x) = \\mathbb{E}[\\max(f(x) - f(x^+), 0)]"}),n[25]||(n[25]=l("p",null,'直觉：在"可能更好"和"尚未探索"之间权衡。',-1)),n[26]||(n[26]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 粗调→精调策略"),t("：吴恩达建议两阶段搜索——"),l("strong",null,"粗调"),t('：大范围随机搜索，快速找到"好的区域"（如学习率在 1e-5 到 1 之间搜索，batch size 在 16-512 之间）；'),l("strong",null,"精调"),t("：在粗调找到的最佳区域附近，缩小搜索范围做密集搜索。这样既覆盖了全局，又不会在差区域浪费计算。贝叶斯优化的优势就体现在这里——它自动完成粗调→精调的过渡。 ")],-1)),n[27]||(n[27]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 为什么学习率用对数尺度？"),t("：学习率 0.001 和 0.002 对训练的影响差别不大，但 0.001 和 0.01 就天差地别。在学习率的整个范围（1e-5 到 1）上均匀采样是浪费——因为你可能只采到 0.1、0.2、0.3 这三个差不多的值。对"),l("strong",null,"数尺度采样"),t('（10^uniform(log10(min), log10(max))）确保在每个数量级上都均匀分布。适用于所有"乘法敏感"的超参：学习率、正则化系数、batch size。 ')],-1)),n[28]||(n[28]=l("div",{class:"visual-hint"},[l("strong",null,"💡 学习率查找器（LR Finder）"),t("：Leslie Smith 提出的实用技巧——从一个极小的学习率（如 1e-7）开始训练，每个 batch 线性增大学习率。绘制 loss 随 LR 变化的曲线：loss 缓慢下降→快速下降→开始震荡或上升。最佳学习率选在 "),l("strong",null,"loss 下降最快但还没震荡的点"),t('（通常是 loss 最低点对应 LR 的 1/10）。直觉：找到"梯度下降的最快安全速度"——再快就翻车了。 ')],-1)),s(u,{lang:"python",code:B})]),_:1},8,["experiment"]),s(o,{title:"模型可解释性",icon:"🔍"},{default:r(()=>[n[29]||(n[29]=l("h2",{id:"interpretability"},"可解释性方法",-1)),n[30]||(n[30]=l("div",{class:"visual-hint"},[l("strong",null,'🎨 图形理解："给黑箱拍 X 光"'),t("：深度学习模型像一个黑箱——这张图你说是猫，为什么？可解释性三种思路：(1) "),l("strong",null,"Grad-CAM"),t('——对模型输出做反向传播，看输入图像的哪些区域贡献了最大的梯度（模型最"关注"的区域），画成热力图叠加在原图上。结果是猫脸区域红彤彤——说明模型在看猫脸。(2) '),l("strong",null,"SHAP"),t('——基于博弈论的 Shapley 值：把每个特征看作团队合作的成员，计算"这个特征加入后预测结果改变了多少"，公平分配"功劳"。SHAP 可解释单个预测（为什么这个样本被判定为高风险），而 Grad-CAM 解释模型整体在关注什么。(3) '),l("strong",null,"LIME"),t("——既然全局太复杂，就在预测点附近用简单的线性模型近似黑箱行为。 ")],-1)),n[31]||(n[31]=l("p",null,[l("strong",null,"Grad-CAM"),t('：利用梯度信息生成类激活热力图，可视化模型关注的图像区域。直觉：让模型"指出来它觉得图片的哪部分最重要"。')],-1)),n[32]||(n[32]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 Grad-CAM 的数学直觉"),t("：对最后一层卷积特征图的每个通道 k 计算"),l("strong",null,"重要性权重"),t(' α_k = 全局平均池化(∂y/∂A_k)——它衡量"这个通道对最终预测的猫类别的贡献有多大"。然后对所有通道的特征图做加权求和：热力图 = ReLU(Σ α_k·A_k)。ReLU 确保只显示正向贡献（让模型"更确信是猫"的区域）。不用全连接层的梯度因为那是"全局判断"，卷积层保留了空间结构——你知道猫的脸在哪。 ')],-1)),n[33]||(n[33]=l("p",null,[l("strong",null,"SHAP"),t('：基于博弈论 Shapley 值，为每个特征分配贡献值。直觉：把模型预测看作团队合作的成果，每个特征应该分到多少"功劳"。')],-1)),n[34]||(n[34]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 SHAP 的博弈论直觉"),t("：想象一个合作游戏——员工 A、B、C 一起完成项目，创造了 100 万的利润。A 的 Shapley 值 = A 加入各种子团队后带来的"),l("strong",null,"边际贡献的平均值"),t('：空→A（A 单独能创造多少）vs B→AB（A 加入已有 B 的团队后增加的利润）vs C→AC（A 加入 C 后增加的）vs BC→ABC（A 加入 BC 后增加的）。SHAP 把这个思想搬到特征上——"年龄=35"这个特征值，在所有可能的特征组合下，对预测结果的平均边际贡献就是它的 SHAP 值。优势是理论上公平（满足四个公理），代价是计算极其昂贵（组合爆炸）。 ')],-1)),n[35]||(n[35]=l("div",{class:"visual-hint"},[l("strong",null,"💡 可解释性选型"),t("："),l("strong",null,"图像"),t("→ Grad-CAM（直观，哪里红就是模型看哪）；"),l("strong",null,"表格数据"),t("→ SHAP（每个特征贡献清晰，满足博弈论公理）；"),l("strong",null,"需要快速调试"),t("→ LIME（局部近似，快但不全局一致）；"),l("strong",null,"Transformer"),t("→ 注意力可视化（天然内置，但注意力权重≠特征重要性——有争议）。 ")],-1)),s(i,{formula:"\\phi_i = \\sum_{S \\subseteq F \\setminus \\{i\\}} \\frac{|S|!(|F|-|S|-1)!}{|F|!}[f(S \\cup \\{i\\}) - f(S)]"}),n[36]||(n[36]=l("p",null,[l("strong",null,"LIME"),t("：在预测点附近用简单模型（线性模型）近似复杂模型的行为。直觉：全局太复杂无法理解，但局部可以简化。")],-1)),n[37]||(n[37]=l("p",null,[l("strong",null,"注意力可视化"),t("：在 Transformer 模型中，注意力权重本身就是一种可解释性——哪些 token 对当前预测影响最大。")],-1)),s(u,{lang:"python",code:N})]),_:1}),s(o,{title:"模型压缩与部署",icon:"📦",experiment:p(f)["model-compression"]},{default:r(()=>[n[38]||(n[38]=l("h2",{id:"deployment"},"模型压缩与部署",-1)),n[39]||(n[39]=l("div",{class:"visual-hint"},[l("strong",null,'🎨 图形理解："大行李精简术"'),t("：训练好的大模型像出国搬家的大行李箱——什么都有但根本带不动。模型压缩三大手段：(1) "),l("strong",null,"剪枝"),t('——神经元像公司员工，10-20% 的"明星员工"做了 80% 的工作，剩下 80% 的神经元权重接近零可以安全裁掉。彩票假说（Frankle & Carbin, 2019）证明：随机初始化的网络中隐藏着一个极小的"中奖子网络"，单独训练也能达到全网络性能。(2) '),l("strong",null,"量化"),t("——FP32（32 位浮点）→ INT8（8 位整数），参数精度降 4 倍、模型体积降 4 倍、推理显著加速，精度损失通常很小（1-2%）。本质是模型权重不需要小数点后那么多位。(3) "),l("strong",null,"蒸馏"),t('——大模型（教师）教小模型（学生）——学生不仅学标准答案（猫），还学教师的"思考过程"（猫 0.7、虎 0.2、豹 0.1），暗知识包含类别间关系，比硬标签丰富得多。 ')],-1)),n[40]||(n[40]=l("h3",null,"模型压缩三大技术",-1)),n[41]||(n[41]=l("p",null,[l("strong",null,"剪枝（Pruning）"),t('：移除不重要的权重或神经元。彩票假说（Lottery Ticket Hypothesis）发现：网络中存在稀疏的"中奖子网络"，只用 10-20% 的参数就能达到接近原始性能。')],-1)),n[42]||(n[42]=l("p",null,[l("strong",null,"量化（Quantization）"),t("：降低参数精度。FP32 → INT8 可以减少 4 倍存储和计算量，精度损失通常很小。更激进的有 INT4 量化和二值网络。")],-1)),n[43]||(n[43]=l("p",null,[l("strong",null,"知识蒸馏（Knowledge Distillation）"),t('：大模型（教师）教小模型（学生）。关键：学生不只学"硬标签"（猫/狗），还学教师的"软标签"（概率分布：猫 0.7, 狗 0.2, 老虎 0.1）——这些"暗知识"包含了类别间的相似性信息。')],-1)),s(i,{formula:"\\mathcal{L} = \\alpha \\cdot T^2 \\cdot D_{\\text{KL}}(\\sigma(z_s/T) \\| \\sigma(z_t/T)) + (1-\\alpha) \\cdot \\mathcal{L}_{\\text{CE}}(y, \\hat{y}_s)"}),n[44]||(n[44]=l("p",null,'T 是温度参数，T 越大概率分布越"软"（更均匀），暗知识越明显。',-1)),n[45]||(n[45]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 剪枝的类型"),t("："),l("strong",null,"非结构化剪枝"),t("——逐个权重独立判断，达到 90% 稀疏但权重矩阵不规则，实际加速依赖稀疏矩阵硬件支持；"),l("strong",null,"结构化剪枝"),t("——整行/整列/整通道删除，虽然压缩率低些（70-80%），但直接减少矩阵维度，在普通 GPU 上就能加速。"),l("strong",null,"迭代剪枝"),t('——剪→微调→再剪→再微调，比一次性剪掉 90% 效果好得多（给网络时间"适应"）。 ')],-1)),n[46]||(n[46]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 量化的精度层级"),t("："),l("strong",null,"动态量化"),t("——只量化权重，激活值保持 FP32，推理时才转为 INT8 计算（PyTorch 的 quantize_dynamic 方法，最简单）；"),l("strong",null,"静态量化"),t("——权重+激活都量化，但需要校准数据来确定激活值的量化范围，精度更高但流程复杂；"),l("strong",null,"量化感知训练（QAT）"),t("——训练时就模拟量化误差，模型学会补偿，精度损失几乎为零。层次：动态 < 静态 < QAT（精度保留程度递增，复杂度也递增）。 ")],-1)),n[47]||(n[47]=l("div",{class:"visual-hint"},[l("strong",null,"💡 蒸馏的温度直觉"),t('：T=1 时软标签和原始 softmax 一样——猫 0.999，狗 0.001——几乎没有"暗知识"。T=10 时——猫 0.7，虎 0.15，豹 0.1，狗 0.05——类别间相似性（猫和虎更像）浮现了。这就是教师模型要教给学生的——不是简单的"这是猫"，而是"这更像猫、有点像虎、绝对不是狗"。损失函数中的 T² 因子是为了'),l("strong",null,"梯度缩放"),t("——T 增大后梯度会等比例缩小，乘 T² 补回来。 ")],-1)),n[48]||(n[48]=l("h3",null,"部署方案",-1)),n[49]||(n[49]=l("ul",null,[l("li",null,[l("strong",null,"ONNX Runtime"),t("：跨平台推理引擎，支持 CPU/GPU/移动端")]),l("li",null,[l("strong",null,"TensorRT"),t("：NVIDIA 专用，极致优化 GPU 推理速度")]),l("li",null,[l("strong",null,"TFLite"),t("：移动端部署，支持 Android/iOS")]),l("li",null,[l("strong",null,"vLLM / TGI"),t("：大语言模型专用推理框架，支持连续批处理和 KV Cache 优化")])],-1)),s(u,{lang:"python",code:X})]),_:1},8,["experiment"]),s(o,{title:"MLOps 与持续监控",icon:"📡"},{default:r(()=>[n[50]||(n[50]=l("h2",{id:"mlops"},"MLOps 与持续监控",-1)),n[51]||(n[51]=l("div",{class:"visual-hint"},[l("strong",null,'🎨 图形理解："买车容易养车难"'),t("：部署模型只是开始，上线后的"),l("strong",null,"持续运维"),t("才是真正的挑战——就像买车之后的保养和加油。三大核心问题：(1) "),l("strong",null,"数据漂移"),t("——训练时用的夏天数据，冬天上线后数据分布变了（用户行为、光照、场景），模型性能无声退化。需要持续监控输入特征的统计分布（PSI/KS 检验）。(2) "),l("strong",null,"实验管理"),t("——训练 50 次实验，哪个超参组合最优？忘记了就白费——用 W&B/MLflow 自动记录所有超参、指标、模型检查点，可追溯可复现。(3) "),l("strong",null,"A/B 测试"),t("——新模型上线不能一把梭，先用 5% 流量对比旧模型，确认指标提升再全量。过拟合在离线评估中看不出来，但线上真实数据会暴露一切。 ")],-1)),n[52]||(n[52]=l("h3",null,"数据漂移检测",-1)),n[53]||(n[53]=l("p",null,'图形直觉：训练时的数据和线上的数据分布逐渐偏移——就像模型是在"夏天的数据"上训练的，但"冬天"的数据分布不同了。需要监控输入特征的分布变化。',-1)),s(i,{formula:"D_{\\text{KL}}(P_{\\text{train}} \\| P_{\\text{live}}) = \\sum_x P_{\\text{train}}(x) \\log \\frac{P_{\\text{train}}(x)}{P_{\\text{live}}(x)}"}),n[54]||(n[54]=l("p",null,"常用方法：PSI（Population Stability Index）、KS 检验、AD 距离",-1)),n[55]||(n[55]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 数据漂移 vs 概念漂移"),t("："),l("strong",null,"数据漂移（Covariate Shift）"),t("——输入 X 的分布变了（用户年龄结构变了），但 P(Y|X) 不变（给定年龄的购买概率没变）；"),l("strong",null,"概念漂移（Concept Drift）"),t("——P(Y|X) 变了（同样的用户行为，购买意愿变了，比如经济衰退期）。数据漂移可以通过监控特征分布检测，概念漂移必须通过监控"),l("strong",null,"模型预测准确率"),t('来检测——但你不知道真实标签！通常用"预测结果与最终业务指标的偏离"来间接判断。 ')],-1)),n[56]||(n[56]=l("h3",null,"实验管理",-1)),n[57]||(n[57]=l("ul",null,[l("li",null,[l("strong",null,"版本控制"),t("：代码（Git）、数据（DVC）、模型（MLflow）——三位一体缺一不可")]),l("li",null,[l("strong",null,"实验跟踪"),t("：Weights & Biases / MLflow 记录超参数、指标、模型检查点")]),l("li",null,[l("strong",null,"CI/CD"),t("：自动训练、评估、部署流水线")]),l("li",null,[l("strong",null,"A/B 测试"),t("：新旧模型线上对比，用真实流量验证")])],-1)),n[58]||(n[58]=l("div",{class:"visual-hint"},[l("strong",null,"🔍 部署策略的渐进式风险控制"),t("："),l("strong",null,"影子模式"),t("——新模型在线上运行但不影响用户（只记录预测结果），对比旧模型后再切换；"),l("strong",null,"金丝雀部署"),t("——先用 5% 流量测试新模型，如果没出问题逐步扩大到 25%→50%→100%；"),l("strong",null,"回滚机制"),t("——线上指标一旦恶化（延迟、错误率、业务指标），自动切换回旧模型。ML 系统的独特性：不像传统软件只有代码 bug，ML 模型可能"),l("strong",null,"悄无声息地退化"),t("（数据漂移导致准确率缓慢下降），需要专门的监控体系。 ")],-1)),n[59]||(n[59]=l("div",{class:"visual-hint"},[l("strong",null,"💡 模型再训练的触发条件"),t("：不要每天定时重训（可能浪费资源，模型其实没退化）。更好的触发："),l("strong",null,"性能驱动"),t("——线上准确率/业务指标下降到阈值；"),l("strong",null,"数据驱动"),t("——新数据量累积到训练集的一定比例（如新增 10%）；"),l("strong",null,"时间驱动"),t("——固定周期但结合性能检查（每周检查一次，退化了才训）。关键是"),l("strong",null,"自动化闭环"),t("——监控→检测漂移→触发重训→自动评估→部署，减少人工介入。 ")],-1)),s(u,{lang:"python",code:G})]),_:1}),s(v,{paper:{title:"A Survey of Model Compression and Acceleration for Deep Neural Networks",authors:"Cheng, Y., Wang, D., Zhou, P. & Zhang, T.",venue:"arXiv",year:"2017",url:"https://arxiv.org/abs/1710.09282"}}),s(v,{paper:{title:"The Lottery Ticket Hypothesis: Finding Sparse, Trainable Neural Networks",authors:"Frankle, J. & Carlin, M.",venue:"ICLR",year:"2019",url:"https://arxiv.org/abs/1803.03635"}}),s(b,null,{default:r(()=>[...n[60]||(n[60]=[l("h3",null,"实验复现说明与代码开源规范",-1),l("ul",null,[l("li",null,[l("strong",null,"环境说明"),t("：Python 版本、CUDA 版本、依赖包及版本（requirements.txt 或 environment.yml）")]),l("li",null,[l("strong",null,"随机种子"),t("：设置并报告所有随机种子（numpy, torch, random），确保可复现")]),l("li",null,[l("strong",null,"README 模板"),t("：项目简介→安装步骤→数据准备→训练→评估→预训练模型")]),l("li",null,[l("strong",null,"许可证"),t("：选择合适的开源协议（MIT/Apache 2.0/GPL）")]),l("li",null,[l("strong",null,"模型检查点"),t("：提供预训练权重下载链接和加载代码")]),l("li",null,[l("strong",null,"性能基准"),t("：报告推理延迟、吞吐量、显存占用，而不仅仅是精度指标")])],-1)])]),_:1})]))}},E=S(h,[["__scopeId","data-v-0f2b91b2"]]);export{E as default};
