import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Tickets from './pages/Tickets/Tickets';
import CreateTicket from './pages/CreateTicket/CreateTicket';
import TicketDetails from './pages/TicketDetails/TicketDetails';
import Users from './pages/Users/Users';
import Notifications from './pages/Notifications/Notifications';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Main Layout Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/tickets/create" element={<CreateTicket />} />
              <Route path="/tickets/:id" element={<TicketDetails />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Admin Only Route */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              fontFamily: 'monospace',
              backgroundColor: '#f5f5f5',
              padding: '24px'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '4px solid #000000',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '8px 8px 0px 0px #000000',
                maxWidth: '480px'
              }}>
                <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>404</h1>
                <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', textTransform: 'uppercase' }}>
                  PAGE_NOT_FOUND
                </h2>
                <p style={{ color: '#666666', fontSize: '14px', marginBottom: '24px' }}>
                  The requested address does not exist or has been relocated within the directory structure.
                </p>
                <a href="/dashboard" style={{
                  display: 'inline-block',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: '4px solid #000000',
                  padding: '10px 20px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}>
                  RETURN_TO_DASHBOARD
                </a>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
