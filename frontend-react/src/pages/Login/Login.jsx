import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Key, Mail } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !role) {
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
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'AUTHENTICATION_FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-card-header">
          <span className="system-indicator">🎫 SYS_AUTH_v1.0</span>
          <h1 className="login-title">BRUTAL_TICKET</h1>
          <p className="login-subtitle">MULTI_TENANT_SAAS_HELPDESK</p>
        </div>

        {error && (
          <div className="login-error-banner">
            <strong>ERROR:</strong> {error === 'ALL_FIELDS_REQUIRED' ? 'All fields are required' 
                                  : error === 'INVALID_EMAIL_FORMAT' ? 'Please enter a valid email address' 
                                  : error === 'PASSWORD_TOO_SHORT' ? 'Password must be at least 6 characters long' 
                                  : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              <Mail size={14} /> EMAIL_ADDRESS
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Key size={14} /> PASSWORD
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

          <div className="form-group">
            <label className="form-label">
              LOGIN_AS_ROLE
            </label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '3px solid #000000',
                backgroundColor: '#ffffff',
                fontFamily: 'monospace',
                fontSize: '13px',
                fontWeight: 'bold',
                outline: 'none',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
            <LogIn size={18} /> {loading ? 'AUTHENTICATING...' : 'SIGN_IN'}
          </button>
        </form>

        <div className="login-footer">
          <span>NEW_TO_PLATFORM?</span>
          <Link to="/register" className="register-link">
            CREATE_AN_ACCOUNT
          </Link>
        </div>

        <div className="demo-credentials-box">
          <p className="demo-title">DEMO_CREDENTIALS:</p>
          <div className="demo-grid">
            <div>
              <strong>ADMIN:</strong> admin@acme.com<br />
              <strong>PASS:</strong> password123
            </div>
            <div>
              <strong>AGENT:</strong> john@acme.com<br />
              <strong>PASS:</strong> password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
