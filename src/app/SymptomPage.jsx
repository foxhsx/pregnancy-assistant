import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { SYMPTOM_CATEGORIES, SYMPTOMS_BY_CATEGORY, SEVERITY_LABELS, TRIGGERS } from './symptom-data.js';
import { formatDate, formatDateCN } from './utils.js';

const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const TREND_COLORS = ['#2c7a7b', '#dd6b20', '#805ad5', '#3182ce', '#d53f8c'];

function startOfWeek(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function addDays(dateValue, days) {
  const date = new Date(dateValue);
  date.setDate(date.getDate() + days);
  return date;
}

function severityColor(severity) {
  if (severity <= 0) return '#e2e8f0';
  if (severity <= 2) return '#48bb78';
  if (severity === 3) return '#ecc94b';
  if (severity === 4) return '#ed8936';
  return '#f56565';
}

function defaultFormState(date) {
  const initialCategory = SYMPTOM_CATEGORIES[0]?.key ?? 'digestive';
  return {
    date,
    category: initialCategory,
    symptom: SYMPTOMS_BY_CATEGORY[initialCategory]?.[0] ?? '',
    severity: 3,
    durationType: 'persistent',
    hours: '2',
    triggers: [],
    note: '',
  };
}

function durationText(entry) {
  const mode = entry.durationType === 'intermittent' ? '间歇' : '持续';
  return `${mode} · ${entry.hours}小时`;
}

export function SymptomPage({ info, symptoms, addSymptom, deleteSymptom, onBack }) {
  const today = useMemo(() => new Date(), []);
  const [weekStart, setWeekStart] = useState(formatDate(startOfWeek(today)));
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [showForm, setShowForm] = useState(false);
  const [showTrend, setShowTrend] = useState(false);
  const [formState, setFormState] = useState(defaultFormState(formatDate(today)));
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const symptomMap = useMemo(() => {
    return symptoms.reduce((acc, record) => {
      acc[record.date] = record.entries;
      return acc;
    }, {});
  }, [symptoms]);

  const weekDates = useMemo(() => {
    const monday = new Date(weekStart);
    return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
  }, [weekStart]);

  const weekRecords = useMemo(() => {
    const start = new Date(weekStart).getTime();
    const end = addDays(weekStart, 6).getTime();

    return symptoms
      .filter(record => {
        const time = new Date(record.date).getTime();
        return time >= start && time <= end;
      })
      .flatMap(record => record.entries.map(entry => ({ ...entry, date: record.date })))
      .sort((a, b) => `${a.date}-${a.id}`.localeCompare(`${b.date}-${b.id}`));
  }, [symptoms, weekStart]);

  const avgSeverity = (date) => {
    const entries = symptomMap[date] ?? [];
    if (!entries.length) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.severity, 0);
    return Math.round((total / entries.length) * 10) / 10;
  };

  const openForm = (date) => {
    setSelectedDate(date);
    setFormState(defaultFormState(date));
    setShowForm(true);
  };

  const handleCategoryChange = (category) => {
    setFormState(prev => ({
      ...prev,
      category,
      symptom: SYMPTOMS_BY_CATEGORY[category]?.[0] ?? '',
    }));
  };

  const handleTriggerToggle = (triggerKey) => {
    setFormState(prev => ({
      ...prev,
      triggers: prev.triggers.includes(triggerKey)
        ? prev.triggers.filter(key => key !== triggerKey)
        : [...prev.triggers, triggerKey],
    }));
  };

  const handleSave = () => {
    if (!formState.symptom) return;

    addSymptom({
      date: formState.date,
      entries: [
        {
          id: `${formState.date}-${Date.now()}`,
          category: formState.category,
          symptom: formState.symptom,
          severity: formState.severity,
          durationType: formState.durationType,
          hours: Number(formState.hours) || 0,
          triggers: formState.triggers,
          note: formState.note.trim(),
        },
      ],
    });

    setShowForm(false);
    setFormState(defaultFormState(formState.date));
  };

  const trendData = useMemo(() => {
    const labels = symptoms.map(record => record.date);

    const datasets = SYMPTOM_CATEGORIES.map((category, index) => ({
      label: `${category.icon} ${category.label}`,
      data: symptoms.map(record => {
        const matched = record.entries.filter(entry => entry.category === category.key);
        if (!matched.length) return null;
        const total = matched.reduce((sum, entry) => sum + entry.severity, 0);
        return Math.round((total / matched.length) * 10) / 10;
      }),
      borderColor: TREND_COLORS[index % TREND_COLORS.length],
      backgroundColor: TREND_COLORS[index % TREND_COLORS.length],
      tension: 0.3,
      spanGaps: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    })).filter(dataset => dataset.data.some(value => value !== null));

    return { labels, datasets };
  }, [symptoms]);

  useEffect(() => {
    if (!showTrend || !canvasRef.current || trendData.labels.length === 0 || trendData.datasets.length === 0) return undefined;

    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, ChartTooltip, Legend);

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: trendData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}：${context.parsed.y} 级`,
            },
          },
        },
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: '严重程度',
            },
            grid: {
              color: '#f0eae3',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [showTrend, trendData]);

  return (
    <div className="detail-page symptom-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={onBack}>← 返回</button>
        <h1>🩺 症状记录</h1>
        <button type="button" className="sp-trend-btn" onClick={() => setShowTrend(true)}>趋势</button>
      </header>

      <section className="sp-stage-card">
        <div className="sp-stage-label">当前孕期阶段</div>
        <div className="sp-stage-main">{info.trimesterLabel} · {info.formatted}</div>
        <div className="sp-stage-sub">按周记录不适变化，便于回顾和就诊时描述。</div>
      </section>

      <section className="sp-calendar-card">
        <div className="sp-card-head">
          <h2>本周日历</h2>
          <div className="sp-week-range">{formatDateCN(weekDates[0])} - {formatDateCN(weekDates[6])}</div>
        </div>

        <div className="sp-week-nav">
          <button type="button" className="sp-nav-btn" onClick={() => setWeekStart(formatDate(addDays(weekStart, -7)))}>‹</button>
          <div className="sp-week-scroll">
            {weekDates.map((date, index) => {
              const dateStr = formatDate(date);
              const severity = avgSeverity(dateStr);
              const entryCount = symptomMap[dateStr]?.length ?? 0;
              const isActive = selectedDate === dateStr;
              const isToday = dateStr === formatDate(today);

              return (
                <article
                  key={dateStr}
                  className={`sp-day-card${isActive ? ' active' : ''}${isToday ? ' today' : ''}`}
                  onClick={() => openForm(dateStr)}
                >
                  <div className="weekday">{WEEKDAY_LABELS[index]}</div>
                  <div className="date-num">{date.getDate()}</div>
                  <span className="severity-dot" style={{ background: severityColor(severity) }} />
                  <div className={`day-status${entryCount > 0 ? ' has-record' : ''}`}>
                    {entryCount > 0 ? `${entryCount}条` : '—'}
                  </div>
                  <span className="day-indicator" style={{ background: severityColor(severity) }} />
                </article>
              );
            })}
          </div>
          <button type="button" className="sp-nav-btn" onClick={() => setWeekStart(formatDate(addDays(weekStart, 7)))}>›</button>
        </div>
      </section>

      <section className="sp-records-card">
        <div className="sp-card-head">
          <h2>本周记录列表</h2>
          <div className="sp-record-count">共 {weekRecords.length} 条</div>
        </div>

        {weekRecords.length === 0 ? (
          <div className="sp-empty">本周还没有症状记录，点击上方日期开始记录。</div>
        ) : (
          <div className="sp-record-list">
            {weekRecords.map((entry) => {
              const category = SYMPTOM_CATEGORIES.find(item => item.key === entry.category);
              return (
                <article key={entry.id} className="sp-record-item">
                  <div className="sp-record-top">
                    <div>
                      <div className="sp-record-date">{formatDateCN(entry.date)}</div>
                      <div className="sp-record-name">{category?.icon} {entry.symptom}</div>
                    </div>
                    <button
                      type="button"
                      className="sp-delete-btn"
                      onClick={() => {
                        if (confirm(`删除 ${entry.date} 的“${entry.symptom}”记录？`)) {
                          deleteSymptom(entry.date, entry.id);
                        }
                      }}
                    >
                      删除
                    </button>
                  </div>

                  <div className="sp-meta-row">
                    <span className="sp-pill">{category?.label}</span>
                    <span className="sp-pill" style={{ color: severityColor(entry.severity), borderColor: severityColor(entry.severity) }}>
                      {SEVERITY_LABELS[entry.severity]}
                    </span>
                    <span className="sp-pill">{durationText(entry)}</span>
                  </div>

                  {entry.triggers?.length > 0 && (
                    <div className="sp-trigger-row">
                      触发因素：
                      {entry.triggers.map((triggerKey) => (
                        <span key={triggerKey} className="sp-trigger-tag">
                          {TRIGGERS.find(item => item.key === triggerKey)?.label ?? triggerKey}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.note && <div className="sp-note">备注：{entry.note}</div>}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {showForm && (
        <div className="sp-modal" onMouseDown={() => setShowForm(false)}>
          <div className="sp-modal-card" onMouseDown={(event) => event.stopPropagation()}>
            <div className="sp-modal-head">
              <h3>记录 {formatDateCN(formState.date)} 的症状</h3>
              <button type="button" className="sp-close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-form-section">
                <div className="sp-form-label">症状类型</div>
                <div className="sp-tabs">
                  {SYMPTOM_CATEGORIES.map((category) => (
                    <button
                      key={category.key}
                      type="button"
                      className={`sp-tab${formState.category === category.key ? ' active' : ''}`}
                      onClick={() => handleCategoryChange(category.key)}
                    >
                      {category.icon} {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sp-form-section">
                <label htmlFor="symptom-select" className="sp-form-label">具体症状</label>
                <select
                  id="symptom-select"
                  className="sp-select"
                  value={formState.symptom}
                  onChange={(event) => setFormState(prev => ({ ...prev, symptom: event.target.value }))}
                >
                  {SYMPTOMS_BY_CATEGORY[formState.category]?.map((symptom) => (
                    <option key={symptom} value={symptom}>{symptom}</option>
                  ))}
                </select>
              </div>

              <div className="sp-form-section">
                <label htmlFor="severity-range" className="sp-form-label">严重程度：{SEVERITY_LABELS[formState.severity]}</label>
                <input
                  id="severity-range"
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={formState.severity}
                  onChange={(event) => setFormState(prev => ({ ...prev, severity: Number(event.target.value) }))}
                  className="sp-range"
                />
                <div className="sp-range-scale">
                  {SEVERITY_LABELS.slice(1).map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="sp-form-section">
                <div className="sp-form-label">持续时间</div>
                <div className="sp-duration-row">
                  <label className="sp-radio">
                    <input
                      type="radio"
                      name="durationType"
                      checked={formState.durationType === 'persistent'}
                      onChange={() => setFormState(prev => ({ ...prev, durationType: 'persistent' }))}
                    />
                    持续
                  </label>
                  <label className="sp-radio">
                    <input
                      type="radio"
                      name="durationType"
                      checked={formState.durationType === 'intermittent'}
                      onChange={() => setFormState(prev => ({ ...prev, durationType: 'intermittent' }))}
                    />
                    间歇
                  </label>
                  <input
                    id="symptom-hours"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formState.hours}
                    onChange={(event) => setFormState(prev => ({ ...prev, hours: event.target.value }))}
                    className="sp-hours-input"
                  />
                  <label htmlFor="symptom-hours" className="sp-hours-unit">小时</label>
                </div>
              </div>

              <div className="sp-form-section">
                <div className="sp-form-label">触发因素</div>
                <div className="sp-trigger-options">
                  {TRIGGERS.map((trigger) => (
                    <label key={trigger.key} className="sp-checkbox">
                      <input
                        type="checkbox"
                        checked={formState.triggers.includes(trigger.key)}
                        onChange={() => handleTriggerToggle(trigger.key)}
                      />
                      {trigger.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="sp-form-section">
                <label htmlFor="symptom-note" className="sp-form-label">备注</label>
                <textarea
                  id="symptom-note"
                  className="sp-textarea"
                  rows="4"
                  placeholder="例如：早上空腹时更明显，喝温水后稍有缓解。"
                  value={formState.note}
                  onChange={(event) => setFormState(prev => ({ ...prev, note: event.target.value }))}
                />
              </div>

              <button type="button" className="sp-save-btn" onClick={handleSave}>保存记录</button>
            </div>
          </div>
        </div>
      )}

      {showTrend && (
        <div className="sp-modal" onMouseDown={() => setShowTrend(false)}>
          <div className="sp-modal-card sp-trend-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="sp-modal-head">
              <h3>症状严重程度趋势</h3>
              <button type="button" className="sp-close-btn" onClick={() => setShowTrend(false)}>✕</button>
            </div>

            {trendData.labels.length === 0 || trendData.datasets.length === 0 ? (
              <div className="sp-empty">暂无足够数据生成趋势图，请先记录症状。</div>
            ) : (
              <>
                <div className="sp-chart-wrap">
                  <canvas ref={canvasRef}></canvas>
                </div>
                <p className="sp-chart-hint">折线展示各症状类别在不同记录日期的平均严重程度，方便观察是否逐渐加重或缓解。</p>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="detail-footer">
        <p>如果症状持续加重、伴随出血/高热/剧烈腹痛，请及时就医。</p>
      </footer>
    </div>
  );
}
