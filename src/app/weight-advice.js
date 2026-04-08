/**
 * 体重建议引擎
 *
 * 数据来源：《中国居民膳食指南（2022）》孕期体重增长推荐
 * 参考标准：IOM（美国医学研究院）2009 孕期体重增长指南
 *
 * BMI 分类采用中国标准（WS/T 428-2013）：
 *   偏低 < 18.5 | 正常 18.5-23.9 | 超重 24-27.9 | 肥胖 ≥ 28
 */

/**
 * BMI 分类（中国标准）
 */
export function classifyBMI(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 24) return 'normal';
  if (bmi < 28) return 'overweight';
  return 'obese';
}

const BMI_LABELS = {
  underweight: '偏低',
  normal: '正常',
  overweight: '超重',
  obese: '肥胖',
};

/**
 * 各BMI类别的推荐增重参数
 * totalMin/Max: 整个孕期推荐总增重 (kg)
 * weeklyRate: 孕中晚期（14周后）推荐每周增重 (kg)
 * firstTrimesterMax: 孕早期（前13周）推荐最大增重 (kg)
 */
const RECOMMENDATIONS = {
  underweight: { totalMin: 12.5, totalMax: 18, weeklyRate: 0.51, firstTrimesterMax: 2.0 },
  normal:      { totalMin: 11.5, totalMax: 16, weeklyRate: 0.42, firstTrimesterMax: 2.0 },
  overweight:  { totalMin: 7,    totalMax: 11.5, weeklyRate: 0.28, firstTrimesterMax: 1.5 },
  obese:       { totalMin: 5,    totalMax: 9, weeklyRate: 0.22, firstTrimesterMax: 1.0 },
};

/**
 * 计算到当前孕周为止的推荐增重范围
 * 孕早期约增重 0.5-2kg，孕中期起按每周推荐速率线性增长
 */
export function getRecommendedGain(week, bmiCategory) {
  const rec = RECOMMENDATIONS[bmiCategory] || RECOMMENDATIONS.normal;

  if (week <= 13) {
    // 孕早期：线性插值 0 到 firstTrimesterMax
    const fraction = week / 13;
    const max = rec.firstTrimesterMax * fraction;
    return { min: 0, max: Math.round(max * 10) / 10 };
  }

  // 孕中晚期：早期基础 + 每周增长
  const weeksAfterFirst = week - 13;
  const min = rec.firstTrimesterMax * 0.5 + weeksAfterFirst * rec.weeklyRate * 0.8;
  const max = rec.firstTrimesterMax + weeksAfterFirst * rec.weeklyRate * 1.2;

  return {
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    weeklyRate: rec.weeklyRate,
    totalMin: rec.totalMin,
    totalMax: rec.totalMax,
  };
}

/**
 * 生成体重建议
 * @param {Object} params
 * @param {number|null} params.preWeight 孕前体重 (kg)
 * @param {number|null} params.height 身高 (cm)，暂不用，预留
 * @param {Array} params.weightRecords 体重记录 [{date, weight, week}]
 * @param {number} params.currentWeek 当前孕周
 * @param {number} params.trimester 孕期阶段 1/2/3
 * @returns {Object|null} 建议结果
 */
export function getWeightAdvice({ preWeight, weightRecords, currentWeek, trimester }) {
  if (!preWeight || weightRecords.length === 0) return null;

  const latest = weightRecords[weightRecords.length - 1];
  const totalGain = latest.weight - preWeight;
  const bmi = null; // 需要身高才能算BMI，暂时用孕前体重差来判断
  const bmiCategory = 'normal'; // 默认正常，后续可加身高输入

  const rec = getRecommendedGain(currentWeek, bmiCategory);
  const status = totalGain > rec.max ? 'over' : totalGain < rec.min ? 'under' : 'normal';

  // 最近增速（取最近两条记录）
  let weeklyRate = null;
  if (weightRecords.length >= 2) {
    const prev = weightRecords[weightRecords.length - 2];
    const weekDiff = latest.week - prev.week;
    if (weekDiff > 0) {
      weeklyRate = Math.round(((latest.weight - prev.weight) / weekDiff) * 100) / 100;
    }
  }

  // 生成建议
  const advice = generateAdvice(status, totalGain, rec, weeklyRate, trimester, currentWeek);

  return {
    totalGain: Math.round(totalGain * 10) / 10,
    status,
    recRange: rec,
    weeklyRate,
    bmiCategory: BMI_LABELS[bmiCategory],
    advice,
  };
}

function generateAdvice(status, totalGain, rec, weeklyRate, trimester, week) {
  const level = status === 'over' ? 'warning' : status === 'under' ? 'info' : 'success';
  const icon = status === 'over' ? '⚠️' : status === 'under' ? '💡' : '✅';

  let title, messages;

  if (status === 'over') {
    title = '体重增长偏快';
    const overBy = Math.round((totalGain - rec.max) * 10) / 10;
    messages = [
      `目前累计增重 ${totalGain > 0 ? '+' : ''}${totalGain}kg，超过推荐上限约 ${overBy}kg（本周推荐范围：${rec.min}-${rec.max}kg）。`,
    ];

    if (trimester === 1) {
      messages.push('📌 孕早期不需要"吃两人份"，宝宝还很小，注意均衡即可。');
      messages.push('🥗 少吃油炸、甜食，用杂粮替代精白米面。');
    } else if (trimester === 2) {
      messages.push('📌 孕中期开始每周增重建议控制在0.4-0.5kg以内。');
      messages.push('🏃 每天饭后散步30分钟，帮助控制体重和血糖。');
      messages.push('🥦 多吃蔬菜和优质蛋白（鱼虾、鸡胸、豆腐），减少精制碳水。');
    } else {
      messages.push('📌 孕晚期也要控制增速！宝宝最后几周主要长脂肪，妈妈增重过快不利于顺产。');
      messages.push('🍽 用少食多餐代替大餐，每餐七分饱。');
      messages.push('🍬 避免蛋糕、奶茶、果汁等高糖食物，水果每天不超过350g。');
    }

    if (weeklyRate && weeklyRate > 0.7) {
      messages.push(`⚡ 最近每周增重约${weeklyRate}kg，明显偏快，建议下周开始记录饮食日记。`);
    }
  } else if (status === 'under') {
    title = '体重增长偏慢';
    messages = [
      `目前累计增重 ${totalGain > 0 ? '+' : ''}${totalGain}kg，低于推荐下限（本周推荐范围：${rec.min}-${rec.max}kg）。`,
    ];

    if (trimester === 1) {
      messages.push('📌 孕早期因为孕吐吃不下是正常的，不用太焦虑。');
      messages.push('🍞 能吃什么就吃什么：苏打饼干、面包片、水果，保持能量摄入。');
      messages.push('💊 如果持续无法进食或体重下降超过2kg，请咨询医生。');
    } else {
      messages.push('📌 孕中晚期宝宝快速生长，体重增长不足可能影响胎儿发育。');
      messages.push('🥛 增加营养密度：每天加2次加餐（酸奶+坚果、牛奶+全麦面包）。');
      messages.push('🥩 确保每天有充足的优质蛋白（鸡蛋、鱼虾、瘦肉、豆腐）。');
      messages.push('👩‍⚕️ 如果持续增重不足，建议产检时告知医生。');
    }
  } else {
    title = '体重增长正常';
    messages = [
      `目前累计增重 +${totalGain}kg，在推荐范围内（${rec.min}-${rec.max}kg），保持得很好！`,
    ];

    if (trimester === 1) {
      messages.push('💪 继续保持均衡饮食和适量活动。');
    } else if (trimester === 2) {
      messages.push('💪 孕中期每周增重0.4-0.5kg是理想节奏，继续保持。');
      messages.push('🏃 每天坚持30分钟轻度运动（散步、孕妇瑜伽）。');
    } else {
      messages.push('💪 孕晚期保持这个节奏，为顺利分娩打好基础。');
      messages.push('🍽 继续少食多餐，注意铁和钙的补充。');
    }
  }

  return { level, icon, title, messages };
}
