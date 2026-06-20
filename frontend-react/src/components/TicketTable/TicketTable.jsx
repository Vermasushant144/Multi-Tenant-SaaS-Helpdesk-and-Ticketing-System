import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge';
import { Calendar, User, Eye } from 'lucide-react';
import './TicketTable.css';

const TicketTable = ({ tickets, loading }) => {
  const getPriorityClass = (priority) => {
    if (priority === 'HIGH') return 'priority-badge high';
    if (priority === 'MEDIUM') return 'priority-badge medium';
    return 'priority-badge low';
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>TICKET_ID</th>
            <th style={{ width: '35%' }}>TITLE</th>
            <th style={{ width: '15%' }}>PRIORITY</th>
            <th style={{ width: '15%' }}>STATUS</th>
            <th style={{ width: '15%' }}>ASSIGNEE</th>
            <th style={{ width: '10%' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '30px', fontWeight: 'bold' }}>
                LOADING_TICKET_DATA...
              </td>
            </tr>
          ) : tickets.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '30px', fontWeight: 'bold' }}>
                NO_TICKETS_FOUND
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="font-bold">{ticket.id}</td>
                <td>
                  <div className="ticket-title-cell">
                    <span className="ticket-title-text">{ticket.title}</span>
                    <span className="ticket-company-text">{ticket.company}</span>
                  </div>
                </td>
                <td>
                  <span className={getPriorityClass(ticket.priority)}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <StatusBadge status={ticket.status} />
                </td>
                <td>
                  <div className="table-assignee">
                    <User size={12} />
                    <span>{ticket.assigneeName}</span>
                  </div>
                </td>
                <td>
                  <Link to={`/tickets/${ticket.id}`} className="btn btn-secondary btn-sm table-action-btn">
                    <Eye size={12} /> VIEW
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
