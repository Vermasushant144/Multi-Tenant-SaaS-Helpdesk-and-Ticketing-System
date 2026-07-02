import { getTickets as getMockTickets, setTickets, getUsers } from './mockData';
import api from './api';

export const TicketService = {
  // Get all tickets with pagination, filters and search
  getTickets: async ({ search = '', status = '', priority = '', page = 1, limit = 5 } = {}) => {
    try {
      const response = await api.get('/tickets');
      const backendTickets = response.data.map(t => ({
        id: `T-${t.id}`,
        title: t.title,
        description: t.description,
        priority: t.priority,
        category: 'TECHNICAL',
        status: t.status,
        creator: t.creatorName,
        creatorEmail: t.creatorEmail,
        company: 'Acme Corp',
        assigneeId: t.assigneeId ? `U-${t.assigneeId}` : '',
        assigneeName: t.assigneeName || 'Unassigned',
        createdAt: t.createdAt || new Date().toISOString(),
        comments: [],
        history: []
      }));

      const mockTickets = getMockTickets();
      // Filter out any mock tickets that duplicate the backend tickets
      const uniqueMockTickets = mockTickets.filter(mt => {
        return !backendTickets.some(bt => bt.id === mt.id);
      });

      let combinedTickets = [...backendTickets, ...uniqueMockTickets];

      // Search filter
      if (search) {
        const q = search.toLowerCase();
        combinedTickets = combinedTickets.filter(t => 
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.creator.toLowerCase().includes(q) ||
          t.assigneeName.toLowerCase().includes(q)
        );
      }

      // Status filter
      if (status) {
        combinedTickets = combinedTickets.filter(t => t.status === status);
      }

      // Priority filter
      if (priority) {
        combinedTickets = combinedTickets.filter(t => t.priority === priority);
      }

      // Sort by created descending
      combinedTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Pagination
      const total = combinedTickets.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const items = combinedTickets.slice(startIndex, endIndex);

      return {
        tickets: items,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.warn("Failed to load tickets from backend, falling back to mock:", error);
      return new Promise((resolve) => {
        setTimeout(() => {
          let tickets = getMockTickets();

          // Search filter
          if (search) {
            const q = search.toLowerCase();
            tickets = tickets.filter(t => 
              t.id.toLowerCase().includes(q) ||
              t.title.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q) ||
              t.creator.toLowerCase().includes(q) ||
              t.assigneeName.toLowerCase().includes(q)
            );
          }

          // Status filter
          if (status) {
            tickets = tickets.filter(t => t.status === status);
          }

          // Priority filter
          if (priority) {
            tickets = tickets.filter(t => t.priority === priority);
          }

          // Sort by created descending
          tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          // Pagination
          const total = tickets.length;
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const items = tickets.slice(startIndex, endIndex);

          resolve({
            tickets: items,
            total,
            page,
            pages: Math.ceil(total / limit)
          });
        }, 400);
      });
    }
  },

  getTicketById: async (id) => {
    try {
      const response = await api.get('/tickets');
      const found = response.data.find(t => `T-${t.id}` === id || String(t.id) === id);
      if (found) {
        return {
          id: `T-${found.id}`,
          title: found.title,
          description: found.description,
          priority: found.priority,
          category: 'TECHNICAL',
          status: found.status,
          creator: found.creatorName,
          creatorEmail: found.creatorEmail,
          company: 'Acme Corp',
          assigneeId: found.assigneeId ? `U-${found.assigneeId}` : '',
          assigneeName: found.assigneeName || 'Unassigned',
          createdAt: found.createdAt || new Date().toISOString(),
          comments: [],
          history: []
        };
      }
      throw new Error('Ticket not found on backend');
    } catch (error) {
      console.warn("Failed to get ticket by ID from backend, falling back to mock:", error);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const tickets = getMockTickets();
          const ticket = tickets.find(t => t.id === id);
          if (ticket) {
            resolve(ticket);
          } else {
            reject(new Error('Ticket not found'));
          }
        }, 300);
      });
    }
  },

  createTicket: async (ticketData, currentUser) => {
    try {
      const response = await api.post('/tickets', {
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority || 'MEDIUM',
        creatorEmail: currentUser.email,
        creatorName: currentUser.name
      });

      const createdTicket = response.data;
      const newId = `T-${createdTicket.id}`;

      const newTicket = {
        id: newId,
        title: createdTicket.title,
        description: createdTicket.description,
        priority: createdTicket.priority,
        category: ticketData.category || 'TECHNICAL',
        status: createdTicket.status,
        creator: createdTicket.creatorName,
        creatorEmail: createdTicket.creatorEmail,
        company: currentUser.company || 'Unknown Corp',
        assigneeId: createdTicket.assigneeId ? `U-${createdTicket.assigneeId}` : '',
        assigneeName: createdTicket.assigneeName || 'Unassigned',
        createdAt: createdTicket.createdAt || new Date().toISOString(),
        comments: [],
        history: [
          {
            id: `H-${Date.now()}`,
            action: `Ticket Created by ${currentUser.name}`,
            user: currentUser.name,
            timestamp: new Date().toISOString()
          }
        ]
      };

      // Also update local mock tickets array to keep frontend fully synchronized
      const tickets = getMockTickets();
      const updated = [newTicket, ...tickets];
      setTickets(updated);

      // Add System Notification
      const notifications = JSON.parse(localStorage.getItem('bd_notifications') || '[]');
      notifications.unshift({
        id: `N-${Date.now()}`,
        title: 'New Ticket Created',
        message: `New ticket ${newId} created: "${ticketData.title}"`,
        type: 'TICKET',
        createdAt: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('bd_notifications', JSON.stringify(notifications));

      return newTicket;
    } catch (error) {
      console.warn("Failed to create ticket on backend, falling back to mock creation:", error);
      // Fallback mock creation so the app remains interactive offline / without backend running
      return new Promise((resolve) => {
        setTimeout(() => {
          const tickets = getMockTickets();
          const newId = `T-${1000 + tickets.length + 1}`;
          const newTicket = {
            id: newId,
            title: ticketData.title,
            description: ticketData.description,
            priority: ticketData.priority || 'MEDIUM',
            category: ticketData.category || 'TECHNICAL',
            status: 'OPEN',
            creator: currentUser.name,
            creatorEmail: currentUser.email,
            company: currentUser.company || 'Unknown Corp',
            assigneeId: '',
            assigneeName: 'Unassigned',
            createdAt: new Date().toISOString(),
            comments: [],
            history: [
              {
                id: `H-${Date.now()}`,
                action: `Ticket Created (Offline Mode) by ${currentUser.name}`,
                user: currentUser.name,
                timestamp: new Date().toISOString()
              }
            ]
          };

          const updated = [newTicket, ...tickets];
          setTickets(updated);

          const notifications = JSON.parse(localStorage.getItem('bd_notifications') || '[]');
          notifications.unshift({
            id: `N-${Date.now()}`,
            title: 'New Ticket Created (Offline)',
            message: `New ticket ${newId} created: "${ticketData.title}"`,
            type: 'TICKET',
            createdAt: new Date().toISOString(),
            read: false
          });
          localStorage.setItem('bd_notifications', JSON.stringify(notifications));

          resolve(newTicket);
        }, 500);
      });
    }
  },

  updateTicketStatus: async (ticketId, status, user) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tickets = getMockTickets();
        const idx = tickets.findIndex(t => t.id === ticketId);
        if (idx !== -1) {
          const ticket = tickets[idx];
          const oldStatus = ticket.status;
          ticket.status = status;
          ticket.history.push({
            id: `H-${Date.now()}`,
            action: `Status changed from ${oldStatus} to ${status}`,
            user: user.name,
            timestamp: new Date().toISOString()
          });

          tickets[idx] = ticket;
          setTickets(tickets);
          resolve(ticket);
        } else {
          reject(new Error('Ticket not found'));
        }
      }, 400);
    });
  },

  assignTicket: async (ticketId, agentId, user) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tickets = getMockTickets();
        const idx = tickets.findIndex(t => t.id === ticketId);
        if (idx !== -1) {
          const ticket = tickets[idx];
          let agentName = 'Unassigned';
          if (agentId) {
            const users = getUsers();
            const agent = users.find(u => u.id === agentId);
            if (agent) {
              agentName = agent.name;
            }
          }

          const oldAssignee = ticket.assigneeName;
          ticket.assigneeId = agentId;
          ticket.assigneeName = agentName;
          ticket.history.push({
            id: `H-${Date.now()}`,
            action: `Assigned changed from ${oldAssignee} to ${agentName}`,
            user: user.name,
            timestamp: new Date().toISOString()
          });

          tickets[idx] = ticket;
          setTickets(tickets);

          // Trigger notification
          if (agentId) {
            const notifications = JSON.parse(localStorage.getItem('bd_notifications') || '[]');
            notifications.unshift({
              id: `N-${Date.now()}`,
              title: 'Ticket Assigned',
              message: `Ticket ${ticketId} has been assigned to you.`,
              type: 'TICKET',
              createdAt: new Date().toISOString(),
              read: false
            });
            localStorage.setItem('bd_notifications', JSON.stringify(notifications));
          }

          resolve(ticket);
        } else {
          reject(new Error('Ticket not found'));
        }
      }, 400);
    });
  },

  addComment: async (ticketId, commentText, user) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tickets = getMockTickets();
        const idx = tickets.findIndex(t => t.id === ticketId);
        if (idx !== -1) {
          const ticket = tickets[idx];
          const newComment = {
            id: `C-${Date.now()}`,
            author: user.name,
            role: user.role,
            text: commentText,
            createdAt: new Date().toISOString()
          };

          ticket.comments.push(newComment);
          ticket.history.push({
            id: `H-${Date.now()}`,
            action: `Added comment: "${commentText.substring(0, 30)}${commentText.length > 30 ? '...' : ''}"`,
            user: user.name,
            timestamp: new Date().toISOString()
          });

          tickets[idx] = ticket;
          setTickets(tickets);
          resolve(ticket);
        } else {
          reject(new Error('Ticket not found'));
        }
      }, 300);
    });
  }
};
