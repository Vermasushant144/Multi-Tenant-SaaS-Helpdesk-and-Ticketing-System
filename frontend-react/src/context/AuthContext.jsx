import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers, setUsers, initStore } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStore();
    const storedUser = localStorage.getItem('bd_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (found) {
          if (found.status === 'INACTIVE') {
            reject(new Error('This account has been deactivated.'));
            return;
          }
          const userPayload = { ...found };
          delete userPayload.password;
          setUser(userPayload);
          localStorage.setItem('bd_current_user', JSON.stringify(userPayload));
          resolve(userPayload);
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 500);
    });
  };

  const register = async (companyName, fullName, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (exists) {
          reject(new Error('Email is already registered.'));
          return;
        }

        const newUser = {
          id: `U-${users.length + 1}`,
          name: fullName,
          email: email,
          password: password,
          role: 'ADMIN', // default registered user is admin of their tenant
          company: companyName,
          status: 'ACTIVE'
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);

        // Auto login
        const userPayload = { ...newUser };
        delete userPayload.password;
        setUser(userPayload);
        localStorage.setItem('bd_current_user', JSON.stringify(userPayload));
        resolve(userPayload);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bd_current_user');
  };

  const updateProfile = async (name, email, company, telegramUsername) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          reject(new Error('Not authenticated'));
          return;
        }
        const users = getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
          users[idx].name = name;
          users[idx].email = email;
          users[idx].company = company;
          users[idx].telegramUsername = telegramUsername;
          setUsers(users);

          const updatedUser = { ...user, name, email, company, telegramUsername };
          setUser(updatedUser);
          localStorage.setItem('bd_current_user', JSON.stringify(updatedUser));
          resolve(updatedUser);
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  };

  const changePassword = async (oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          reject(new Error('Not authenticated'));
          return;
        }
        const users = getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
          if (users[idx].password !== oldPassword) {
            reject(new Error('Incorrect current password'));
            return;
          }
          users[idx].password = newPassword;
          setUsers(users);
          resolve();
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
