// src/app/InAppAlert.jsx

/**
 * 应用内提醒弹窗
 */
export function InAppAlert({ reminder, onDismiss }) {
  if (!reminder) return null;

  return (
    <div className="in-app-alert-overlay" onClick={onDismiss}>
      <div className="in-app-alert" onClick={e => e.stopPropagation()}>
        <div className="alert-icon">🔔</div>
        <div className="alert-content">
          <h3 className="alert-title">{reminder.title}</h3>
          {reminder.description && (
            <p className="alert-desc">{reminder.description}</p>
          )}
        </div>
        <div className="alert-actions">
          <button type="button" className="alert-btn-dismiss" onClick={onDismiss}>
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}
