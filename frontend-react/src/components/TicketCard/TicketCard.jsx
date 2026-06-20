import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge';
import { Calendar, User } from 'lucide-react';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
  const getPriorityClass = (priority) => {
    if (priority === 'HIGH') return 'priority-high';
    if (priority === 'MEDIUM') return 'priority-medium';
    return 'priority-low';
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <span className="ticket-card-id">{ticket.id}</span>
        <span className={`ticket-card-priority ${getPriorityClass(ticket.priority)}`}>
          {ticket.priority}
        </span>
      </div>
      
      <h3 className="ticket-card-title">{ticket.title}</h3>
      <p className="ticket-card-desc">{ticket.description}</p>
      
      <div className="ticket-card-meta">
        <div className="meta-item">
          <User size={14} />
          <span>{ticket.assigneeName}</span>
        </div>
        <div className="meta-item">
          <Calendar size={14} />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
      </div>
      
      <div className="ticket-card-footer">
        <StatusBadge status={ticket.status} />
        <Link to={`/tickets/${ticket.id}`} className="btn btn-secondary btn-sm">
          VIEW_DETAILS
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;
