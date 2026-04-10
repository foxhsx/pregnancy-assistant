import { useState } from 'react';
import { usePregnancy } from './usePregnancy.js';
import { SetupPage } from './SetupPage.jsx';
import { Dashboard } from './Dashboard.jsx';
import { CheckupPage } from './CheckupPage.jsx';
import { WeightPage } from './WeightPage.jsx';
import { DietPage } from './DietPage.jsx';
import { LifestylePage } from './LifestylePage.jsx';
import { DadPage } from './DadPage.jsx';
import { SymptomPage } from './SymptomPage.jsx';
import { SyncPage } from './SyncPage.jsx';
import { useReminders } from './useReminders.js';
import { ReminderPage } from './ReminderPage.jsx';
import { InAppAlert } from './InAppAlert.jsx';

/**
 * 应用根组件
 */
export function App() {
  const { ready, lmpDate, info, isSetup, setLmpDate, setDueDate, checkupDone, toggleCheckup, weightRecords, addWeight, deleteWeight, preWeight, setPreWeight, resetData, symptoms, addSymptom, deleteSymptom, reloadData } = usePregnancy();
  const [page, setPage] = useState('home');

  // 提醒系统
  const {
    reminders,
    settings,
    missedReminders,
    todayReminders,
    hasPermission,
    currentAlert,
    addReminder,
    deleteReminder,
    toggleReminder,
    updateSettings,
    requestPermission,
    dismissAlert,
    dismissMissed
  } = useReminders(info);

  // 渲染页面
  const pageContent = (() => {
    if (!ready) return null;

    // 未设置日期 → 显示设置页面
    if (!isSetup) {
      return (
        <SetupPage
          onSetup={(dateValue, mode) => {
            if (mode === 'lmp') setLmpDate(dateValue);
            else setDueDate(dateValue);
          }}
        />
      );
    }

    // 路由
    const handleNavigate = (key) => {
      if (key === 'home') {
        setPage('home');
      } else {
        setPage(key);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
      if (confirm('确定要重置所有数据吗？将清除已保存的日期、产检和体重记录。')) {
        resetData();
        setPage('home');
      }
    };

    switch (page) {
      case 'checkup':
        return <CheckupPage info={info} checkupDone={checkupDone} toggleCheckup={toggleCheckup} onBack={() => setPage('home')} />;
      case 'weight':
        return <WeightPage info={info} weightRecords={weightRecords} addWeight={addWeight} deleteWeight={deleteWeight} preWeight={preWeight} setPreWeight={setPreWeight} onBack={() => setPage('home')} />;
      case 'diet':
        return <DietPage info={info} onBack={() => setPage('home')} />;
      case 'life':
        return <LifestylePage info={info} onBack={() => setPage('home')} />;
      case 'dad':
        return <DadPage info={info} onBack={() => setPage('home')} />;
      case 'symptom':
        return <SymptomPage info={info} symptoms={symptoms} addSymptom={addSymptom} deleteSymptom={deleteSymptom} onBack={() => setPage('home')} />;
      case 'sync':
        return <SyncPage onBack={() => setPage('home')} reloadData={reloadData} />;
      case 'reminder':
        return (
          <ReminderPage
            reminders={reminders}
            settings={settings}
            hasPermission={hasPermission}
            onAdd={addReminder}
            onDelete={deleteReminder}
            onToggle={toggleReminder}
            onUpdateSettings={updateSettings}
            onRequestPermission={requestPermission}
            onBack={() => setPage('home')}
          />
        );
      default:
        return (
          <Dashboard
            info={info}
            checkupDone={checkupDone}
            toggleCheckup={toggleCheckup}
            weightRecords={weightRecords}
            preWeight={preWeight}
            symptoms={symptoms}
            onNavigate={handleNavigate}
            onReset={handleReset}
            todayReminders={todayReminders}
            missedReminders={missedReminders}
            hasPermission={hasPermission}
            requestPermission={requestPermission}
            dismissMissed={dismissMissed}
            onNavigateToReminder={() => setPage('reminder')}
          />
        );
    }
  })();

  return (
    <>
      {pageContent}
      {currentAlert && <InAppAlert reminder={currentAlert} onDismiss={dismissAlert} />}
    </>
  );
}
