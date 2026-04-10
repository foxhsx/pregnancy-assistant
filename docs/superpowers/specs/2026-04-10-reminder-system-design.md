# 定时提醒系统设计

## 概述

在孕期助手 SPA 中新增定时提醒系统，帮助孕妈管理产检、记录、自定义事项等提醒。由于项目为纯前端应用（无后端），采用应用内提醒为主、浏览器通知为辅的混合策略。

## 需求范围

### 支持的提醒类型

| 类型 | 说明 | 触发方式 |
|------|------|----------|
| **用户自定义** | 产检日期、服药、产教课等用户自行添加 | 用户创建 |
| **产检自动提醒** | 根据孕周自动提醒本周应做的产检 | 自动生成 |
| **记录提醒** | 提醒用户记录体重、症状等 | 用户设置频率 |
| **里程碑提醒** | 孕期重要节点通知 | 自动生成 |

### 提醒时间设置

- **用户自定义事项**：支持自定义日期和时间，可选提前提醒（提前5分钟/1小时/1天/3天）
- **记录提醒**：用户自定义提醒时间（可设置多个时间段）和生效日期（如工作日/周末）
- **产检提醒**：进入产检周范围时提醒 + 窗口期结束前3天提醒
- **里程碑提醒**：孕期阶段变化当天提醒

---

## 技术方案

### 平台兼容性约束

| 平台 | 应用内提醒 | 浏览器通知 | 后台通知 |
|------|-----------|-----------|---------|
| Android Chrome | ✅ | ✅ | ✅ |
| iOS Safari | ✅ | ⚠️ 需添加到主屏幕 | ⚠️ 可能延迟 |
| 桌面浏览器 | ✅ | ✅ | ❌ 浏览器关闭后无效 |

**核心策略**：应用内提醒为主，浏览器通知为增强功能。

### 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    提醒系统架构                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │ ReminderPage │    │ ReminderCard │                  │
│  │  (提醒管理)   │    │ (Dashboard)  │                  │
│  └──────┬───────┘    └──────┬───────┘                  │
│         │                   │                          │
│         └─────────┬─────────┘                          │
│                   ▼                                    │
│         ┌──────────────────┐                           │
│         │  useReminders    │  (提醒状态管理 Hook)       │
│         │    Hook          │                           │
│         └────────┬─────────┘                           │
│                  │                                     │
│    ┌─────────────┼─────────────┐                       │
│    ▼             ▼             ▼                       │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│ │reminder- │ │notification│ │ reminder │                │
│ │  data.js │ │-service.js│ │-utils.js │                │
│ │(数据层)   │ │(通知服务)  │ │(工具函数) │                │
│ └──────────┘ └──────────┘ └──────────┘                │
│                  │                                     │
│                  ▼                                     │
│         ┌──────────────────┐                           │
│         │  Service Worker  │  (后台通知，可选)          │
│         │  sw.js           │                           │
│         └──────────────────┘                           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              localStorage                        │  │
│  │  - yunqi_reminders (用户提醒)                     │  │
│  │  - yunqi_reminder_settings (提醒设置)             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 数据模型

### 1. 用户自定义提醒

```js
// localStorage key: 'yunqi_reminders'
{
  reminders: [
    {
      id: 'uuid',
      type: 'custom',
      title: '产检提醒',
      description: '去市一院做NT检查',
      datetime: '2026-04-15T10:00:00',  // ISO 格式
      repeat: null,  // null | 'daily' | 'weekly' | 'monthly'
      advanceMinutes: 0,  // 提前提醒分钟数：0 | 5 | 60 | 1440 | 4320
      enabled: true,
      createdAt: '2026-04-10T08:00:00',
      lastTriggered: null  // 最后触发时间
    }
  ]
}
```

### 2. 产检自动提醒

基于 `checkup-data.js` 自动生成，设置存储在 localStorage。

```js
// localStorage key: 'yunqi_checkup_reminder_settings'
{
  enabled: true,
  enterWeekNotify: true,   // 进入产检周时提醒
  deadlineNotify: true,    // 窗口期结束前提醒
  advanceDays: 3           // 提前天数
}
```

### 3. 记录提醒

```js
// localStorage key: 'yunqi_record_reminder_settings'
{
  weight: {
    enabled: true,
    times: ['21:00'],  // 可设置多个时间
    days: [1, 2, 3, 4, 5, 6, 0]  // 0=周日，1-6=周一至周六
  },
  symptom: {
    enabled: false,
    times: [],
    days: []
  }
}
```

### 4. 里程碑提醒

```js
// localStorage key: 'yunqi_milestone_reminder_settings'
{
  trimesterChange: true,    // 孕期阶段变化（进入孕中期/孕晚期）
  dueDateApproaching: true  // 预产期临近（提前7天、提前1天）
}
```

### 5. 通知权限状态

```js
// localStorage key: 'yunqi_notification_settings'
{
  permissionAsked: true,     // 是否已请求过权限
  permissionStatus: 'granted' | 'denied' | 'default'
}
```

---

## 核心模块

### 1. useReminders Hook

```js
// src/app/useReminders.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadReminders, saveReminders, loadSettings, saveSettings } from './reminder-data.js';
import { NotificationService } from './notification-service.js';
import { checkMissedReminders, getTodayReminders, generateAutoReminders } from './reminder-utils.js';

export function useReminders(info) {
  const [reminders, setReminders] = useState([]);
  const [settings, setSettings] = useState({
    checkup: { enabled: true, enterWeekNotify: true, deadlineNotify: true, advanceDays: 3 },
    record: { weight: { enabled: true, times: ['21:00'], days: [1,2,3,4,5,6,0] }, symptom: { enabled: false, times: [], days: [] } },
    milestone: { trimesterChange: true, dueDateApproaching: true }
  });
  const [missedReminders, setMissedReminders] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  
  const checkIntervalRef = useRef(null);
  
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
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);
  
  // 根据孕周生成自动提醒
  useEffect(() => {
    if (info && settings) {
      const autoReminders = generateAutoReminders(info, settings, reminders);
      if (autoReminders.length > 0) {
        setReminders(prev => {
          const next = [...prev, ...autoReminders];
          saveReminders(next);
          return next;
        });
      }
    }
  }, [info?.weeks, settings]);
  
  // 检查并触发提醒
  const checkAndTriggerReminders = useCallback(() => {
    const now = new Date();
    const toTrigger = reminders.filter(r => {
      if (!r.enabled) return false;
      const triggerTime = new Date(r.datetime);
      return triggerTime <= now && (!r.lastTriggered || new Date(r.lastTriggered) < triggerTime);
    });
    
    toTrigger.forEach(r => {
      // 应用内提醒
      showInAppAlert(r);
      
      // 浏览器通知（如果有权限）
      if (hasPermission) {
        NotificationService.show(r.title, { body: r.description });
      }
      
      // 更新 lastTriggered
      setReminders(prev => {
        const next = prev.map(item => 
          item.id === r.id ? { ...item, lastTriggered: now.toISOString() } : item
        );
        saveReminders(next);
        return next;
      });
    });
  }, [reminders, hasPermission]);
  
  // 添加自定义提醒
  const addReminder = useCallback((reminder) => {
    const newReminder = {
      id: crypto.randomUUID(),
      type: 'custom',
      ...reminder,
      enabled: true,
      createdAt: new Date().toISOString(),
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
      const next = { ...prev, [category]: { ...prev[category], ...updates } };
      saveSettings(next);
      return next;
    });
  }, []);
  
  // 获取今日提醒
  const todayReminders = getTodayReminders(reminders);
  
  return {
    reminders,
    settings,
    missedReminders,
    todayReminders,
    hasPermission,
    addReminder,
    deleteReminder,
    updateReminder,
    toggleReminder,
    updateSettings,
    requestPermission,
    dismissMissed: (id) => setMissedReminders(prev => prev.filter(r => r.id !== id))
  };
}
```

### 2. NotificationService

```js
// src/app/notification-service.js

export const NotificationService = {
  /**
   * 检查浏览器是否支持通知
   */
  isSupported() {
    return 'Notification' in window;
  },
  
  /**
   * 请求通知权限
   */
  async requestPermission() {
    if (!this.isSupported()) return 'unsupported';
    
    // iOS 要求必须从用户手势触发
    const result = await Notification.requestPermission();
    return result; // 'granted' | 'denied' | 'default'
  },
  
  /**
   * 获取当前权限状态
   */
  getPermissionStatus() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },
  
  /**
   * 发送通知
   */
  async show(title, options = {}) {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return null;
    }
    
    const notification = new Notification(title, {
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: options.tag || `reminder-${Date.now()}`,
      requireInteraction: true,
      ...options
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) options.onClick();
    };
    
    return notification;
  }
};
```

### 3. reminder-utils.js

```js
// src/app/reminder-utils.js

import { checkupSchedule } from './checkup-data.js';

/**
 * 检查错过的提醒
 */
export function checkMissedReminders(reminders) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  
  return reminders.filter(r => {
    if (!r.enabled || r.type === 'record') return false;
    const triggerTime = new Date(r.datetime);
    return triggerTime < now && !r.lastTriggered;
  });
}

/**
 * 获取今日提醒
 */
export function getTodayReminders(reminders) {
  const today = new Date().toISOString().slice(0, 10);
  
  return reminders.filter(r => {
    if (!r.enabled) return false;
    
    // 一次性提醒
    if (r.datetime) {
      return r.datetime.slice(0, 10) === today;
    }
    
    // 重复提醒
    if (r.repeat === 'daily') return true;
    if (r.repeat === 'weekly') {
      const dayOfWeek = new Date().getDay();
      return new Date(r.datetime).getDay() === dayOfWeek;
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
 */
export function generateAutoReminders(info, settings, existingReminders) {
  const newReminders = [];
  const existingIds = new Set(existingReminders.map(r => r.id));
  
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
            datetime: new Date().toISOString(),
            checkupName: checkup.name,
            enabled: true
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
          datetime: new Date().toISOString(),
          enabled: true
        });
      }
    });
  }
  
  return newReminders;
}

/**
 * 格式化提醒时间显示
 */
export function formatReminderTime(datetime) {
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
  
  return `${targetDate} ${datetime.slice(11, 16)}`;
}
```

### 4. reminder-data.js

```js
// src/app/reminder-data.js

const REMINDERS_KEY = 'yunqi_reminders';
const SETTINGS_KEY = 'yunqi_reminder_settings';

const defaultSettings = {
  checkup: { enabled: true, enterWeekNotify: true, deadlineNotify: true, advanceDays: 3 },
  record: {
    weight: { enabled: true, times: ['21:00'], days: [1,2,3,4,5,6,0] },
    symptom: { enabled: false, times: [], days: [] }
  },
  milestone: { trimesterChange: true, dueDateApproaching: true }
};

export function loadReminders() {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReminders(reminders) {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
```

---

## UI 设计

### 1. Dashboard 提醒入口卡片

在 Dashboard 底部（症状记录入口之前）添加提醒中心卡片。

```jsx
{/* 提醒中心 */}
<section className="dash-section dash-reminder">
  <h2 className="section-title">⏰ 提醒中心</h2>
  
  {/* 错过的提醒 */}
  {missedReminders.length > 0 && (
    <div className="reminder-missed">
      <div className="missed-header">
        🔔 你有 {missedReminders.length} 条错过的提醒
      </div>
      {missedReminders.slice(0, 3).map(r => (
        <div key={r.id} className="missed-item">
          <span className="missed-title">{r.title}</span>
          <span className="missed-time">{formatReminderTime(r.datetime)}</span>
          <button onClick={() => dismissMissed(r.id)}>忽略</button>
        </div>
      ))}
    </div>
  )}
  
  {/* 今日提醒 */}
  {todayReminders.length > 0 ? (
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
      <button className="permission-btn" onClick={requestPermission}>开启通知</button>
    </div>
  )}
  
  <button className="reminder-manage-btn" onClick={() => onNavigate('reminder')}>
    管理提醒 →
  </button>
</section>
```

### 2. 提醒管理页面 (ReminderPage)

独立页面，Tab 布局管理各类型提醒。

```jsx
// src/app/ReminderPage.jsx

export function ReminderPage({ reminders, settings, hasPermission, onAdd, onDelete, onToggle, onUpdateSettings, onRequestPermission, onBack }) {
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const filteredReminders = reminders.filter(r => {
    if (activeTab === 'all') return true;
    return r.type === activeTab;
  });
  
  return (
    <div className="detail-page reminder-page">
      <header className="detail-header">
        <button className="back-btn" onClick={onBack}>← 返回</button>
        <h1>⏰ 提醒管理</h1>
      </header>
      
      {/* 通知权限状态 */}
      {!hasPermission && (
        <div className="permission-banner">
          <span>🔔 开启通知可获得更好的提醒体验</span>
          <button onClick={onRequestPermission}>开启</button>
        </div>
      )}
      
      {/* Tab 切换 */}
      <div className="reminder-tabs">
        {['all', 'custom', 'checkup', 'record', 'milestone'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? '全部' : 
             tab === 'custom' ? '自定义' :
             tab === 'checkup' ? '产检' :
             tab === 'record' ? '记录' : '里程碑'}
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
                    className="toggle-btn"
                    onClick={() => onToggle(r.id)}
                  >
                    {r.enabled ? '🔔' : '🔕'}
                  </button>
                  {r.type === 'custom' && (
                    <button 
                      className="delete-btn"
                      onClick={() => onDelete(r.id)}
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
            checked={settings.checkup?.enabled}
            onChange={(e) => onUpdateSettings('checkup', { enabled: e.target.checked })}
          />
        </div>
        
        {/* 记录提醒设置 */}
        <div className="setting-item">
          <span>体重记录提醒</span>
          <input
            type="checkbox"
            checked={settings.record?.weight?.enabled}
            onChange={(e) => onUpdateSettings('record', { 
              weight: { ...settings.record.weight, enabled: e.target.checked }
            })}
          />
        </div>
        
        {/* 里程碑提醒设置 */}
        <div className="setting-item">
          <span>里程碑提醒</span>
          <input
            type="checkbox"
            checked={settings.milestone?.trimesterChange}
            onChange={(e) => onUpdateSettings('milestone', { trimesterChange: e.target.checked })}
          />
        </div>
      </div>
      
      {/* FAB 添加按钮 */}
      <button className="fab-add" onClick={() => setShowAddModal(true)}>
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

### 3. 添加提醒弹窗

```jsx
// src/app/AddReminderModal.jsx

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
          />
        </div>
        
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="详细说明（可选）"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>日期 *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
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
          <button className="btn-cancel" onClick={onClose}>取消</button>
          <button className="btn-confirm" onClick={handleSubmit}>确定</button>
        </div>
      </div>
    </div>
  );
}
```

---

## 平台兼容性说明

在设置页面底部添加说明文字：

```jsx
<div className="platform-notice">
  <h4>📱 提醒功能说明</h4>
  <ul>
    <li><strong>Android Chrome</strong>：支持后台通知，需开启通知权限</li>
    <li><strong>iOS Safari</strong>：建议将应用"添加到主屏幕"，浏览器关闭时通知可能延迟</li>
    <li><strong>电脑浏览器</strong>：浏览器运行时可接收通知，关闭后无法通知</li>
  </ul>
  <p className="notice-tip">💡 重要事项建议使用手机系统闹钟作为双重保障</p>
</div>
```

---

## 依赖

- 复用现有 `usePregnancy` hook 获取孕周信息
- 复用现有 `checkup-data.js` 产检时间表
- 复用 Dashboard card 样式
- 无需新增 npm 依赖

---

## 页面路由

与现有页面结构一致，通过 `onNavigate('reminder')` 切换。

在 `App.jsx` 中添加：

```jsx
case 'reminder':
  return <ReminderPage {...reminderProps} onBack={() => setPage('home')} />;
```

---

## 优先级

1. **核心功能**：useReminders Hook + localStorage 数据层
2. **UI 层**：Dashboard 提醒卡片 + 提醒管理页面
3. **增强功能**：添加提醒弹窗 + 通知权限集成
4. **自动提醒**：产检/里程碑自动生成逻辑

---

## 测试要点

1. 创建/编辑/删除自定义提醒
2. 应用打开时的提醒触发
3. 错过提醒的检测和显示
4. 通知权限请求流程
5. 产检周变化时的自动提醒生成
6. 跨天后的日期计算正确性
