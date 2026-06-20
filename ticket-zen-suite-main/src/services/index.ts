import { MOCK_TICKETS, MOCK_USERS, MOCK_NOTIFICATIONS, type Ticket, type User, type NotificationItem } from "@/lib/mock-data";

// In-memory mutable stores (simulates an API).
let tickets: Ticket[] = [...MOCK_TICKETS];
let users: User[] = [...MOCK_USERS];
let notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];

const delay = <T,>(v: T, ms = 200) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const TicketService = {
  list: () => delay([...tickets]),
  get: (id: string) => delay(tickets.find((t) => t.id === id) ?? null),
  create: (input: Pick<Ticket, "title" | "description" | "priority" | "category">) => {
    const id = `TCK-${1000 + tickets.length + 1}`;
    const t: Ticket = {
      id,
      title: input.title,
      description: input.description,
      priority: input.priority,
      category: input.category,
      status: "OPEN",
      assignee: null,
      requester: "You",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      activity: [{ id: `a-${id}`, type: "CREATED", message: "Ticket created", at: new Date().toISOString() }],
    };
    tickets = [t, ...tickets];
    return delay(t);
  },
  update: (id: string, patch: Partial<Ticket>) => {
    tickets = tickets.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t));
    return delay(tickets.find((t) => t.id === id)!);
  },
  comment: (id: string, body: string, author = "You") => {
    const c = { id: `c-${Date.now()}`, author, body, at: new Date().toISOString() };
    tickets = tickets.map((t) => (t.id === id ? { ...t, comments: [...t.comments, c] } : t));
    return delay(c);
  },
};

export const UserService = {
  list: () => delay([...users]),
  create: (u: Omit<User, "id">) => {
    const nu: User = { ...u, id: `u${users.length + 1}` };
    users = [nu, ...users];
    return delay(nu);
  },
  update: (id: string, patch: Partial<User>) => {
    users = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    return delay(users.find((u) => u.id === id)!);
  },
  remove: (id: string) => {
    users = users.filter((u) => u.id !== id);
    return delay(true);
  },
};

export const NotificationService = {
  list: () => delay([...notifications]),
  markAllRead: () => {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return delay(true);
  },
};

export const DashboardService = {
  stats: async () => {
    const list = await TicketService.list();
    return {
      total: list.length,
      open: list.filter((t) => t.status === "OPEN").length,
      inProgress: list.filter((t) => t.status === "IN_PROGRESS").length,
      closed: list.filter((t) => t.status === "CLOSED").length,
      recent: list.slice(0, 6),
    };
  },
};

export const AuthService = {
  login: (email: string, _password: string) =>
    delay({ id: "me", name: "Alex Carter", email, role: "ADMIN" as const, company: "Acme Inc." }),
  register: (input: { company: string; name: string; email: string; password: string }) =>
    delay({ id: "me", name: input.name, email: input.email, role: "ADMIN" as const, company: input.company }),
};
