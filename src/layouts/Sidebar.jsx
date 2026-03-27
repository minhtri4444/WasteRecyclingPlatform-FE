import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Leaf } from "lucide-react";
import { menuConfig } from "./menuConfig";

const menuGroups = {
  Admin: [
    { groupLabel: "Tổng quan", items: ["Thống kê hệ thống"] },
    {
      groupLabel: "Quản lý",
      items: ["Quản lý người dùng", "Khu vực dịch vụ", "Loại rác thải"],
    },
    { groupLabel: "Hỗ trợ", items: ["Phản hồi & Khiếu nại"] },
  ],
  Citizen: [
    { groupLabel: "Hoạt động", items: ["Tổng quan", "Báo cáo của tôi"] },
    
    { groupLabel: "Hỗ trợ", items: ["Phản hồi của tôi"] },
  ],
  Enterprise: [
    { groupLabel: "Tổng quan", items: ["Tổng quan"] },
    {
      groupLabel: "Vận hành",
      items: ["Năng lực xử lý", "Rác chờ duyệt", "Điều phối Collector"],
    },
    {
      groupLabel: "Nhân sự & Cấu hình",
      items: ["Quản lý Collector", "Quy tắc thưởng"],
    },
  ],
  Collector: [
    { groupLabel: "Công việc", items: ["Nhiệm vụ thu gom"] },
  
  ],
};

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }
  if (!user) return null;

  const allItems = menuConfig[user.role] || [];
  const groups = menuGroups[user.role] || [
    { groupLabel: null, items: allItems.map((i) => i.label) },
  ];
  const itemByLabel = Object.fromEntries(allItems.map((item) => [item.label, item]));

  return (
    <>
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}
      <aside
        className={`
        fixed md:sticky top-16 left-0 z-40
        w-56 h-[calc(100vh-64px)] bg-[#080d08] border-r border-white/[0.07]
        flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <nav className="flex-1 px-2.5 overflow-y-auto py-3 space-y-4">
          {groups.map((group, gi) => (
            <div key={gi}>
              {group.groupLabel && (
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.28em] px-3 mb-1.5">
                  {group.groupLabel}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((label) => {
                  const item = itemByLabel[label];
                  if (!item) return null;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                        ${
                          active
                            ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/20"
                            : "text-white/35 hover:text-white/75 hover:bg-white/[0.04] border border-transparent"
                        }`}
                    >
                      <span
                        className={
                          active
                            ? "text-emerald-400"
                            : "text-white/25 group-hover:text-white/50 transition-colors"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 leading-tight">{item.label}</span>
                      {active && (
                        <ChevronRight
                          size={13}
                          className="text-emerald-400/50 flex-shrink-0"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Leaf size={13} className="text-black" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white/75 truncate">
                {user.fullName || "Người dùng"}
              </p>
              <p className="text-[10px] text-white/25 truncate">{user.email || "-"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
