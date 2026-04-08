# 症状记录功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在孕期助手中新增症状记录模块，支持按日期记录孕期不适症状，并展示趋势图供产检参考。

**Architecture:** 采用与现有体重记录、产检打卡一致的 localStorage 持久化模式。新增 SymptomPage 组件（症状记录主页面），复用 Chart.js 绘制趋势图。日历组件自研，按周横向滚动展示。

**Tech Stack:** React（现有）, Chart.js（已有依赖）, localStorage

---

## 文件结构

```
src/app/
├── symptom-data.js      # 新增：症状类型定义
├── SymptomPage.jsx      # 新增：症状记录主页面
├── usePregnancy.js      # 修改：增加症状状态和方法
├── App.jsx              # 修改：增加症状页面路由
├── Dashboard.jsx        # 修改：增加症状入口卡片
└── app.css              # 修改：增加症状页面样式
```

---

## Task 1: 症状类型数据定义

**Files:**
- Create: `src/app/symptom-data.js`

- [ ] **Step 1: 创建症状类型数据文件**

```js
export const SYMPTOM_CATEGORIES = [
  { key: 'digestive', label: '消化系统', icon: '🤢' },
  { key: 'systemic', label: '全身症状', icon: '😵' },
  { key: 'sleep', label: '睡眠问题', icon: '😴' },
  { key: 'physical', label: '身体不适', icon: '💪' },
  { key: 'emotional', label: '心理情绪', icon: '😢' },
];

export const SYMPTOMS_BY_CATEGORY = {
  digestive: ['孕吐（晨吐）', '孕吐（全天吐）', '反胃', '食欲不振', '食欲亢进', '胃灼热', '腹胀', '便秘'],
  systemic: ['疲劳', '头晕', '头痛', '发热', '乏力', '心悸'],
  sleep: ['失眠', '嗜睡', '夜醒', '多梦', '打鼾'],
  physical: ['水肿', '抽筋', '腰背痛', '乳房胀痛', '骨盆痛', '呼吸困难', '皮肤瘙痒'],
  emotional: ['焦虑', '情绪波动', '注意力不集中', '抑郁倾向', '易怒'],
};

export const SEVERITY_LABELS = ['', '😊轻微', '😟较轻', '😐中等', '😣较重', '😭严重'];

export const TRIGGERS = [
  { key: 'food', label: '饮食' },
  { key: 'exercise', label: '运动' },
  { key: 'emotion', label: '情绪' },
  { key: 'environment', label: '环境' },
  { key: 'time', label: '时间因素' },
  { key: 'other', label: '其他' },
];
```

- [ ] **Step 2: 提交**

```bash
git add src/app/symptom-data.js
git commit -m "feat: 添加症状类型数据定义"
```

---

## Task 2: 扩展 usePregnancy Hook

**Files:**
- Modify: `src/app/usePregnancy.js`

在 STORAGE_KEY 附近增加症状存储 key，在 useState 声明区增加症状状态，导出症状相关方法。

- [ ] **Step 1: 添加存储 key**

在 `STORAGE_KEY` 行后添加：

```js
const SYMPTOM_KEY = 'yunqi_symptoms';
```

- [ ] **Step 2: 添加 load/save 函数**

在 `saveCheckupRecords` 函数后添加：

```js
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
```

- [ ] **Step 3: 添加 useState 声明**

在 `const [preWeight, setPreWeightState] = useState(null);` 后添加：

```js
const [symptoms, setSymptoms] = useState([]);
```

- [ ] **Step 4: 在 useEffect 初始化中加载症状**

在 `setWeightRecords(loadWeightRecords());` 后添加：

```js
setSymptoms(loadSymptoms());
```

- [ ] **Step 5: 在 resetData 中清除症状**

在 `localStorage.removeItem(PRE_WEIGHT_KEY);` 后添加：

```js
localStorage.removeItem(SYMPTOM_KEY);
```

- [ ] **Step 6: 添加症状操作方法**

在 `deleteWeight` 方法后添加：

```js
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
```

- [ ] **Step 7: 在导出的 return 对象中增加症状相关**

在 `resetData` 后添加：

```js
symptoms,
addSymptom,
deleteSymptom,
updateSymptomEntry,
```

- [ ] **Step 8: 提交**

```bash
git add src/app/usePregnancy.js
git commit -m "feat: usePregnancy hook 增加症状记录状态和方法"
```

---

## Task 3: Dashboard 症状入口卡片

**Files:**
- Modify: `src/app/Dashboard.jsx`
- Modify: `src/app/app.css`

- [ ] **Step 1: 在 Dashboard 导入后添加 props 接收 symptoms**

当前 `export function Dashboard({ info, checkupDone, toggleCheckup, weightRecords, preWeight, onNavigate, onReset })` 改为：

```js
export function Dashboard({ info, checkupDone, toggleCheckup, weightRecords, preWeight, symptoms, onNavigate, onReset }) {
```

- [ ] **Step 2: 在生活指南 section 后、footer 前添加症状卡片**

在 `</section>` (dash-life section) 后、`</footer>` 前添加：

```jsx
{/* 症状记录入口 */}
<section className="dash-section dash-symptom" onClick={() => onNavigate('symptom')}>
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
</section>
```

- [ ] **Step 3: 在 app.css 中添加样式**

在 `.dash-life` 样式后添加：

```css
.dash-symptom {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.dash-symptom:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.symptom-quick {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.symptom-quick-count {
  font-size: 14px;
  color: #666;
}
.symptom-empty {
  color: #999;
  font-size: 14px;
}
```

- [ ] **Step 4: 在 App.jsx 中传递 symptoms prop**

修改 Dashboard 渲染处：

```jsx
<Dashboard info={info} checkupDone={checkupDone} toggleCheckup={toggleCheckup} weightRecords={weightRecords} preWeight={preWeight} symptoms={symptoms} onNavigate={handleNavigate} onReset={handleReset} />
```

- [ ] **Step 5: 提交**

```bash
git add src/app/Dashboard.jsx src/app/app.css src/app/App.jsx
git commit -m "feat: Dashboard 增加症状记录入口卡片"
```

---

## Task 4: 症状记录主页面 SymptomPage

**Files:**
- Create: `src/app/SymptomPage.jsx`

这是最核心的组件，包含日历视图、记录表单和趋势图。

- [ ] **Step 1: 创建 SymptomPage 组件**

完整代码约 400 行，包含：
- 顶部返回栏 + 标题
- 周导航（日历横向滚动）
- 日期圆点（颜色=严重程度）
- 点击日期弹出记录抽屉/弹窗
- 记录表单（症状类型选择、严重程度滑块、持续时间、触发因素、备注）
- 底部趋势按钮

```jsx
import { useState, useMemo } from 'react';
import { SYMPTOM_CATEGORIES, SYMPTOMS_BY_CATEGORY, SEVERITY_LABELS, TRIGGERS } from './symptom-data.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 11);

export function SymptomPage({ info, symptoms, addSymptom, deleteSymptom, onBack }) {
  // 当前查看的周（ISO 周起始日，周一）
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 周一
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().slice(0, 10);
  });

  const [selectedDate, setSelectedDate] = useState(null); // 选中日期
  const [showForm, setShowForm] = useState(false);        // 显示记录表单
  const [showTrend, setShowTrend] = useState(false);      // 显示趋势页
  const [form, setForm] = useState({ category: 'digestive', symptom: '', severity: 3, durationType: 'intermittent', durationHours: 2, triggers: [], note: '' });

  // 计算当前周的所有日期
  const weekDates = useMemo(() => {
    const start = new Date(weekStart);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  }, [weekStart]);

  // 按日期索引症状记录
  const symptomByDate = useMemo(() => {
    const map = {};
    symptoms.forEach(r => { map[r.date] = r; });
    return map;
  }, [symptoms]);

  // 周导航
  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d.toISOString().slice(0, 10));
  };
  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d.toISOString().slice(0, 10));
  };

  // 打开记录表单
  const openForm = (date) => {
    setSelectedDate(date);
    setForm({ category: 'digestive', symptom: SYMPTOMS_BY_CATEGORY.digestive[0], severity: 3, durationType: 'intermittent', durationHours: 2, triggers: [], note: '' });
    setShowForm(true);
  };

  // 提交记录
  const handleSubmit = () => {
    if (!form.symptom) return;
    addSymptom({
      id: uid(),
      date: selectedDate,
      entries: [{
        id: uid(),
        category: form.category,
        symptom: form.symptom,
        severity: form.severity,
        duration: { type: form.durationType, hours: form.durationHours },
        triggers: form.triggers,
        note: form.note,
      }],
    });
    setShowForm(false);
  };

  // 删除单条记录
  const handleDelete = (entryId) => {
    deleteSymptom(selectedDate, entryId);
  };

  // 计算某天的平均严重程度
  const avgSeverity = (date) => {
    const record = symptomByDate[date];
    if (!record || record.entries.length === 0) return 0;
    return record.entries.reduce((sum, e) => sum + e.severity, 0) / record.entries.length;
  };

  // 严重程度对应颜色
  const severityColor = (s) => {
    if (s === 0) return '#e0e0e0';
    const colors = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];
    return colors[Math.min(Math.round(s) - 1, 4)];
  };

  return (
    <div className="symptom-page">
      {/* 头部 */}
      <header className="sp-header">
        <button type="button" className="sp-back" onClick={onBack}>← 返回</button>
        <h1 className="sp-title">🩺 症状记录</h1>
        <button type="button" className="sp-trend-btn" onClick={() => setShowTrend(true)}>📈 趋势</button>
      </header>

      {/* 孕周标签 */}
      <div className="sp-week-tag">
        {info?.trimesterLabel} · 第{info?.weeks}周
      </div>

      {/* 周日历 */}
      <div className="sp-calendar">
        <button type="button" className="sp-nav" onClick={prevWeek}>◀</button>
        <div className="sp-days">
          {weekDates.map(date => {
            const s = avgSeverity(date);
            const isToday = date === today();
            return (
              <button
                key={date}
                type="button"
                className={`sp-day ${isToday ? 'today' : ''}`}
                onClick={() => openForm(date)}
                title={date}
              >
                <span className="sp-day-label">{new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' })}</span>
                <span className="sp-day-num">{new Date(date).getDate()}</span>
                <span className="sp-day-dot" style={{ background: severityColor(s) }} />
              </button>
            );
          })}
        </div>
        <button type="button" className="sp-nav" onClick={nextWeek}>▶</button>
      </div>

      {/* 记录列表（当周） */}
      <div className="sp-records">
        <h3 className="sp-section-title">本周记录</h3>
        {weekDates.map(date => {
          const record = symptomByDate[date];
          if (!record) return null;
          return (
            <div key={date} className="sp-day-records">
              <div className="sp-record-date">{date}</div>
              {record.entries.map(entry => (
                <div key={entry.id} className="sp-entry">
                  <span className="sp-entry-sev" style={{ color: severityColor(entry.severity) }}>
                    {SEVERITY_LABELS[entry.severity]}
                  </span>
                  <span className="sp-entry-name">{entry.symptom}</span>
                  <span className="sp-entry-cat">{SYMPTOM_CATEGORIES.find(c => c.key === entry.category)?.label}</span>
                  <button type="button" className="sp-entry-del" onClick={() => handleDelete(entry.id)}>×</button>
                </div>
              ))}
            </div>
          );
        })}
        {weekDates.every(d => !symptomByDate[d]) && (
          <div className="sp-empty">本周暂无记录</div>
        )}
      </div>

      {/* 记录表单弹窗 */}
      {showForm && (
        <div className="sp-modal">
          <div className="sp-modal-content">
            <div className="sp-modal-header">
              <h3>记录症状 · {selectedDate}</h3>
              <button type="button" onClick={() => setShowForm(false)}>×</button>
            </div>

            {/* 症状类型 */}
            <div className="sp-form-group">
              <label>症状类型</label>
              <div className="sp-category-tabs">
                {SYMPTOM_CATEGORIES.map(c => (
                  <button
                    key={c.key}
                    type="button"
                    className={`sp-cat-tab ${form.category === c.key ? 'active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, category: c.key, symptom: SYMPTOMS_BY_CATEGORY[c.key][0] }))}
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 具体症状 */}
            <div className="sp-form-group">
              <label>具体症状</label>
              <select value={form.symptom} onChange={e => setForm(f => ({ ...f, symptom: e.target.value }))}>
                {SYMPTOMS_BY_CATEGORY[form.category].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 严重程度 */}
            <div className="sp-form-group">
              <label>严重程度：{SEVERITY_LABELS[form.severity]}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={form.severity}
                onChange={e => setForm(f => ({ ...f, severity: Number(e.target.value) }))}
                className="sp-slider"
              />
              <div className="sp-slider-labels">
                <span>轻微</span><span>严重</span>
              </div>
            </div>

            {/* 持续时间 */}
            <div className="sp-form-group">
              <label>持续时间</label>
              <div className="sp-duration-row">
                <label><input type="radio" checked={form.durationType === 'continuous'} onChange={() => setForm(f => ({ ...f, durationType: 'continuous' }))} /> 持续</label>
                <label><input type="radio" checked={form.durationType === 'intermittent'} onChange={() => setForm(f => ({ ...f, durationType: 'intermittent' }))} /> 间歇</label>
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={form.durationHours}
                  onChange={e => setForm(f => ({ ...f, durationHours: Number(e.target.value) }))}
                  className="sp-duration-input"
                /> 小时
              </div>
            </div>

            {/* 触发因素 */}
            <div className="sp-form-group">
              <label>触发因素</label>
              <div className="sp-triggers">
                {TRIGGERS.map(t => (
                  <label key={t.key} className="sp-trigger">
                    <input
                      type="checkbox"
                      checked={form.triggers.includes(t.key)}
                      onChange={e => {
                        setForm(f => ({
                          ...f,
                          triggers: e.target.checked
                            ? [...f.triggers, t.key]
                            : f.triggers.filter(k => k !== t.key),
                        }));
                      }}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            {/* 备注 */}
            <div className="sp-form-group">
              <label>备注</label>
              <textarea
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="记录更多细节..."
                rows={3}
              />
            </div>

            <button type="button" className="sp-submit" onClick={handleSubmit}>保存</button>
          </div>
        </div>
      )}

      {/* 趋势页弹窗 */}
      {showTrend && (
        <SymptomTrend symptoms={symptoms} onClose={() => setShowTrend(false)} />
      )}
    </div>
  );
}

/** 趋势图组件 */
function SymptomTrend({ symptoms, onClose }) {
  const canvasRef = useState(null);
  const chartRef = useState(null);

  useState(() => {
    if (!canvasRef.current || symptoms.length === 0) return;
    // 绘制折线图逻辑...
  });

  return (
    <div className="sp-modal">
      <div className="sp-modal-content sp-trend-modal">
        <div className="sp-modal-header">
          <h3>📈 症状趋势</h3>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <div className="sp-trend-body">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
```

**注意**：上述代码中的 `useState` 在 `SymptomTrend` 里用法有误（应该是 `useRef` 和 `useEffect` 配合 Chart.js），实现时需修正：

```jsx
function SymptomTrend({ symptoms, onClose }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || symptoms.length === 0) return;
    if (chartRef.current) chartRef.current.destroy();

    // 聚合数据：按日期、按症状类别计算平均严重程度
    const datasets = SYMPTOM_CATEGORIES.map(cat => ({
      label: cat.label,
      data: [],
      borderColor: 'rgba(75,192,192,1)',
    }));

    // ... 数据填充逻辑

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: { labels: [], datasets },
      options: { responsive: true, scales: { y: { min: 1, max: 5 } } },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [symptoms]);

  return (
    <div className="sp-modal">
      <div className="sp-modal-content sp-trend-modal">
        <div className="sp-modal-header">
          <h3>📈 症状趋势</h3>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <div className="sp-trend-body">
          {symptoms.length === 0 ? (
            <div className="sp-empty">暂无数据</div>
          ) : (
            <canvas ref={canvasRef} />
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/SymptomPage.jsx
git commit -m "feat: 添加症状记录主页面 SymptomPage"
```

---

## Task 5: App.jsx 路由和 app.css 样式

**Files:**
- Modify: `src/app/App.jsx`
- Modify: `src/app/app.css`

- [ ] **Step 1: App.jsx 导入 SymptomPage**

```jsx
import { SymptomPage } from './SymptomPage.jsx';
```

- [ ] **Step 2: App.jsx 传递症状相关 props 并添加路由**

在 `case 'dad':` 后添加：

```jsx
case 'symptom':
  return <SymptomPage info={info} symptoms={symptoms} addSymptom={addSymptom} deleteSymptom={deleteSymptom} onBack={() => setPage('home')} />;
```

同时在 usePregnancy 解构处增加 `symptoms, addSymptom, deleteSymptom`。

- [ ] **Step 3: app.css 添加 SymptomPage 样式**

在文件末尾添加完整的症状页面 CSS（约 200 行），包含：
- `.symptom-page` 容器
- `.sp-header` 头部导航栏
- `.sp-calendar` 周日历布局
- `.sp-day` 日期格（flex column）
- `.sp-day-dot` 圆点样式
- `.sp-modal` 弹窗遮罩和内容
- `.sp-form-group` 表单分组
- `.sp-category-tabs` 类型切换 tabs
- `.sp-slider` 严重程度滑块
- `.sp-triggers` 触发因素复选框
- `.sp-trend-modal` 趋势弹窗

（CSS 样式参考现有 Dashboard 和 WeightPage 的风格，保持一致的视觉语言）

- [ ] **Step 4: 提交**

```bash
git add src/app/App.jsx src/app/app.css
git commit -m "feat: App 路由和样式适配"
```

---

## Task 6: 端到端验证

**Files:**
- None (测试现有功能)

- [ ] **Step 1: 本地运行 dev server**

```bash
npm run dev
```

- [ ] **Step 2: 手动测试流程**

1. 设置孕周（随便选一个日期）
2. Dashboard 出现「症状记录」卡片
3. 点击进入 SymptomPage
4. 点击某天日期，弹窗出现
5. 选择症状类型、严重程度，填写备注，保存
6. 当天出现圆点（颜色对应严重程度）
7. 重新打开弹窗，已保存的症状出现在列表（如果要做这个功能）
8. 点击「趋势」按钮，查看趋势图是否渲染
9. 关闭弹窗和页面，返回 Dashboard

- [ ] **Step 3: 构建验证**

```bash
npm run build
```

确认无报错。

- [ ] **Step 4: 提交**

```bash
git add -A && git commit -m "feat: 症状记录功能完整实现"
```

---

## 依赖 Task

无。

## 验证清单

- [ ] Dashboard 显示症状入口卡片
- [ ] 点击卡片进入 SymptomPage
- [ ] 日历显示7天，切换周正常
- [ ] 每天有记录则显示圆点，颜色=严重程度
- [ ] 点击日期弹出记录表单
- [ ] 表单可选症状类型、严重程度、持续时间、触发因素、备注
- [ ] 保存后记录出现在本周列表
- [ ] 删除单条记录正常
- [ ] 趋势图弹窗能打开并显示折线图
- [ ] `npm run build` 成功
