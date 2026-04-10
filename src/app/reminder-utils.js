import { checkupSchedule } from './checkup-data.js';

/**
 * 检查错过的提醒
 * @param {Array} reminders 提醒列表
 * @returns {Array} 错过的提醒
 */
export function checkMissedReminders(reminders) {
  const now = new Date();

  return reminders.filter(r => {
    if (!r.enabled || r.type === 'record') return false;
    if (!r.datetime) return false;

    const triggerTime = new Date(r.datetime);
    // 提前提醒时间
    const advanceMs = (r.advanceMinutes || 0) * 60 * 1000;
    const actualTriggerTime = new Date(triggerTime.getTime() - advanceMs);

    return actualTriggerTime < now && !r.lastTriggered;
  });
}

/**
 * 获取今日提醒
 * @param {Array} reminders 提醒列表
 * @returns {Array} 今日提醒列表
 */
export function getTodayReminders(reminders) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  return reminders.filter(r => {
    if (!r.enabled) return false;

    // 一次性提醒
    if (r.datetime && !r.repeat) {
      return r.datetime.slice(0, 10) === today;
    }

    // 重复提醒 - 每天
    if (r.repeat === 'daily' && r.datetime) {
      return true;
    }

    // 重复提醒 - 每周
    if (r.repeat === 'weekly' && r.datetime) {
      const dayOfWeek = now.getDay();
      return new Date(r.datetime).getDay() === dayOfWeek;
    }

    // 重复提醒 - 每月
    if (r.repeat === 'monthly' && r.datetime) {
      const dayOfMonth = now.getDate();
      return new Date(r.datetime).getDate() === dayOfMonth;
    }

    return false;
  }).sort((a, b) => {
    const timeA = a.datetime?.slice(11, 16) || '00:00';
    const timeB = b.datetime?.slice(11, 16) || '00:00';
    return timeA.localeCompare(timeB);
  });
}

/**
 * 根据孕周和设置生成自动提醒
 * @param {Object} info 孕周信息
 * @param {Object} settings 提醒设置
 * @param {Array} existingReminders 现有提醒
 * @returns {Array} 新生成的提醒
 */
export function generateAutoReminders(info, settings, existingReminders) {
  const newReminders = [];
  const existingIds = new Set(existingReminders.map(r => r.id));
  const now = new Date();

  // 产检提醒
  if (settings.checkup?.enabled) {
    checkupSchedule.forEach(checkup => {
      const enterWeekId = `checkup-enter-${checkup.name}`;
      const deadlineId = `checkup-deadline-${checkup.name}`;

      // 进入产检周提醒
      if (settings.checkup.enterWeekNotify && !existingIds.has(enterWeekId)) {
        if (info.weeks >= checkup.week && info.weeks <= checkup.weekEnd) {
          newReminders.push({
            id: enterWeekId,
            type: 'checkup',
            title: `本周需做：${checkup.name}`,
            description: checkup.desc,
            datetime: now.toISOString(),
            checkupName: checkup.name,
            weekRange: { start: checkup.week, end: checkup.weekEnd },
            enabled: true,
            createdAt: now.toISOString(),
            lastTriggered: null
          });
        }
      }

      // 产检窗口期结束前提醒
      if (settings.checkup.deadlineNotify && !existingIds.has(deadlineId) && info.lmpDate) {
        const advanceDays = settings.checkup.advanceDays || 3;
        // 计算产检窗口期结束日期（产检结束周的最后一天）
        const deadlineDate = new Date(info.lmpDate);
        deadlineDate.setDate(deadlineDate.getDate() + (checkup.weekEnd + 1) * 7 - 1); // weekEnd周的最后一天
        // 计算提醒日期
        const remindDate = new Date(deadlineDate);
        remindDate.setDate(remindDate.getDate() - advanceDays);
        
        // 检查今天是否是提醒日期（允许±1天的容差）
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const remindDateStart = new Date(remindDate);
        remindDateStart.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.round((remindDateStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 0 && daysDiff <= 1 && info.weeks >= checkup.week && info.weeks <= checkup.weekEnd) {
          newReminders.push({
            id: deadlineId,
            type: 'checkup',
            title: `⚠️ ${checkup.name}窗口期即将结束`,
            description: `${checkup.name}的最佳检查时间为${checkup.week}-${checkup.weekEnd}周，请尽快完成检查`,
            datetime: now.toISOString(),
            checkupName: checkup.name,
            weekRange: { start: checkup.week, end: checkup.weekEnd },
            enabled: true,
            createdAt: now.toISOString(),
            lastTriggered: null
          });
        }
      }
    });
  }

  // 里程碑提醒
  if (settings.milestone?.trimesterChange) {
    const trimesterMilestones = [
      { week: 14, name: 'trimester-2', title: '进入孕中期', description: '恭喜！你已经进入孕中期（14周），早孕反应可能开始缓解' },
      { week: 28, name: 'trimester-3', title: '进入孕晚期', description: '你已经进入孕晚期（28周），宝宝即将来临！' }
    ];

    trimesterMilestones.forEach(m => {
      const id = `milestone-${m.name}`;
      if (info.weeks === m.week && !existingIds.has(id)) {
        newReminders.push({
          id,
          type: 'milestone',
          title: m.title,
          description: m.description,
          datetime: now.toISOString(),
          enabled: true,
          createdAt: now.toISOString(),
          lastTriggered: null
        });
      }
    });
  }

  // 预产期临近提醒
  if (settings.milestone?.dueDateApproaching && info.daysUntilDue !== undefined) {
    // 提前7天
    if (info.daysUntilDue === 7) {
      const id = `milestone-due-7d`;
      if (!existingIds.has(id)) {
        newReminders.push({
          id,
          type: 'milestone',
          title: '距预产期还有7天',
          description: '宝宝即将到来，请准备好待产包，确认医院路线',
          datetime: now.toISOString(),
          enabled: true,
          createdAt: now.toISOString(),
          lastTriggered: null
        });
      }
    }

    // 提前1天
    if (info.daysUntilDue === 1) {
      const id = `milestone-due-1d`;
      if (!existingIds.has(id)) {
        newReminders.push({
          id,
          type: 'milestone',
          title: '距预产期还有1天',
          description: '随时准备迎接宝宝！注意观察临产征兆',
          datetime: now.toISOString(),
          enabled: true,
          createdAt: now.toISOString(),
          lastTriggered: null
        });
      }
    }
  }

  return newReminders;
}

/**
 * 格式化提醒时间显示
 * @param {string} datetime ISO 时间字符串
 * @returns {string} 格式化后的时间
 */
export function formatReminderTime(datetime) {
  if (!datetime) return '';

  const date = new Date(datetime);
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const targetDate = datetime.slice(0, 10);

  if (targetDate === today) {
    return `今天 ${datetime.slice(11, 16)}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (targetDate === tomorrow.toISOString().slice(0, 10)) {
    return `明天 ${datetime.slice(11, 16)}`;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日 ${datetime.slice(11, 16)}`;
}

/**
 * 检查提醒是否应该触发
 * @param {Object} reminder 提醒对象
 * @param {Date} now 当前时间
 * @returns {boolean} 是否应该触发
 */
export function shouldTriggerReminder(reminder, now = new Date()) {
  if (!reminder.enabled || !reminder.datetime) return false;

  const triggerTime = new Date(reminder.datetime);
  // 减去提前提醒时间
  const advanceMs = (reminder.advanceMinutes || 0) * 60 * 1000;
  const actualTriggerTime = new Date(triggerTime.getTime() - advanceMs);

  // 已过期且未触发过
  if (actualTriggerTime <= now && !reminder.lastTriggered) {
    return true;
  }

  return false;
}

/**
 * 生成记录提醒实例
 * @param {Object} settings 记录提醒设置
 * @returns {Array} 今日应触发的记录提醒
 */
export function generateRecordReminders(settings) {
  const reminders = [];
  const now = new Date();
  const dayOfWeek = now.getDay();
  const today = now.toISOString().slice(0, 10);

  // 体重记录提醒
  if (settings.weight?.enabled && settings.weight.days?.includes(dayOfWeek)) {
    settings.weight.times?.forEach(time => {
      reminders.push({
        id: `record-weight-${today}-${time}`,
        type: 'record',
        recordType: 'weight',
        title: '体重记录提醒',
        description: '该记录今天的体重了',
        datetime: `${today}T${time}:00`,
        enabled: true,
        createdAt: now.toISOString(),
        lastTriggered: null
      });
    });
  }

  // 症状记录提醒
  if (settings.symptom?.enabled && settings.symptom.days?.includes(dayOfWeek)) {
    settings.symptom.times?.forEach(time => {
      reminders.push({
        id: `record-symptom-${today}-${time}`,
        type: 'record',
        recordType: 'symptom',
        title: '症状记录提醒',
        description: '该记录今天的症状了',
        datetime: `${today}T${time}:00`,
        enabled: true,
        createdAt: now.toISOString(),
        lastTriggered: null
      });
    });
  }

  return reminders;
}
