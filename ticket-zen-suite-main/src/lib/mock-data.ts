export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  assignee: string | null;
  requester: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  activity: ActivityEntry[];
}
export interface Comment {
  id: string;
  author: string;
  body: string;
  at: string;
}
export interface ActivityEntry {
  id: string;
  type: string;
  message: string;
  at: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "AGENT" | "CUSTOMER";
  status: "ACTIVE" | "INACTIVE";
}
export interface NotificationItem {
  id: string;
  channel: "EMAIL" | "TELEGRAM" | "SYSTEM";
  title: string;
  body: string;
  at: string;
  read: boolean;
}

const now = Date.now();
const iso = (offsetMin: number) => new Date(now - offsetMin * 60_000).toISOString();

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Alex Carter", email: "alex@acme.io", role: "ADMIN", status: "ACTIVE" },
  { id: "u2", name: "Priya Shah", email: "priya@acme.io", role: "AGENT", status: "ACTIVE" },
  { id: "u3", name: "Marcus Lee", email: "marcus@acme.io", role: "AGENT", status: "ACTIVE" },
  { id: "u4", name: "Sara Kim", email: "sara@acme.io", role: "CUSTOMER", status: "ACTIVE" },
  { id: "u5", name: "Dan Wolf", email: "dan@acme.io", role: "CUSTOMER", status: "INACTIVE" },
];

export const MOCK_TICKETS: Ticket[] = Array.from({ length: 23 }).map((_, i) => {
  const statuses: TicketStatus[] = ["OPEN", "IN_PROGRESS", "CLOSED"];
  const prios: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  const cats = ["Billing", "Technical", "Account", "Feature Request", "Bug"];
  const status = statuses[i % 3];
  const priority = prios[i % 4];
  return {
    id: `TCK-${(1000 + i).toString()}`,
    title: [
      "Cannot log in after password reset",
      "Invoice missing line items",
      "Dark mode toggle broken",
      "Request: bulk CSV export",
      "API rate limit too aggressive",
      "Webhook delivery failing 500",
      "2FA setup loop",
      "Subscription not upgrading",
    ][i % 8],
    description: "Customer reports unexpected behavior. Reproduced internally. Awaiting triage from engineering team for further investigation.",
    status,
    priority,
    category: cats[i % cats.length],
    assignee: i % 3 === 0 ? null : MOCK_USERS[1 + (i % 2)].name,
    requester: MOCK_USERS[3 + (i % 2)].name,
    createdAt: iso(60 * (i + 1)),
    updatedAt: iso(30 * (i + 1)),
    comments: [
      { id: `c-${i}-1`, author: "Priya Shah", body: "Looking into this, will update soon.", at: iso(45 * (i + 1)) },
      { id: `c-${i}-2`, author: "Sara Kim", body: "Thanks, please prioritize — blocking our launch.", at: iso(20 * (i + 1)) },
    ],
    activity: [
      { id: `a-${i}-1`, type: "CREATED", message: "Ticket created", at: iso(60 * (i + 1)) },
      { id: `a-${i}-2`, type: "ASSIGNED", message: "Assigned to Priya Shah", at: iso(50 * (i + 1)) },
      { id: `a-${i}-3`, type: "STATUS", message: `Status changed to ${status}`, at: iso(30 * (i + 1)) },
    ],
  };
});

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", channel: "EMAIL", title: "New ticket assigned", body: "TCK-1003 has been assigned to you", at: iso(5), read: false },
  { id: "n2", channel: "TELEGRAM", title: "Ticket escalated", body: "TCK-1008 marked URGENT", at: iso(30), read: false },
  { id: "n3", channel: "SYSTEM", title: "SLA warning", body: "TCK-1001 nearing breach", at: iso(120), read: true },
  { id: "n4", channel: "EMAIL", title: "Reply received", body: "Sara Kim commented on TCK-1004", at: iso(240), read: true },
];
