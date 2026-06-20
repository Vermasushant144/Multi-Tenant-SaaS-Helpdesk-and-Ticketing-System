import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserService } from "@/services";
import type { User } from "@/lib/mock-data";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/users")({
  component: UsersPage,
});

type Form = { name: string; email: string; role: User["role"]; status: User["status"] };
const EMPTY: Form = { name: "", email: "", role: "AGENT", status: "ACTIVE" };

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [modal, setModal] = useState(false);
  const [confirmDel, setConfirmDel] = useState<User | null>(null);

  useEffect(() => { UserService.list().then(setUsers); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setModal(true); }
  function openEdit(u: User) { setEditing(u); setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setModal(true); }

  async function save() {
    if (!form.name || !form.email) return;
    if (editing) {
      const u = await UserService.update(editing.id, form);
      setUsers((arr) => arr.map((x) => (x.id === u.id ? u : x)));
    } else {
      const u = await UserService.create(form);
      setUsers((arr) => [u, ...arr]);
    }
    setModal(false);
  }
  async function doDelete() {
    if (!confirmDel) return;
    await UserService.remove(confirmDel.id);
    setUsers((arr) => arr.filter((u) => u.id !== confirmDel.id));
    setConfirmDel(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase">Users</h2>
          <p className="text-sm opacity-70 mt-1">Manage workspace members and roles.</p>
        </div>
        <button className="brut-btn brut-btn-primary" onClick={openCreate}>+ Add User</button>
      </div>

      <div className="overflow-x-auto">
        <table className="brut-table min-w-[640px]">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-bold">{u.name}</td>
                <td className="font-mono text-xs">{u.email}</td>
                <td><span className="brut-badge brut-badge-solid">{u.role}</span></td>
                <td><span className={`brut-badge ${u.status === "ACTIVE" ? "brut-badge-solid" : ""}`}>{u.status}</span></td>
                <td>
                  <div className="flex gap-2">
                    <button aria-label={`Edit ${u.name}`} className="brut-btn-ghost brut-border p-2" onClick={() => openEdit(u)}><Pencil size={14} /></button>
                    <button aria-label={`Delete ${u.name}`} className="brut-btn-ghost brut-border p-2" onClick={() => setConfirmDel(u)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit User" : "Add User"}
        footer={<>
          <button className="brut-btn" onClick={() => setModal(false)}>Cancel</button>
          <button className="brut-btn brut-btn-primary" onClick={save}>{editing ? "Save Changes" : "Create User"}</button>
        </>}>
        <div className="space-y-4">
          <div>
            <label className="brut-label" htmlFor="u-name">Full Name</label>
            <input id="u-name" className="brut-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="brut-label" htmlFor="u-email">Email</label>
            <input id="u-email" type="email" className="brut-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="brut-label" htmlFor="u-role">Role</label>
              <select id="u-role" className="brut-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })}>
                <option value="ADMIN">Admin</option>
                <option value="AGENT">Agent</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>
            <div>
              <label className="brut-label" htmlFor="u-status">Status</label>
              <select id="u-status" className="brut-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as User["status"] })}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete User"
        message={`This will permanently remove ${confirmDel?.name}. This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setConfirmDel(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}
