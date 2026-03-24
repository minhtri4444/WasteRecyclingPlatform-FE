import { useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import enterpriseService from "../../apis/enterpriseService";
import { formatDate, getApiErrorMessage, pick, rowId, toArray } from "./enterpriseHelpers";

export default function EnterprisePending() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  const fetchReports = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await enterpriseService.getPendingReports();
      setReports(toArray(data));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai bao cao cho duyet"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (report, action) => {
    const reportId = pick(report, ["reportId", "id"], null);
    if (reportId === null || reportId === "-") return;

    setActionLoading((prev) => ({ ...prev, [reportId]: true }));
    setError("");

    try {
      if (action === "accept") await enterpriseService.acceptReport(reportId);
      else await enterpriseService.rejectReport(reportId);

      setReports((prev) =>
        prev.filter((r) => pick(r, ["reportId", "id"], null) !== reportId),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Xu ly bao cao that bai"));
    } finally {
      setActionLoading((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Bao cao cho duyet</h1>
          <p className="text-white/35 text-sm mt-1">Danh sach bao cao cho phe duyet hoac tu choi</p>
        </div>

        <button
          onClick={fetchReports}
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
            <Loader2 size={16} className="animate-spin mr-2" /> Dang tai bao cao
          </div>
        ) : reports.length === 0 ? (
          <p className="px-4 py-8 text-white/35 text-sm">Khong co bao cao dang cho</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="text-white/45 bg-white/[0.02]">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">ID</th>
                  <th className="text-left px-4 py-3 font-bold">Mo ta</th>
                  <th className="text-left px-4 py-3 font-bold">Loai rac</th>
                  <th className="text-left px-4 py-3 font-bold">Nguoi gui</th>
                  <th className="text-left px-4 py-3 font-bold">Thoi gian</th>
                  <th className="text-left px-4 py-3 font-bold">Hanh dong</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  const reportId = pick(report, ["reportId", "id"], "-");
                  const busy = !!actionLoading[reportId];

                  return (
                    <tr key={rowId(report, ["reportId"])} className="border-t border-white/5 text-white/80 align-top">
                      <td className="px-4 py-3">{reportId}</td>
                      <td className="px-4 py-3 max-w-[420px]">{pick(report, ["description"], "-")}</td>
                      <td className="px-4 py-3">{pick(report, ["wasteTypeName", "wasteType"], "-")}</td>
                      <td className="px-4 py-3">{pick(report, ["citizenName", "createdBy", "fullName"], "-")}</td>
                      <td className="px-4 py-3">{formatDate(pick(report, ["createdAt", "reportedAt"], null))}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            disabled={busy}
                            onClick={() => handleAction(report, "accept")}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                              busy
                                ? "text-white/35 border-white/10 bg-white/[0.02] cursor-not-allowed"
                                : "text-emerald-400 border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15"
                            }`}
                          >
                            {busy ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Duyet
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => handleAction(report, "reject")}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                              busy
                                ? "text-white/35 border-white/10 bg-white/[0.02] cursor-not-allowed"
                                : "text-rose-400 border-rose-500/25 bg-rose-500/10 hover:bg-rose-500/15"
                            }`}
                          >
                            {busy ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />} Tu choi
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
