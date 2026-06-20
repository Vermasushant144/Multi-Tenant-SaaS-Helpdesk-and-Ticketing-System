import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Send, Check } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, signIn } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [company, setCompany] = useState(user?.company ?? "");
  const [saved, setSaved] = useState(false);

  const [curr, setCurr] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  const [tgLinked, setTgLinked] = useState(false);
  const [tgHandle, setTgHandle] = useState("");

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    signIn({ ...user, name, email, company });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  function changePw(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 6) { setPwMsg("New password must be 6+ characters."); return; }
    if (next !== confirm) { setPwMsg("Passwords do not match."); return; }
    if (!curr) { setPwMsg("Current password required."); return; }
    setPwMsg("Password updated.");
    setCurr(""); setNext(""); setConfirm("");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-black uppercase">Profile</h2>
        <p className="text-sm opacity-70 mt-1">Manage your account, security, and integrations.</p>
      </div>

      <form onSubmit={saveProfile} className="brut-card p-6 space-y-4">
        <h3 className="font-black uppercase text-sm tracking-wider">User Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="brut-label" htmlFor="p-name">Full Name</label>
            <input id="p-name" className="brut-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="brut-label" htmlFor="p-email">Email</label>
            <input id="p-email" type="email" className="brut-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="brut-label" htmlFor="p-company">Company</label>
            <input id="p-company" className="brut-input" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end">
          {saved && <span className="brut-badge brut-badge-solid"><Check size={12} className="mr-1" /> Saved</span>}
          <button className="brut-btn brut-btn-primary">Save Changes</button>
        </div>
      </form>

      <form onSubmit={changePw} className="brut-card p-6 space-y-4">
        <h3 className="font-black uppercase text-sm tracking-wider">Change Password</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="brut-label" htmlFor="pw-curr">Current</label>
            <input id="pw-curr" type="password" className="brut-input" value={curr} onChange={(e) => setCurr(e.target.value)} />
          </div>
          <div>
            <label className="brut-label" htmlFor="pw-next">New</label>
            <input id="pw-next" type="password" className="brut-input" value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          <div>
            <label className="brut-label" htmlFor="pw-conf">Confirm</label>
            <input id="pw-conf" type="password" className="brut-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </div>
        {pwMsg && <div className="brut-border bg-foreground text-background px-3 py-2 text-xs font-bold uppercase">{pwMsg}</div>}
        <div className="flex justify-end">
          <button className="brut-btn">Update Password</button>
        </div>
      </form>

      <div className="brut-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Send size={16} />
          <h3 className="font-black uppercase text-sm tracking-wider">Telegram Account Linking</h3>
        </div>
        {tgLinked ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="brut-badge brut-badge-solid">LINKED</span>
            <span className="font-mono font-bold">@{tgHandle}</span>
            <button className="brut-btn ml-auto" onClick={() => { setTgLinked(false); setTgHandle(""); }}>Unlink</button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <input className="brut-input flex-1" placeholder="@yourtelegramhandle" value={tgHandle} onChange={(e) => setTgHandle(e.target.value.replace(/^@/, ""))} />
            <button className="brut-btn brut-btn-primary" onClick={() => tgHandle && setTgLinked(true)}>Link Account</button>
          </div>
        )}
        <p className="text-xs opacity-70">Get instant alerts in Telegram for assignments, mentions, and escalations.</p>
      </div>
    </div>
  );
}
