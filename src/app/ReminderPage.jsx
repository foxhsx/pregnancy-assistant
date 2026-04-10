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

      {!hasPermission && (
        <div className="permission-banner">
          <span>🔔 开启通知可获得更好的提醒体验</span>
          <button type="button" onClick={onRequestPermission}>开启</button>
        </div>
      )}

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

      <div className="reminder-settings">
        <h3>提醒设置</h3>

        <div className="setting-item">
          <span>产检自动提醒</span>
          <input
            type="checkbox"
            checked={settings?.checkup?.enabled ?? true}
            onChange={e => onUpdateSettings('checkup', { enabled: e.target.checked })}
          />
        </div>

        <div className="setting-item">
          <span>体重记录提醒</span>
          <input
            type="checkbox"
            checked={settings?.record?.weight?.enabled ?? false}
            onChange={e => onUpdateSettings('record', {
              weight: {
                ...(settings?.record?.weight || { times: ['21:00'], days: [1, 2, 3, 4, 5, 6, 0] }),
                enabled: e.target.checked
              }
            })}
          />
        </div>

        <div className="setting-item">
          <span>里程碑提醒</span>
          <input
            type="checkbox"
            checked={settings?.milestone?.trimesterChange ?? true}
            onChange={e => onUpdateSettings('milestone', { trimesterChange: e.target.checked })}
          />
        </div>

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

      <button
        type="button"
        className="fab-add"
        onClick={() => setShowAddModal(true)}
        title="添加提醒"
      >
        +
      </button>

      {showAddModal && (
        <AddReminderModal
          onAdd={reminder => {
            onAdd(reminder);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
