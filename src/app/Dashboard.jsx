import { getBabyInfo } from './baby-data.js';
import { getCheckupsForWeek, getUpcomingCheckups } from './checkup-data.js';
import { getDietGuide } from './diet-data.js';
import { getLifestyleGuide } from './lifestyle-data.js';
import { formatReminderTime } from './reminder-utils.js';
import { formatDateCN } from './utils.js';
import { getWeightAdvice } from './weight-advice.js';

/**
 * Dashboard 主页面
 */
export function Dashboard({
  info, checkupDone, toggleCheckup, weightRecords, preWeight, symptoms, onNavigate, onReset,
  todayReminders, missedReminders, hasPermission, requestPermission, dismissMissed, onNavigateToReminder,
}) {
  const baby = getBabyInfo(info.weeks);
  const diet = getDietGuide(info.weeks);
  const checkups = getCheckupsForWeek(info.weeks);
  const upcoming = getUpcomingCheckups(info.weeks).slice(0, 3);
  const lifestyle = getLifestyleGuide(info.trimester);
  const handleSymptomNavigate = () => onNavigate('symptom');

  // 体重概览
  const latestWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : null;
  const totalGain = preWeight && latestWeight
    ? Math.round((latestWeight - preWeight) * 10) / 10
    : null;

  // 体重建议
  const weightAdvice = preWeight
    ? getWeightAdvice({ preWeight, weightRecords, currentWeek: info.weeks, trimester: info.trimester })
    : null;

  // 产检完成统计
  const doneCount = Object.keys(checkupDone).length;

  return (
    <div className="dashboard">
      {/* 顶部状态栏 */}
      <header className="dash-header">
        <div className="dash-header-left">
          <span className="dash-logo">🤰</span>
          <span className="dash-title">孕期助手</span>
        </div>
        <div className="dash-header-right">
          <button type="button" className="dash-sync-btn" onClick={() => onNavigate('sync')} title="数据同步">
            🔗
          </button>
          <button type="button" className="dash-reset-btn" onClick={onReset} title="重置日期">
            ⚙️
          </button>
        </div>
      </header>

      {/* 孕周大卡片 */}
      <section className="dash-week-card">
        <div className="week-badge">{info.trimesterLabel}</div>
        <div className="week-number">{info.formatted}</div>
        <div className="week-meta">
          <span>第 {info.days} 天</span>
          <span>·</span>
          <span>距预产期 {info.daysUntilDue} 天</span>
        </div>
        <div className="week-due">预产期：{formatDateCN(info.dueDate)}</div>
      </section>

      {/* 导航 tabs */}
      <nav className="dash-nav">
        {[
          { key: 'home', label: '今日', icon: '🏠' },
          { key: 'checkup', label: '产检', icon: '🏥' },
          { key: 'weight', label: '体重', icon: '⚖️' },
          { key: 'diet', label: '饮食', icon: '🍽' },
          { key: 'life', label: '生活', icon: '📋' },
          { key: 'dad', label: '准爸爸', icon: '👨' },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`dash-nav-btn ${tab.key}`}
            onClick={() => onNavigate(tab.key)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* 宝宝发育 */}
      <section className="dash-section dash-baby">
        <h2 className="section-title">👶 宝宝发育 · 第{info.weeks}周</h2>
        <div className="baby-size">
          <span className="size-emoji">🫐</span>
          <div>
            <div className="size-label">大小约</div>
            <div className="size-value">{baby.size}</div>
          </div>
          <div className="baby-stats">
            <div className="stat"><span className="stat-label">体重</span><span className="stat-val">{baby.weight}</span></div>
            <div className="stat"><span className="stat-label">身长</span><span className="stat-val">{baby.length}</span></div>
          </div>
        </div>
        <div className="baby-milestones">
          {baby.milestones.map((m, i) => (
            <span key={`m-${i}`} className="milestone-tag">{m}</span>
          ))}
        </div>
      </section>

      {/* 体重速览 */}
      <button type="button" className="dash-section dash-weight weight-quick-btn" onClick={() => onNavigate('weight')}>
        <h2 className="section-title">⚖️ 体重追踪</h2>
        {latestWeight ? (
          <>
            <div className="weight-quick">
              <div className="weight-quick-stat">
                <span className="weight-quick-label">最新</span>
                <span className="weight-quick-value">{latestWeight} kg</span>
              </div>
              {totalGain !== null && (
                <div className="weight-quick-stat">
                  <span className="weight-quick-label">累计</span>
                  <span className={`weight-quick-value ${totalGain > 0 ? 'gain' : totalGain < 0 ? 'loss' : ''}`}>
                    {totalGain > 0 ? '+' : ''}{totalGain} kg
                  </span>
                </div>
              )}
              <span className="weight-quick-arrow">→</span>
            </div>
            {weightAdvice && (
              <div className={`weight-quick-advice weight-quick-${weightAdvice.advice.level}`}>
                {weightAdvice.advice.icon} {weightAdvice.advice.title}
                {weightAdvice.advice.messages.length > 0 && (
                  <span className="weight-quick-advice-detail"> — {weightAdvice.advice.messages[0]}</span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="weight-empty">点击开始记录体重 📊</div>
        )}
      </button>

      {/* 本周产检 */}
      <section className="dash-section dash-checkup">
        <h2 className="section-title">🏥 本周产检提醒</h2>
        {checkups.length === 0 ? (
          <div className="checkup-empty">本周没有常规产检安排</div>
        ) : (
          <div className="checkup-list">
            {checkups.map(c => (
              <div key={c.name} className={`checkup-item ${c.important ? 'important' : ''} ${checkupDone[c.name] ? 'done' : ''}`}>
                <button
                  type="button"
                  className="checkup-check"
                  onClick={() => toggleCheckup(c.name)}
                  aria-label={checkupDone[c.name] ? '取消完成' : '标记完成'}
                >
                  {checkupDone[c.name] ? '✅' : '⬜'}
                </button>
                <div className="checkup-info">
                  <div className="checkup-name">{c.name}</div>
                  <div className="checkup-desc">{c.desc}</div>
                  <div className="checkup-week">{c.week}-{c.weekEnd}周</div>
                  {checkupDone[c.name] && (
                    <div className="checkup-done-date">已于 {checkupDone[c.name]} 完成</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {upcoming.length > 0 && (
          <div className="upcoming">
            <h3>即将到来</h3>
            {upcoming.map(c => (
              <div key={c.name} className="upcoming-item">
                <span className="upcoming-week">第{c.week}周</span>
                <span className="upcoming-name">{c.name}</span>
              </div>
            ))}
          </div>
        )}

        {doneCount > 0 && (
          <div className="checkup-progress">
            已完成 {doneCount} 项产检
          </div>
        )}
      </section>

      {/* 饮食指南 */}
      <section className="dash-section dash-diet">
        <h2 className="section-title">🍽 本周饮食重点 · {diet.focus}</h2>
        <p className="diet-advice">{diet.advice}</p>

        <div className="nutrient-tags">
          <span className="nutrient-label">重点补充：</span>
          {diet.keyNutrients.map(n => (
            <span key={n} className="nutrient-tag">{n}</span>
          ))}
        </div>

        <div className="avoid-tags">
          <span className="avoid-label">避免食用：</span>
          {diet.avoid.map(a => (
            <span key={a} className="avoid-tag">{a}</span>
          ))}
        </div>

        <h3 className="recipe-title">推荐菜谱</h3>
        <div className="recipe-list">
          {diet.recipes.map(r => (
            <div key={r.name} className="recipe-card">
              <div className="recipe-name">{r.name}</div>
              <div className="recipe-ingredients">食材：{r.ingredients}</div>
              <div className="recipe-steps">{r.steps}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 生活指南 */}
      <section className="dash-section dash-life">
        <h2 className="section-title">📋 {lifestyle.label} · 生活指南</h2>

        <div className="life-cols">
          <div className="life-col do-col">
            <h3>✅ 推荐做</h3>
            <ul className="life-list">
              {lifestyle.doList.map((item, i) => (
                <li key={`do-${i}`} className="life-item do-item">
                  <span className="life-cat">{item.category}</span>
                  <span className="life-text">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-col dont-col">
            <h3>🚫 不要做</h3>
            <ul className="life-list">
              {lifestyle.dontList.map((item, i) => (
                <li key={`dont-${i}`} className="life-item dont-item">
                  <span className="life-cat">{item.category}</span>
                  <span className="life-text">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 提醒中心 */}
      <section className="dash-section dash-reminder">
        <h2 className="section-title">⏰ 提醒中心</h2>

        {/* 错过的提醒 */}
        {missedReminders && missedReminders.length > 0 && (
          <div className="reminder-missed">
            <div className="missed-header">
              🔔 你有 {missedReminders.length} 条错过的提醒
            </div>
            {missedReminders.slice(0, 3).map(r => (
              <div key={r.id} className="missed-item">
                <span className="missed-title">{r.title}</span>
                <span className="missed-time">{formatReminderTime(r.datetime)}</span>
                <button type="button" onClick={() => dismissMissed(r.id)}>忽略</button>
              </div>
            ))}
          </div>
        )}

        {/* 今日提醒 */}
        {todayReminders && todayReminders.length > 0 ? (
          <div className="reminder-today">
            <div className="today-count">今日 {todayReminders.length} 项提醒</div>
            {todayReminders.slice(0, 3).map(r => (
              <div key={r.id} className="reminder-item">
                <span className="reminder-time">{r.datetime?.slice(11, 16) || '--:--'}</span>
                <span className="reminder-title">{r.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="reminder-empty">今日暂无提醒</div>
        )}

        {/* 通知权限提示 */}
        {!hasPermission && (
          <div className="reminder-permission-tip">
            <p>💡 开启通知权限，在应用后台时也能收到提醒</p>
            <button type="button" className="permission-btn" onClick={requestPermission}>开启通知</button>
          </div>
        )}

        <button type="button" className="reminder-manage-btn" onClick={onNavigateToReminder}>
          管理提醒 →
        </button>
      </section>

      {/* 症状记录入口 */}
      <button
        type="button"
        className="dash-section dash-symptom"
        onClick={handleSymptomNavigate}
      >
        <h2 className="section-title">🩺 症状记录</h2>
        <div className="symptom-quick">
          {symptoms.length === 0 ? (
            <div className="symptom-empty">点击记录孕期不适症状 📝</div>
          ) : (
            <>
              <div className="symptom-quick-count">共 {symptoms.length} 天有记录</div>
              <div className="symptom-quick-recent">
                最近：{symptoms[symptoms.length - 1].date}
              </div>
            </>
          )}
        </div>
      </button>

      {/* 免责声明 */}
      <footer className="dash-footer">
        <p>以上内容仅供参考，不能替代专业医疗建议。如有健康问题，请咨询专业医生。</p>
      </footer>
    </div>
  );
}
