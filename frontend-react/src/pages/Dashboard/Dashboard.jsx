import React, { useState, useEffect } from 'react';
import { DashboardService } from '../../services/DashboardService';
import TicketTable from '../../components/TicketTable/TicketTable';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await DashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="grid-4 mb-3">
          <LoadingSkeleton type="card" count={4} />
        </div>
        <div className="grid-2">
          <div>
            <div className="card">
              <div className="card-title">RECENT_TICKETS</div>
              <div className="table-container">
                <table className="table">
                  <LoadingSkeleton type="table" count={4} />
                </table>
              </div>
            </div>
          </div>
          <div>
            <div className="card">
              <div className="card-title">SYSTEM_ACTIVITY</div>
              <LoadingSkeleton type="text" count={6} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* 4 Stat Cards */}
      <div className="grid-4 mb-3">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">TOTAL_TICKETS</span>
            <Layers size={18} />
          </div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card open-border">
          <div className="stat-card-header">
            <span className="stat-label">OPEN_TICKETS</span>
            <Inbox size={18} />
          </div>
          <div className="stat-value">{stats.open}</div>
        </div>

        <div className="stat-card progress-border">
          <div className="stat-card-header">
            <span className="stat-label">IN_PROGRESS</span>
            <Clock size={18} />
          </div>
          <div className="stat-value">{stats.inProgress}</div>
        </div>

        <div className="stat-card closed-border">
          <div className="stat-card-header">
            <span className="stat-label">CLOSED_TICKETS</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="stat-value">{stats.closed}</div>
        </div>
      </div>

      {/* Main Section */}
      <div className="dashboard-grid">
        {/* Left Side: Recent Tickets */}
        <div className="dashboard-main-card card">
          <div className="card-title">
            <span>RECENT_TICKETS</span>
            <Link to="/tickets" className="btn btn-secondary btn-sm link-btn">
              VIEW_ALL <ArrowRight size={14} />
            </Link>
          </div>
          <TicketTable tickets={stats.recentTickets} loading={false} />
        </div>

        {/* Right Side: Recent Activity Timeline */}
        <div className="dashboard-activity-card card">
          <div className="card-title">
            <span>SYSTEM_ACTIVITY</span>
            <Activity size={18} />
          </div>
          <div className="activity-timeline">
            {stats.recentActivity.length === 0 ? (
              <div className="empty-timeline">NO_RECENT_ACTIVITY</div>
            ) : (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <span className="timeline-user">{activity.user}</span>
                      <span className="timeline-time">{formatDate(activity.timestamp)}</span>
                    </div>
                    <p className="timeline-action">{activity.action}</p>
                    <Link to={`/tickets/${activity.ticketId}`} className="timeline-ticket-ref">
                      REF: {activity.ticketId} — {activity.ticketTitle.substring(0, 30)}
                      {activity.ticketTitle.length > 30 ? '...' : ''}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
