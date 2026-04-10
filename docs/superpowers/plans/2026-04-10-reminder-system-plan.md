# 定时提醒系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为孕期助手添加定时提醒系统，支持用户自定义提醒、产检自动提醒、记录提醒和里程碑提醒。

**Architecture:** 采用应用内提醒为主、浏览器通知为辅的混合策略。核心是 useReminders Hook 管理状态，数据存储在 localStorage，定时检查器每分钟扫描待触发提醒。

**Tech Stack:** React 19 + Vite + localStorage + Notification API

---

## 文件结构

```
src/app/
├── reminder-data.js      # 数据层：localStorage 读写
├── reminder-utils.js     # 工具函数：提醒计算、格式化
├── notification-service.js # 通知服务：浏览器通知封装
├── useReminders.js       # 核心 Hook：状态管理 + 定时检查
├── ReminderPage.jsx      # 提醒管理页面
├── AddReminderModal.jsx  # 添加提醒弹窗
├── Dashboard.jsx         # 修改：添加提醒入口卡片
├── App.jsx               # 修改：添加路由和 Hook 集成
└── styles/
    └── index.css         # 修改：添加提醒相关样式
```

---

## Task 1: 数据层 - reminder-data.js

**Files:**
- Create: `src/app/reminder-data.js`

- [ ] **Step 1: 创建 reminder-data.js**

```js
// src/app/reminder-data.js

const REMINDERS_KEY = 'yunqi_reminders';
const SETTINGS_KEY = 'yunqi_reminder_settings';

const defaultSettings = {
  checkup: { enabled: true, enterWeekNotify: true, deadlineNotify: true, advanceDays: 3 },
  record: {
    weight: { enabled: true, times: ['21:00'], days: [1, 2, 3, 4, 5, 6, 0] },
    symptom: { enabled: false, times: [], days: [] }
  },
  milestone: { trimesterChange: true, dueDateApproaching: true }
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
```

- [ ] **Step 2: 提交数据层**

```bash
git add src/app/reminder-data.js
git commit -m "feat(reminder): add data layer for reminders"
```

---

## Task 2: 工具函数 - reminder-utils.js

**Files:**
- Create: `src/app/reminder-utils.js`

- [ ] **Step 1: 创建 reminder-utils.js**

```js
// src/app/reminder-utils.js

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
```

- [ ] **Step 2: 提交工具函数**

```bash
git add src/app/reminder-utils.js
git commit -m "feat(reminder): add utility functions for reminders"
```

---

## Task 3: 通知服务 - notification-service.js

**Files:**
- Create: `src/app/notification-service.js`

- [ ] **Step 1: 创建 notification-service.js**

```js
// src/app/notification-service.js

/**
 * 浏览器通知服务
 */
export const NotificationService = {
  /**
   * 检查浏览器是否支持通知
   * @returns {boolean}
   */
  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  /**
   * 请求通知权限
   * @returns {Promise<string>} 'granted' | 'denied' | 'default' | 'unsupported'
   */
  async requestPermission() {
    if (!this.isSupported()) return 'unsupported';
    
    try {
      const result = await Notification.requestPermission();
      return result;
    } catch {
      return 'default';
    }
  },

  /**
   * 获取当前权限状态
   * @returns {string} 'granted' | 'denied' | 'default' | 'unsupported'
   */
  getPermissionStatus() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  /**
   * 发送通知
   * @param {string} title 通知标题
   * @param {Object} options 通知选项
   * @returns {Notification|null}
   */
  async show(title, options = {}) {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: options.tag || `reminder-${Date.now()}`,
        requireInteraction: true,
        body: options.body || '',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) {
          options.onClick();
        }
      };

      return notification;
    } catch {
      return null;
    }
  }
};
```

- [ ] **Step 2: 提交通知服务**

```bash
git add src/app/notification-service.js
git commit -m "feat(reminder): add notification service"
```

---

## Task 4: 核心 Hook - useReminders.js

**Files:**
- Create: `src/app/useReminders.js`

- [ ] **Step 1: 创建 useReminders.js**

```js
// src/app/useReminders.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadReminders, saveReminders, loadSettings, saveSettings } from './reminder-data.js';
import { NotificationService } from './notification-service.js';
import { 
  checkMissedReminders, 
  getTodayReminders, 
  generateAutoReminders, 
  shouldTriggerReminder,
  generateRecordReminders 
} from './reminder-utils.js';

/**
 * 应用内提醒弹窗状态
 */
let inAppAlertCallback = null;

/**
 * 注册应用内提醒回调
 */
export function setInAppAlertHandler(handler) {
  inAppAlertCallback = handler;
}

/**
 * 显示应用内提醒
 */
function showInAppAlert(reminder) {
  if (inAppAlertCallback) {
    inAppAlertCallback(reminder);
  }
}

/**
 * 提醒系统核心 Hook
 * @param {Object|null} info 孕周信息
 */
export function useReminders(info) {
  const [reminders, setReminders] = useState([]);
  const [settings, setSettings] = useState(null);
  const [missedReminders, setMissedReminders] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  
  const checkIntervalRef = useRef(null);
  const lastCheckDateRef = useRef('');

  // 注册应用内提醒处理
  useEffect(() => {
    setInAppAlertHandler((reminder) => {
      setCurrentAlert(reminder);
    });
  }, []);
  
  // 初始化
  useEffect(() => {
    const loadedReminders = loadReminders();
    const loadedSettings = loadSettings();
    
    setReminders(loadedReminders);
    setSettings(loadedSettings);
    setHasPermission(NotificationService.getPermissionStatus() === 'granted');
    
    // 检查错过的提醒
    const missed = checkMissedReminders(loadedReminders);
    setMissedReminders(missed);
    
    // 启动定时检查（每分钟）
    checkIntervalRef.current = setInterval(() => {
      checkAndTriggerReminders();
    }, 60000);
    
    // 立即检查一次
    checkAndTriggerReminders();
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);
  
  // 根据孕周生成自动提醒
  useEffect(() => {
    if (!info || !settings) return;
    
    const autoReminders = generateAutoReminders(info, settings, reminders);
    if (autoReminders.length > 0) {
      setReminders(prev => {
        const next = [...prev, ...autoReminders];
        saveReminders(next);
        return next;
      });
    }
  }, [info?.weeks, settings]);
  
  // 生成记录提醒
  useEffect(() => {
    if (!settings) return;
    
    const today = new Date().toISOString().slice(0, 10);
    if (lastCheckDateRef.current !== today) {
      lastCheckDateRef.current = today;
      
      const recordReminders = generateRecordReminders(settings.record);
      if (recordReminders.length > 0) {
        setReminders(prev => {
          const existingIds = new Set(prev.map(r => r.id));
          const newReminders = recordReminders.filter(r => !existingIds.has(r.id));
          if (newReminders.length > 0) {
            const next = [...prev, ...newReminders];
            saveReminders(next);
            return next;
          }
          return prev;
        });
      }
    }
  }, [settings, reminders]);
  
  // 检查并触发提醒
  const checkAndTriggerReminders = useCallback(() => {
    const now = new Date();
    
    setReminders(prev => {
      let changed = false;
      const next = prev.map(r => {
        if (shouldTriggerReminder(r, now)) {
          changed = true;
          
          // 应用内提醒
          showInAppAlert(r);
          
          // 浏览器通知
          if (hasPermission) {
            NotificationService.show(r.title, { body: r.description });
          }
          
          return { ...r, lastTriggered: now.toISOString() };
        }
        return r;
      });
      
      if (changed) {
        saveReminders(next);
      }
      return next;
    });
  }, [hasPermission]);
  
  // 添加自定义提醒
  const addReminder = useCallback((reminder) => {
    const now = new Date();
    const newReminder = {
      id: `custom-${crypto.randomUUID()}`,
      type: 'custom',
      ...reminder,
      enabled: true,
      createdAt: now.toISOString(),
      lastTriggered: null
    };
    
    setReminders(prev => {
      const next = [...prev, newReminder];
      saveReminders(next);
      return next;
    });
    
    return newReminder;
  }, []);
  
  // 删除提醒
  const deleteReminder = useCallback((id) => {
    setReminders(prev => {
      const next = prev.filter(r => r.id !== id);
      saveReminders(next);
      return next;
    });
  }, []);
  
  // 更新提醒
  const updateReminder = useCallback((id, updates) => {
    setReminders(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      saveReminders(next);
      return next;
    });
  }, []);
  
  // 切换启用状态
  const toggleReminder = useCallback((id) => {
    setReminders(prev => {
      const next = prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
      saveReminders(next);
      return next;
    });
  }, []);
  
  // 请求通知权限
  const requestPermission = useCallback(async () => {
    const result = await NotificationService.requestPermission();
    setHasPermission(result === 'granted');
    return result;
  }, []);
  
  // 更新设置
  const updateSettings = useCallback((category, updates) => {
    setSettings(prev => {
      if (!prev) return prev;
      const next = { 
        ...prev, 
        [category]: { ...prev[category], ...updates } 
      };
      saveSettings(next);
      return next;
    });
  }, []);
  
  // 关闭当前提醒弹窗
  const dismissAlert = useCallback(() => {
    setCurrentAlert(null);
  }, []);
  
  // 忽略错过的提醒
  const dismissMissed = useCallback((id) => {
    setMissedReminders(prev => prev.filter(r => r.id !== id));
    // 同时标记为已触发，避免重复
    setReminders(prev => {
      const next = prev.map(r => 
        r.id === id ? { ...r, lastTriggered: new Date().toISOString() } : r
      );
      saveReminders(next);
      return next;
    });
  }, []);
  
  // 清理过期的记录提醒（超过今天的）
  const cleanupExpiredRecordReminders = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    setReminders(prev => {
      const next = prev.filter(r => {
        if (r.type !== 'record') return true;
        return r.datetime?.slice(0, 10) === today;
      });
      if (next.length !== prev.length) {
        saveReminders(next);
      }
      return next;
    });
  }, []);
  
  // 获取今日提醒
  const todayReminders = settings ? getTodayReminders(reminders) : [];
  
  return {
    reminders,
    settings,
    missedReminders,
    todayReminders,
    hasPermission,
    currentAlert,
    addReminder,
    deleteReminder,
    updateReminder,
    toggleReminder,
    updateSettings,
    requestPermission,
    dismissAlert,
    dismissMissed,
    cleanupExpiredRecordReminders
  };
}
```

- [ ] **Step 2: 提交核心 Hook**

```bash
git add src/app/useReminders.js
git commit -m "feat(reminder): add useReminders hook"
```

---

## Task 5: 添加提醒弹窗 - AddReminderModal.jsx

**Files:**
- Create: `src/app/AddReminderModal.jsx`

- [ ] **Step 1: 创建 AddReminderModal.jsx**

```jsx
// src/app/AddReminderModal.jsx

import { useState } from 'react';

/**
 * 添加提醒弹窗组件
 */
export function AddReminderModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [repeat, setRepeat] = useState('none');
  const [advance, setAdvance] = useState(0);

  const handleSubmit = () => {
    if (!title.trim() || !date) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      datetime: `${date}T${time}:00`,
      repeat: repeat === 'none' ? null : repeat,
      advanceMinutes: advance
    });
  };

  // 获取最小日期（今天）
  const getMinDate = () => {
    return new Date().toISOString().slice(0, 10);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>添加提醒</h2>

        <div className="form-group">
          <label>标题 *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="如：产检提醒"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>描述</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="详细说明（可选）"
            rows={2}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>日期 *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={getMinDate()}
            />
          </div>
          <div className="form-group">
            <label>时间</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>重复</label>
          <select value={repeat} onChange={e => setRepeat(e.target.value)}>
            <option value="none">不重复</option>
            <option value="daily">每天</option>
            <option value="weekly">每周</option>
            <option value="monthly">每月</option>
          </select>
        </div>

        <div className="form-group">
          <label>提前提醒</label>
          <select value={advance} onChange={e => setAdvance(Number(e.target.value))}>
            <option value={0}>准时提醒</option>
            <option value={5}>提前5分钟</option>
            <option value={60}>提前1小时</option>
            <option value={1440}>提前1天</option>
            <option value={4320}>提前3天</option>
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
          <button 
            type="button" 
            className="btn-confirm" 
            onClick={handleSubmit}
            disabled={!title.trim() || !date}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交添加提醒弹窗**

```bash
git add src/app/AddReminderModal.jsx
git commit -m "feat(reminder): add AddReminderModal component"
```

---

## Task 6: 提醒管理页面 - ReminderPage.jsx

**Files:**
- Create: `src/app/ReminderPage.jsx`

- [ ] **Step 1: 创建 ReminderPage.jsx**

```jsx
// src/app/ReminderPage.jsx

import { useState } from 'react';
import { AddReminderModal } from './AddReminderModal.jsx';
import { formatReminderTime } from './reminder-utils.js';

/**
 * 提醒管理页面
 */
export function ReminderPage({ 
  reminders, 
  settings, 
  hasPermission, 
  onAdd, 
  onDelete, 
  onToggle, 
  onUpdateSettings, 
  onRequestPermission, 
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredReminders = reminders.filter(r => {
    if (activeTab === 'all') return true;
    return r.type === activeTab;
  });

  const tabLabels = {
    all: '全部',
    custom: '自定义',
    checkup: '产检',
    record: '记录',
    milestone: '里程碑'
  };

  return (
    <div className="detail-page reminder-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={onBack}>← 返回</button>
        <h1>⏰ 提醒管理</h1>
      </header>

      {/* 通知权限状态 */}
      {!hasPermission && (
        <div className="permission-banner">
          <span>🔔 开启通知可获得更好的提醒体验</span>
          <button type="button" onClick={onRequestPermission}>开启</button>
        </div>
      )}

      {/* Tab 切换 */}
      <div className="reminder-tabs">
        {['all', 'custom', 'checkup', 'record', 'milestone'].map(tab => (
          <button
            key={tab}
            type="button"
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* 提醒列表 */}
      <div className="reminder-list">
        {filteredReminders.length === 0 ? (
          <div className="list-empty">暂无提醒</div>
        ) : (
          filteredReminders.map(r => (
            <div key={r.id} className={`reminder-card ${r.enabled ? '' : 'disabled'}`}>
              <div className="reminder-card-main">
                <div className="reminder-card-left">
                  <span className="reminder-card-time">
                    {r.datetime ? formatReminderTime(r.datetime) : '重复提醒'}
                  </span>
                  <span className="reminder-card-title">{r.title}</span>
                  {r.description && (
                    <span className="reminder-card-desc">{r.description}</span>
                  )}
                </div>
                <div className="reminder-card-right">
                  <button 
                    type="button"
                    className="toggle-btn"
                    onClick={() => onToggle(r.id)}
                    title={r.enabled ? '点击关闭' : '点击开启'}
                  >
                    {r.enabled ? '🔔' : '🔕'}
                  </button>
                  {r.type === 'custom' && (
                    <button 
                      type="button"
                      className="delete-btn"
                      onClick={() => onDelete(r.id)}
                      title="删除"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 设置区域 */}
      <div className="reminder-settings">
        <h3>提醒设置</h3>

        {/* 产检提醒设置 */}
        <div className="setting-item">
          <span>产检自动提醒</span>
          <input
            type="checkbox"
            checked={settings?.checkup?.enabled ?? true}
            onChange={e => onUpdateSettings('checkup', { enabled: e.target.checked })}
          />
        </div>

        {/* 记录提醒设置 */}
        <div className="setting-item">
          <span>体重记录提醒</span>
          <input
            type="checkbox"
            checked={settings?.record?.weight?.enabled ?? false}
            onChange={e => onUpdateSettings('record', { 
              weight: { 
                ...(settings?.record?.weight || { times: ['21:00'], days: [1,2,3,4,5,6,0] }), 
                enabled: e.target.checked 
              }
            })}
          />
        </div>

        {/* 里程碑提醒设置 */}
        <div className="setting-item">
          <span>里程碑提醒</span>
          <input
            type="checkbox"
            checked={settings?.milestone?.trimesterChange ?? true}
            onChange={e => onUpdateSettings('milestone', { trimesterChange: e.target.checked })}
          />
        </div>

        {/* 平台说明 */}
        <div className="platform-notice">
          <h4>📱 提醒功能说明</h4>
          <ul>
            <li><strong>Android Chrome</strong>：支持后台通知</li>
            <li><strong>iOS Safari</strong>：建议添加到主屏幕</li>
            <li><strong>电脑浏览器</strong>：浏览器运行时可通知</li>
          </ul>
          <p className="notice-tip">💡 重要事项建议使用手机系统闹钟</p>
        </div>
      </div>

      {/* FAB 添加按钮 */}
      <button 
        type="button" 
        className="fab-add" 
        onClick={() => setShowAddModal(true)}
        title="添加提醒"
      >
        +
      </button>

      {/* 添加提醒弹窗 */}
      {showAddModal && (
        <AddReminderModal
          onAdd={(reminder) => {
            onAdd(reminder);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: 提交提醒管理页面**

```bash
git add src/app/ReminderPage.jsx
git commit -m "feat(reminder): add ReminderPage component"
```

---

## Task 7: 应用内提醒弹窗组件 - InAppAlert.jsx

**Files:**
- Create: `src/app/InAppAlert.jsx`

- [ ] **Step 1: 创建 InAppAlert.jsx**

```jsx
// src/app/InAppAlert.jsx

/**
 * 应用内提醒弹窗
 */
export function InAppAlert({ reminder, onDismiss }) {
  if (!reminder) return null;

  return (
    <div className="in-app-alert-overlay" onClick={onDismiss}>
      <div className="in-app-alert" onClick={e => e.stopPropagation()}>
        <div className="alert-icon">🔔</div>
        <div className="alert-content">
          <h3 className="alert-title">{reminder.title}</h3>
          {reminder.description && (
            <p className="alert-desc">{reminder.description}</p>
          )}
        </div>
        <div className="alert-actions">
          <button type="button" className="alert-btn-dismiss" onClick={onDismiss}>
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交应用内提醒弹窗**

```bash
git add src/app/InAppAlert.jsx
git commit -m "feat(reminder): add InAppAlert component"
```

---

## Task 8: 修改 Dashboard - 添加提醒入口卡片

**Files:**
- Modify: `src/app/Dashboard.jsx`

- [ ] **Step 1: 修改 Dashboard.jsx 导入和参数**

在 `Dashboard.jsx` 顶部添加导入：

```jsx
// 在现有导入后添加
import { formatReminderTime } from './reminder-utils.js';
```

修改函数签名，添加提醒相关 props：

```jsx
// 修改第11行
export function Dashboard({ info, checkupDone, toggleCheckup, weightRecords, preWeight, symptoms, onNavigate, onReset, 
  // 新增参数
  todayReminders, missedReminders, hasPermission, requestPermission, dismissMissed, onNavigateToReminder }) {
```

- [ ] **Step 2: 在症状记录入口之前添加提醒中心卡片**

在 `{/* 症状记录入口 */}` 注释前（约第250行）添加：

```jsx
      {/* 提醒中心 */}
      <section className="dash-section dash-reminder">
        <h2 className="section-title">⏰ 提醒中心</h2>
        
        {/* 错过的提醒 */}
        {missedReminders && missedReminders.length > 0 && (
          <div className="reminder-missed">
            <div className="missed-header">
              🔔 你有 {missedReminders.length} 条错过的提醒
            </div>
            {missedReminders.slice(0, 3).map(r => (
              <div key={r.id} className="missed-item">
                <span className="missed-title">{r.title}</span>
                <span className="missed-time">{formatReminderTime(r.datetime)}</span>
                <button type="button" onClick={() => dismissMissed(r.id)}>忽略</button>
              </div>
            ))}
          </div>
        )}
        
        {/* 今日提醒 */}
        {todayReminders && todayReminders.length > 0 ? (
          <div className="reminder-today">
            <div className="today-count">今日 {todayReminders.length} 项提醒</div>
            {todayReminders.slice(0, 3).map(r => (
              <div key={r.id} className="reminder-item">
                <span className="reminder-time">{r.datetime?.slice(11, 16) || '--:--'}</span>
                <span className="reminder-title">{r.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="reminder-empty">今日暂无提醒</div>
        )}
        
        {/* 通知权限提示 */}
        {!hasPermission && (
          <div className="reminder-permission-tip">
            <p>💡 开启通知权限，在应用后台时也能收到提醒</p>
            <button type="button" className="permission-btn" onClick={requestPermission}>开启通知</button>
          </div>
        )}
        
        <button type="button" className="reminder-manage-btn" onClick={onNavigateToReminder}>
          管理提醒 →
        </button>
      </section>
```

- [ ] **Step 3: 提交 Dashboard 修改**

```bash
git add src/app/Dashboard.jsx
git commit -m "feat(reminder): add reminder card to Dashboard"
```

---

## Task 9: 修改 App.jsx - 集成提醒系统

**Files:**
- Modify: `src/app/App.jsx`

- [ ] **Step 1: 添加导入**

在 `App.jsx` 顶部添加导入：

```jsx
import { useReminders } from './useReminders.js';
import { ReminderPage } from './ReminderPage.jsx';
import { InAppAlert } from './InAppAlert.jsx';
```

- [ ] **Step 2: 在 App 函数内调用 useReminders Hook**

在 `const [page, setPage] = useState('home');` 后添加：

```jsx
  // 提醒系统
  const {
    reminders,
    settings,
    missedReminders,
    todayReminders,
    hasPermission,
    currentAlert,
    addReminder,
    deleteReminder,
    toggleReminder,
    updateSettings,
    requestPermission,
    dismissAlert,
    dismissMissed
  } = useReminders(info);
```

- [ ] **Step 3: 添加 reminder 路由**

在 switch 语句中添加 case：

```jsx
    case 'reminder':
      return (
        <ReminderPage
          reminders={reminders}
          settings={settings}
          hasPermission={hasPermission}
          onAdd={addReminder}
          onDelete={deleteReminder}
          onToggle={toggleReminder}
          onUpdateSettings={updateSettings}
          onRequestPermission={requestPermission}
          onBack={() => setPage('home')}
        />
      );
```

- [ ] **Step 4: 修改 Dashboard 调用，传入提醒相关 props**

修改 default case 中的 Dashboard 调用：

```jsx
    default:
      return (
        <Dashboard 
          info={info} 
          checkupDone={checkupDone} 
          toggleCheckup={toggleCheckup} 
          weightRecords={weightRecords} 
          preWeight={preWeight} 
          symptoms={symptoms} 
          onNavigate={handleNavigate} 
          onReset={handleReset}
          // 提醒相关
          todayReminders={todayReminders}
          missedReminders={missedReminders}
          hasPermission={hasPermission}
          requestPermission={requestPermission}
          dismissMissed={dismissMissed}
          onNavigateToReminder={() => setPage('reminder')}
        />
      );
```

- [ ] **Step 5: 添加应用内提醒弹窗**

在 App 组件的 return 之前，switch 语句之后添加：

```jsx
  // 提醒弹窗（全局）
  const alertComponent = currentAlert ? (
    <InAppAlert reminder={currentAlert} onDismiss={dismissAlert} />
  ) : null;
```

然后修改每个 case 的 return，将 alertComponent 包裹进去。最简单的方式是在 switch 外面包一层：

```jsx
  // 渲染页面
  const pageContent = (() => {
    if (!ready) return null;

    // 未设置日期 → 显示设置页面
    if (!isSetup) {
      return (
        <SetupPage
          onSetup={(dateValue, mode) => {
            if (mode === 'lmp') setLmpDate(dateValue);
            else setDueDate(dateValue);
          }}
        />
      );
    }

    // 路由
    const handleNavigate = (key) => {
      if (key === 'home') {
        setPage('home');
      } else {
        setPage(key);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
      if (confirm('确定要重置所有数据吗？将清除已保存的日期、产检和体重记录。')) {
        resetData();
        setPage('home');
      }
    };

    switch (page) {
      case 'checkup':
        return <CheckupPage info={info} checkupDone={checkupDone} toggleCheckup={toggleCheckup} onBack={() => setPage('home')} />;
      case 'weight':
        return <WeightPage info={info} weightRecords={weightRecords} addWeight={addWeight} deleteWeight={deleteWeight} preWeight={preWeight} setPreWeight={setPreWeight} onBack={() => setPage('home')} />;
      case 'diet':
        return <DietPage info={info} onBack={() => setPage('home')} />;
      case 'life':
        return <LifestylePage info={info} onBack={() => setPage('home')} />;
      case 'dad':
        return <DadPage info={info} onBack={() => setPage('home')} />;
      case 'symptom':
        return <SymptomPage info={info} symptoms={symptoms} addSymptom={addSymptom} deleteSymptom={deleteSymptom} onBack={() => setPage('home')} />;
      case 'sync':
        return <SyncPage onBack={() => setPage('home')} reloadData={reloadData} />;
      case 'reminder':
        return (
          <ReminderPage
            reminders={reminders}
            settings={settings}
            hasPermission={hasPermission}
            onAdd={addReminder}
            onDelete={deleteReminder}
            onToggle={toggleReminder}
            onUpdateSettings={updateSettings}
            onRequestPermission={requestPermission}
            onBack={() => setPage('home')}
          />
        );
      default:
        return (
          <Dashboard 
            info={info} 
            checkupDone={checkupDone} 
            toggleCheckup={toggleCheckup} 
            weightRecords={weightRecords} 
            preWeight={preWeight} 
            symptoms={symptoms} 
            onNavigate={handleNavigate} 
            onReset={handleReset}
            todayReminders={todayReminders}
            missedReminders={missedReminders}
            hasPermission={hasPermission}
            requestPermission={requestPermission}
            dismissMissed={dismissMissed}
            onNavigateToReminder={() => setPage('reminder')}
          />
        );
    }
  })();

  return (
    <>
      {pageContent}
      {currentAlert && <InAppAlert reminder={currentAlert} onDismiss={dismissAlert} />}
    </>
  );
```

- [ ] **Step 6: 提交 App.jsx 修改**

```bash
git add src/app/App.jsx
git commit -m "feat(reminder): integrate reminder system into App"
```

---

## Task 10: 添加样式

**Files:**
- Modify: `src/styles/index.css`（或项目使用的样式文件）

- [ ] **Step 1: 添加提醒相关样式**

在样式文件末尾添加：

```css
/* ========================================
   提醒系统样式
   ======================================== */

/* Dashboard 提醒卡片 */
.dash-reminder {
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
}

.dash-reminder .section-title {
  color: #d97706;
}

/* 错过的提醒 */
.reminder-missed {
  background: #fef3c7;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.missed-header {
  font-weight: 600;
  color: #92400e;
  margin-bottom: 8px;
}

.missed-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #fcd34d;
}

.missed-item:last-child {
  border-bottom: none;
}

.missed-title {
  flex: 1;
  font-size: 14px;
}

.missed-time {
  font-size: 12px;
  color: #92400e;
}

.missed-item button {
  padding: 4px 8px;
  font-size: 12px;
  background: #fff;
  border: 1px solid #f59e0b;
  border-radius: 4px;
  cursor: pointer;
}

/* 今日提醒 */
.reminder-today {
  margin-bottom: 12px;
}

.today-count {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.reminder-item:last-child {
  border-bottom: none;
}

.reminder-time {
  font-size: 14px;
  font-weight: 600;
  color: #d97706;
  min-width: 50px;
}

.reminder-title {
  flex: 1;
  font-size: 14px;
}

.reminder-empty {
  text-align: center;
  color: #9ca3af;
  padding: 20px 0;
  font-size: 14px;
}

/* 通知权限提示 */
.reminder-permission-tip {
  background: #eff6ff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  text-align: center;
}

.reminder-permission-tip p {
  font-size: 13px;
  color: #1e40af;
  margin-bottom: 8px;
}

.permission-btn {
  padding: 6px 16px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.permission-btn:hover {
  background: #2563eb;
}

/* 管理提醒按钮 */
.reminder-manage-btn {
  width: 100%;
  padding: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #d97706;
  cursor: pointer;
  text-align: center;
}

.reminder-manage-btn:hover {
  background: #fef3c7;
}

/* ========================================
   提醒管理页面
   ======================================== */

.reminder-page {
  background: #f9fafb;
}

/* 权限横幅 */
.permission-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #eff6ff;
  border-bottom: 1px solid #bfdbfe;
}

.permission-banner span {
  font-size: 14px;
  color: #1e40af;
}

.permission-banner button {
  padding: 6px 12px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

/* Tab 切换 */
.reminder-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
}

.tab-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
}

.tab-btn.active {
  background: #d97706;
  color: #fff;
}

/* 提醒列表 */
.reminder-list {
  padding: 16px;
}

.list-empty {
  text-align: center;
  color: #9ca3af;
  padding: 40px 0;
  font-size: 14px;
}

.reminder-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.reminder-card.disabled {
  opacity: 0.5;
}

.reminder-card-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.reminder-card-left {
  flex: 1;
}

.reminder-card-time {
  display: block;
  font-size: 12px;
  color: #d97706;
  margin-bottom: 4px;
}

.reminder-card-title {
  display: block;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
}

.reminder-card-desc {
  display: block;
  font-size: 13px;
  color: #6b7280;
}

.reminder-card-right {
  display: flex;
  gap: 8px;
}

.toggle-btn,
.delete-btn {
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

/* 设置区域 */
.reminder-settings {
  padding: 16px;
  background: #fff;
  margin-top: 16px;
}

.reminder-settings h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.setting-item span {
  font-size: 14px;
}

.setting-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* 平台说明 */
.platform-notice {
  margin-top: 16px;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
}

.platform-notice h4 {
  font-size: 14px;
  margin-bottom: 8px;
}

.platform-notice ul {
  list-style: none;
  padding: 0;
  margin: 0 0 8px 0;
}

.platform-notice li {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.notice-tip {
  font-size: 12px;
  color: #92400e;
  margin: 0;
}

/* FAB 按钮 */
.fab-add {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #d97706;
  color: #fff;
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);
  z-index: 100;
}

.fab-add:hover {
  background: #b45309;
}

/* ========================================
   模态框样式
   ======================================== */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h2 {
  font-size: 18px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #d97706;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.btn-cancel {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #6b7280;
}

.btn-confirm {
  background: #d97706;
  border: none;
  color: #fff;
}

.btn-confirm:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.btn-confirm:not(:disabled):hover {
  background: #b45309;
}

/* ========================================
   应用内提醒弹窗
   ======================================== */

.in-app-alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
}

.in-app-alert {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  text-align: center;
  animation: alert-pop 0.3s ease-out;
}

@keyframes alert-pop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.alert-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.alert-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.alert-desc {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

.alert-btn-dismiss {
  width: 100%;
  padding: 12px;
  background: #d97706;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}

.alert-btn-dismiss:hover {
  background: #b45309;
}
```

- [ ] **Step 2: 提交样式**

```bash
git add src/styles/index.css
git commit -m "feat(reminder): add reminder system styles"
```

---

## Task 11: 添加导航入口

**Files:**
- Modify: `src/app/Dashboard.jsx`

- [ ] **Step 1: 在 Dashboard 导航 tabs 中添加提醒入口**

修改 Dashboard.jsx 中的导航 tabs 数组（约第65-72行），在 `dad` 后添加 `reminder`：

```jsx
      <nav className="dash-nav">
        {[
          { key: 'home', label: '今日', icon: '🏠' },
          { key: 'checkup', label: '产检', icon: '🏥' },
          { key: 'weight', label: '体重', icon: '⚖️' },
          { key: 'diet', label: '饮食', icon: '🍽' },
          { key: 'life', label: '生活', icon: '📋' },
          { key: 'dad', label: '准爸爸', icon: '👨' },
          { key: 'reminder', label: '提醒', icon: '⏰' },
        ].map(tab => (
```

- [ ] **Step 2: 提交导航修改**

```bash
git add src/app/Dashboard.jsx
git commit -m "feat(reminder): add reminder tab to navigation"
```

---

## Task 12: 最终验证和测试

- [ ] **Step 1: 运行 lint 检查**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 2: 运行开发服务器**

```bash
npm run dev
```

Expected: Server starts successfully

- [ ] **Step 3: 手动测试清单**

1. 打开应用，检查 Dashboard 是否显示提醒中心卡片
2. 点击"管理提醒"，进入提醒管理页面
3. 点击 FAB 按钮，打开添加提醒弹窗
4. 添加一个测试提醒（如 2 分钟后）
5. 等待提醒触发，检查是否显示应用内弹窗
6. 点击通知权限按钮，测试权限请求流程
7. 检查产检提醒是否根据当前孕周自动生成
8. 测试提醒的开启/关闭/删除功能

- [ ] **Step 4: 提交最终修改**

```bash
git add -A
git commit -m "feat(reminder): complete reminder system implementation"
```

---

## 实现顺序总结

1. **数据层** → reminder-data.js
2. **工具函数** → reminder-utils.js
3. **通知服务** → notification-service.js
4. **核心 Hook** → useReminders.js
5. **UI 组件** → AddReminderModal.jsx, ReminderPage.jsx, InAppAlert.jsx
6. **集成** → Dashboard.jsx, App.jsx
7. **样式** → index.css
8. **导航** → Dashboard tabs
9. **验证** → lint + 手动测试
