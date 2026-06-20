import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/services";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Helpdesk" },
      { name: "description", content: "Sign in to your helpdesk workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (user) navigate({ to: "/" }); }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Email and password required."); return; }
    setLoading(true);
    try {
      const u = await AuthService.login(email, password);
      signIn(u);
      navigate({ to: "/" });
    } catch {
      setError("Invalid credentials.");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <aside className="hidden lg:flex flex-col justify-between p-10 brut-border-r">
        <div>
          <div className="text-4xl font-black tracking-tighter leading-none">HELP/DESK</div>
          <div className="text-xs mt-2 font-bold tracking-[0.3em]">TICKETING.SYSTEM</div>
        </div>
        <div className="space-y-6">
          <h2 className="text-5xl font-black uppercase leading-[0.9]">Ship support<br />without the noise.</h2>
          <p className="text-sm max-w-md leading-relaxed">A brutal, no-nonsense helpdesk for teams that move fast. Multi-tenant. Keyboard-first. Built for ops.</p>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {["FAST", "AUDITABLE", "MULTI-TENANT"].map((w) => (
              <div key={w} className="brut-border p-3 text-center text-xs font-black tracking-widest">{w}</div>
            ))}
          </div>
        </div>
        <div className="text-xs opacity-60">© 2026 HELP/DESK SYSTEMS</div>
      </aside>

      <main className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-md brut-border brut-shadow p-8 bg-background">
          <h1 className="text-3xl font-black uppercase mb-1">Sign In</h1>
          <p className="text-sm opacity-70 mb-6">Access your workspace.</p>

          <label className="brut-label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className="brut-input mb-4"
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />

          <label className="brut-label" htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" className="brut-input mb-2"
            value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

          {error && <div className="brut-border bg-foreground text-background px-3 py-2 text-xs font-bold uppercase mt-3">{error}</div>}

          <button type="submit" disabled={loading} className="brut-btn brut-btn-primary w-full mt-6">
            {loading ? "Signing In…" : "Sign In"}
          </button>

          <div className="mt-6 text-sm text-center">
            No account? <Link to="/register" className="brut-link">Create one</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
