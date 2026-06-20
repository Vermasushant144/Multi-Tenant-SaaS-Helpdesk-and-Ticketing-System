import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TicketService } from '../../services/TicketService';
import { UserService } from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import CommentSection from '../../components/CommentSection/CommentSection';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  AlertTriangle,
  Clock,
  UserCheck,
  CheckCircle,
  Inbox
} from 'lucide-react';
import './TicketDetails.css';

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [submittingAssignee, setSubmittingAssignee] = useState(false);
  const [error, setError] = useState('');

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const ticketData = await TicketService.getTicketById(id);
      setTicket(ticketData);

      // If user is admin/agent, load all agents for assignment
      if (user.role === 'ADMIN' || user.role === 'AGENT') {
        const agentsList = await UserService.getAgents();
        setAgents(agentsList);
      }
    } catch (err) {
      setError(err.message || 'FAILED_TO_LOAD_TICKET_DETAILS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id, user]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus) return;

    setSubmittingStatus(true);
    try {
      const updated = await TicketService.updateTicketStatus(ticket.id, newStatus, user);
      setTicket(updated);
    } catch (err) {
      setError(err.message || 'FAILED_TO_UPDATE_STATUS');
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleAssignChange = async (e) => {
    const agentId = e.target.value;
    
    setSubmittingAssignee(true);
    try {
      const updated = await TicketService.assignTicket(ticket.id, agentId, user);
      setTicket(updated);
    } catch (err) {
      setError(err.message || 'FAILED_TO_ASSIGN_TICKET');
    } finally {
      setSubmittingAssignee(false);
    }
  };

  const handleAddComment = async (text) => {
    try {
      const updated = await TicketService.addComment(ticket.id, text, user);
      setTicket(updated);
    } catch (err) {
      setError(err.message || 'FAILED_TO_POST_COMMENT');
      throw err;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getPriorityClass = (priority) => {
    if (priority === 'HIGH') return 'priority-badge high';
    if (priority === 'MEDIUM') return 'priority-badge medium';
    return 'priority-badge low';
  };

  if (loading) {
    return (
      <div className="ticket-details-loading">
        <div className="mb-2">
          <LoadingSkeleton type="text" count={1} />
        </div>
        <div className="grid-2">
          <LoadingSkeleton type="card" count={2} />
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="ticket-details-error card">
        <h3 className="text-error">ERROR_RETRIEVING_TICKET</h3>
        <p className="mt-1">{error}</p>
        <Link to="/tickets" className="btn btn-secondary mt-2">
          <ArrowLeft size={14} /> BACK_TO_TICKETS
        </Link>
      </div>
    );
  }

  // Check if current user has permission to change assignee/status
  const isSupportTeam = user.role === 'ADMIN' || user.role === 'AGENT';

  return (
    <div className="ticket-details-container">
      {/* Back Button */}
      <div className="mb-2">
        <Link to="/tickets" className="btn btn-secondary btn-sm back-link-btn">
          <ArrowLeft size={14} /> BACK_TO_LIST
        </Link>
      </div>

      {error && (
        <div className="ticket-error-banner mb-2">
          <strong>ERROR:</strong> {error}
        </div>
      )}

      {/* Title Card */}
      <div className="ticket-details-header-card card mb-2">
        <div className="ticket-id-tag">TICKET_ID: {ticket.id}</div>
        <h2 className="ticket-details-title">{ticket.title}</h2>
        <div className="ticket-details-sub-meta">
          <div className="meta-sub-item">
            <User size={12} />
            <span>CREATOR: {ticket.creator} ({ticket.company})</span>
          </div>
          <div className="meta-sub-item">
            <Calendar size={12} />
            <span>CREATED: {formatDate(ticket.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="ticket-details-grid mb-2">
        {/* Left Side: Ticket Description & Info */}
        <div className="ticket-details-info card">
          <div className="card-title">
            <span>TICKET_INFORMATION</span>
            <Inbox size={18} />
          </div>

          <div className="ticket-attributes-grid mb-3">
            <div className="attribute-box">
              <span className="attribute-label">STATUS</span>
              <div className="mt-1">
                <StatusBadge status={ticket.status} />
              </div>
            </div>

            <div className="attribute-box">
              <span className="attribute-label">PRIORITY</span>
              <div className="mt-1">
                <span className={getPriorityClass(ticket.priority)}>
                  {ticket.priority}
                </span>
              </div>
            </div>

            <div className="attribute-box">
              <span className="attribute-label">CATEGORY</span>
              <div className="attribute-val">
                <Tag size={12} /> {ticket.category}
              </div>
            </div>

            <div className="attribute-box">
              <span className="attribute-label">CURRENT_ASSIGNEE</span>
              <div className="attribute-val">
                <UserCheck size={12} /> {ticket.assigneeName}
              </div>
            </div>
          </div>

          <div className="description-container">
            <h4 className="description-title">DETAILED_DESCRIPTION</h4>
            <p className="description-text">{ticket.description}</p>
          </div>
        </div>

        {/* Right Side: Status Updates & Timeline */}
        <div className="ticket-details-actions card">
          <div className="card-title">
            <span>CONTROL_PANEL</span>
            <Clock size={18} />
          </div>

          {isSupportTeam ? (
            <div className="control-selectors mb-3">
              <div className="form-group">
                <label className="form-label"><CheckCircle size={12} /> SET_STATUS</label>
                <select 
                  className="form-select" 
                  value={ticket.status} 
                  onChange={handleStatusChange}
                  disabled={submittingStatus}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label"><User size={12} /> ASSIGN_AGENT</label>
                <select 
                  className="form-select" 
                  value={ticket.assigneeId || ''} 
                  onChange={handleAssignChange}
                  disabled={submittingAssignee}
                >
                  <option value="">UNASSIGNED</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="client-controls mb-3">
              <p className="client-notice">
                <AlertTriangle size={14} /> Only support agents or administrators can modify ticket status and assignees.
              </p>
              {ticket.status !== 'CLOSED' && (
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleStatusChange({ target: { value: 'CLOSED' } })}
                  disabled={submittingStatus}
                >
                  CLOSE_THIS_TICKET
                </button>
              )}
            </div>
          )}

          <div className="ticket-history-timeline">
            <h4 className="timeline-title">ACTIVITY_TIMELINE</h4>
            <div className="details-timeline">
              {ticket.history.map((h) => (
                <div key={h.id} className="details-timeline-item">
                  <div className="details-timeline-marker"></div>
                  <div className="details-timeline-content">
                    <span className="details-timeline-time">{formatDate(h.timestamp)}</span>
                    <span className="details-timeline-user">[{h.user}]</span>
                    <p className="details-timeline-desc">{h.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Comments */}
      <CommentSection comments={ticket.comments} onAddComment={handleAddComment} />
    </div>
  );
};

export default TicketDetails;
