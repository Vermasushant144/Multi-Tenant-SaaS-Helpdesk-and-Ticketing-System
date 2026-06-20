import { getUsers as getMockUsers, setUsers } from './mockData';

export const UserService = {
  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockUsers());
      }, 300);
    });
  },

  getAgents: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getMockUsers();
        const agents = users.filter(u => u.role === 'AGENT' || u.role === 'ADMIN');
        resolve(agents);
      }, 200);
    });
  },

  addUser: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getMockUsers();
        const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
        
        if (exists) {
          reject(new Error('User email already exists'));
          return;
        }

        const newUser = {
          id: `U-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'CUSTOMER',
          company: userData.company || 'Unknown',
          status: userData.status || 'ACTIVE',
          password: 'password123' // default password
        };

        const updated = [...users, newUser];
        setUsers(updated);
        resolve(newUser);
      }, 400);
    });
  },

  updateUser: async (userId, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getMockUsers();
        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
          const updatedUser = { ...users[idx], ...userData };
          users[idx] = updatedUser;
          setUsers(users);
          resolve(updatedUser);
        } else {
          reject(new Error('User not found'));
        }
      }, 400);
    });
  },

  deleteUser: async (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getMockUsers();
        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
          // Instead of hard deleting, we can either delete or set status to INACTIVE. Let's filter it out.
          const updated = users.filter(u => u.id !== userId);
          setUsers(updated);
          resolve({ success: true });
        } else {
          reject(new Error('User not found'));
        }
      }, 350);
    });
  }
};
