// src/app/notification-service.js

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
