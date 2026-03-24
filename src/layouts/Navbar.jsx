import {
  Recycle,
  LogOut,
  User as UserIcon,
  UserPlus,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ onMenuToggle, menuOpen }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const roleBadge = {
    Admin: "bg-red-500/20 text-red-300 border-red-500/30",
    Citizen: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    Enterprise: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Collector: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  };

  return (
    <nav className="h-16 bg-[#080d08] border-b border-white/[0.07] flex items-center justify-between px-5 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {user && (
          <button
            onClick={onMenuToggle}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        )}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="relative w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Recycle size={17} className="text-black" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#080d08]" />
          </div>
          <div className="leading-none">
            <div
              className="font-black text-white text-[17px] tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              WASTE<span className="text-emerald-400">CYCLE</span>
            </div>
            <div className="text-[9px] text-white/25 tracking-[0.18em] uppercase font-semibold">
              Platform
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all">
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </button>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1.5 rounded-xl">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-white/90 leading-none mb-1">
                  {user.fullName || "Nguoi dung"}
                </p>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${roleBadge[user.role] || "bg-white/10 text-white/40 border-white/10"}`}
                >
                  {user.role}
                </span>
              </div>
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                <UserIcon size={14} className="text-black" />
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut size={17} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <Link
              to="/login"
              className="px-3 py-2 text-sm font-semibold text-white/50 hover:text-white/90 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-black rounded-xl transition-all shadow-md shadow-emerald-500/25 flex items-center gap-1.5"
            >
              <UserPlus size={14} /> Đăng ký
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
