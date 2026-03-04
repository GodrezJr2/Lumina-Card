"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { RoleGate } from "@/components/RoleGate";
import { ALL_ROLES, ROLE_LABELS, ROLE_BADGE } from "@/lib/roles";
import type { Role } from "@/lib/roles";

// ── Types ────────────────────────────────────────────────────────────────────

interface UserRow {
  id:                 number;
  email:              string;
  name:               string | null;
  role:               Role;
  lockedTemplateId:   string | null;
  purchasedTemplates: string | null;
  createdAt:          string;
  deletedAt:          string | null;
  deletedBy:          number | null;
}

interface ChangeLogRow {
  id:          number;
  category:    string;
  description: string;
  before:      string | null;
  after:       string | null;
  targetId:    number | null;
  createdAt:   string;
  actor:       { id: number; email: string; name: string | null } | null;
}

// ── Category badge ────────────────────────────────────────────────────────────
const CATEGORY_BADGE: Record<string, string> = {
  user_create:      "bg-emerald-100 text-emerald-700",
  user_role_change: "bg-blue-100 text-blue-700",
  user_delete:      "bg-red-100 text-red-700",
  user_restore:     "bg-amber-100 text-amber-700",
  system:           "bg-slate-100 text-slate-600",
};
const CATEGORY_LABEL: Record<string, string> = {
  user_create:      "Buat Akun",
  user_role_change: "Ganti Role",
  user_delete:      "Hapus Akun",
  user_restore:     "Pulihkan Akun",
  system:           "System",
};

// ── Modal tambah user ─────────────────────────────────────────────────────────
function AddUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail]       = useState("");
  const [name, setName]         = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState<Role>("BASIC_USER");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password, role }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Gagal membuat user."); return; }
    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Tambah User Baru</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select value={role} onChange={e => setRole(e.target.value as Role)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
              {ALL_ROLES.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60">
              {loading ? "Menyimpan…" : "Tambah User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function UsersContent() {
  const [tab, setTab]           = useState<"users" | "changelog">("users");
  const [users, setUsers]       = useState<UserRow[]>([]);
  const [logs, setLogs]         = useState<ChangeLogRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showAdd, setShowAdd]   = useState(false);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);
  const [editRole, setEditRole] = useState<{ id: number; role: Role } | null>(null);
  const [filterDeleted, setFilterDeleted] = useState(false);
  const [search, setSearch]     = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  const fetchLogs = useCallback(async () => {
    const res = await fetch("/api/admin/changelog?limit=100");
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs ?? []);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchLogs();
    // Ambil userId yang sedang login
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user?.id) setCurrentUserId(d.user.id);
    });
  }, [fetchUsers, fetchLogs]);

  async function handleRoleChange(userId: number, newRole: Role) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error ?? "Gagal update role.", false); return; }
    showToast(`Role berhasil diubah ke ${ROLE_LABELS[newRole]}`);
    setEditRole(null);
    fetchUsers(); fetchLogs();
  }

  async function handleDelete(user: UserRow) {
    if (!confirm(`Hapus akun "${user.email}"? User tidak bisa login tapi data tetap tersimpan.`)) return;
    const res  = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { showToast(data.error ?? "Gagal hapus.", false); return; }
    showToast(data.message ?? "User dihapus.");
    fetchUsers(); fetchLogs();
  }

  async function handleRestore(user: UserRow) {
    const res  = await fetch(`/api/admin/users/${user.id}`, { method: "PUT" });
    const data = await res.json();
    if (!res.ok) { showToast(data.error ?? "Gagal restore.", false); return; }
    showToast(data.message ?? "User dipulihkan.");
    fetchUsers(); fetchLogs();
  }

  const filtered = users.filter(u => {
    if (!filterDeleted && u.deletedAt) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all
          ${toast.ok ? "bg-emerald-500" : "bg-red-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Add User Modal */}
      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { fetchUsers(); fetchLogs(); showToast("User baru berhasil ditambahkan!"); }}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/panel" className="text-slate-400 hover:text-slate-600">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manajemen User</h1>
          <p className="text-xs text-slate-500">Kelola akun, role, dan histori perubahan</p>
        </div>
        <div className="ml-auto">
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            <span className="material-symbols-outlined text-base">person_add</span>
            Tambah User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-6">
        <div className="flex gap-6">
          {(["users", "changelog"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                tab === t ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              {t === "users" ? "Semua User" : "Change Log"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* ── TAB: USERS ── */}
        {tab === "users" && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <div className="relative flex-1 min-w-48">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input
                  type="text" placeholder="Cari email / nama…" value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input type="checkbox" checked={filterDeleted} onChange={e => setFilterDeleted(e.target.checked)}
                  className="rounded" />
                Tampilkan user terhapus
              </label>
              <span className="text-xs text-slate-400">{filtered.length} user ditampilkan</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Template</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={5} className="py-12 text-center text-slate-400">Memuat…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-slate-400">Tidak ada user ditemukan.</td></tr>
                  ) : filtered.map(user => (
                    <tr key={user.id} className={`hover:bg-slate-50/50 transition ${user.deletedAt ? "opacity-50" : ""}`}>
                      {/* User info */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                            ${user.id === currentUserId ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400" : "bg-slate-200 text-slate-500"}`}>
                            {(user.name ?? user.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-800">{user.name ?? "—"}</p>
                              {user.id === currentUserId && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Kamu</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3">
                        {editRole?.id === user.id ? (
                          <div className="flex gap-2 items-center">
                            <select
                              value={editRole.role}
                              onChange={e => setEditRole({ id: user.id, role: e.target.value as Role })}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                              {ALL_ROLES.map(r => (
                                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                              ))}
                            </select>
                            <button onClick={() => handleRoleChange(user.id, editRole.role)}
                              className="text-emerald-600 hover:text-emerald-800">
                              <span className="material-symbols-outlined text-base">check</span>
                            </button>
                            <button onClick={() => setEditRole(null)}
                              className="text-slate-400 hover:text-slate-600">
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                          </div>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[user.role]}`}>
                            {ROLE_LABELS[user.role]}
                          </span>
                        )}
                      </td>

                      {/* Template */}
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {user.lockedTemplateId ?? "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3">
                        {user.deletedAt ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                            Dihapus
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Aktif
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          {/* Tombol ganti role — disembunyikan untuk akun sendiri */}
                          {!user.deletedAt && user.id !== currentUserId && (
                            <button onClick={() => setEditRole({ id: user.id, role: user.role })}
                              title="Ganti Role"
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition">
                              <span className="material-symbols-outlined text-base">manage_accounts</span>
                            </button>
                          )}
                          {/* Tombol hapus/restore — disembunyikan untuk akun sendiri */}
                          {user.id !== currentUserId && (
                            user.deletedAt ? (
                              <button onClick={() => handleRestore(user)}
                                title="Pulihkan Akun"
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition">
                                <span className="material-symbols-outlined text-base">restore</span>
                              </button>
                            ) : (
                              <button onClick={() => handleDelete(user)}
                                title="Hapus Akun (Soft Delete)"
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition">
                                <span className="material-symbols-outlined text-base">person_remove</span>
                              </button>
                            )
                          )}
                          {/* Indikator untuk akun sendiri */}
                          {user.id === currentUserId && (
                            <span className="text-xs text-slate-300 italic px-2 py-1.5">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stats bar */}
            <div className="mt-4 flex gap-4 text-xs text-slate-500">
              <span>{users.filter(u => !u.deletedAt).length} aktif</span>
              <span>{users.filter(u => !!u.deletedAt).length} dihapus</span>
              <span>{users.filter(u => u.role === "SUPER_ADMIN").length} super admin</span>
              <span>{users.filter(u => u.role === "DIY_CLIENT").length} DIY client</span>
            </div>
          </>
        )}

        {/* ── TAB: CHANGELOG ── */}
        {tab === "changelog" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Histori Perubahan</h2>
              <button onClick={fetchLogs}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">refresh</span> Refresh
              </button>
            </div>
            {logs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">Belum ada log perubahan.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {logs.map(log => (
                  <div key={log.id} className="px-5 py-4 flex gap-4 items-start hover:bg-slate-50/50 transition">
                    {/* Category badge */}
                    <span className={`mt-0.5 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${CATEGORY_BADGE[log.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {CATEGORY_LABEL[log.category] ?? log.category}
                    </span>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">{log.description}</p>
                      {(log.before || log.after) && (
                        <div className="mt-1 flex gap-4 text-xs text-slate-400 font-mono">
                          {log.before && <span>before: {log.before}</span>}
                          {log.after  && <span>after: {log.after}</span>}
                        </div>
                      )}
                      {log.actor && (
                        <p className="mt-1 text-xs text-slate-400">
                          oleh <span className="font-medium text-slate-500">{log.actor.name ?? log.actor.email}</span>
                        </p>
                      )}
                    </div>
                    {/* Timestamp */}
                    <span className="shrink-0 text-xs text-slate-400">
                      {new Date(log.createdAt).toLocaleString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  return (
    <RoleGate feature="superAdmin" fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Akses ditolak. Halaman ini hanya untuk Super Admin.</p>
      </div>
    }>
      <UsersContent />
    </RoleGate>
  );
}
