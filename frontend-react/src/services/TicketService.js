import { getTickets as getMockTickets, setTickets, getUsers } from './mockData';

export const TicketService = {
  // Get all tickets with pagination, filters and search
  getTickets: async ({ search = '', status = '', priority = '', page = 1, limit = 5 } = {}) => {
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
  },

  getTicketById: async (id) => {
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
  },

  createTicket: async (ticketData, currentUser) => {
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
              action: `Ticket Created by ${currentUser.name}`,
              user: currentUser.name,
              timestamp: new Date().toISOString()
            }
          ]
        };

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

        resolve(newTicket);
      }, 500);
    });
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
