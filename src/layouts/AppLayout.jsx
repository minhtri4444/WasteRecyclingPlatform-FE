import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&family=Syne:wght@700;800&display=swap');`;

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "#0b0f0b" }}
    >
      <style>{FONTS}</style>
      <Navbar onMenuToggle={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
      <div className="flex">
        {user && <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />}
        <main
          className={`flex-1 min-h-[calc(100vh-64px)] overflow-x-hidden bg-[#0f140f] ${user ? "p-5 lg:p-8" : ""}`}
        >
          <div className={user ? "max-w-7xl mx-auto" : ""}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
