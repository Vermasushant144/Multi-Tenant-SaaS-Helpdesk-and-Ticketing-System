import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TicketService } from "@/services";
import type { TicketPriority } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/tickets/new")({
  component: CreateTicketPage,
});

const CATEGORIES = ["Billing", "Technical", "Account", "Feature Request", "Bug"];
const PRIORITIES: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

function CreateTicketPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) { setError("Title and description are required."); return; }
    setSubmitting(true);
    try {
      const t = await TicketService.create({ title, description, priority, category });
      navigate({ to: "/tickets/$id", params: { id: t.id } });
    } finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-black uppercase">Create Ticket</h2>
        <p className="text-sm opacity-70 mt-1">File a new issue. Be specific — concise titles route faster.</p>
      </div>

      <form onSubmit={onSubmit} className="brut-card p-6 space-y-5 brut-shadow-sm">
        <div>
          <label className="brut-label" htmlFor="title">Title</label>
          <input id="title" className="brut-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short, descriptive summary" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="brut-label" htmlFor="priority">Priority</label>
            <select id="priority" className="brut-input" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="brut-label" htmlFor="category">Category</label>
            <select id="category" className="brut-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="brut-label" htmlFor="description">Description</label>
          <textarea id="description" className="brut-input min-h-[180px] font-mono" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? Steps to reproduce, expected behavior, environment…" />
        </div>

        {error && <div className="brut-border bg-foreground text-background px-3 py-2 text-xs font-bold uppercase">{error}</div>}

        <div className="flex gap-3 justify-end">
          <button type="button" className="brut-btn" onClick={() => navigate({ to: "/tickets" })}>Cancel</button>
          <button type="submit" disabled={submitting} className="brut-btn brut-btn-primary">
            {submitting ? "Submitting…" : "Submit Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
