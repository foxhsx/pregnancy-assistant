/**
 * PeerJS 数据同步封装
 *
 * 流程：
 * 1. 创建方：generateRoomId() → createRoom(roomId, onReceive)
 * 2. 加入方：joinRoom(roomId, onReceive)
 * 3. 双方连接后调用 sendData(payload) 发送本地数据
 * 4. 收到对方数据后回调 onReceive
 */

import Peer from 'peerjs';

let peer = null;
let conn = null;
let onReceiveCallback = null;

/** 房间号前缀，避免与 PeerJS 其他用户冲突 */
const ROOM_PREFIX = 'yunqi-';

/** 生成 6 位房间号 */
export function generateRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * 获取当前状态：'idle' | 'connecting' | 'connected'
 */
export function getSyncStatus() {
  if (!peer) return 'idle';
  if (conn && conn.open) return 'connected';
  return 'connecting';
}

/**
 * 收集所有本地数据用于同步
 */
export function collectLocalData() {
  return {
    lmpDate: localStorage.getItem('yunqi_user_data') ? JSON.parse(localStorage.getItem('yunqi_user_data')).lmpDate : null,
    checkupDone: JSON.parse(localStorage.getItem('yunqi_checkup_done') || '{}'),
    weightRecords: JSON.parse(localStorage.getItem('yunqi_weight_records') || '[]'),
    preWeight: localStorage.getItem('yunqi_pre_weight') ? parseFloat(localStorage.getItem('yunqi_pre_weight')) : null,
    symptoms: JSON.parse(localStorage.getItem('yunqi_symptoms') || '[]'),
    timestamp: Date.now(),
  };
}

/**
 * 将收到的远程数据写入本地
 * 策略：合并——以 timestamp 更新的一方为准，记录类数据取并集
 */
export function applyRemoteData(remote) {
  if (!remote) return;

  // lmpDate：取非空值，都有则取较新的
  if (remote.lmpDate) {
    localStorage.setItem('yunqi_user_data', JSON.stringify({ lmpDate: remote.lmpDate }));
  }

  // checkupDone：合并
  if (remote.checkupDone) {
    const local = JSON.parse(localStorage.getItem('yunqi_checkup_done') || '{}');
    const merged = { ...local, ...remote.checkupDone };
    localStorage.setItem('yunqi_checkup_done', JSON.stringify(merged));
  }

  // weightRecords：按 date 去重合并，保留两边所有记录
  if (remote.weightRecords) {
    const local = JSON.parse(localStorage.getItem('yunqi_weight_records') || '[]');
    const map = new Map();
    for (const r of [...local, ...remote.weightRecords]) {
      map.set(r.date, r);
    }
    const merged = [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem('yunqi_weight_records', JSON.stringify(merged));
  }

  // preWeight：取非空值
  if (remote.preWeight != null) {
    localStorage.setItem('yunqi_pre_weight', String(remote.preWeight));
  }

  // symptoms：按 date + entry.id 去重合并
  if (remote.symptoms) {
    const local = JSON.parse(localStorage.getItem('yunqi_symptoms') || '[]');
    const dateMap = new Map();
    // 先放本地
    for (const r of local) {
      dateMap.set(r.date, new Map(r.entries.map(e => [e.id, e])));
    }
    // 合并远程
    for (const r of remote.symptoms) {
      if (!dateMap.has(r.date)) {
        dateMap.set(r.date, new Map(r.entries.map(e => [e.id, e])));
      } else {
        const entries = dateMap.get(r.date);
        for (const e of r.entries) {
          if (!entries.has(e.id)) entries.set(e.id, e);
        }
      }
    }
    const merged = [...dateMap.entries()]
      .map(([date, entries]) => ({ date, entries: [...entries.values()] }))
      .sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem('yunqi_symptoms', JSON.stringify(merged));
  }
}

/**
 * 创建房间（等待对方加入）
 * @returns {Promise<void>} 在 peer open 成功后 resolve
 */
export function createRoom(roomId, onReceive) {
  cleanup();
  onReceiveCallback = onReceive;

  return new Promise((resolve, reject) => {
    peer = new Peer(ROOM_PREFIX + roomId);

    peer.on('open', () => {
      resolve();
    });

    peer.on('connection', (connection) => {
      conn = connection;
      setupConnection(conn);
    });

    peer.on('error', (err) => {
      console.error('Peer create error:', err);
      if (err.type === 'unavailable-id') {
        reject(new Error('该房间号已被占用，请重新创建'));
      } else {
        reject(err);
      }
    });
  });
}

/**
 * 加入房间
 */
export function joinRoom(roomId, onReceive) {
  cleanup();
  onReceiveCallback = onReceive;

  peer = new Peer();

  peer.on('open', () => {
    conn = peer.connect(ROOM_PREFIX + roomId, { reliable: true });
    setupConnection(conn);
  });

  peer.on('error', (err) => {
    console.error('Peer join error:', err);
    if (err.type === 'peer-unavailable') {
      if (onReceiveCallback) onReceiveCallback({ type: 'error', message: '房间不存在或对方还未就绪，请确认房间号且对方保持在同步页面' });
    } else {
      if (onReceiveCallback) onReceiveCallback({ type: 'error', message: err.type || err.message });
    }
  });
}

/**
 * 发送数据给对方
 */
export function sendData(payload) {
  if (conn && conn.open) {
    conn.send({ type: 'sync', data: payload });
    return true;
  }
  return false;
}

/**
 * 设置连接事件
 */
function setupConnection(connection) {
  connection.on('open', () => {
    if (onReceiveCallback) onReceiveCallback({ type: 'connected' });
  });

  connection.on('data', (msg) => {
    if (msg.type === 'sync' && onReceiveCallback) {
      onReceiveCallback({ type: 'sync', data: msg.data });
    }
  });

  connection.on('close', () => {
    if (onReceiveCallback) onReceiveCallback({ type: 'disconnected' });
  });

  connection.on('error', (err) => {
    if (onReceiveCallback) onReceiveCallback({ type: 'error', message: err.message });
  });
}

/**
 * 断开连接，清理资源
 */
export function cleanup() {
  if (conn) {
    conn.close();
    conn = null;
  }
  if (peer) {
    peer.destroy();
    peer = null;
  }
  onReceiveCallback = null;
}
