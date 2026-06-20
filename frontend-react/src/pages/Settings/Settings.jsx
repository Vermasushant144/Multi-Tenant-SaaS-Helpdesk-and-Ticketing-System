import React, { useState, useEffect } from 'react';
import { NotificationService } from '../../services/NotificationService';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { Settings as SettingsIcon, ShieldCheck, HelpCircle, RefreshCw } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Settings properties
  const [companyName, setCompanyName] = useState('');
  const [timezone, setTimezone] = useState('UTC+05:30');
  const [defaultPriority, setDefaultPriority] = useState('MEDIUM');
  const [emailNotif, setEmailNotif] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await NotificationService.getSettings();
      setCompanyName(data.companyName || '');
      setTimezone(data.timezone || 'UTC+05:30');
      setDefaultPriority(data.defaultPriority || 'MEDIUM');
      setEmailNotif(data.emailNotifications);
    } catch (err) {
      setError('FAILED_TO_LOAD_SETTINGS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await NotificationService.updateSettings({
        companyName,
        timezone,
        defaultPriority,
        emailNotifications: emailNotif
      });
      setSuccess('SYSTEM_SETTINGS_UPDATED_SUCCESSFULLY');
    } catch (err) {
      setError('FAILED_TO_SAVE_SYSTEM_SETTINGS');
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setIsConfirmOpen(false);
    localStorage.clear();
    setSuccess('LOCAL_STORAGE_CLEARED_PLEASE_REFRESH_PAGE');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  if (loading) {
    return (
      <div className="settings-loading">
        Loading settings config...
      </div>
    );
  }

  return (
    <div className="settings-page-container">
      {success && (
        <div className="settings-success-banner card mb-2">
          <ShieldCheck size={18} /> <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="settings-error-banner card mb-2">
          <HelpCircle size={18} /> <span>{error}</span>
        </div>
      )}

      <div className="grid-2">
        {/* Left Side: System Configurations */}
        <div className="settings-main-card card">
          <div className="card-title">
            <span>TENANT_CONFIGURATION</span>
            <SettingsIcon size={18} />
          </div>

          <form onSubmit={handleSaveSettings} className="settings-form">
            <div className="form-group">
              <label className="form-label">TENANT_ORGANIZATION_NAME</label>
              <input
                type="text"
                className="form-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label className="form-label">DEFAULT_SYSTEM_TIMEZONE</label>
              <select
                className="form-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={saving}
              >
                <option value="UTC-08:00">UTC-08:00 (Pacific Time)</option>
                <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
                <option value="UTC+00:00">UTC+00:00 (Greenwich Mean Time)</option>
                <option value="UTC+01:00">UTC+01:00 (Central European Time)</option>
                <option value="UTC+05:30">UTC+05:30 (Indian Standard Time)</option>
                <option value="UTC+08:00">UTC+08:00 (Singapore / Beijing Time)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">DEFAULT_TICKET_PRIORITY</label>
              <select
                className="form-select"
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(e.target.value)}
                disabled={saving}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={saving}>
              {saving ? 'SAVING_SETTINGS...' : 'SAVE_SYSTEM_SETTINGS'}
            </button>
          </form>
        </div>

        {/* Right Side: Operations / Disaster Recovery */}
        <div className="settings-ops-card card">
          <div className="card-title">
            <span>SYSTEM_OPERATIONS</span>
          </div>

          <div className="ops-section mb-3">
            <h4 className="ops-title">RESET_SYSTEM_STATE</h4>
            <p className="ops-desc">
              Clears all local storage settings, mock database states, tickets revisions, comments, and resets to defaults.
            </p>
            <button className="btn btn-danger btn-sm" onClick={handleResetData}>
              <RefreshCw size={12} /> RESET_SYSTEM_DATA
            </button>
          </div>

          <div className="ops-section">
            <h4 className="ops-title">TENANT_LICENSE_INFO</h4>
            <div className="license-info-box">
              <div className="info-row">
                <span>LICENSE_TYPE:</span>
                <strong>ENTERPRISE_MULTITENANT</strong>
              </div>
              <div className="info-row">
                <span>SEAT_COUNT:</span>
                <strong>UNLIMITED</strong>
              </div>
              <div className="info-row">
                <span>STATUS:</span>
                <strong style={{ color: '#2bb32b' }}>ACTIVE</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="CONFIRM_DATABASE_RESET"
        message="Are you absolutely sure you want to reset the system database? This action will purge all local storage data, sign you out, and refresh the helpdesk environment. Any custom tickets or comments will be lost."
      />
    </div>
  );
};

export default Settings;
