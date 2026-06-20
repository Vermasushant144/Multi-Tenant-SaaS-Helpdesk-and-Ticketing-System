import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  TicketPlus, 
  Users, 
  Bell, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'DASHBOARD', icon: <LayoutDashboard size={18} /> },
    { path: '/tickets', label: 'TICKETS', icon: <Ticket size={18} /> },
    { path: '/tickets/create', label: 'CREATE_TICKET', icon: <TicketPlus size={18} /> },
    { path: '/users', label: 'USER_MANAGEMENT', icon: <Users size={18} />, roles: ['ADMIN'] },
    { path: '/notifications', label: 'NOTIFICATIONS', icon: <Bell size={18} /> },
    { path: '/profile', label: 'PROFILE', icon: <User size={18} /> },
    { path: '/settings', label: 'SETTINGS', icon: <Settings size={18} /> },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <aside className={`sidebar-aside ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <h1 className="brand-logo">🎫 BRUTAL_TICKET</h1>
        {user && <span className="tenant-badge">{user.company}</span>}
      </div>

      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active-link' : ''}`
            }
          >
            <span className="link-icon">{item.icon}</span>
            <span className="link-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-summary">
          <div className="user-avatar-brutal">
            {user ? user.name.substring(0, 2).toUpperCase() : '??'}
          </div>
          <div className="user-info-text">
            <span className="user-name-span">{user ? user.name : 'Unknown User'}</span>
            <span className="user-role-span">{user ? user.role : 'CLIENT'}</span>
          </div>
        </div>
        <button className="btn btn-danger btn-sm logout-btn" onClick={logout}>
          <LogOut size={14} /> LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
