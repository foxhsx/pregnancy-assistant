import { getLifestyleGuide } from './lifestyle-data.js';

/**
 * 生活指南详情页
 */
export function LifestylePage({ info, onBack }) {
  const guide = getLifestyleGuide(info.trimester);

  // 按分类分组
  const doByCategory = {};
  guide.doList.forEach(item => {
    if (!doByCategory[item.category]) doByCategory[item.category] = [];
    doByCategory[item.category].push(item);
  });

  const dontByCategory = {};
  guide.dontList.forEach(item => {
    if (!dontByCategory[item.category]) dontByCategory[item.category] = [];
    dontByCategory[item.category].push(item);
  });

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={onBack}>← 返回</button>
        <h1>📋 生活指南</h1>
        <div className="header-week">{info.formatted} · {guide.label}</div>
      </header>

      <section className="life-detail-section">
        <h2>✅ 推荐做的事</h2>
        {Object.entries(doByCategory).map(([cat, items]) => (
          <div key={cat} className="life-category">
            <h3>{cat}</h3>
            <ul className="life-detail-list">
              {items.map((item, i) => (
                <li key={`${cat}-do-${i}`} className="life-detail-item do-detail">
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="life-detail-section dont-section">
        <h2>🚫 不要做的事</h2>
        {Object.entries(dontByCategory).map(([cat, items]) => (
          <div key={cat} className="life-category">
            <h3>{cat}</h3>
            <ul className="life-detail-list">
              {items.map((item, i) => (
                <li key={`${cat}-dont-${i}`} className="life-detail-item dont-detail">
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <footer className="detail-footer">
        <p>以上建议仅供参考，具体情况请遵医嘱。如有不适请及时就医。</p>
      </footer>
    </div>
  );
}
