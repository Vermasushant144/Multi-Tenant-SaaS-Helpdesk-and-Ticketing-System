import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketService } from '../../services/TicketService';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, ArrowLeft, CheckSquare, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CreateTicket.css';

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('TECHNICAL');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successTicket, setSuccessTicket] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessTicket(null);

    if (!title.trim() || !description.trim()) {
      setError('TITLE_AND_DESCRIPTION_REQUIRED');
      return;
    }

    setLoading(true);
    try {
      const ticket = await TicketService.createTicket({
        title,
        description,
        priority,
        category
      }, user);
      
      setSuccessTicket(ticket);
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('TECHNICAL');
    } catch (err) {
      setError(err.message || 'FAILED_TO_CREATE_TICKET');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessTicket(null);
  };

  return (
    <div className="create-ticket-container">
      {/* Top Breadcrumb Header */}
      <div className="mb-2">
        <Link to="/tickets" className="btn btn-secondary btn-sm back-link-btn">
          <ArrowLeft size={14} /> BACK_TO_TICKETS
        </Link>
      </div>

      {successTicket && (
        <div className="ticket-success-card card mb-3">
          <div className="success-icon-banner">
            <CheckSquare size={36} />
            <div>
              <h3 className="success-title">TICKET_CREATED_SUCCESSFULLY</h3>
              <p className="success-subtitle">YOUR_TICKET_ID_IS: <strong>{successTicket.id}</strong></p>
            </div>
          </div>
          <div className="success-actions">
            <Link to={`/tickets/${successTicket.id}`} className="btn btn-primary">
              VIEW_TICKET_DETAILS
            </Link>
            <button className="btn btn-secondary" onClick={handleReset}>
              <RefreshCw size={14} /> CREATE_ANOTHER_TICKET
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="ticket-error-banner mb-3">
          <strong>ERROR:</strong> {error}
        </div>
      )}

      <div className="card">
        <div className="card-title">
          <span>NEW_SUPPORT_TICKET</span>
          <PlusCircle size={18} />
        </div>

        <form onSubmit={handleSubmit} className="create-ticket-form">
          <div className="form-group">
            <label className="form-label">TICKET_TITLE</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Server down / Unable to login / Payment failing"
              required
              disabled={loading}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">TICKET_PRIORITY</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={loading}
              >
                <option value="LOW">LOW (GENERIC INQUIRY)</option>
                <option value="MEDIUM">MEDIUM (DEFAULT)</option>
                <option value="HIGH">HIGH (CRITICAL ERROR)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ISSUE_CATEGORY</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                <option value="TECHNICAL">TECHNICAL ISSUE</option>
                <option value="BILLING">BILLING & INVOICES</option>
                <option value="SALES">SALES / UPGRADE</option>
                <option value="ACCOUNT">ACCOUNT SECURITY / ACCESS</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">DETAILED_DESCRIPTION</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in details. Include any error codes, user IDs, or reproduction steps..."
              rows="8"
              required
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary submit-ticket-btn" disabled={loading}>
              {loading ? 'SUBMITTING_TICKET...' : 'SUBMIT_TICKET'}
            </button>
            <Link to="/tickets" className="btn btn-secondary">
              CANCEL
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
