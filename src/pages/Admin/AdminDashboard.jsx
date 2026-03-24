import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Users,
  MessageSquareWarning,
  ClipboardList,
  Loader2,
  RefreshCw,
} from "lucide-react";
import adminService from "../../apis/adminService";
import { formatDate, getApiErrorMessage, pick, rowId, toArray } from "./adminHelpers";

function StatCard({ title, value, icon: Icon, tone }) {
  return (
    <div
      className={`rounded-2xl border p-5 bg-[#0d120d] ${tone.border}`}
      style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.22)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/35">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone.bg}`}>
          <Icon size={18} className={tone.text} />
        </div>
      </div>
      <p className={`text-3xl font-black leading-none ${tone.text}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsRes, usersRes, feedbacksRes, reportsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getFeedbacks(),
        adminService.getReports(),
      ]);

      setStats(statsRes || {});
      setUsers(toArray(usersRes));
      setFeedbacks(toArray(feedbacksRes));
      setReports(toArray(reportsRes));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai du lieu dashboard Admin"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const overview = useMemo(() => {
    const pendingReports = reports.filter((r) =>
      String(pick(r, ["status"], "")).toLowerCase().includes("pending"),
    ).length;

    const unresolvedFeedbacks = feedbacks.filter((f) => {
      const status = String(pick(f, ["status"], "")).toLowerCase();
      return !status || status.includes("pending") || status.includes("open");
    }).length;

    return {
      totalUsers: pick(stats, ["totalUsers", "usersCount", "userCount"], users.length),
      totalReports: pick(stats, ["totalReports", "reportsCount", "reportCount"], reports.length),
      pendingReports: pick(stats, ["pendingReports", "reportsPending"], pendingReports),
      openFeedbacks: pick(
        stats,
        ["openFeedbacks", "pendingFeedbacks", "feedbackPending"],
        unresolvedFeedbacks,
      ),
    };
  }, [feedbacks, reports, stats, users.length]);

  const recentReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => {
        const da = new Date(pick(a, ["createdAt", "reportedAt"], 0)).getTime();
        const db = new Date(pick(b, ["createdAt", "reportedAt"], 0)).getTime();
        return db - da;
      })
      .slice(0, 5);
  }, [reports]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-white/35 text-sm mt-1">Tong quan van hanh he thong tai che</p>
        </div>
        <button
          onClick={fetchData}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          title="Tong nguoi dung"
          value={loading ? "..." : overview.totalUsers}
          icon={Users}
          tone={{
            text: "text-sky-400",
            bg: "bg-sky-500/10",
            border: "border-sky-500/20",
          }}
        />
        <StatCard
          title="Tong bao cao"
          value={loading ? "..." : overview.totalReports}
          icon={ClipboardList}
          tone={{
            text: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          }}
        />
        <StatCard
          title="Bao cao cho xu ly"
          value={loading ? "..." : overview.pendingReports}
          icon={BarChart3}
          tone={{
            text: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
          }}
        />
        <StatCard
          title="Feedback chua dong"
          value={loading ? "..." : overview.openFeedbacks}
          icon={MessageSquareWarning}
          tone={{
            text: "text-rose-400",
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
          }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[#0d120d] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-white font-black text-sm tracking-wide">Bao cao gan day</h2>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center text-white/40 text-sm">
              <Loader2 size={16} className="animate-spin mr-2" /> Dang tai du lieu
            </div>
          ) : recentReports.length === 0 ? (
            <p className="px-4 py-8 text-white/35 text-sm">Chua co du lieu bao cao</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-white/45 bg-white/[0.02]">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold">Ma</th>
                    <th className="text-left px-4 py-3 font-bold">Nguoi gui</th>
                    <th className="text-left px-4 py-3 font-bold">Trang thai</th>
                    <th className="text-left px-4 py-3 font-bold">Thoi gian</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((r) => (
                    <tr key={rowId(r)} className="border-t border-white/5 text-white/80">
                      <td className="px-4 py-3">{pick(r, ["reportId", "id"], "-")}</td>
                      <td className="px-4 py-3">{pick(r, ["citizenName", "createdBy", "fullName"], "-")}</td>
                      <td className="px-4 py-3">{pick(r, ["status"], "-")}</td>
                      <td className="px-4 py-3">{formatDate(pick(r, ["createdAt", "reportedAt"], null))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d120d] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-white font-black text-sm tracking-wide">Chi so chi tiet</h2>
          </div>

          <div className="p-3 space-y-2 max-h-[380px] overflow-auto">
            {Object.keys(stats || {}).length === 0 ? (
              <p className="text-white/35 text-sm px-1 py-2">Khong co chi so chi tiet</p>
            ) : (
              Object.entries(stats).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2">
                  <p className="text-white/35 text-[11px] uppercase tracking-wider">{key}</p>
                  <p className="text-white font-bold text-sm mt-1 break-all">{String(value)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
