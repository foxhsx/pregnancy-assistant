/**
 * 孕期计算核心工具
 */

/** 孕期总天数（280天 = 40周） */
export const TOTAL_PREGNANCY_DAYS = 280;
export const TOTAL_PREGNANCY_WEEKS = 40;

/**
 * 根据末次月经日期(LMP)计算当前孕周信息
 * @param {Date|string} lmpDate 末次月经第一天
 * @param {Date|string} [today] 今天日期，默认 new Date()
 */
export function calcPregnancyInfo(lmpDate, today = new Date()) {
  const lmp = new Date(lmpDate);
  const now = new Date(today);

  // 归一化到纯日期（去掉时分秒）
  lmp.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - lmp.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;

  const dueDate = new Date(lmp);
  dueDate.setDate(dueDate.getDate() + TOTAL_PREGNANCY_DAYS);

  const daysUntilDue = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const trimester = weeks < 13 ? 1 : weeks < 28 ? 2 : 3;
  const trimesterLabel = trimester === 1 ? '孕早期' : trimester === 2 ? '孕中期' : '孕晚期';

  return {
    /** 距LMP的总天数 */
    days,
    /** 完整周数，如 12 */
    weeks,
    /** 余数天，如 3（表示 12周+3天） */
    remainingDays,
    /** 预产期 */
    dueDate,
    /** 距预产期还有多少天 */
    daysUntilDue,
    /** 孕期阶段 1/2/3 */
    trimester,
    /** "孕早期"/"孕中期"/"孕晚期" */
    trimesterLabel,
    /** 格式化字符串 "12周+3天" */
    formatted: `${weeks}周+${remainingDays}天`,
    /** LMP本身 */
    lmpDate: lmp,
  };
}

/**
 * 根据预产期反算 LMP
 */
export function lmpFromDueDate(dueDate) {
  const d = new Date(dueDate);
  d.setDate(d.getDate() - TOTAL_PREGNANCY_DAYS);
  return d;
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * 格式化日期为中文友好格式 "2026年4月7日"
 */
export function formatDateCN(date) {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
