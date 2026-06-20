import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Ticket, PlusSquare, Users, Bell, User, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/tickets", label: "Tickets", icon: Ticket },
  { to: "/tickets/new", label: "New Ticket", icon: PlusSquare },
  { to: "/users", label: "Users", icon: Users },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { signOut, user } = useAuth();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
      <aside
        className={`fixed z-40 lg:static top-0 left-0 h-screen w-72 bg-background brut-border-r flex flex-col transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="brut-border-b p-5 flex items-center justify-between">
          <Link to="/" className="block" onClick={onClose}>
            <div className="text-2xl font-black tracking-tighter leading-none">HELP/DESK</div>
            <div className="text-[10px] mt-1 font-bold tracking-[0.2em]">TICKETING.SYSTEM</div>
          </Link>
          <button onClick={onClose} className="lg:hidden brut-btn-ghost p-1" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map((item) => {
            const active = isActive(item.to, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider border-3 ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "border-transparent hover:bg-muted"
                }`}
                style={{ borderWidth: 3 }}
              >
                <Icon size={18} strokeWidth={2.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="brut-border-t p-4">
          <div className="mb-3">
            <div className="text-[10px] font-bold tracking-[0.2em] opacity-60">SIGNED IN</div>
            <div className="font-bold truncate">{user?.name}</div>
            <div className="text-xs truncate opacity-70">{user?.company}</div>
          </div>
          <button onClick={signOut} className="brut-btn w-full">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
