import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TicketService } from "@/services";
import type { Ticket, TicketPriority, TicketStatus } from "@/lib/mock-data";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badges";

export const Route = createFileRoute("/_app/tickets/")({
  component: TicketsPage,
});

const PAGE_SIZE = 8;

function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | TicketStatus>("ALL");
  const [priority, setPriority] = useState<"ALL" | TicketPriority>("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => { TicketService.list().then(setTickets); }, []);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (status !== "ALL" && t.status !== status) return false;
      if (priority !== "ALL" && t.priority !== priority) return false;
      if (q && !`${t.id} ${t.title} ${t.requester} ${t.category}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tickets, q, status, priority]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [q, status, priority]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase">Tickets</h2>
          <p className="text-sm opacity-70 mt-1">{filtered.length} result{filtered.length === 1 ? "" : "s"}.</p>
        </div>
        <Link to="/tickets/new" className="brut-btn brut-btn-primary">+ New Ticket</Link>
      </div>

      <div className="brut-card p-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="flex items-center brut-border">
          <Search size={16} className="ml-3 shrink-0" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search tickets, requesters, IDs…"
            className="w-full px-3 py-2 bg-transparent outline-none text-sm font-bold uppercase tracking-wider placeholder:opacity-50"
            aria-label="Search tickets"
          />
        </div>
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as "ALL" | TicketStatus)} className="brut-input md:w-44">
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select aria-label="Filter by priority" value={priority} onChange={(e) => setPriority(e.target.value as "ALL" | TicketPriority)} className="brut-input md:w-44">
          <option value="ALL">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="brut-table min-w-[760px]">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((t) => (
              <tr key={t.id}>
                <td className="font-mono font-bold">
                  <Link to="/tickets/$id" params={{ id: t.id }} className="brut-link">{t.id}</Link>
                </td>
                <td>
                  <div className="font-bold">{t.title}</div>
                  <div className="text-xs opacity-60">{t.category}</div>
                </td>
                <td><StatusBadge status={t.status} /></td>
                <td><PriorityBadge priority={t.priority} /></td>
                <td>{t.assignee ?? <span className="opacity-50">— Unassigned</span>}</td>
                <td className="text-xs">{new Date(t.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 opacity-60">No tickets match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button className="brut-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <button className="brut-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      </div>
    </div>
  );
}
