import React, { useState, useEffect } from 'react';
import { NotificationService } from '../../services/NotificationService';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import { 
  Bell, 
  Mail, 
  Send, 
  Check, 
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Settings states
  const [emailNotif, setEmailNotif] = useState(true);
  const [telegramNotif, setTelegramNotif] = useState(false);
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const notifData = await NotificationService.getNotifications();
      setNotifications(notifData);

      const settings = await NotificationService.getSettings();
      setEmailNotif(settings.emailNotifications);
      setTelegramNotif(settings.telegramNotifications);
      setTelegramToken(settings.telegramToken || '');
      setTelegramChatId(settings.telegramChatId || '');
    } catch (err) {
      setError('FAILED_TO_LOAD_NOTIFICATIONS_OR_SETTINGS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSavingSettings(true);

    try {
      await NotificationService.updateSettings({
        emailNotifications: emailNotif,
        telegramNotifications: telegramNotif,
        telegramToken,
        telegramChatId
      });
      setSuccessMsg('NOTIFICATION_SETTINGS_UPDATED');
    } catch (err) {
      setError('FAILED_TO_SAVE_SETTINGS');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const updated = await NotificationService.markAsRead(id);
      setNotifications(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const updated = await NotificationService.markAllAsRead();
      setNotifications(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="notifications-loading">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page-container">
      {successMsg && (
        <div className="notifications-success-banner card mb-2">
          <Check size={18} /> <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="notifications-error-banner card mb-2">
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}

      <div className="notifications-grid">
        {/* Left Side: Activity Feed */}
        <div className="notifications-feed-card card">
          <div className="card-title">
            <span>NOTIFICATION_FEED ({unreadCount} UNREAD)</span>
            {unreadCount > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
                MARK_ALL_READ
              </button>
            )}
          </div>

          <div className="notifications-list-feed">
            {notifications.length === 0 ? (
              <div className="empty-notifications-feed">
                NO_NOTIFICATIONS_FOUND
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`feed-item-card ${!notif.read ? 'unread' : ''}`}>
                  <div className="feed-item-header">
                    <span className="feed-item-type">{notif.type}</span>
                    <span className="feed-item-time">
                      <Clock size={10} /> {formatDate(notif.createdAt)}
                    </span>
                  </div>
                  <h4 className="feed-item-title">{notif.title}</h4>
                  <p className="feed-item-desc">{notif.message}</p>
                  {!notif.read && (
                    <button className="btn btn-secondary btn-sm mt-1" onClick={() => handleMarkAsRead(notif.id)}>
                      <Eye size={12} /> MARK_AS_READ
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Channel Settings */}
        <div className="notifications-settings-card card">
          <div className="card-title">
            <span>CHANNEL_PREFERENCES</span>
            <Bell size={18} />
          </div>

          <form onSubmit={handleSaveSettings} className="notification-settings-form">
            <div className="preference-option-box mb-2">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  disabled={savingSettings}
                />
                <div className="label-text-combo">
                  <span className="channel-title"><Mail size={14} /> EMAIL_NOTIFICATIONS</span>
                  <span className="channel-desc">Receive summary digests and ticket response reports.</span>
                </div>
              </label>
            </div>

            <div className="preference-option-box mb-3">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={telegramNotif}
                  onChange={(e) => setTelegramNotif(e.target.checked)}
                  disabled={savingSettings}
                />
                <div className="label-text-combo">
                  <span className="channel-title"><Send size={14} /> TELEGRAM_WEBHOOKS</span>
                  <span className="channel-desc">Receive real-time instant messages from support bot.</span>
                </div>
              </label>
            </div>

            {telegramNotif && (
              <div className="telegram-fields card mb-3">
                <h4 className="telegram-fields-title">TELEGRAM_BOT_CREDENTIALS</h4>
                <div className="form-group">
                  <label className="form-label">BOT_API_TOKEN</label>
                  <input
                    type="password"
                    className="form-input"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                    required={telegramNotif}
                    disabled={savingSettings}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">TARGET_CHAT_ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="e.g. -10012345678"
                    required={telegramNotif}
                    disabled={savingSettings}
                  />
                  <span className="help-text">Obtain chat ID by messaging @userinfobot / setting group access.</span>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100" disabled={savingSettings}>
              {savingSettings ? 'SAVING_PREFERENCES...' : 'SAVE_NOTIF_SETTINGS'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
