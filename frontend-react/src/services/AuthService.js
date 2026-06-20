// Standard Auth endpoints mock mapping
import { getUsers } from './mockData';

export const AuthService = {
  login: async (email, password) => {
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
          resolve(userPayload);
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 400);
    });
  },

  register: async (companyName, fullName, email, password) => {
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
          role: 'ADMIN',
          company: companyName,
          status: 'ACTIVE'
        };
        
        resolve(newUser);
      }, 400);
    });
  }
};
