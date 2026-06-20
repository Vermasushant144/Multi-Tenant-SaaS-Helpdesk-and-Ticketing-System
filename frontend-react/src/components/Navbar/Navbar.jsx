import React from 'react';
import { Menu, X } from 'lucide-react';
import NotificationBell from '../NotificationBell/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Simple page title generation from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/tickets/create')) return 'CREATE_TICKET';
    if (path.startsWith('/tickets/')) return 'TICKET_DETAILS';
    if (path === '/tickets') return 'TICKETS_LIST';
    if (path === '/dashboard') return 'DASHBOARD_OVERVIEW';
    if (path === '/users') return 'USER_MANAGEMENT';
    if (path === '/notifications') return 'NOTIFICATIONS_CENTER';
    if (path === '/profile') return 'USER_PROFILE';
    if (path === '/settings') return 'SYSTEM_SETTINGS';
    return 'HELP_DESK';
  };

  return (
    <header className="navbar-header">
      <div className="navbar-left">
        <button 
          className="sidebar-toggle-btn" 
          onClick={toggleSidebar} 
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="navbar-page-title">{getPageTitle()}</span>
      </div>

      <div className="navbar-right">
        <NotificationBell />
        <div className="navbar-tenant-pill">
          <span className="navbar-role-pill">{user ? user.role : 'CLIENT'}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
