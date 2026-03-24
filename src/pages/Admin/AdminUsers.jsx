import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Save, Search } from "lucide-react";
import adminService from "../../apis/adminService";
import { getApiErrorMessage, normalizeText, pick, rowId, toArray } from "./adminHelpers";

const DEFAULT_STATUSES = ["Active", "Inactive", "Suspended"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [draftStatus, setDraftStatus] = useState({});
  const [saving, setSaving] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminService.getUsers();
      setUsers(toArray(data));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai danh sach nguoi dung"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const statusOptions = useMemo(() => {
    const fromData = users
      .map((u) => String(pick(u, ["status"], "")).trim())
      .filter(Boolean);

    return [...new Set([...DEFAULT_STATUSES, ...fromData])];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = normalizeText(search);
    if (!q) return users;

    return users.filter((user) => {
      const content = [
        pick(user, ["fullName", "name", "userName"], ""),
        pick(user, ["email"], ""),
        pick(user, ["role"], ""),
        pick(user, ["status"], ""),
      ]
        .join(" ")
        .trim();

      return normalizeText(content).includes(q);
    });
  }, [search, users]);

  const handleSaveStatus = async (user) => {
    const id = pick(user, ["userId", "id"], null);
    if (id === null || id === "-") return;

    const currentStatus = String(pick(user, ["status"], ""));
    const nextStatus = draftStatus[id] ?? currentStatus;
    if (!nextStatus || nextStatus === currentStatus) return;

    setSaving((prev) => ({ ...prev, [id]: true }));

    try {
      await adminService.updateUserStatus(id, { status: nextStatus });

      setUsers((prev) =>
        prev.map((u) => {
          const uid = pick(u, ["userId", "id"], null);
          return uid === id ? { ...u, status: nextStatus } : u;
        }),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Cap nhat trang thai nguoi dung that bai"));
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Quan ly nguoi dung</h1>
          <p className="text-white/35 text-sm mt-1">Theo doi vai tro va cap nhat trang thai tai khoan</p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/25 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 text-sm font-bold"
        >
          <RefreshCw size={14} /> Lam moi
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0d120d] p-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tim theo ten, email, role, status"
            className="w-full rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm pl-10 pr-3 py-2.5 outline-none focus:border-emerald-500/40"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0d120d] overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-white/40 text-sm">
            <Loader2 size={16} className="animate-spin mr-2" /> Dang tai danh sach nguoi dung
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="px-4 py-8 text-white/35 text-sm">Khong co nguoi dung phu hop</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="text-white/45 bg-white/[0.02]">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">ID</th>
                  <th className="text-left px-4 py-3 font-bold">Ho ten</th>
                  <th className="text-left px-4 py-3 font-bold">Email</th>
                  <th className="text-left px-4 py-3 font-bold">Role</th>
                  <th className="text-left px-4 py-3 font-bold">Status</th>
                  <th className="text-left px-4 py-3 font-bold">Hanh dong</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const id = pick(user, ["userId", "id"], "-");
                  const currentStatus = String(pick(user, ["status"], "Unknown"));
                  const nextStatus = draftStatus[id] ?? currentStatus;
                  const dirty = nextStatus !== currentStatus;

                  return (
                    <tr key={rowId(user, ["userId"])} className="border-t border-white/5 text-white/80">
                      <td className="px-4 py-3">{id}</td>
                      <td className="px-4 py-3 font-semibold">{pick(user, ["fullName", "name", "userName"], "-")}</td>
                      <td className="px-4 py-3">{pick(user, ["email"], "-")}</td>
                      <td className="px-4 py-3">{pick(user, ["role"], "-")}</td>
                      <td className="px-4 py-3">
                        <select
                          value={nextStatus}
                          onChange={(e) =>
                            setDraftStatus((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                          className="rounded-lg bg-white/[0.03] border border-white/10 text-white px-2.5 py-1.5 text-xs font-semibold"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s} className="text-black">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          disabled={!dirty || saving[id]}
                          onClick={() => handleSaveStatus(user)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                            !dirty || saving[id]
                              ? "text-white/35 border-white/10 bg-white/[0.02] cursor-not-allowed"
                              : "text-emerald-400 border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15"
                          }`}
                        >
                          {saving[id] ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Luu
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
