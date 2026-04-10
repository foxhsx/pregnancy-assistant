// src/app/reminder-data.js

const REMINDERS_KEY = 'yunqi_reminders';
const SETTINGS_KEY = 'yunqi_reminder_settings';

const defaultSettings = {
  checkup: { enabled: true, enterWeekNotify: true, deadlineNotify: true, advanceDays: 3 },
  record: {
    weight: { enabled: true, times: ['21:00'], days: [1, 2, 3, 4, 5, 6, 0] },
    symptom: { enabled: false, times: [], days: [] }
  },
  milestone: { trimesterChange: true, dueDateApproaching: true },
  speech: { enabled: true, rate: 1.0 }
};

/**
 * 加载提醒列表
 * @returns {Array} 提醒列表
 */
export function loadReminders() {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * 保存提醒列表
 * @param {Array} reminders 提醒列表
 */
export function saveReminders(reminders) {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

/**
 * 加载提醒设置
 * @returns {Object} 设置对象
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

/**
 * 保存提醒设置
 * @param {Object} settings 设置对象
 */
export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export { defaultSettings };
