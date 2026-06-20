import { getTickets } from './mockData';

export const DashboardService = {
  getStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tickets = getTickets();
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'OPEN').length;
        const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
        const closed = tickets.filter(t => t.status === 'CLOSED').length;

        // Compile recent activity from ticket histories
        const allActivity = [];
        tickets.forEach(ticket => {
          if (ticket.history) {
            ticket.history.forEach(h => {
              allActivity.push({
                ...h,
                ticketId: ticket.id,
                ticketTitle: ticket.title
              });
            });
          }
        });

        // Sort by timestamp descending
        allActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentActivity = allActivity.slice(0, 10);

        // Get 5 most recent tickets
        const recentTickets = [...tickets]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        resolve({
          total,
          open,
          inProgress,
          closed,
          recentActivity,
          recentTickets
        });
      }, 300);
    });
  }
};
