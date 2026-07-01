import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Mail, Key, Briefcase, User } from 'lucide-react';
import './Register.css';

const Register = () => {
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!companyName || !fullName || !email || !password) {
      setError('ALL_FIELDS_REQUIRED');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('INVALID_EMAIL_FORMAT');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setError('PASSWORD_TOO_SHORT');
      return;
    }

    setLoading(true);
    try {
      await register(companyName, fullName, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'REGISTRATION_FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-root">
      <div className="register-card">
        <div className="register-card-header">
          <span className="system-indicator">🎫 SYS_REG_v1.0</span>
          <h1 className="register-title">CREATE_ACCOUNT</h1>
          <p className="register-subtitle">INITIALIZE_YOUR_TENANT_ORGANIZATION</p>
        </div>

        {error && (
          <div className="register-error-banner">
            <strong>ERROR:</strong> {error === 'ALL_FIELDS_REQUIRED' ? 'All fields are required'
                                  : error === 'INVALID_EMAIL_FORMAT' ? 'Please enter a valid email address'
                                  : error === 'PASSWORD_TOO_SHORT' ? 'Password must be at least 6 characters long'
                                  : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">
              <Briefcase size={14} /> COMPANY_NAME
            </label>
            <input
              type="text"
              className="form-input"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <User size={14} /> FULL_NAME
            </label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={14} /> EMAIL_ADDRESS
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@acme.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Key size={14} /> ACCOUNT_PASSWORD
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary register-submit-btn" disabled={loading}>
            <UserPlus size={18} /> {loading ? 'PROVISIONING...' : 'CREATE_ACCOUNT'}
          </button>
        </form>

        <div className="register-footer">
          <span>ALREADY_HAVE_AN_ACCOUNT?</span>
          <Link to="/login" className="login-link">
            SIGN_IN_INSTEAD
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
