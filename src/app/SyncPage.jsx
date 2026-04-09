import { useCallback, useEffect, useState } from 'react';
import {
  generateRoomId,
  createRoom,
  joinRoom,
  sendData,
  collectLocalData,
  applyRemoteData,
  cleanup,
} from './sync.js';

/**
 * 数据同步页面
 *
 * 两种模式：
 * - 创建房间：显示 6 位房间号，等待对方加入
 * - 加入房间：输入房间号，连接对方
 *
 * 连接成功后可手动触发「同步数据」
 */
export function SyncPage({ onBack, reloadData }) {
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [status, setStatus] = useState('idle'); // idle | waiting | connecting | connected | synced | error
  const [errorMsg, setErrorMsg] = useState('');
  const [syncLog, setSyncLog] = useState([]);

  const addLog = useCallback((msg) => {
    setSyncLog(prev => [...prev, `${new Date().toLocaleTimeString()} ${msg}`]);
  }, []);

  // 处理收到的消息
  const handleReceive = useCallback((msg) => {
    switch (msg.type) {
      case 'connected':
        setStatus('connected');
        addLog('✅ 对方已连接');
        break;
      case 'sync':
        applyRemoteData(msg.data);
        reloadData();
        setStatus('synced');
        addLog('📥 收到对方数据并已合并');
        break;
      case 'disconnected':
        setStatus('idle');
        addLog('⚠️ 连接已断开');
        break;
      case 'error':
        setStatus('error');
        setErrorMsg(msg.message);
        addLog(`❌ 错误：${msg.message}`);
        break;
    }
  }, [reloadData, addLog]);

  // 清理连接
  useEffect(() => {
    return () => cleanup();
  }, []);

  const handleCreate = async () => {
    const id = generateRoomId();
    setRoomId(id);
    setMode('create');
    setStatus('connecting');
    setSyncLog([]);
    addLog(`正在创建房间 ${id}...`);
    try {
      await createRoom(id, handleReceive);
      setStatus('waiting');
      addLog(`房间 ${id} 已就绪，等待对方加入`);
    } catch (err) {
      setStatus('error');
      addLog(`❌ 创建失败：${err.message}`);
    }
  };

  const handleJoin = () => {
    const id = inputRoomId.trim().toUpperCase();
    if (id.length !== 6) return;
    setRoomId(id);
    setMode('join');
    setStatus('connecting');
    setSyncLog([]);
    addLog(`正在连接房间 ${id}...`);
    joinRoom(id, handleReceive);
  };

  const handleSync = () => {
    const data = collectLocalData();
    const ok = sendData(data);
    if (ok) {
      addLog('📤 已发送本地数据');
    } else {
      addLog('❌ 发送失败，连接可能已断开');
    }
  };

  const handleBack = () => {
    cleanup();
    setMode(null);
    setStatus('idle');
    setRoomId('');
    setInputRoomId('');
    setErrorMsg('');
    setSyncLog([]);
    onBack();
  };

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={handleBack}>← 返回</button>
        <h1>🔗 数据同步</h1>
        <div />
      </header>

      {!mode ? (
        <section className="sync-choice-card">
          <h2>选择同步方式</h2>
          <p className="sync-hint">两台设备之间直接同步孕期数据，无需服务器。确保双方网络可用。</p>
          <div className="sync-choice-buttons">
            <button type="button" className="sync-choice-btn" onClick={handleCreate}>
              <span className="sync-choice-icon">📡</span>
              <span>创建房间</span>
              <span className="sync-choice-sub">生成房间号，等对方加入</span>
            </button>
            <button type="button" className="sync-choice-btn" onClick={() => setMode('join-input')}>
              <span className="sync-choice-icon">🔗</span>
              <span>加入房间</span>
              <span className="sync-choice-sub">输入对方的房间号</span>
            </button>
          </div>
        </section>
      ) : mode === 'join-input' ? (
        <section className="sync-join-card">
          <h2>加入房间</h2>
          <p className="sync-hint">输入对方提供的 6 位房间号</p>
          <div className="sync-input-row">
            <input
              type="text"
              className="sync-room-input"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="输入房间号"
              maxLength={6}
            />
            <button
              type="button"
              className="sync-join-btn"
              onClick={handleJoin}
              disabled={inputRoomId.trim().length !== 6}
            >
              连接
            </button>
          </div>
          <button type="button" className="sync-back-link" onClick={() => setMode(null)}>
            ← 返回选择
          </button>
        </section>
      ) : (
        <section className="sync-room-card">
          {mode === 'create' && (
            <div className="sync-room-display">
              <div className="sync-room-label">房间号</div>
              <div className="sync-room-code">{roomId}</div>
              <div className="sync-room-hint">将此房间号告诉对方，等待加入</div>
            </div>
          )}

          <div className="sync-status-bar">
            <span className={`sync-status-dot ${status === 'connected' || status === 'synced' ? 'online' : status === 'waiting' || status === 'connecting' ? 'pending' : ''}`} />
            <span className="sync-status-text">
              {status === 'waiting' && '等待对方加入...'}
              {status === 'connecting' && '正在连接...'}
              {status === 'connected' && '已连接，可以同步'}
              {status === 'synced' && '同步完成'}
              {status === 'error' && `出错：${errorMsg}`}
            </span>
          </div>

          {(status === 'connected' || status === 'synced') && (
            <button type="button" className="sync-action-btn" onClick={handleSync}>
              🔄 同步我的数据
            </button>
          )}

          {syncLog.length > 0 && (
            <div className="sync-log">
              {syncLog.map((log, i) => (
                <div key={i} className="sync-log-item">{log}</div>
              ))}
            </div>
          )}

          <button type="button" className="sync-back-link" onClick={() => { cleanup(); setMode(null); setStatus('idle'); setSyncLog([]); }}>
            ← 断开并返回
          </button>
        </section>
      )}
    </div>
  );
}
