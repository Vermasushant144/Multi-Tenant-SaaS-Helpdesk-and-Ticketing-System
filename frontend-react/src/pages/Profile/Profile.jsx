import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Key, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  
  // Profile Info Form
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [company, setCompany] = useState(user ? user.company : '');
  const [telegramUsername, setTelegramUsername] = useState(user && user.telegramUsername ? user.telegramUsername : '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password Change Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Telegram Linking State
  const [telegramStatus, setTelegramStatus] = useState(user && user.telegramUsername ? 'LINKED' : 'UNLINKED');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      await updateProfile(name, email, company, telegramUsername);
      setProfileSuccess('PROFILE_INFORMATION_UPDATED');
    } catch (err) {
      setProfileError(err.message || 'FAILED_TO_UPDATE_PROFILE');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('NEW_PASSWORDS_DO_NOT_MATCH');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordSuccess('PASSWORD_CHANGED_SUCCESSFULLY');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'PASSWORD_CHANGE_FAILED');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLinkTelegram = async () => {
    if (!telegramUsername.trim()) {
      setProfileError('TELEGRAM_USERNAME_REQUIRED');
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile(name, email, company, telegramUsername);
      setTelegramStatus('LINKED');
      setProfileSuccess('TELEGRAM_ACCOUNT_LINKED_PROVISIONALLY');
    } catch (err) {
      setProfileError(err.message || 'LINKING_FAILED');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUnlinkTelegram = async () => {
    setProfileLoading(true);
    try {
      await updateProfile(name, email, company, '');
      setTelegramUsername('');
      setTelegramStatus('UNLINKED');
      setProfileSuccess('TELEGRAM_ACCOUNT_DISCONNECTED');
    } catch (err) {
      setProfileError(err.message || 'DISCONNECTION_FAILED');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="grid-2">
        {/* Left Side: Profile Info Form */}
        <div className="profile-info-card card">
          <div className="card-title">
            <span>PROFILE_CREDENTIALS</span>
            <User size={18} />
          </div>

          {profileSuccess && (
            <div className="profile-success-banner mb-2">
              <CheckCircle size={16} /> <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="profile-error-banner mb-2">
              <AlertCircle size={16} /> <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label className="form-label">FULL_NAME</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={profileLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">EMAIL_ADDRESS</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={profileLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">TENANT_ORGANIZATION</label>
              <input
                type="text"
                className="form-input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                disabled={profileLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">SECURITY_LEVEL</label>
              <input
                type="text"
                className="form-input"
                value={user ? user.role : 'CLIENT'}
                disabled
                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
              />
            </div>

            {/* Telegram linking section in profile info */}
            <div className="telegram-linking-section mb-3">
              <h4 className="section-subtitle">TELEGRAM_ACCOUNT_LINKING</h4>
              <div className="telegram-input-row">
                <div className="tg-at-input">
                  <span className="at-marker">@</span>
                  <input
                    type="text"
                    className="form-input tg-input-field"
                    placeholder="username"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value.replace('@', ''))}
                    disabled={profileLoading || telegramStatus === 'LINKED'}
                  />
                </div>
                {telegramStatus === 'LINKED' ? (
                  <button 
                    type="button" 
                    className="btn btn-danger btn-sm"
                    onClick={handleUnlinkTelegram}
                    disabled={profileLoading}
                  >
                    DISCONNECT
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={handleLinkTelegram}
                    disabled={profileLoading}
                  >
                    LINK_ACCOUNT
                  </button>
                )}
              </div>
              <span className="help-text">
                {telegramStatus === 'LINKED' 
                  ? 'Status: LINKED // You will receive direct messages through your username.' 
                  : 'Link account to receive real-time direct notifications via @BrutalTicketSupportBot.'
                }
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={profileLoading}>
              {profileLoading ? 'SAVING_CHANGES...' : 'SAVE_PROFILE_CHANGES'}
            </button>
          </form>
        </div>

        {/* Right Side: Change Password Form */}
        <div className="profile-password-card card">
          <div className="card-title">
            <span>CHANGE_PASSWORD</span>
            <Key size={18} />
          </div>

          {passwordSuccess && (
            <div className="profile-success-banner mb-2">
              <CheckCircle size={16} /> <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="profile-error-banner mb-2">
              <AlertCircle size={16} /> <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="password-form">
            <div className="form-group">
              <label className="form-label">CURRENT_PASSWORD</label>
              <input
                type="password"
                className="form-input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={passwordLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">NEW_PASSWORD</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={passwordLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CONFIRM_NEW_PASSWORD</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={passwordLoading}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={passwordLoading}>
              {passwordLoading ? 'UPDATING_PASSWORD...' : 'UPDATE_PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
