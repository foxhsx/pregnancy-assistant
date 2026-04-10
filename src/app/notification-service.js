// src/app/notification-service.js

/**
 * 语音播报服务
 */
export const SpeechService = {
  /**
   * 检查浏览器是否支持语音合成
   * @returns {boolean}
   */
  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  /**
   * 获取可用的中文语音
   * @returns {SpeechSynthesisVoice|null}
   */
  getChineseVoice() {
    if (!this.isSupported()) return null;
    const voices = speechSynthesis.getVoices();
    return voices.find(v => v.lang.startsWith('zh')) || voices[0] || null;
  },

  /**
   * 播报文本
   * @param {string} text 要播报的文本
   * @param {Object} options 选项
   * @returns {boolean} 是否成功
   */
  speak(text, options = {}) {
    if (!this.isSupported() || !text) return false;

    // 取消之前的播报
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = options.rate || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.pitch = options.pitch || 1.0;

    // 尝试使用中文语音
    const chineseVoice = this.getChineseVoice();
    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    speechSynthesis.speak(utterance);
    return true;
  },

  /**
   * 停止播报
   */
  stop() {
    if (this.isSupported()) {
      speechSynthesis.cancel();
    }
  }
};

/**
 * 浏览器通知服务
 */
export const NotificationService = {
  /**
   * 检查浏览器是否支持通知
   * @returns {boolean}
   */
  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  /**
   * 请求通知权限
   * @returns {Promise<string>} 'granted' | 'denied' | 'default' | 'unsupported'
   */
  async requestPermission() {
    if (!this.isSupported()) return 'unsupported';

    try {
      const result = await Notification.requestPermission();
      return result;
    } catch {
      return 'default';
    }
  },

  /**
   * 获取当前权限状态
   * @returns {string} 'granted' | 'denied' | 'default' | 'unsupported'
   */
  getPermissionStatus() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  /**
   * 发送通知
   * @param {string} title 通知标题
   * @param {Object} options 通知选项
   * @returns {Notification|null}
   */
  async show(title, options = {}) {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: options.tag || `reminder-${Date.now()}`,
        requireInteraction: true,
        body: options.body || '',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) {
          options.onClick();
        }
      };

      return notification;
    } catch {
      return null;
    }
  }
};
