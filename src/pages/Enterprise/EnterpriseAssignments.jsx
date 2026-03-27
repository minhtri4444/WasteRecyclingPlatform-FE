import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import enterpriseService from "../../apis/enterpriseService";
import { formatDate, getApiErrorMessage, pick, rowId, toArray } from "./enterpriseHelpers";

const INITIAL_FORM = {
  reportId: "",
  collectorId: "",
};


export default function EnterpriseAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  const fetchAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await enterpriseService.getAssignments();
      setAssignments(toArray(data));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai danh sach assignments"));
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReports = async () => {
    setLoadingPending(true);
    try {
      const data = await enterpriseService.getPendingReports();
      setPendingReports(toArray(data));
    } catch (err) {
      // Không cần setError chung, chỉ log
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchPendingReports();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.reportId || !form.collectorId) {
      setError("Vui long nhap reportId va collectorId");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await enterpriseService.createAssignment({
        reportId: Number(form.reportId),
        collectorId: Number(form.collectorId),
      });
      setForm(INITIAL_FORM);
      await fetchAssignments();
    } catch (err) {
      setError(getApiErrorMessage(err, "Tao assignment that bai"));
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Điều phối Collector</h1>
          <p className="text-white/35 text-sm mt-1">Tạo và theo dõi assignment giữa report và collector</p>
        </div>
        <button
          onClick={() => { fetchAssignments(); fetchPendingReports(); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/25 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 text-sm font-bold"
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      {/* Bảng rác chờ duyệt */}
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 overflow-hidden">
        <div className="px-4 py-3 font-bold text-yellow-400 text-base">Rác chờ duyệt (Pending Reports)</div>
        {loadingPending ? (
          <div className="py-8 flex items-center justify-center text-yellow-400/60 text-sm">
            <Loader2 size={16} className="animate-spin mr-2" /> Đang tải pending reports
          </div>
        ) : pendingReports.length === 0 ? (
          <p className="px-4 py-6 text-yellow-400/50 text-sm">Không có rác chờ duyệt</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="text-yellow-700 bg-yellow-100/10">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Report ID</th>
                  <th className="text-left px-4 py-3 font-bold">Người báo cáo</th>
                  <th className="text-left px-4 py-3 font-bold">Loại rác</th>
                  <th className="text-left px-4 py-3 font-bold">Mô tả</th>
                  <th className="text-left px-4 py-3 font-bold">Ngày tạo</th>
                  <th className="text-left px-4 py-3 font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {pendingReports.map((item) => (
                  <tr key={rowId(item, ["reportId"])} className="border-t border-yellow-400/10 text-yellow-900">
                    <td className="px-4 py-3">{pick(item, ["reportId", "id"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["citizenName"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["wasteTypeName"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["description"], "-")}</td>
                    <td className="px-4 py-3">{formatDate(pick(item, ["createdAt"], null))}</td>
                    <td className="px-4 py-3">{pick(item, ["status"], "-")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-white/10 bg-[#0d120d] p-4 grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        <input
          value={form.reportId}
          onChange={(e) => setForm((prev) => ({ ...prev, reportId: e.target.value }))}
          placeholder="reportId"
          className="rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm px-3 py-2.5 outline-none"
        />
        <input
          value={form.collectorId}
          onChange={(e) => setForm((prev) => ({ ...prev, collectorId: e.target.value }))}
          placeholder="collectorId"
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
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Tao assignment
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
            <Loader2 size={16} className="animate-spin mr-2" /> Dang tai assignments
          </div>
        ) : assignments.length === 0 ? (
          <p className="px-4 py-8 text-white/35 text-sm">Chua co assignment nao</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="text-white/45 bg-white/[0.02]">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Assignment ID</th>
                  <th className="text-left px-4 py-3 font-bold">Report ID</th>
                  <th className="text-left px-4 py-3 font-bold">Collector ID</th>
                  <th className="text-left px-4 py-3 font-bold">Status</th>
                  <th className="text-left px-4 py-3 font-bold">Assigned At</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((item) => (
                  <tr key={rowId(item, ["assignmentId"])} className="border-t border-white/5 text-white/80">
                    <td className="px-4 py-3">{pick(item, ["assignmentId", "id"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["reportId"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["collectorId"], "-")}</td>
                    <td className="px-4 py-3">{pick(item, ["status"], "-")}</td>
                    <td className="px-4 py-3">{formatDate(pick(item, ["assignedAt", "createdAt"], null))}</td>
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
