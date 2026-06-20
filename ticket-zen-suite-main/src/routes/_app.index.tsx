import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardService } from "@/services";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badges";
import type { Ticket } from "@/lib/mock-data";
import { ArrowUpRight, TicketIcon, Inbox, Clock, CheckSquare } from "lucide-react";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }) {
  return (
    <div className="brut-card p-5 brut-shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-black tracking-[0.2em] opacity-70">{label}</div>
          <div className="text-5xl font-black mt-2 leading-none">{value}</div>
        </div>
        <div className="brut-border w-11 h-11 grid place-items-center bg-foreground text-background">
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<{ total: number; open: number; inProgress: number; closed: number; recent: Ticket[] } | null>(null);

  useEffect(() => { DashboardService.stats().then(setStats); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase">Overview</h2>
          <p className="text-sm opacity-70 mt-1">Real-time snapshot of your support queue.</p>
        </div>
        <Link to="/tickets/new" className="brut-btn brut-btn-primary">+ New Ticket</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tickets" value={stats?.total ?? 0} icon={TicketIcon} />
        <StatCard label="Open" value={stats?.open ?? 0} icon={Inbox} />
        <StatCard label="In Progress" value={stats?.inProgress ?? 0} icon={Clock} />
        <StatCard label="Closed" value={stats?.closed ?? 0} icon={CheckSquare} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 brut-card">
          <div className="brut-border-b px-5 py-3 flex items-center justify-between">
            <h3 className="font-black uppercase text-sm tracking-wider">Recent Tickets</h3>
            <Link to="/tickets" className="brut-link text-xs">View All</Link>
          </div>
          <div className="divide-y-2 divide-foreground">
            {stats?.recent.map((t) => (
              <Link key={t.id} to="/tickets/$id" params={{ id: t.id }} className="flex items-center gap-4 p-4 hover:bg-muted">
                <div className="font-mono text-xs font-bold w-20 shrink-0">{t.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{t.title}</div>
                  <div className="text-xs opacity-70 truncate">{t.category} · {t.requester}</div>
                </div>
                <div className="hidden sm:flex gap-2 shrink-0">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
                <ArrowUpRight size={16} className="shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <section className="brut-card">
          <div className="brut-border-b px-5 py-3">
            <h3 className="font-black uppercase text-sm tracking-wider">Recent Activity</h3>
          </div>
          <ul className="p-5 space-y-4">
            {[
              { who: "Priya Shah", what: "assigned TCK-1004 to Marcus Lee", when: "2m ago" },
              { who: "Sara Kim", what: "commented on TCK-1002", when: "12m ago" },
              { who: "System", what: "escalated TCK-1008 to URGENT", when: "1h ago" },
              { who: "Alex Carter", what: "closed TCK-1000", when: "3h ago" },
              { who: "Marcus Lee", what: "opened TCK-1009", when: "5h ago" },
            ].map((a, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-2 h-2 bg-foreground mt-2 shrink-0" />
                <div>
                  <div className="text-sm"><span className="font-bold">{a.who}</span> {a.what}</div>
                  <div className="text-[10px] font-bold tracking-widest opacity-60 mt-0.5">{a.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
