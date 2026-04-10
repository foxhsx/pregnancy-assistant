// src/app/AddReminderModal.jsx

import { useEffect, useRef, useState } from 'react';

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
  const titleInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

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

  const handleOverlayKeyDown = e => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <button
        type="button"
        className="modal-backdrop"
        aria-label="关闭添加提醒弹窗"
        onClick={onClose}
      />
      <div
        className="modal-content"
        onKeyDown={handleOverlayKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-reminder-title"
      >
        <h2 id="add-reminder-title">添加提醒</h2>

        <div className="form-group">
          <label htmlFor="reminder-title">标题 *</label>
          <input
            id="reminder-title"
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="如：产检提醒"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reminder-description">描述</label>
          <textarea
            id="reminder-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="详细说明（可选）"
            rows={2}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reminder-date">日期 *</label>
            <input
              id="reminder-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={getMinDate()}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reminder-time">时间</label>
            <input
              id="reminder-time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reminder-repeat">重复</label>
          <select id="reminder-repeat" value={repeat} onChange={e => setRepeat(e.target.value)}>
            <option value="none">不重复</option>
            <option value="daily">每天</option>
            <option value="weekly">每周</option>
            <option value="monthly">每月</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reminder-advance">提前提醒</label>
          <select id="reminder-advance" value={advance} onChange={e => setAdvance(Number(e.target.value))}>
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
