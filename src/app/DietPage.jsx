import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDietGuide, dietGuide, pickMealPlan } from './diet-data.js';
import { fetchChineseMeals } from './meal-api.js';
import { formatDate } from './utils.js';

const MEAL_META = {
  breakfast: { icon: '🌅', label: '早餐' },
  lunch: { icon: '☀️', label: '午餐' },
  dinner: { icon: '🌙', label: '晚餐' },
};

/**
 * 饮食菜谱页面 - 每日三餐推荐 + 当前阶段饮食指南 + 全部菜谱
 */
export function DietPage({ info, onBack }) {
  const currentDiet = getDietGuide(info.weeks);
  const allWeeks = Object.keys(dietGuide).map(Number).sort((a, b) => a - b);
  const [refreshCount, setRefreshCount] = useState(0);
  const [apiMeals, setApiMeals] = useState(null);

  const today = useMemo(() => formatDate(new Date()), []);

  // 加载 API 菜谱（带中文映射和图片）
  useEffect(() => {
    let cancelled = false;
    fetchChineseMeals().then((meals) => {
      if (!cancelled && meals) setApiMeals(meals);
    });
    return () => { cancelled = true; };
  }, []);

  // API 菜谱可用时优先用，否则兜底静态数据
  const mealPlan = useMemo(() => {
    if (apiMeals && apiMeals.length >= 3) {
      return pickMealPlan(apiMeals, today, refreshCount);
    }
    return pickMealPlan(currentDiet.recipes, today, refreshCount);
  }, [apiMeals, currentDiet.recipes, today, refreshCount]);

  const handleRefresh = useCallback(() => setRefreshCount(prev => prev + 1), []);

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={onBack}>← 返回</button>
        <h1>🍽 饮食与菜谱</h1>
        <div className="header-week">{info.formatted} · {info.trimesterLabel}</div>
      </header>

      {/* 每日三餐推荐 */}
      <section className="daily-meal-card">
        <div className="daily-meal-head">
          <h2>🍽 今日三餐推荐</h2>
          <button type="button" className="daily-refresh-btn" onClick={handleRefresh}>
            🔄 换一批
          </button>
        </div>

        <div className="daily-meal-list">
          {['breakfast', 'lunch', 'dinner'].map((mealKey) => {
            const recipe = mealPlan[mealKey];
            const meta = MEAL_META[mealKey];
            if (!recipe) return null;
            return (
              <div key={mealKey + (recipe.id || recipe.name)} className="daily-meal-item">
                {recipe.image && (
                  <img
                    className="daily-meal-img"
                    src={recipe.image}
                    alt={recipe.name}
                    loading="lazy"
                  />
                )}
                <div className="daily-meal-body">
                  <div className="daily-meal-type">{meta.icon} {meta.label}</div>
                  <div className="daily-meal-name">{recipe.name}</div>
                  <div className="daily-meal-info">{recipe.desc || recipe.steps}</div>
                  {recipe.ingredients && (
                    <div className="daily-meal-ingredients">食材：{recipe.ingredients}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
