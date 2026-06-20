import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Key, Mail } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('ALL_FIELDS_REQUIRED');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
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
            <strong>ERROR:</strong> {error}
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
