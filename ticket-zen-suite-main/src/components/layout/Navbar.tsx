import { Menu, Search, Bell } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";

export function Navbar({ onMenu }: { onMenu: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const title =
    pathname === "/" ? "Dashboard"
    : pathname.startsWith("/tickets/new") ? "Create Ticket"
    : pathname.startsWith("/tickets/") && pathname !== "/tickets" ? "Ticket Details"
    : pathname.startsWith("/tickets") ? "Tickets"
    : pathname.slice(1).replace(/^./, (c) => c.toUpperCase()) || "Dashboard";

  return (
    <header className="brut-border-b bg-background sticky top-0 z-20">
      <div className="flex items-center gap-3 px-4 md:px-6 h-16">
        <button onClick={onMenu} className="lg:hidden brut-btn-ghost p-2" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="text-lg md:text-xl font-black uppercase tracking-tight truncate">{title}</h1>

        <div className="hidden md:flex flex-1 max-w-md ml-6 items-center brut-border">
          <Search size={16} className="ml-3 shrink-0" />
          <input
            placeholder="QUICK SEARCH…"
            className="w-full px-3 py-2 bg-transparent outline-none text-sm font-bold uppercase tracking-wider placeholder:opacity-50"
            aria-label="Search"
          />
        </div>

        <div className="flex-1 md:flex-none" />

        <Link to="/notifications" className="brut-btn-ghost p-2 relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-foreground" />
        </Link>

        <Link to="/profile" className="hidden sm:flex items-center gap-2 brut-border px-3 py-1.5">
          <div className="w-7 h-7 bg-foreground text-background grid place-items-center text-xs font-black">
            {user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <span className="text-sm font-bold uppercase">{user?.name?.split(" ")[0]}</span>
        </Link>
      </div>
    </header>
  );
}
