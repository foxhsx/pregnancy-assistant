import { useState, useEffect, useCallback } from 'react';
import { calcPregnancyInfo, lmpFromDueDate, formatDate } from './utils.js';

const STORAGE_KEY = 'yunqi_user_data';
const SYMPTOM_KEY = 'yunqi_symptoms';
const WEIGHT_KEY = 'yunqi_weight_records';
const CHECKUP_KEY = 'yunqi_checkup_done';
const PRE_WEIGHT_KEY = 'yunqi_pre_weight';

/**
 * 读取 localStorage 中的用户数据
 */
function loadUserData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUserData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * 读取体重记录 [{date, weight, week}]
 */
function loadWeightRecords() {
  try {
    const raw = localStorage.getItem(WEIGHT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWeightRecords(records) {
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(records));
}

/**
 * 读取孕前体重
 */
function loadPreWeight() {
  try {
    const raw = localStorage.getItem(PRE_WEIGHT_KEY);
    return raw ? parseFloat(raw) : null;
  } catch {
    return null;
  }
}

function savePreWeight(w) {
  localStorage.setItem(PRE_WEIGHT_KEY, String(w));
}

/**
 * 读取产检打卡记录 { checkupName: "2026-04-08" | null }
 */
function loadCheckupRecords() {
  try {
    const raw = localStorage.getItem(CHECKUP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCheckupRecords(records) {
  localStorage.setItem(CHECKUP_KEY, JSON.stringify(records));
}

function loadSymptoms() {
  try {
    const raw = localStorage.getItem(SYMPTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSymptoms(records) {
  localStorage.setItem(SYMPTOM_KEY, JSON.stringify(records));
}

/**
 * 主 Hook：管理用户的孕期数据
 */
export function usePregnancy() {
  const [lmpDate, setLmpDateState] = useState(null);
  const [checkupDone, setCheckupDone] = useState({});
  const [weightRecords, setWeightRecords] = useState([]);
  const [preWeight, setPreWeightState] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [ready, setReady] = useState(false);

  // 初始化：从 localStorage 读取
  useEffect(() => {
    const saved = loadUserData();
    if (saved?.lmpDate) {
      setLmpDateState(saved.lmpDate);
    }
    setCheckupDone(loadCheckupRecords());
    setWeightRecords(loadWeightRecords());
    setSymptoms(loadSymptoms());
    setPreWeightState(loadPreWeight());
    setReady(true);
  }, []);

  const setLmpDate = useCallback((dateStr) => {
    setLmpDateState(dateStr);
    saveUserData({ lmpDate: dateStr });
  }, []);

  const setDueDate = useCallback((dueDateStr) => {
    const lmp = lmpFromDueDate(dueDateStr);
    const lmpStr = formatDate(lmp);
    setLmpDateState(lmpStr);
    saveUserData({ lmpDate: lmpStr });
  }, []);

  const toggleCheckup = useCallback((checkupName) => {
    setCheckupDone(prev => {
      const next = { ...prev };
      if (next[checkupName]) {
        delete next[checkupName];
      } else {
        next[checkupName] = new Date().toISOString().slice(0, 10);
      }
      saveCheckupRecords(next);
      return next;
    });
  }, []);

  const addWeight = useCallback((date, weight, week) => {
    setWeightRecords(prev => {
      const next = [...prev, { date, weight, week }].sort((a, b) => a.date.localeCompare(b.date));
      saveWeightRecords(next);
      return next;
    });
  }, []);

  const deleteWeight = useCallback((date) => {
    setWeightRecords(prev => {
      const next = prev.filter(r => r.date !== date);
      saveWeightRecords(next);
      return next;
    });
  }, []);

  const addSymptom = useCallback((record) => {
    setSymptoms(prev => {
      const existing = prev.findIndex(r => r.date === record.date);
      let next;
      if (existing >= 0) {
        // 更新当天的记录，追加 entries
        next = prev.map((r, i) => i === existing ? { ...r, entries: [...r.entries, record.entries[0]] } : r);
      } else {
        next = [...prev, record].sort((a, b) => a.date.localeCompare(b.date));
      }
      saveSymptoms(next);
      return next;
    });
  }, []);

  const deleteSymptom = useCallback((date, entryId) => {
    setSymptoms(prev => {
      let next = prev.map(r => {
        if (r.date === date) {
          return { ...r, entries: r.entries.filter(e => e.id !== entryId) };
        }
        return r;
      }).filter(r => r.entries.length > 0);
      saveSymptoms(next);
      return next;
    });
  }, []);

  const updateSymptomEntry = useCallback((date, entryId, updates) => {
    setSymptoms(prev => {
      const next = prev.map(r => {
        if (r.date === date) {
          return {
            ...r,
            entries: r.entries.map(e => e.id === entryId ? { ...e, ...updates } : e),
          };
        }
        return r;
      });
      saveSymptoms(next);
      return next;
    });
  }, []);

  const setPreWeight = useCallback((w) => {
    const val = w ? parseFloat(w) : null;
    setPreWeightState(val);
    if (val) savePreWeight(val);
    else localStorage.removeItem(PRE_WEIGHT_KEY);
  }, []);

  const resetData = useCallback(() => {
    setLmpDateState(null);
    setCheckupDone({});
    setWeightRecords([]);
    setPreWeightState(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CHECKUP_KEY);
    localStorage.removeItem(WEIGHT_KEY);
    localStorage.removeItem(PRE_WEIGHT_KEY);
    localStorage.removeItem(SYMPTOM_KEY);
  }, []);

  // 计算当前孕周信息
  const info = lmpDate ? calcPregnancyInfo(lmpDate) : null;

  return {
    ready,
    lmpDate,
    info,
    isSetup: !!lmpDate,
    setLmpDate,
    setDueDate,
    checkupDone,
    toggleCheckup,
    weightRecords,
    addWeight,
    deleteWeight,
    preWeight,
    setPreWeight,
    resetData,
    symptoms,
    addSymptom,
    deleteSymptom,
    updateSymptomEntry,
  };
}
