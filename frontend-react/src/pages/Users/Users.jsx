import React, { useState, useEffect } from 'react';
import { UserService } from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { UserPlus, UserMinus, Edit2, ShieldAlert } from 'lucide-react';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Form states
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [status, setStatus] = useState('ACTIVE');
  const [submitting, setSubmitting] = useState(false);

  // Selected ID for deletion
  const [deleteUserId, setDeleteUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'FAILED_TO_LOAD_USERS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setSelectedUser(null);
    setName('');
    setEmail('');
    setRole('CUSTOMER');
    setStatus('ACTIVE');
    setError('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (userItem) => {
    setSelectedUser(userItem);
    setName(userItem.name);
    setEmail(userItem.email);
    setRole(userItem.role);
    setStatus(userItem.status);
    setError('');
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (selectedUser) {
        // Edit User
        const updated = await UserService.updateUser(selectedUser.id, {
          name,
          email,
          role,
          status
        });
        setUsers(users.map(u => u.id === selectedUser.id ? updated : u));
      } else {
        // Add User
        const created = await UserService.addUser({
          name,
          email,
          role,
          status
        });
        setUsers([...users, created]);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      setError(err.message || 'OPERATION_FAILED');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);
    if (!deleteUserId) return;

    try {
      await UserService.deleteUser(deleteUserId);
      setUsers(users.filter(u => u.id !== deleteUserId));
    } catch (err) {
      setError(err.message || 'DELETION_FAILED');
    } finally {
      setDeleteUserId(null);
    }
  };

  return (
    <div className="users-page-container">
      {/* Upper Control Bar */}
      <div className="users-header-card card mb-2">
        <div className="users-header-main">
          <div>
            <h2 className="users-page-title">USER_MANAGEMENT</h2>
            <p className="users-page-subtitle">PROVISION_ROLES_AND_MANAGE_TENANT_ACCOUNTS</p>
          </div>
          <button className="btn btn-primary add-user-header-btn" onClick={openAddModal}>
            <UserPlus size={16} /> ADD_NEW_USER
          </button>
        </div>
      </div>

      {error && (
        <div className="users-error-banner mb-2">
          <strong>ERROR:</strong> {error}
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <LoadingSkeleton type="table" count={5} />
            </table>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>USER_ID</th>
                <th style={{ width: '25%' }}>FULL_NAME</th>
                <th style={{ width: '25%' }}>EMAIL_ADDRESS</th>
                <th style={{ width: '15%' }}>ROLE</th>
                <th style={{ width: '10%' }}>STATUS</th>
                <th style={{ width: '10%' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.id}>
                  <td className="font-bold">{userItem.id}</td>
                  <td>{userItem.name}</td>
                  <td>{userItem.email}</td>
                  <td>
                    <span className={`user-role-badge-inline ${userItem.role.toLowerCase()}`}>
                      {userItem.role}
                    </span>
                  </td>
                  <td>
                    <span className={`user-status-pill ${userItem.status.toLowerCase()}`}>
                      {userItem.status}
                    </span>
                  </td>
                  <td>
                    <div className="user-action-buttons">
                      <button 
                        className="btn btn-secondary btn-sm edit-icon-btn" 
                        onClick={() => openEditModal(userItem)}
                        title="Edit User"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm delete-icon-btn" 
                        onClick={() => handleDeleteClick(userItem.id)}
                        title="Delete User"
                      >
                        <UserMinus size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Dialog Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={selectedUser ? "EDIT_USER_PROPERTIES" : "PROVISION_NEW_USER"}
      >
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label className="form-label">FULL_NAME</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">EMAIL_ADDRESS</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              required
              disabled={submitting}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">SECURITY_ROLE</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={submitting}
              >
                <option value="CUSTOMER">CUSTOMER (DEFAULT)</option>
                <option value="AGENT">AGENT (SUPPORT STAFF)</option>
                <option value="ADMIN">ADMIN (FULL ACCESS)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ACCOUNT_STATUS</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={submitting}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="form-actions mt-2">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'PROCESSING...' : selectedUser ? 'SAVE_CHANGES' : 'PROVISION_USER'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsFormModalOpen(false)} disabled={submitting}>
              CANCEL
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="CONFIRM_USER_DELETION"
        message="Are you absolutely sure you want to delete this user account? The user will lose access to the system immediately. This action is irreversible."
      />
    </div>
  );
};

export default Users;
