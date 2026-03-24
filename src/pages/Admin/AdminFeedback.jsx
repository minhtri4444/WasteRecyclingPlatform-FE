import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Save } from "lucide-react";
import adminService from "../../apis/adminService";
import { formatDate, getApiErrorMessage, pick, rowId, toArray } from "./adminHelpers";

const DEFAULT_STATUSES = ["Pending", "InProgress", "Resolved", "Rejected"];

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draftStatus, setDraftStatus] = useState({});
  const [saving, setSaving] = useState({});

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminService.getFeedbacks();
      setFeedbacks(toArray(data));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai danh sach feedback"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const statusOptions = useMemo(() => {
    const fromData = feedbacks
      .map((f) => String(pick(f, ["status"], "")).trim())
      .filter(Boolean);

    return [...new Set([...DEFAULT_STATUSES, ...fromData])];
  }, [feedbacks]);

  const handleSaveStatus = async (feedback) => {
    const id = pick(feedback, ["feedbackId", "id"], null);
    if (id === null || id === "-") return;

    const currentStatus = String(pick(feedback, ["status"], ""));
    const nextStatus = draftStatus[id] ?? currentStatus;
    if (!nextStatus || nextStatus === currentStatus) return;

    setSaving((prev) => ({ ...prev, [id]: true }));

    try {
      await adminService.updateFeedback(id, { status: nextStatus });

      setFeedbacks((prev) =>
        prev.map((item) => {
          const fid = pick(item, ["feedbackId", "id"], null);
          return fid === id ? { ...item, status: nextStatus } : item;
        }),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Cap nhat feedback that bai"));
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Feedback va khieu nai</h1>
          <p className="text-white/35 text-sm mt-1">Theo doi trang thai xu ly phan hoi tu nguoi dung</p>
        </div>

        <button
          onClick={fetchFeedbacks}
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
            <Loader2 size={16} className="animate-spin mr-2" /> Dang tai feedback
          </div>
        ) : feedbacks.length === 0 ? (
          <p className="px-4 py-8 text-white/35 text-sm">Chua co feedback</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="text-white/45 bg-white/[0.02]">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">ID</th>
                  <th className="text-left px-4 py-3 font-bold">Noi dung</th>
                  <th className="text-left px-4 py-3 font-bold">Report</th>
                  <th className="text-left px-4 py-3 font-bold">Nguoi gui</th>
                  <th className="text-left px-4 py-3 font-bold">Ngay tao</th>
                  <th className="text-left px-4 py-3 font-bold">Trang thai</th>
                  <th className="text-left px-4 py-3 font-bold">Hanh dong</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((item) => {
                  const id = pick(item, ["feedbackId", "id"], "-");
                  const currentStatus = String(pick(item, ["status"], "Pending"));
                  const nextStatus = draftStatus[id] ?? currentStatus;
                  const dirty = nextStatus !== currentStatus;

                  return (
                    <tr key={rowId(item, ["feedbackId"])} className="border-t border-white/5 text-white/80 align-top">
                      <td className="px-4 py-3">{id}</td>
                      <td className="px-4 py-3 max-w-[420px]">
                        <p className="line-clamp-3">{pick(item, ["content", "message", "description"], "-")}</p>
                      </td>
                      <td className="px-4 py-3">{pick(item, ["reportId"], "-")}</td>
                      <td className="px-4 py-3">{pick(item, ["citizenName", "createdBy", "fullName"], "-")}</td>
                      <td className="px-4 py-3">{formatDate(pick(item, ["createdAt"], null))}</td>
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
                          onClick={() => handleSaveStatus(item)}
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
