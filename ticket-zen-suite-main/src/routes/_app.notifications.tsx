import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NotificationService } from "@/services";
import type { NotificationItem } from "@/lib/mock-data";
import { Mail, Send, Activity } from "lucide-react";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [email, setEmail] = useState({ assigned: true, comments: true, status: false, digest: true });
  const [tg, setTg] = useState({ assigned: true, urgent: true, mentions: false });

  useEffect(() => { NotificationService.list().then(setItems); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase">Notifications</h2>
          <p className="text-sm opacity-70 mt-1">Control how and where you get pinged.</p>
        </div>
        <button className="brut-btn" onClick={async () => { await NotificationService.markAllRead(); const a = await NotificationService.list(); setItems(a); }}>
          Mark All Read
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="brut-card">
          <div className="brut-border-b px-5 py-3 flex items-center gap-2"><Mail size={16} /><h3 className="font-black uppercase text-sm tracking-wider">Email Notifications</h3></div>
          <div className="p-5 space-y-3">
            <Toggle label="Ticket assigned to me" checked={email.assigned} onChange={(v) => setEmail({ ...email, assigned: v })} />
            <Toggle label="New comment on my tickets" checked={email.comments} onChange={(v) => setEmail({ ...email, comments: v })} />
            <Toggle label="Status changes" checked={email.status} onChange={(v) => setEmail({ ...email, status: v })} />
            <Toggle label="Weekly digest" checked={email.digest} onChange={(v) => setEmail({ ...email, digest: v })} />
          </div>
        </section>

        <section className="brut-card">
          <div className="brut-border-b px-5 py-3 flex items-center gap-2"><Send size={16} /><h3 className="font-black uppercase text-sm tracking-wider">Telegram Notifications</h3></div>
          <div className="p-5 space-y-3">
            <Toggle label="Ticket assigned to me" checked={tg.assigned} onChange={(v) => setTg({ ...tg, assigned: v })} />
            <Toggle label="Urgent escalations" checked={tg.urgent} onChange={(v) => setTg({ ...tg, urgent: v })} />
            <Toggle label="Mentions" checked={tg.mentions} onChange={(v) => setTg({ ...tg, mentions: v })} />
            <div className="text-xs opacity-70 mt-3">Link your Telegram account from the <a href="/profile" className="brut-link">Profile page</a>.</div>
          </div>
        </section>
      </div>

      <section className="brut-card">
        <div className="brut-border-b px-5 py-3 flex items-center gap-2"><Activity size={16} /><h3 className="font-black uppercase text-sm tracking-wider">Activity Feed</h3></div>
        <ul className="divide-y-2 divide-foreground">
          {items.map((n) => (
            <li key={n.id} className={`p-4 flex items-start gap-3 ${n.read ? "opacity-60" : ""}`}>
              <span className="brut-badge brut-badge-solid shrink-0">{n.channel}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold">{n.title}</div>
                <div className="text-sm opacity-80">{n.body}</div>
              </div>
              <div className="text-[10px] tracking-widest opacity-60 shrink-0">{new Date(n.at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 brut-border p-3 cursor-pointer">
      <span className="text-sm font-bold">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 brut-border relative ${checked ? "bg-foreground" : "bg-background"}`}
      >
        <span className={`absolute top-0 bottom-0 w-5 ${checked ? "right-0 bg-background" : "left-0 bg-foreground"}`} />
      </button>
    </label>
  );
}
