import { useState, useRef, useEffect } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { getWeightAdvice } from './weight-advice.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, ChartTooltip, Legend);

/**
 * 体重追踪页面
 */
export function WeightPage({ info, weightRecords, addWeight, deleteWeight, preWeight, setPreWeight, onBack }) {
  const [inputWeight, setInputWeight] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().slice(0, 10));
  const [preWeightInput, setPreWeightInput] = useState(preWeight ? String(preWeight) : '');
  const [showPreWeightForm, setShowPreWeightForm] = useState(!preWeight);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // 最新体重
  const latestWeight = weightRecords.length > 0
    ? weightRecords[weightRecords.length - 1].weight
    : null;

  // 总增重
  const totalGain = preWeight && latestWeight
    ? Math.round((latestWeight - preWeight) * 10) / 10
    : null;

  // 建议引擎
  const advice = preWeight
    ? getWeightAdvice({ preWeight, weightRecords, currentWeek: info.weeks, trimester: info.trimester })
    : null;

  // 绘制图表
  useEffect(() => {
    if (!canvasRef.current || weightRecords.length < 1) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = weightRecords.map(r => `${r.week}周`);
    const data = weightRecords.map(r => r.weight);

    // 如果有孕前体重，加入第0周基准
    const chartLabels = preWeight ? ['孕前', ...labels] : labels;
    const chartData = preWeight ? [preWeight, ...data] : data;

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: '我的体重 (kg)',
            data: chartData,
            borderColor: '#2c7a7b',
            backgroundColor: 'rgba(44, 122, 123, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#2c7a7b',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                if (idx === 0 && preWeight) return '孕前体重';
                const rIdx = preWeight ? idx - 1 : idx;
                return `${weightRecords[rIdx].date}（${items[0].label}）`;
              },
            },
          },
        },
        scales: {
          y: {
            title: { display: true, text: '体重 (kg)', font: { size: 11 } },
            grid: { color: '#f0eae3' },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [weightRecords, preWeight]);

  // 保存孕前体重
  const handleSavePreWeight = () => {
    const w = parseFloat(preWeightInput);
    if (!w || w < 30 || w > 200) return;
    setPreWeight(w);
    setShowPreWeightForm(false);
  };

  // 添加体重记录
  const handleAdd = () => {
    const w = parseFloat(inputWeight);
    if (!w || w < 30 || w > 200) return;
    addWeight(inputDate, w, info.weeks);
    setInputWeight('');
  };

  return (
    <div className="detail-page weight-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={onBack}>← 返回</button>
        <h1>⚖️ 体重追踪</h1>
        <div className="header-week">{info.formatted} · {info.trimesterLabel}</div>
      </header>

      {/* 孕前体重设置 */}
      <div className="weight-pre-card">
        {showPreWeightForm ? (
          <>
            <h3>📏 设置孕前体重</h3>
            <p className="weight-pre-hint">用于计算BMI和推荐增重范围，数据仅保存在本地。</p>
            <div className="weight-pre-input-row">
              <input
                id="pre-weight-value"
                type="number"
                value={preWeightInput}
                onChange={(e) => setPreWeightInput(e.target.value)}
                placeholder="如 55.0"
                step="0.1"
                min="30"
                max="200"
              />
              <span className="weight-pre-unit">kg</span>
              <button type="button" className="weight-add-btn" onClick={handleSavePreWeight} disabled={!preWeightInput}>保存</button>
            </div>
          </>
        ) : (
          <div className="weight-pre-display">
            <span>📏 孕前体重：<strong>{preWeight} kg</strong></span>
            <button type="button" className="weight-pre-edit" onClick={() => setShowPreWeightForm(true)}>修改</button>
          </div>
        )}
      </div>

      {/* 概览卡片 */}
      <div className="weight-overview">
        <div className="weight-stat-card">
          <div className="weight-stat-label">最新体重</div>
          <div className="weight-stat-value">{latestWeight ? `${latestWeight} kg` : '暂无'}</div>
        </div>
        <div className="weight-stat-card">
          <div className="weight-stat-label">累计增长</div>
          <div className="weight-stat-value">{totalGain !== null ? `${totalGain > 0 ? '+' : ''}${totalGain} kg` : '暂无'}</div>
        </div>
        <div className="weight-stat-card">
          <div className="weight-stat-label">记录次数</div>
          <div className="weight-stat-value">{weightRecords.length} 次</div>
        </div>
      </div>

      {/* 建议卡片 */}
      {advice && (
        <div className={`weight-advice-card weight-advice-${advice.advice.level}`}>
          <div className="weight-advice-header">
            <span className="weight-advice-icon">{advice.advice.icon}</span>
            <span className="weight-advice-title">{advice.advice.title}</span>
          </div>
          <div className="weight-advice-range">
            本周推荐增重范围：<strong>{advice.recRange.min} - {advice.recRange.max} kg</strong>
          </div>
          <ul className="weight-advice-list">
            {advice.advice.messages.map((msg, i) => (
              <li key={`msg-${i}`}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 添加体重 */}
      <div className="weight-add-card">
        <h3>记录体重</h3>
        <div className="weight-input-row">
          <div className="weight-input-group">
            <label htmlFor="weight-date">日期</label>
            <input
              id="weight-date"
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="weight-input-group">
            <label htmlFor="weight-value">体重 (kg)</label>
            <input
              id="weight-value"
              type="number"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              placeholder="如 62.5"
              step="0.1"
              min="30"
              max="200"
            />
          </div>
          <button type="button" className="weight-add-btn" onClick={handleAdd} disabled={!inputWeight}>记录</button>
        </div>
      </div>

      {/* 图表 */}
      {weightRecords.length >= 1 && (
        <div className="weight-chart-card">
          <h3>体重趋势</h3>
          <div className="weight-chart-container">
            <canvas ref={canvasRef}></canvas>
          </div>
          {advice && (
            <p className="weight-chart-hint">
              孕前体重 {preWeight}kg → 当前 {latestWeight}kg，推荐总增重 {advice.recRange.totalMin}-{advice.recRange.totalMax}kg。
            </p>
          )}
        </div>
      )}

      {/* 历史记录 */}
      {weightRecords.length > 0 && (
        <div className="weight-history-card">
          <h3>历史记录</h3>
          <div className="weight-history-list">
            {[...weightRecords].reverse().map((r) => (
              <div key={r.date} className="weight-history-item">
                <div className="weight-history-info">
                  <span className="weight-history-date">{r.date}</span>
                  <span className="weight-history-week">孕{r.week}周</span>
                </div>
                {preWeight && (
                  <span className="weight-history-gain">
                    {r.weight - preWeight > 0 ? '+' : ''}{Math.round((r.weight - preWeight) * 10) / 10}kg
                  </span>
                )}
                <span className="weight-history-value">{r.weight} kg</span>
                <button
                  type="button"
                  className="weight-delete-btn"
                  onClick={() => {
                    if (confirm(`删除 ${r.date} 的记录（${r.weight}kg）？`)) {
                      deleteWeight(r.date);
                    }
                  }}
                  aria-label="删除记录"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 孕期体重增长参考 */}
      <div className="weight-ref-card">
        <h3>孕期体重增长参考</h3>
        <div className="weight-ref-table">
          <div className="weight-ref-row weight-ref-header">
            <span>孕前BMI</span>
            <span>推荐总增重</span>
            <span>中晚期每周</span>
          </div>
          <div className="weight-ref-row">
            <span>偏低 (&lt;18.5)</span>
            <span>12.5-18 kg</span>
            <span>0.5-0.6 kg</span>
          </div>
          <div className="weight-ref-row">
            <span>正常 (18.5-23.9)</span>
            <span>11.5-16 kg</span>
            <span>0.4-0.5 kg</span>
          </div>
          <div className="weight-ref-row">
            <span>超重 (24-27.9)</span>
            <span>7-11.5 kg</span>
            <span>0.3 kg</span>
          </div>
          <div className="weight-ref-row">
            <span>肥胖 (≥28)</span>
            <span>5-9 kg</span>
            <span>0.2 kg</span>
          </div>
        </div>
        <p className="weight-ref-hint">数据来源：《中国居民膳食指南（2022）》</p>
      </div>

      <footer className="detail-footer">
        <p>体重增长因人而异，以上为一般参考。如有疑问请咨询产检医生。</p>
      </footer>
    </div>
  );
}
