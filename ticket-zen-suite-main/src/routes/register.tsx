import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthService } from "@/services";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Helpdesk" },
      { name: "description", content: "Create a new helpdesk workspace." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (user) navigate({ to: "/" }); }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!company || !name || !email || !password) { setError("All fields are required."); return; }
    if (password.length < 6) { setError("Password must be 6+ characters."); return; }
    setLoading(true);
    try {
      const u = await AuthService.register({ company, name, email, password });
      signIn(u);
      navigate({ to: "/" });
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <form onSubmit={onSubmit} className="w-full max-w-xl brut-border brut-shadow p-8 bg-background">
        <div className="mb-6">
          <div className="text-2xl font-black tracking-tighter">HELP/DESK</div>
          <div className="text-[10px] mt-1 font-bold tracking-[0.3em]">TICKETING.SYSTEM</div>
        </div>
        <h1 className="text-3xl font-black uppercase mb-1">Create Account</h1>
        <p className="text-sm opacity-70 mb-6">Spin up a workspace for your team in seconds.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="brut-label" htmlFor="company">Company Name</label>
            <input id="company" className="brut-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />
          </div>
          <div>
            <label className="brut-label" htmlFor="name">Full Name</label>
            <input id="name" className="brut-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="sm:col-span-2">
            <label className="brut-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="brut-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="brut-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="brut-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
          </div>
        </div>

        {error && <div className="brut-border bg-foreground text-background px-3 py-2 text-xs font-bold uppercase mt-4">{error}</div>}

        <button type="submit" disabled={loading} className="brut-btn brut-btn-primary w-full mt-6">
          {loading ? "Creating…" : "Create Account"}
        </button>

        <div className="mt-6 text-sm text-center">
          Already have one? <Link to="/login" className="brut-link">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
