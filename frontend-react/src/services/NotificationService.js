import { getNotifications as getMockNotifications, setNotifications, getSettings as getMockSettings, setSettings } from './mockData';

export const NotificationService = {
  getNotifications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockNotifications());
      }, 200);
    });
  },

  markAsRead: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getMockNotifications();
        const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
        setNotifications(updated);
        resolve(updated);
      }, 150);
    });
  },

  markAllAsRead: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getMockNotifications();
        const updated = list.map(n => ({ ...n, read: true }));
        setNotifications(updated);
        resolve(updated);
      }, 200);
    });
  },

  getSettings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockSettings());
      }, 150);
    });
  },

  updateSettings: async (settingsData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getMockSettings();
        const updated = { ...current, ...settingsData };
        setSettings(updated);
        resolve(updated);
      }, 300);
    });
  }
};
