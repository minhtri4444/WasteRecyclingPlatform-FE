import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import enterpriseService from "../../apis/enterpriseService";
import { getApiErrorMessage, pick, rowId, toArray } from "./enterpriseHelpers";

const INITIAL_FORM = {
  wasteTypeId: "",
  basePoint: "",
  bonusCondition: "",
};

export default function EnterpriseRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState({});
  const [deleting, setDeleting] = useState({});
  const [draft, setDraft] = useState({});
  const [error, setError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await enterpriseService.getRewardRules();
      setRules(toArray(data));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai reward rules"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.wasteTypeId || !form.basePoint) {
      setError("Vui long nhap wasteTypeId va basePoint");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await enterpriseService.createRewardRule({
        wasteTypeId: Number(form.wasteTypeId),
        basePoint: Number(form.basePoint),
        bonusCondition: form.bonusCondition.trim() || null,
      });
      setForm(INITIAL_FORM);
      await fetchData();
    } catch (err) {
      setError(getApiErrorMessage(err, "Tao reward rule that bai"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async (item) => {
    const id = pick(item, ["ruleId", "id"], null);
    if (id === null || id === "-") return;

    const d = draft[id] || {};
    const payload = {};
    if (d.basePoint !== undefined && d.basePoint !== "") payload.basePoint = Number(d.basePoint);
    if (d.bonusCondition !== undefined) payload.bonusCondition = d.bonusCondition;
    if (Object.keys(payload).length === 0) return;

    setSaving((prev) => ({ ...prev, [id]: true }));
    setError("");

    try {
      await enterpriseService.updateRewardRule(id, payload);
      setRules((prev) =>
        prev.map((r) => {
          const rid = pick(r, ["ruleId", "id"], null);
          return rid === id ? { ...r, ...payload } : r;
        }),
      );
      setDraft((prev) => ({ ...prev, [id]: {} }));
    } catch (err) {
      setError(getApiErrorMessage(err, "Cap nhat reward rule that bai"));
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (item) => {
    const id = pick(item, ["ruleId", "id"], null);
    if (id === null || id === "-") return;

    setDeleting((prev) => ({ ...prev, [id]: true }));
    setError("");

    try {
      await enterpriseService.deleteRewardRule(id);
      setRules((prev) => prev.filter((r) => pick(r, ["ruleId", "id"], null) !== id));
    } catch (err) {
      setError(getApiErrorMessage(err, "Xoa reward rule that bai"));
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Quy tac thuong</h1>
          <p className="text-white/35 text-sm mt-1">Quan ly diem thuong theo tung loai rac</p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/25 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 text-sm font-bold"
        >
          <RefreshCw size={14} /> Lam moi
        </button>
      </div>

      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-white/10 bg-[#0d120d] p-4 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          value={form.wasteTypeId}
          onChange={(e) => setForm((prev) => ({ ...prev, wasteTypeId: e.target.value }))}
          placeholder="wasteTypeId"
          className="rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm px-3 py-2.5 outline-none"
        />
        <input
          value={form.basePoint}
          onChange={(e) => setForm((prev) => ({ ...prev, basePoint: e.target.value }))}
          placeholder="basePoint"
          className="rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm px-3 py-2.5 outline-none"
        />
        <input
          value={form.bonusCondition}
          onChange={(e) => setForm((prev) => ({ ...prev, bonusCondition: e.target.value }))}
          placeholder="bonusCondition (optional)"
          className="rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm px-3 py-2.5 outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold px-4 py-2.5 border ${
            submitting
              ? "text-white/35 border-white/10 bg-white/[0.02] cursor-not-allowed"
              : "text-emerald-400 border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15"
          }`}
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tao rule
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0d120d] overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-white/40 text-sm">
            <Loader2 size={16} className="animate-spin mr-2" /> Dang tai rules
          </div>
        ) : rules.length === 0 ? (
          <p className="px-4 py-8 text-white/35 text-sm">Chua co rule nao</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="text-white/45 bg-white/[0.02]">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">ID</th>
                  <th className="text-left px-4 py-3 font-bold">wasteTypeId</th>
                  <th className="text-left px-4 py-3 font-bold">basePoint</th>
                  <th className="text-left px-4 py-3 font-bold">bonusCondition</th>
                  <th className="text-left px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((item) => {
                  const id = pick(item, ["ruleId", "id"], "-");
                  const d = draft[id] || {};

                  return (
                    <tr key={rowId(item, ["ruleId"])} className="border-t border-white/5 text-white/80">
                      <td className="px-4 py-3">{id}</td>
                      <td className="px-4 py-3">{pick(item, ["wasteTypeId"], "-")}</td>
                      <td className="px-4 py-3">
                        <input
                          value={d.basePoint ?? pick(item, ["basePoint"], "")}
                          onChange={(e) =>
                            setDraft((prev) => ({ ...prev, [id]: { ...prev[id], basePoint: e.target.value } }))
                          }
                          className="w-24 rounded-lg bg-white/[0.03] border border-white/10 text-white px-2 py-1.5"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={d.bonusCondition ?? pick(item, ["bonusCondition"], "")}
                          onChange={(e) =>
                            setDraft((prev) => ({ ...prev, [id]: { ...prev[id], bonusCondition: e.target.value } }))
                          }
                          className="w-72 rounded-lg bg-white/[0.03] border border-white/10 text-white px-2 py-1.5"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            disabled={saving[id]}
                            onClick={() => handleSave(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border text-emerald-400 border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15"
                          >
                            {saving[id] ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Luu
                          </button>
                          <button
                            disabled={deleting[id]}
                            onClick={() => handleDelete(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border text-rose-400 border-rose-500/25 bg-rose-500/10 hover:bg-rose-500/15"
                          >
                            {deleting[id] ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Xoa
                          </button>
                        </div>
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
