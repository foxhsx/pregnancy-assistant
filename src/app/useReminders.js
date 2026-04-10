// src/app/useReminders.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadReminders, saveReminders, loadSettings, saveSettings } from './reminder-data.js';
import { NotificationService, SpeechService } from './notification-service.js';
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
 * 语音播报提醒
 */
function speakReminder(reminder, speechSettings) {
  if (!speechSettings?.enabled) return;
  
  const text = reminder.description 
    ? `${reminder.title}。${reminder.description}`
    : reminder.title;
  
  SpeechService.speak(text, { rate: speechSettings.rate || 1.0 });
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
  const hasPermissionRef = useRef(false);
  const settingsRef = useRef(null);

  // 同步 settings 到 ref
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

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

          // 语音播报
          speakReminder(r, settingsRef.current?.speech);

          // 浏览器通知
          if (hasPermissionRef.current) {
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
  }, []);

  // 注册应用内提醒处理
  useEffect(() => {
    setInAppAlertHandler((reminder) => {
      setCurrentAlert(reminder);
    });
  }, []);

  useEffect(() => {
    hasPermissionRef.current = hasPermission;
  }, [hasPermission]);

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
  }, [checkAndTriggerReminders]);

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
  }, [info, settings, reminders]);

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
  }, [settings]);

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
