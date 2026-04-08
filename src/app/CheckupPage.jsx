import { useState } from 'react';
import { checkupSchedule } from './checkup-data.js';

/**
 * 产检日历页面 - 完整时间线（增强版，展示目的和注意事项）
 */
export function CheckupPage({ info, checkupDone, toggleCheckup, onBack }) {
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (name) => {
    setExpandedItem(prev => prev === name ? null : name);
  };

  return (
    <div className="detail-page checkup-detail-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={onBack}>← 返回</button>
        <h1>🏥 产检日历</h1>
        <div className="header-week">{info.formatted} · {info.trimesterLabel}</div>
      </header>

      <div className="checkup-timeline">
        {checkupSchedule.map(c => {
          const isPast = info.weeks > c.weekEnd;
          const isCurrent = info.weeks >= c.week && info.weeks <= c.weekEnd;
          const isDone = checkupDone[c.name];
          const isExpanded = expandedItem === c.name;
          const statusClass = isDone ? 'done' : isCurrent ? 'current' : isPast ? 'past' : 'future';

          return (
            <div key={c.name} className={`timeline-item ${statusClass} ${c.important ? 'important' : ''}`}>
              <div className="timeline-dot">
                <button
                  type="button"
                  className="timeline-check"
                  onClick={() => toggleCheckup(c.name)}
                  aria-label={isDone ? '取消完成' : '标记完成'}
                >
                  {isDone ? '✅' : isPast && !isDone ? '⚠️' : '⬜'}
                </button>
              </div>
              <div className="timeline-content">
                <button
                  type="button"
                  className="timeline-expand-btn"
                  onClick={() => toggleExpand(c.name)}
                >
                  <div className="timeline-header-row">
                    <div>
                      <div className="timeline-week">{c.week}-{c.weekEnd}周</div>
                      <div className="timeline-name">
                        {c.name}
                        {c.important && <span className="required-badge">必查</span>}
                      </div>
                      <div className="timeline-desc">{c.desc}</div>
                    </div>
                    <span className="timeline-expand-arrow">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isCurrent && (
                  <div className="timeline-now">⏰ 现在正是检查时间</div>
                )}

                {isDone && checkupDone[c.name] && (
                  <div className="timeline-done-date">✅ 已于 {checkupDone[c.name]} 完成</div>
                )}

                {isExpanded && (
                  <div className="timeline-detail">
                    <div className="detail-section">
                      <h4>🎯 检查目的</h4>
                      <p>{c.purpose}</p>
                    </div>
                    {c.tips && c.tips.length > 0 && (
                      <div className="detail-section">
                        <h4>📋 注意事项</h4>
                        <ul className="tip-list">
                          {c.tips.map((tip, i) => (
                            <li key={`${c.name}-tip-${i}`} className="tip-item">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="detail-footer">
        <p>产检时间因医院和个人情况可能有所不同，请以医生建议为准。</p>
      </footer>
    </div>
  );
}
