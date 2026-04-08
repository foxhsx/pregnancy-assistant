/**
 * 宝宝发育数据 - 按孕周索引
 * 
 * 数据来源：
 * - 身长/体重：基于 Hadlock 方法（ACOG/SMFM 推荐标准），
 *   引自 BabyCenter Fetal Growth Chart（医学审阅：Layan Alrahmani, M.D., ob-gyn, MFM）
 *   原始数据来自 NICHD Fetal Growth Studies 和 INTERGROWTH-21st 项目
 * - 大小类比：传统孕期水果类比
 * - 里程碑：综合 ACOG "How Your Fetus Grows During Pregnancy" 及多篇综述
 * 
 * 注意：早期（8-13周）身长为头臀长（CRL），14周起为头脚长
 */
export const babyDevelopment = {
  4:  { size: '罂粟籽',    weight: '<1g',      length: '0.04cm', milestones: ['胚胎着床', '开始形成胎盘'] },
  5:  { size: '芝麻',      weight: '<1g',      length: '0.13cm', milestones: ['心脏开始跳动', '神经管形成'] },
  6:  { size: '小扁豆',    weight: '<1g',      length: '0.25cm', milestones: ['面部轮廓开始形成', '四肢芽出现'] },
  7:  { size: '蓝莓',      weight: '<1g',      length: '0.5cm',  milestones: ['手指脚趾开始分化', '大脑快速发育'] },
  8:  { size: '树莓',      weight: '1g',       length: '1.6cm',  milestones: ['所有主要器官开始发育', '尾巴消失'] },
  9:  { size: '樱桃',      weight: '2g',       length: '2.3cm',  milestones: ['肌肉开始发育', '可以活动四肢'] },
  10: { size: '草莓',      weight: '4g',       length: '3.1cm',  milestones: ['从胚胎变为胎儿', '手指脚趾完全分离'] },
  11: { size: '无花果',    weight: '7g',       length: '4.1cm',  milestones: ['生殖器开始发育', '头部占身长一半'] },
  12: { size: '青柠',      weight: '14g',      length: '5.4cm',  milestones: ['反射神经开始工作', '指甲开始生长'] },
  13: { size: '桃子',      weight: '23g',      length: '6.7cm',  milestones: ['指纹形成', '声带发育'] },
  // 14周起为头脚长（之前为头臀长），所以看起来跳跃较大
  14: { size: '柠檬',      weight: '43g',      length: '14.7cm', milestones: ['可以做出表情', '开始长头发'] },
  15: { size: '苹果',      weight: '70g',      length: '16.7cm', milestones: ['骨骼开始硬化', '味蕾形成'] },
  16: { size: '牛油果',    weight: '100g',     length: '18.6cm', milestones: ['眼睛对光敏感', '可以吸吮手指'] },
  17: { size: '梨',        weight: '140g',     length: '20.4cm', milestones: ['脂肪开始积累', '汗腺形成'] },
  18: { size: '红薯',      weight: '190g',     length: '22.2cm', milestones: ['可以听到声音', '髓鞘开始形成'] },
  19: { size: '芒果',      weight: '240g',     length: '24cm',   milestones: ['胎脂覆盖皮肤', '永久牙芽形成'] },
  20: { size: '香蕉',      weight: '300g',     length: '25.7cm', milestones: ['吞咽羊水', '产生胎粪', '准妈妈可感到胎动'] },
  21: { size: '胡萝卜',    weight: '360g',     length: '27.4cm', milestones: ['骨髓开始造血', '眉毛成型'] },
  22: { size: '木瓜',      weight: '430g',     length: '29cm',   milestones: ['嘴唇眼皮更清晰', '肺部发育'] },
  23: { size: '葡萄柚',    weight: '500g',     length: '30.6cm', milestones: ['皮肤变厚', '可以听到妈妈声音'] },
  24: { size: '玉米棒',    weight: '600g',     length: '32.2cm', milestones: ['肺部开始产生表面活性物质', '面部完整'] },
  25: { size: '菜花',      weight: '660g',     length: '33.7cm', milestones: ['可以感受光线变化', '开始有睡眠周期'] },
  26: { size: '生菜',      weight: '760g',     length: '35.1cm', milestones: ['眼睛开始睁开', '免疫系统发育'] },
  27: { size: '花椰菜',    weight: '875g',     length: '36.6cm', milestones: ['大脑快速发育', '可以做梦'] },
  28: { size: '茄子',      weight: '1kg',      length: '37.6cm', milestones: ['可以眨眼', '皮下脂肪增加', '进入孕晚期'] },
  29: { size: '南瓜',      weight: '1.15kg',   length: '39.3cm', milestones: ['骨骼完全形成', '肌肉成熟'] },
  30: { size: '椰子',      weight: '1.32kg',   length: '40.5cm', milestones: ['大脑表面开始出现沟回', '造血转至骨髓'] },
  31: { size: '菠萝',      weight: '1.5kg',    length: '41.8cm', milestones: ['所有主要器官基本成熟', '可以转头'] },
  32: { size: '哈密瓜',    weight: '1.7kg',    length: '43cm',   milestones: ['指甲长到指尖', '肺部继续成熟'] },
  33: { size: '芹菜',      weight: '1.9kg',    length: '44.1cm', milestones: ['骨骼开始硬化（除颅骨）', '皮肤变粉'] },
  34: { size: '哈密瓜',    weight: '2.1kg',    length: '45.3cm', milestones: ['中枢神经系统成熟', '免疫系统增强'] },
  35: { size: '蜂蜜柚子',  weight: '2.4kg',    length: '46.3cm', milestones: ['大部分宝宝已头位', '皮下脂肪丰满'] },
  36: { size: '罗马生菜',  weight: '2.6kg',    length: '47.3cm', milestones: ['胎毛脱落', '吮吸反射完善'] },
  37: { size: '瑞士甜菜',  weight: '2.9kg',    length: '48.3cm', milestones: ['肺部基本成熟', '视为早期足月'] },
  38: { size: '韭菜',      weight: '3.0kg',    length: '49.3cm', milestones: ['肝脏储存铁', '肠内积累胎粪'] },
  39: { size: '西瓜（小）', weight: '3.3kg',    length: '50.1cm', milestones: ['胸部变突出', '足月'] },
  40: { size: '西瓜',      weight: '3.5kg',    length: '51cm',   milestones: ['随时准备出生', '头已入盆'] },
};

export function getBabyInfo(week) {
  const w = Math.max(4, Math.min(40, week));
  return babyDevelopment[w] || babyDevelopment[4];
}
