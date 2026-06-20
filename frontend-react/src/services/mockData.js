// Helper for local storage persistence
const getStored = (key, defaultVal) => {
  const val = localStorage.getItem(key);
  if (val) {
    try {
      return JSON.parse(val);
    } catch (e) {
      return defaultVal;
    }
  }
  return defaultVal;
};

const setStored = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// Initial Users
const initialUsers = [
  { id: "U-1", name: "Sushant Verma", email: "admin@acme.com", password: "password123", role: "ADMIN", company: "Acme Corp", status: "ACTIVE" },
  { id: "U-2", name: "John Doe", email: "john@acme.com", password: "password123", role: "AGENT", company: "Acme Corp", status: "ACTIVE" },
  { id: "U-3", name: "Alice Smith", email: "alice@customer.com", password: "password123", role: "CUSTOMER", company: "Globex Inc", status: "ACTIVE" },
  { id: "U-4", name: "Bob Johnson", email: "bob@agent.com", password: "password123", role: "AGENT", company: "Acme Corp", status: "INACTIVE" }
];

// Initial Tickets
const initialTickets = [
  {
    id: "T-1001",
    title: "Database latency spiking during peak hours",
    description: "We are noticing a significant slowdown in loading dashboard items when traffic spikes at 2 PM. Connection pools seem saturated.",
    priority: "HIGH",
    category: "TECHNICAL",
    status: "IN_PROGRESS",
    creator: "Alice Smith",
    creatorEmail: "alice@customer.com",
    company: "Globex Inc",
    assigneeId: "U-2",
    assigneeName: "John Doe",
    createdAt: "2026-06-20T10:15:30Z",
    comments: [
      { id: "C-1", author: "John Doe", role: "AGENT", text: "Looking into connection pool configurations. Will update shortly.", createdAt: "2026-06-20T11:00:00Z" }
    ],
    history: [
      { id: "H-1", action: "Ticket Created", user: "Alice Smith", timestamp: "2026-06-20T10:15:30Z" },
      { id: "H-2", action: "Assigned to John Doe", user: "System", timestamp: "2026-06-20T10:16:00Z" },
      { id: "H-3", action: "Status changed to IN_PROGRESS", user: "John Doe", timestamp: "2026-06-20T11:00:00Z" }
    ]
  },
  {
    id: "T-1002",
    title: "Request for invoice modification - Q1 Billing",
    description: "Need to change corporate address on Invoice #ACME-2026-01 from Globex London address to Globex NY headquarters.",
    priority: "MEDIUM",
    category: "BILLING",
    status: "OPEN",
    creator: "Alice Smith",
    creatorEmail: "alice@customer.com",
    company: "Globex Inc",
    assigneeId: "",
    assigneeName: "Unassigned",
    createdAt: "2026-06-20T12:00:00Z",
    comments: [],
    history: [
      { id: "H-4", action: "Ticket Created", user: "Alice Smith", timestamp: "2026-06-20T12:00:00Z" }
    ]
  },
  {
    id: "T-1003",
    title: "SSO login failing with SAML error 404",
    description: "Several team members are locked out of their accounts. Getting a SAML authentication entity ID mismatch.",
    priority: "HIGH",
    category: "TECHNICAL",
    status: "OPEN",
    creator: "Charlie Brown",
    creatorEmail: "charlie@customer2.com",
    company: "Initech",
    assigneeId: "",
    assigneeName: "Unassigned",
    createdAt: "2026-06-20T13:45:00Z",
    comments: [],
    history: [
      { id: "H-5", action: "Ticket Created", user: "Charlie Brown", timestamp: "2026-06-20T13:45:00Z" }
    ]
  },
  {
    id: "T-1004",
    title: "Adding new agent license to account seat count",
    description: "We are expanding our support team and need to purchase 5 extra agent seat licenses for Acme Corp environment.",
    priority: "LOW",
    category: "SALES",
    status: "CLOSED",
    creator: "Sushant Verma",
    creatorEmail: "admin@acme.com",
    company: "Acme Corp",
    assigneeId: "U-1",
    assigneeName: "Sushant Verma",
    createdAt: "2026-06-19T09:00:00Z",
    comments: [
      { id: "C-2", author: "Sushant Verma", role: "ADMIN", text: "Added seats and processed payment details.", createdAt: "2026-06-19T14:00:00Z" }
    ],
    history: [
      { id: "H-6", action: "Ticket Created", user: "Sushant Verma", timestamp: "2026-06-19T09:00:00Z" },
      { id: "H-7", action: "Assigned to Sushant Verma", user: "System", timestamp: "2026-06-19T09:01:00Z" },
      { id: "H-8", action: "Status changed to CLOSED", user: "Sushant Verma", timestamp: "2026-06-19T14:00:00Z" }
    ]
  },
  {
    id: "T-1005",
    title: "Password reset token not sending for users",
    description: "Reports from some users that they are not getting the email reset links, checked spam folders.",
    priority: "MEDIUM",
    category: "ACCOUNT",
    status: "CLOSED",
    creator: "Alice Smith",
    creatorEmail: "alice@customer.com",
    company: "Globex Inc",
    assigneeId: "U-2",
    assigneeName: "John Doe",
    createdAt: "2026-06-18T16:20:00Z",
    comments: [
      { id: "C-3", author: "John Doe", role: "AGENT", text: "Email queue was stuck. Flushed queue and checked delivery logs - users should receive them now.", createdAt: "2026-06-18T18:00:00Z" },
      { id: "C-4", author: "Alice Smith", role: "CUSTOMER", text: "Confirmed that password reset emails are coming through now. Thanks!", createdAt: "2026-06-18T19:30:00Z" }
    ],
    history: [
      { id: "H-9", action: "Ticket Created", user: "Alice Smith", timestamp: "2026-06-18T16:20:00Z" },
      { id: "H-10", action: "Assigned to John Doe", user: "System", timestamp: "2026-06-18T16:25:00Z" },
      { id: "H-11", action: "Status changed to CLOSED", user: "John Doe", timestamp: "2026-06-18T19:30:00Z" }
    ]
  }
];

// Initial Notifications
const initialNotifications = [
  { id: "N-1", title: "New Ticket Assigned", message: "Ticket T-1001 assigned to John Doe.", type: "TICKET", createdAt: "2026-06-20T11:01:00Z", read: false },
  { id: "N-2", title: "System Alert", message: "Weekly database maintenance completed successfully.", type: "SYSTEM", createdAt: "2026-06-20T04:00:00Z", read: true },
  { id: "N-3", title: "New User Registered", message: "Alice Smith registered from Globex Inc.", type: "USER", createdAt: "2026-06-20T10:00:00Z", read: false }
];

// Initial Settings
const initialSettings = {
  companyName: "Acme Helpdesk Services",
  timezone: "UTC+05:30",
  defaultPriority: "MEDIUM",
  emailNotifications: true,
  telegramNotifications: false,
  telegramToken: "",
  telegramChatId: "",
  theme: "brutal"
};

// Initialize Store
export const initStore = () => {
  if (!localStorage.getItem("bd_users")) setStored("bd_users", initialUsers);
  if (!localStorage.getItem("bd_tickets")) setStored("bd_tickets", initialTickets);
  if (!localStorage.getItem("bd_notifications")) setStored("bd_notifications", initialNotifications);
  if (!localStorage.getItem("bd_settings")) setStored("bd_settings", initialSettings);
};

// Accessors
export const getUsers = () => getStored("bd_users", initialUsers);
export const setUsers = (users) => setStored("bd_users", users);

export const getTickets = () => getStored("bd_tickets", initialTickets);
export const setTickets = (tickets) => setStored("bd_tickets", tickets);

export const getNotifications = () => getStored("bd_notifications", initialNotifications);
export const setNotifications = (notifications) => setStored("bd_notifications", notifications);

export const getSettings = () => getStored("bd_settings", initialSettings);
export const setSettings = (settings) => setStored("bd_settings", settings);
