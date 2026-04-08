import { getDietGuide } from './diet-data.js';
import { dietGuide } from './diet-data.js';

/**
 * 饮食菜谱页面 - 展示当前阶段和所有菜谱
 */
export function DietPage({ info, onBack }) {
  const currentDiet = getDietGuide(info.weeks);
  const allWeeks = Object.keys(dietGuide).map(Number).sort((a, b) => a - b);

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={onBack}>← 返回</button>
        <h1>🍽 饮食与菜谱</h1>
        <div className="header-week">{info.formatted} · {info.trimesterLabel}</div>
      </header>

      {/* 当前周推荐 */}
      <section className="diet-current">
        <h2>本周饮食重点 · {currentDiet.focus}</h2>
        <p className="diet-advice-full">{currentDiet.advice}</p>

        <div className="nutrient-section">
          <h3>🔑 重点补充营养素</h3>
          <div className="nutrient-cards">
            {currentDiet.keyNutrients.map(n => (
              <div key={n} className="nutrient-card">{n}</div>
            ))}
          </div>
        </div>

        <div className="avoid-section">
          <h3>🚫 需要避免</h3>
          <div className="avoid-cards">
            {currentDiet.avoid.map(a => (
              <div key={a} className="avoid-card">{a}</div>
            ))}
          </div>
        </div>

        <h3>👩‍🍳 本周推荐菜谱</h3>
        <div className="recipe-detail-list">
          {currentDiet.recipes.map(r => (
            <div key={r.name} className="recipe-detail-card">
              <div className="recipe-detail-name">{r.name}</div>
              <div className="recipe-detail-section">
                <strong>食材：</strong>{r.ingredients}
              </div>
              <div className="recipe-detail-section">
                <strong>做法：</strong>{r.steps}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 其他阶段菜谱 */}
      <section className="diet-all">
        <h2>📖 全孕期菜谱参考</h2>
        <div className="all-recipes">
          {allWeeks.filter(w => w !== parseInt(Object.keys(dietGuide).find(k => dietGuide[k] === currentDiet))).map(w => {
            const d = dietGuide[w];
            return (
              <div key={w} className="all-recipe-group">
                <h3>第{w}周 · {d.focus}</h3>
                <div className="all-recipe-names">
                  {d.recipes.map(r => (
                    <div key={r.name} className="all-recipe-item">
                      <div className="all-recipe-name">{r.name}</div>
                      <div className="all-recipe-ing">{r.ingredients}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
