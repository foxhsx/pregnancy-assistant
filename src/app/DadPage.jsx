import { useState } from 'react';
import { getDadGuide } from './dad-data.js';

/**
 * 准爸爸指南页面
 */
export function DadPage({ info, onBack }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const guide = getDadGuide(info.trimester);

  const toggleExpand = (key) => {
    setExpandedItem(prev => prev === key ? null : key);
  };

  return (
    <div className="detail-page dad-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={onBack}>← 返回</button>
        <h1>👨 准爸爸指南</h1>
        <div className="header-week">{info.formatted} · {guide.label}</div>
      </header>

      <div className="dad-intro">
        <p className="dad-subtitle">{guide.subtitle}</p>
      </div>

      {guide.categories.map(cat => (
        <section key={cat.key} className="dad-category">
          <h2 className="dad-category-title">{cat.title}</h2>
          <ul className="dad-task-list">
            {cat.items.map((item, idx) => {
              const itemKey = `${cat.key}-${idx}`;
              const isExpanded = expandedItem === itemKey;

              return (
                <li key={itemKey} className={`dad-task-item ${isExpanded ? 'expanded' : ''}`}>
                  <button
                    type="button"
                    className="dad-task-toggle"
                    onClick={() => toggleExpand(itemKey)}
                  >
                    <span className="dad-task-text">{item.text}</span>
                    <span className="dad-task-arrow">{isExpanded ? '▲' : '▼'}</span>
                  </button>
                  {isExpanded && (
                    <div className="dad-task-detail">{item.detail}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <footer className="detail-footer">
        <p>以上建议仅供参考。每个家庭的情况不同，找到适合你们的相处方式最重要。</p>
      </footer>
    </div>
  );
}
