import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import adminService from "../../apis/adminService";
import { getApiErrorMessage, pick, rowId, toArray } from "./adminHelpers";

const INITIAL_FORM = {
  areaName: "",
  city: "",
};

export default function AdminAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  const fetchAreas = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminService.getServiceAreas();
      setAreas(toArray(data));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai danh sach khu vuc"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.areaName.trim() || !form.city.trim()) {
      setError("Vui long nhap day du ten khu vuc va thanh pho");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await adminService.createServiceArea({
        areaName: form.areaName.trim(),
        city: form.city.trim(),
      });

      setForm(INITIAL_FORM);
      await fetchAreas();
    } catch (err) {
      setError(getApiErrorMessage(err, "Tao khu vuc that bai"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Khu vuc dich vu</h1>
          <p className="text-white/35 text-sm mt-1">Quan ly danh sach khu vuc thu gom tai che</p>
        </div>

        <button
          onClick={fetchAreas}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/25 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 text-sm font-bold"
        >
          <RefreshCw size={14} /> Lam moi
        </button>
      </div>

      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-white/10 bg-[#0d120d] p-4 grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        <input
          value={form.areaName}
          onChange={(e) => setForm((prev) => ({ ...prev, areaName: e.target.value }))}
          placeholder="Ten khu vuc"
          className="rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-emerald-500/40"
        />
        <input
          value={form.city}
          onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
          placeholder="Thanh pho"
          className="rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-emerald-500/40"
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
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tao khu vuc
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
            <Loader2 size={16} className="animate-spin mr-2" /> Dang tai khu vuc
          </div>
        ) : areas.length === 0 ? (
          <p className="px-4 py-8 text-white/35 text-sm">Chua co khu vuc nao</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/45 bg-white/[0.02]">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">ID</th>
                  <th className="text-left px-4 py-3 font-bold">Ten khu vuc</th>
                  <th className="text-left px-4 py-3 font-bold">Thanh pho</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((item) => (
                  <tr key={rowId(item, ["areaId"])} className="border-t border-white/5 text-white/80">
                    <td className="px-4 py-3">{pick(item, ["areaId", "id"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["areaName", "name"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["city"], "-")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
