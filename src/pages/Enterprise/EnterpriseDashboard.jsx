import { useEffect, useMemo, useState } from "react";
import { BarChart3, ClipboardList, Loader2, RefreshCw, Truck, Users } from "lucide-react";
import enterpriseService from "../../apis/enterpriseService";
import { getApiErrorMessage, pick, toArray } from "./enterpriseHelpers";

function Card({ icon: Icon, title, value, color }) {
  return (
    <div className={`rounded-2xl border ${color.border} bg-[#0d120d] p-5`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/35">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.bg}`}>
          <Icon size={18} className={color.text} />
        </div>
      </div>
      <p className={`text-3xl font-black leading-none ${color.text}`}>{value}</p>
    </div>
  );
}

export default function EnterpriseDashboard() {
  const [stats, setStats] = useState({});
  const [pendingReports, setPendingReports] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsRes, pendingRes, assignRes, collectorRes] = await Promise.all([
        enterpriseService.getStats(),
        enterpriseService.getPendingReports(),
        enterpriseService.getAssignments(),
        enterpriseService.getCollectors(),
      ]);

      setStats(statsRes || {});
      setPendingReports(toArray(pendingRes));
      setAssignments(toArray(assignRes));
      setCollectors(toArray(collectorRes));
    } catch (err) {
      setError(getApiErrorMessage(err, "Khong the tai dashboard enterprise"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const computed = useMemo(() => {
    return {
      pending: pick(stats, ["pendingReports", "reportsPending"], pendingReports.length),
      assignments: pick(stats, ["totalAssignments", "assignmentsCount"], assignments.length),
      collectors: pick(stats, ["totalCollectors", "collectorsCount"], collectors.length),
      handled: pick(stats, ["handledReports", "processedReports"], 0),
    };
  }, [assignments.length, collectors.length, pendingReports.length, stats]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Enterprise Dashboard</h1>
          <p className="text-white/35 text-sm mt-1">Tong quan van hanh thu gom va dieu phoi</p>
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
        <Card
          icon={ClipboardList}
          title="Bao cao cho duyet"
          value={loading ? "..." : computed.pending}
          color={{ text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" }}
        />
        <Card
          icon={Truck}
          title="Phan cong"
          value={loading ? "..." : computed.assignments}
          color={{ text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" }}
        />
        <Card
          icon={Users}
          title="Collector"
          value={loading ? "..." : computed.collectors}
          color={{ text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }}
        />
        <Card
          icon={BarChart3}
          title="Bao cao da xu ly"
          value={loading ? "..." : computed.handled}
          color={{ text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" }}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0d120d] p-4">
        <h2 className="text-white font-black text-sm mb-3">Thong so tu API /Enterprise/stats</h2>
        {loading ? (
          <div className="text-white/40 text-sm flex items-center"><Loader2 size={15} className="animate-spin mr-2" /> Dang tai</div>
        ) : Object.keys(stats).length === 0 ? (
          <p className="text-white/35 text-sm">Khong co du lieu thong ke chi tiet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {Object.entries(stats).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <p className="text-white/35 text-[11px] uppercase tracking-wide">{k}</p>
                <p className="text-white font-bold mt-1 break-all">{String(v)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
