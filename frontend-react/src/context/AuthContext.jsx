import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// axios instance — uses env var in production, Vite proxy in dev
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start — read saved user from localStorage (so refresh doesn't log you out)
  useEffect(() => {
    const storedUser = localStorage.getItem('bd_current_user');
    const storedToken = localStorage.getItem('bd_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ─── LOGIN ──────────────────────────────────────────────────────
  // Calls POST /api/auth/login → gets token + user info back from backend
  const login = async (email, password, role) => {
    let response;
    try {
      response = await api.post('/auth/login', { email, password, role });
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Authentication failed';
      throw new Error(message);
    }
    const data = response.data;

    // Save JWT token separately (used in future API calls)
    localStorage.setItem('bd_token', data.token);

    // Save user info (shown in sidebar, header, etc.)
    const userPayload = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      tenantId: data.tenantId,
      company: data.company
    };
    localStorage.setItem('bd_current_user', JSON.stringify(userPayload));
    setUser(userPayload);

    return userPayload;
  };

  // ─── REGISTER ──────────────────────────────────────────────────
  // Calls POST /api/auth/register → creates company + admin user in DB
  const register = async (companyName, fullName, email, password) => {
    let response;
    try {
      response = await api.post('/auth/register', {
        companyName,
        fullName,
        email,
        password
      });
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Registration failed';
      throw new Error(message);
    }
    const data = response.data;

    localStorage.setItem('bd_token', data.token);

    const userPayload = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      tenantId: data.tenantId,
      company: data.company
    };
    localStorage.setItem('bd_current_user', JSON.stringify(userPayload));
    setUser(userPayload);

    return userPayload;
  };

  // ─── LOGOUT ────────────────────────────────────────────────────
  // Just clears localStorage — no backend call needed (JWT is stateless)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bd_token');
    localStorage.removeItem('bd_current_user');
  };

  // ─── UPDATE PROFILE (mock for now — backend endpoint to be added) ─
  const updateProfile = async (name, email, company) => {
    // TODO: Replace with real API call when backend endpoint is ready
    const updatedUser = { ...user, name, email, company };
    setUser(updatedUser);
    localStorage.setItem('bd_current_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  // ─── CHANGE PASSWORD (mock for now) ────────────────────────────
  const changePassword = async (oldPassword, newPassword) => {
    // TODO: Replace with real API call when backend endpoint is ready
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

