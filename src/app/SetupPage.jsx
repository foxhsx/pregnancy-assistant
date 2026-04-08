import { useState } from 'react';

/**
 * 初始设置页面 - 输入末次月经日期或预产期
 */
export function SetupPage({ onSetup, onBack }) {
  const [mode, setMode] = useState('lmp'); // 'lmp' 或 'due'
  const [dateValue, setDateValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dateValue) return;
    onSetup(dateValue, mode);
  };

  return (
    <div className="setup-page">
      <div className="setup-card">
        <div className="setup-header">
          <span className="setup-logo">🤰</span>
          <h1>欢迎使用孕期助手</h1>
          <p>输入您的信息，获得个性化孕期指导</p>
        </div>

        <div className="setup-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${mode === 'lmp' ? 'active' : ''}`}
            onClick={() => setMode('lmp')}
          >
            末次月经日期
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'due' ? 'active' : ''}`}
            onClick={() => setMode('due')}
          >
            预产期
          </button>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <label className="setup-label" htmlFor="setup-date-input">
            {mode === 'lmp' ? '末次月经第一天' : '预产期'}
          </label>
          <input
            id="setup-date-input"
            type="date"
            className="setup-input"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            required
          />

          <div className="setup-hint">
            {mode === 'lmp'
              ? '请输入您最后一次月经的第一天日期，我们将据此计算预产期和孕周'
              : '如果您已经知道预产期（如B超推算），可以直接输入'}
          </div>

          <button type="submit" className="setup-submit" disabled={!dateValue}>
            开始使用
          </button>
        </form>

        {onBack && (
          <button type="button" className="setup-back" onClick={onBack}>
            ← 返回
          </button>
        )}
      </div>
    </div>
  );
}
