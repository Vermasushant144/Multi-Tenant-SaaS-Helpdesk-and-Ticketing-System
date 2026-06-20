import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckSquare, BellOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotificationService } from '../../services/NotificationService';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 15 seconds to simulate realtime
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      const updated = await NotificationService.markAllAsRead();
      setNotifications(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const updated = await NotificationService.markAsRead(id);
      setNotifications(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className="notification-trigger-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="unread-counter">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>NOTIFICATIONS</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
                <CheckSquare size={12} /> MARK_ALL_READ
              </button>
            )}
          </div>

          <div className="dropdown-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <BellOff size={16} />
                <span>NO_NOTIFICATIONS</span>
              </div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div key={notif.id} className={`dropdown-item ${!notif.read ? 'unread' : ''}`}>
                  <div className="dropdown-item-header">
                    <span className="notif-type">{notif.type}</span>
                    <span className="notif-time">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="notif-title">{notif.title}</h4>
                  <p className="notif-msg">{notif.message}</p>
                  {!notif.read && (
                    <button className="mark-read-btn" onClick={(e) => handleMarkAsRead(notif.id, e)}>
                      MARK_READ
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="dropdown-footer">
            <Link to="/notifications" className="view-all-link" onClick={() => setIsOpen(false)}>
              VIEW_ALL_FEED
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
