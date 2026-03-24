import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Recycle,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Leaf,
} from "lucide-react";
import authService from "../../apis/authService";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  .wc-auth * { box-sizing: border-box; margin: 0; padding: 0; }
  .wc-auth {
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    background: #080c08;
    color: #f0f7f0;
  }

  .wc-auth-grid {
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  .wc-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 12px;
    color: #f0f7f0;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    padding: 13px 14px 13px 44px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .wc-input::placeholder { color: rgba(240,247,240,0.28); }
  .wc-input:focus {
    border-color: rgba(61,220,132,0.40);
    background: rgba(61,220,132,0.04);
    box-shadow: 0 0 0 3px rgba(61,220,132,0.07);
  }

  .wc-btn-primary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px;
    background: #3ddc84;
    color: #03150a;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.18s, transform 0.12s;
  }
  .wc-btn-primary:hover:not(:disabled) { background: #5ee89c; transform: translateY(-1px); }
  .wc-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

  @keyframes wc-rise { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes wc-spin { to { transform: rotate(360deg); } }
  .wc-rise { animation: wc-rise 0.6s cubic-bezier(.22,.61,.36,1) both; }
  .wc-d1 { animation-delay: 0.06s; }
  .wc-d2 { animation-delay: 0.14s; }
  .wc-d3 { animation-delay: 0.24s; }
  .wc-spin { animation: wc-spin 80s linear infinite; }

  .wc-login-left {
    flex: 0 0 48%;
    display: none;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 48px;
    background: linear-gradient(160deg,#0c1f0e 0%, #080c08 100%);
    border-right: 1px solid rgba(255,255,255,0.06);
  }

  @media(min-width: 860px){ .wc-login-left { display: flex; } }
`;

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authService.login(formData);
      localStorage.setItem("user", JSON.stringify(response));
      const role = String(response?.role || "").toLowerCase();
      if (role === "admin" || role === "administrator") navigate("/admin/dashboard");
      else if (role === "enterprise") navigate("/enterprise/pending");
      else if (role === "collector") navigate("/collector/tasks");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Sai email hoặc mật khẩu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="wc-auth wc-auth-grid" style={{ display: "flex", alignItems: "stretch", minHeight: "100vh" }}>
        <div className="wc-login-left">
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "#3ddc84",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(61,220,132,0.35)",
              }}
            >
              <Recycle size={18} color="#03150a" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.03em", color: "#f0f7f0" }}>
              WASTE<span style={{ color: "#3ddc84" }}>CYCLE</span>
            </span>
          </Link>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 24,
                padding: "5px 12px",
                borderRadius: 999,
                background: "rgba(61,220,132,0.09)",
                border: "1px solid rgba(61,220,132,0.20)",
                fontSize: 11,
                fontWeight: 600,
                color: "#3ddc84",
              }}
            >
              <Leaf size={12} /> Vì môi trường Việt Nam xanh sạch đẹp
            </div>
            <h1
              style={{
                fontFamily: "'Inter',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(32px,3.5vw,52px)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#f0f7f0",
                marginBottom: 18,
              }}
            >
              Cùng nhau
              <br />
              <span style={{ color: "#3ddc84" }}>xanh hóa</span>
              <br />
              hành tinh.
            </h1>
            <p style={{ fontSize: 14, color: "rgba(240,247,240,0.45)", lineHeight: 1.75, maxWidth: 340 }}>
              Kết nối người dân với doanh nghiệp tái chế trong một hệ sinh thái minh bạch, hiệu quả và bền vững.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              { v: "1.2M", u: "kg rác", d: "đã thu gom" },
              { v: "450+", u: "yêu cầu", d: "mỗi ngày" },
              { v: "98%", u: "tỷ lệ", d: "hài lòng" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 12px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontWeight: 900,
                    fontSize: 22,
                    letterSpacing: "-0.03em",
                    color: "#3ddc84",
                    lineHeight: 1,
                    marginBottom: 3,
                  }}
                >
                  {s.v}
                </p>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#c8dcc8" }}>{s.u}</p>
                <p style={{ fontSize: 10, color: "rgba(240,247,240,0.30)" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
          <div className="wc-rise" style={{ width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    background: "#3ddc84",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Recycle size={16} color="#03150a" />
                </div>
                <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: "-0.03em", color: "#f0f7f0" }}>
                  WASTE<span style={{ color: "#3ddc84" }}>CYCLE</span>
                </span>
              </Link>
            </div>

            <div className="wc-rise wc-d1" style={{ textAlign: "center", marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontWeight: 900,
                  fontSize: 28,
                  letterSpacing: "-0.03em",
                  color: "#f0f7f0",
                  marginBottom: 6,
                }}
              >
                Đăng nhập
              </h2>
              <p style={{ fontSize: 14, color: "rgba(240,247,240,0.40)", fontWeight: 400 }}>
                Chào mừng trở lại. Vui lòng nhập thông tin của bạn.
              </p>
            </div>

            {error && (
              <div
                style={{
                  marginBottom: 20,
                  padding: "12px 14px",
                  background: "rgba(245,96,122,0.09)",
                  border: "1px solid rgba(245,96,122,0.22)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#f5607a",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "rgba(245,96,122,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  !
                </span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="wc-rise wc-d2">
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(240,247,240,0.40)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 7,
                  }}
                >
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={15}
                    color="rgba(240,247,240,0.28)"
                    style={{ position: "absolute", left: 14, top: "50%", marginTop: -7.5, pointerEvents: "none" }}
                  />
                  <input
                    type="email"
                    required
                    className="wc-input"
                    placeholder="name@example.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(240,247,240,0.40)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 7,
                  }}
                >
                  Mật khẩu
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={15}
                    color="rgba(240,247,240,0.28)"
                    style={{ position: "absolute", left: 14, top: "50%", marginTop: -7.5, pointerEvents: "none" }}
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    className="wc-input"
                    style={{ paddingRight: 44 }}
                    placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      marginTop: -8,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(240,247,240,0.30)",
                      padding: 0,
                      lineHeight: 1,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "rgba(240,247,240,0.70)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(240,247,240,0.30)";
                    }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="wc-btn-primary">
                {loading ? (
                  <Loader2 size={18} style={{ animation: "wc-spin 0.8s linear infinite" }} />
                ) : (
                  <>
                    <span>Đăng Nhập</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="wc-rise wc-d3" style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: 12, color: "rgba(240,247,240,0.22)" }}>hoặc</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            <p className="wc-rise wc-d3" style={{ textAlign: "center", fontSize: 14, color: "rgba(240,247,240,0.40)" }}>
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                style={{ color: "#3ddc84", fontWeight: 700, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#5ee89c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#3ddc84";
                }}
              >
                Đăng ký ngay →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
