import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import adminService from "../../apis/adminService";
import { getApiErrorMessage, pick, rowId, toArray } from "./adminHelpers";

export default function AdminWasteTypes() {
  const [wasteTypes, setWasteTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWasteTypes = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminService.getWasteTypes();
      setWasteTypes(toArray(data));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai danh sach loai rac"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteTypes();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Loai rac thai</h1>
          <p className="text-white/35 text-sm mt-1">Danh muc loai rac su dung trong he thong</p>
        </div>

        <button
          onClick={fetchWasteTypes}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/25 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 text-sm font-bold"
        >
          <RefreshCw size={14} /> Lam moi
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0d120d] overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-white/40 text-sm">
            <Loader2 size={16} className="animate-spin mr-2" /> Dang tai loai rac
          </div>
        ) : wasteTypes.length === 0 ? (
          <p className="px-4 py-8 text-white/35 text-sm">Chua co loai rac nao</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/45 bg-white/[0.02]">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">ID</th>
                  <th className="text-left px-4 py-3 font-bold">Ten loai rac</th>
                  <th className="text-left px-4 py-3 font-bold">Mo ta</th>
                </tr>
              </thead>
              <tbody>
                {wasteTypes.map((item) => (
                  <tr key={rowId(item, ["wasteTypeId"])} className="border-t border-white/5 text-white/80">
                    <td className="px-4 py-3">{pick(item, ["wasteTypeId", "id"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["wasteTypeName", "name"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["description"], "-")}</td>
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
