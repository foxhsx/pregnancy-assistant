/**
 * 生活指南 - 按孕期阶段分为"推荐做"和"不要做"
 *
 * 数据来源：
 * - ACOG Committee Opinion No. 804 (2020): Physical Activity and Exercise During Pregnancy
 * - ACOG FAQ: Sleep Position During Pregnancy
 * - ACOG FAQ: Is it safe to keep a cat during pregnancy?
 * - Cleveland Clinic: Kick Counts (Fetal Movement Counting)
 * - 《中国居民膳食指南（2022）》孕妇膳食指南
 */

const lifestyle = {
  1: { // 孕早期 (1-12周)
    label: '孕早期（1-12周）',
    doList: [
      { category: '运动', text: '散步、孕妇瑜伽（轻度）', icon: '🏃' },
      { category: '运动', text: '每天保证30分钟轻度活动', icon: '🏃' },
      { category: '饮食', text: '少食多餐，缓解孕吐', icon: '🍽' },
      { category: '饮食', text: '每天补充400μg叶酸', icon: '💊' },
      { category: '生活', text: '保持充足睡眠（8-10小时）', icon: '😴' },
      { category: '生活', text: '穿宽松舒适的衣物', icon: '👗' },
      { category: '心理', text: '和家人分享你的感受', icon: '💬' },
      { category: '心理', text: '加入孕妈交流群获取支持', icon: '🤝' },
    ],
    dontList: [
      { category: '运动', text: '剧烈运动、跑步、跳跃', icon: '🚫' },
      { category: '运动', text: '蒸桑拿、泡热水澡（>38°C）', icon: '🚫' },
      { category: '饮食', text: '生鱼片、生肉、生蛋', icon: '🚫' },
      { category: '饮食', text: '酒精、浓茶、过量咖啡因', icon: '🚫' },
      { category: '生活', text: '清理猫砂盆（尤其外出捕猎的猫）', icon: '🚫' },
      { category: '生活', text: '使用含维A酸的护肤品', icon: '🚫' },
      { category: '用药', text: '自行服用任何药物（含中药）', icon: '🚫' },
      { category: '环境', text: '接触二手烟、化学溶剂', icon: '🚫' },
    ],
  },
  2: { // 孕中期 (13-27周)
    label: '孕中期（13-27周）',
    doList: [
      { category: '运动', text: '游泳、孕妇体操、快走', icon: '🏊' },
      { category: '运动', text: '凯格尔运动（盆底肌训练）', icon: '💪' },
      { category: '饮食', text: '增加蛋白质和钙的摄入', icon: '🥛' },
      { category: '饮食', text: '多吃富含铁的食物', icon: '🥩' },
      { category: '生活', text: '侧卧位睡觉，尤其是左侧（改善血液循环）', icon: '🛏' },
      { category: '生活', text: '开始使用孕妇枕', icon: '🛏' },
      { category: '生活', text: '做好皮肤保湿（预防妊娠纹）', icon: '🧴' },
      { category: '互动', text: '和宝宝说话、播放轻音乐', icon: '🎵' },
      { category: '准备', text: '开始了解分娩方式和医院', icon: '📝' },
    ],
    dontList: [
      { category: '运动', text: '仰卧位运动（压迫下腔静脉）', icon: '🚫' },
      { category: '运动', text: '任何有跌倒风险的运动', icon: '🚫' },
      { category: '饮食', text: '过量吃甜食（妊娠糖尿病风险）', icon: '🚫' },
      { category: '饮食', text: '含汞高的鱼类（鲨鱼、剑鱼、金枪鱼）', icon: '🚫' },
      { category: '生活', text: '长时间站立或久坐', icon: '🚫' },
      { category: '生活', text: '提重物或做需要腹部用力的动作', icon: '🚫' },
      { category: '用药', text: '服用未经医生同意的保健品', icon: '🚫' },
      { category: '出行', text: '长途旅行不做防护', icon: '🚫' },
    ],
  },
  3: { // 孕晚期 (28-40周)
    label: '孕晚期（28-40周）',
    doList: [
      { category: '运动', text: '散步（助产、控体重）', icon: '🚶' },
      { category: '运动', text: '继续凯格尔运动', icon: '💪' },
      { category: '运动', text: '拉玛泽呼吸法练习', icon: '🧘' },
      { category: '监测', text: '每天数胎动（2小时内应有10次以上胎动）', icon: '📊' },
      { category: '监测', text: '注意见红、破水、规律宫缩', icon: '👀' },
      { category: '准备', text: '准备待产包', icon: '🎒' },
      { category: '准备', text: '确认去医院的路线和交通', icon: '🗺' },
      { category: '饮食', text: '少食多餐，控制体重增速', icon: '🍽' },
      { category: '心理', text: '了解分娩流程，减少恐惧', icon: '📖' },
    ],
    dontList: [
      { category: '运动', text: '剧烈运动或过度劳累', icon: '🚫' },
      { category: '运动', text: '长时间平躺', icon: '🚫' },
      { category: '饮食', text: '暴饮暴食或大补', icon: '🚫' },
      { category: '饮食', text: '食用可能引起过敏的新食物', icon: '🚫' },
      { category: '出行', text: '独自长途出行', icon: '🚫' },
      { category: '出行', text: '孕36周后坐飞机', icon: '🚫' },
      { category: '生活', text: '忽视异常症状（头痛、水肿、视物模糊）', icon: '🚫' },
      { category: '生活', text: '超过预产期两周仍未就医', icon: '🚫' },
    ],
  },
};

/**
 * 获取当前阶段的生活指南
 */
export function getLifestyleGuide(trimester) {
  return lifestyle[trimester] || lifestyle[1];
}
