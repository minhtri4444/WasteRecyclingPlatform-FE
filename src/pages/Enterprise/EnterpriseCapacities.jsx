import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import enterpriseService from "../../apis/enterpriseService";
import { getApiErrorMessage, pick, rowId, toArray } from "./enterpriseHelpers";

const INITIAL_FORM = {
  wasteTypeId: "",
  areaId: "",
  maxCapacityPerDay: "",
};

export default function EnterpriseCapacities() {
  const [capacities, setCapacities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState({});
  const [deleting, setDeleting] = useState({});
  const [draft, setDraft] = useState({});
  const [form, setForm] = useState(INITIAL_FORM);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await enterpriseService.getCapacities();
      setCapacities(toArray(data));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai capacities"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.wasteTypeId || !form.areaId) {
      setError("Vui long nhap wasteTypeId va areaId");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await enterpriseService.createCapacity({
        wasteTypeId: Number(form.wasteTypeId),
        areaId: Number(form.areaId),
        maxCapacityPerDay: form.maxCapacityPerDay === "" ? null : Number(form.maxCapacityPerDay),
      });

      setForm(INITIAL_FORM);
      await fetchData();
    } catch (err) {
      setError(getApiErrorMessage(err, "Tao capacity that bai"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async (item) => {
    const id = pick(item, ["capacityId", "id"], null);
    if (id === null || id === "-") return;

    const d = draft[id] || {};
    if (Object.keys(d).length === 0) return;

    setSaving((prev) => ({ ...prev, [id]: true }));
    setError("");

    try {
      await enterpriseService.updateCapacity(id, {
        wasteTypeId: d.wasteTypeId === undefined || d.wasteTypeId === "" ? undefined : Number(d.wasteTypeId),
        areaId: d.areaId === undefined || d.areaId === "" ? undefined : Number(d.areaId),
        maxCapacityPerDay:
          d.maxCapacityPerDay === undefined || d.maxCapacityPerDay === ""
            ? undefined
            : Number(d.maxCapacityPerDay),
      });

      setCapacities((prev) =>
        prev.map((c) => {
          const cid = pick(c, ["capacityId", "id"], null);
          return cid === id ? { ...c, ...d } : c;
        }),
      );
      setDraft((prev) => ({ ...prev, [id]: {} }));
    } catch (err) {
      setError(getApiErrorMessage(err, "Cap nhat capacity that bai"));
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (item) => {
    const id = pick(item, ["capacityId", "id"], null);
    if (id === null || id === "-") return;

    setDeleting((prev) => ({ ...prev, [id]: true }));
    setError("");

    try {
      await enterpriseService.deleteCapacity(id);
      setCapacities((prev) => prev.filter((c) => pick(c, ["capacityId", "id"], null) !== id));
    } catch (err) {
      setError(getApiErrorMessage(err, "Xoa capacity that bai"));
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Nang luc xu ly</h1>
          <p className="text-white/35 text-sm mt-1">Quan ly capacity theo area va waste type</p>
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
          value={form.areaId}
          onChange={(e) => setForm((prev) => ({ ...prev, areaId: e.target.value }))}
          placeholder="areaId"
          className="rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm px-3 py-2.5 outline-none"
        />
        <input
          value={form.maxCapacityPerDay}
          onChange={(e) => setForm((prev) => ({ ...prev, maxCapacityPerDay: e.target.value }))}
          placeholder="maxCapacityPerDay (optional)"
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
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tao
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
            <Loader2 size={16} className="animate-spin mr-2" /> Dang tai capacities
          </div>
        ) : capacities.length === 0 ? (
          <p className="px-4 py-8 text-white/35 text-sm">Chua co du lieu capacity</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="text-white/45 bg-white/[0.02]">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">ID</th>
                  <th className="text-left px-4 py-3 font-bold">wasteTypeId</th>
                  <th className="text-left px-4 py-3 font-bold">areaId</th>
                  <th className="text-left px-4 py-3 font-bold">max/day</th>
                  <th className="text-left px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {capacities.map((item) => {
                  const id = pick(item, ["capacityId", "id"], "-");
                  const d = draft[id] || {};

                  return (
                    <tr key={rowId(item, ["capacityId"])} className="border-t border-white/5 text-white/80">
                      <td className="px-4 py-3">{id}</td>
                      <td className="px-4 py-3">
                        <input
                          value={d.wasteTypeId ?? pick(item, ["wasteTypeId"], "")}
                          onChange={(e) =>
                            setDraft((prev) => ({ ...prev, [id]: { ...prev[id], wasteTypeId: e.target.value } }))
                          }
                          className="w-24 rounded-lg bg-white/[0.03] border border-white/10 text-white px-2 py-1.5"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={d.areaId ?? pick(item, ["areaId"], "")}
                          onChange={(e) =>
                            setDraft((prev) => ({ ...prev, [id]: { ...prev[id], areaId: e.target.value } }))
                          }
                          className="w-24 rounded-lg bg-white/[0.03] border border-white/10 text-white px-2 py-1.5"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={d.maxCapacityPerDay ?? pick(item, ["maxCapacityPerDay"], "")}
                          onChange={(e) =>
                            setDraft((prev) => ({ ...prev, [id]: { ...prev[id], maxCapacityPerDay: e.target.value } }))
                          }
                          className="w-32 rounded-lg bg-white/[0.03] border border-white/10 text-white px-2 py-1.5"
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
