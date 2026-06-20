import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TicketService } from "@/services";
import { MOCK_USERS } from "@/lib/mock-data";
import type { Ticket, TicketStatus } from "@/lib/mock-data";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badges";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_app/tickets/$id")({
  component: TicketDetailsPage,
  notFoundComponent: () => (
    <div className="brut-card p-8 text-center">
      <h2 className="text-2xl font-black uppercase">Ticket Not Found</h2>
      <Link to="/tickets" className="brut-link mt-3 inline-block">Back to tickets</Link>
    </div>
  ),
});

function TicketDetailsPage() {
  const { id } = useParams({ from: "/_app/tickets/$id" });
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TicketService.get(id).then((t) => { setTicket(t); setLoading(false); });
  }, [id]);

  if (loading) return <div className="brut-border p-6 animate-pulse">Loading ticket…</div>;
  if (!ticket) return (
    <div className="brut-card p-8 text-center">
      <h2 className="text-2xl font-black uppercase">Ticket Not Found</h2>
      <Link to="/tickets" className="brut-link mt-3 inline-block">Back to tickets</Link>
    </div>
  );

  async function setStatus(s: TicketStatus) {
    const updated = await TicketService.update(ticket!.id, { status: s });
    setTicket(updated);
  }
  async function setAssignee(name: string) {
    const updated = await TicketService.update(ticket!.id, { assignee: name || null });
    setTicket(updated);
  }
  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    await TicketService.comment(ticket!.id, comment.trim());
    const t = await TicketService.get(ticket!.id);
    setTicket(t);
    setComment("");
  }

  return (
    <div className="space-y-6">
      <Link to="/tickets" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline">
        <ArrowLeft size={16} /> All Tickets
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="brut-card p-6 brut-shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold tracking-widest opacity-60 font-mono">{ticket.id}</div>
                <h2 className="text-2xl font-black uppercase mt-1 break-words">{ticket.title}</h2>
              </div>
              <div className="flex gap-2 shrink-0">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="brut-card">
            <div className="brut-border-b px-5 py-3"><h3 className="font-black uppercase text-sm tracking-wider">Comments ({ticket.comments.length})</h3></div>
            <ul className="divide-y-2 divide-foreground">
              {ticket.comments.map((c) => (
                <li key={c.id} className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 bg-foreground text-background grid place-items-center text-[10px] font-black">
                      {c.author.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="font-bold text-sm">{c.author}</div>
                    <div className="text-[10px] tracking-widest opacity-60 ml-auto">{new Date(c.at).toLocaleString()}</div>
                  </div>
                  <p className="text-sm pl-9">{c.body}</p>
                </li>
              ))}
              {ticket.comments.length === 0 && <li className="p-5 text-sm opacity-60">No comments yet.</li>}
            </ul>
            <form onSubmit={addComment} className="brut-border-t p-5 space-y-3">
              <label className="brut-label" htmlFor="cmt">Add Comment</label>
              <textarea id="cmt" className="brut-input min-h-[100px]" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a reply…" />
              <div className="flex justify-end">
                <button type="submit" className="brut-btn brut-btn-primary">Post Comment</button>
              </div>
            </form>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="brut-card p-5">
            <h3 className="font-black uppercase text-sm tracking-wider mb-4">Ticket Info</h3>
            <dl className="space-y-3 text-sm">
              <Row k="Category" v={ticket.category} />
              <Row k="Requester" v={ticket.requester} />
              <Row k="Created" v={new Date(ticket.createdAt).toLocaleString()} />
              <Row k="Updated" v={new Date(ticket.updatedAt).toLocaleString()} />
            </dl>
          </div>

          <div className="brut-card p-5 space-y-4">
            <h3 className="font-black uppercase text-sm tracking-wider">Status</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["OPEN", "IN_PROGRESS", "CLOSED"] as TicketStatus[]).map((s) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`brut-btn text-[11px] px-2 ${ticket.status === s ? "brut-btn-primary" : ""}`}>
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>

            <div>
              <label className="brut-label" htmlFor="assign">Assign Agent</label>
              <select id="assign" className="brut-input" value={ticket.assignee ?? ""} onChange={(e) => setAssignee(e.target.value)}>
                <option value="">— Unassigned</option>
                {MOCK_USERS.filter((u) => u.role !== "CUSTOMER").map((u) => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="brut-card">
            <div className="brut-border-b px-5 py-3"><h3 className="font-black uppercase text-sm tracking-wider">Activity Timeline</h3></div>
            <ol className="p-5 space-y-4">
              {ticket.activity.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-foreground" />
                    <div className="w-px flex-1 bg-foreground mt-1" />
                  </div>
                  <div className="pb-2">
                    <div className="text-sm font-bold">{a.message}</div>
                    <div className="text-[10px] tracking-widest opacity-60 mt-0.5">{new Date(a.at).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-foreground/20 pb-2">
      <dt className="text-[10px] font-black tracking-widest opacity-70 uppercase">{k}</dt>
      <dd className="text-right font-bold break-words">{v}</dd>
    </div>
  );
}
