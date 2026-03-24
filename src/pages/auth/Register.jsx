import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Factory,
  Truck,
  Mail,
  Lock,
  Phone,
  UserCircle,
  MapPin,
  Info,
  ArrowLeft,
  Loader2,
  Recycle,
} from "lucide-react";
import authService from "../../apis/authService";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  .wc-register * { box-sizing: border-box; }
  .wc-register {
    font-family: 'Inter', -apple-system, sans-serif;
    min-height: 100vh;
    background: #080c08;
    color: #f0f7f0;
    -webkit-font-smoothing: antialiased;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  .wc-panel {
    width: 100%;
    max-width: 860px;
    background: rgba(12, 18, 12, 0.96);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 22px;
    box-shadow: 0 16px 70px rgba(0, 0, 0, 0.35);
    padding: 28px;
  }

  .wc-role-tab {
    flex: 1;
    border: 1px solid transparent;
    border-radius: 11px;
    background: transparent;
    color: rgba(240,247,240,0.45);
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    padding: 11px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: all .18s;
  }
  .wc-role-tab:hover { color: rgba(240,247,240,0.80); }
  .wc-role-tab.active {
    background: rgba(61,220,132,0.10);
    border-color: rgba(61,220,132,0.22);
    color: #3ddc84;
  }

  .wc-input-wrap { position: relative; }
  .wc-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(240,247,240,0.28);
    pointer-events: none;
  }

  .wc-input,
  .wc-textarea {
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.04);
    color: #f0f7f0;
    outline: none;
    transition: border-color .18s, box-shadow .18s, background .18s;
    font-size: 14px;
  }

  .wc-input {
    padding: 13px 14px 13px 44px;
  }

  .wc-textarea {
    min-height: 96px;
    resize: vertical;
    padding: 12px 14px 12px 44px;
  }

  .wc-input::placeholder,
  .wc-textarea::placeholder {
    color: rgba(240,247,240,0.28);
  }

  .wc-input:focus,
  .wc-textarea:focus {
    border-color: rgba(61,220,132,0.4);
    background: rgba(61,220,132,0.05);
    box-shadow: 0 0 0 3px rgba(61,220,132,0.08);
  }

  .wc-submit {
    width: 100%;
    border: none;
    border-radius: 12px;
    background: #3ddc84;
    color: #03150a;
    padding: 14px;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    transition: background .18s, transform .12s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .wc-submit:hover:not(:disabled) { background: #5ee89c; transform: translateY(-1px); }
  .wc-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin .8s linear infinite; }

  @media(max-width: 768px) {
    .wc-panel { padding: 20px; border-radius: 18px; }
  }
`;

export default function Register() {
  const [role, setRole] = useState("Citizen");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getApiErrorMessage = (err) => {
    const data = err?.response?.data;

    if (typeof data === "string") return data;
    if (data?.message && typeof data.message === "string") return data.message;

    if (data?.errors && typeof data.errors === "object") {
      const messages = Object.values(data.errors)
        .flat()
        .filter((msg) => typeof msg === "string");

      if (messages.length > 0) return messages.join(" ");
    }

    if (data?.title && typeof data.title === "string") return data.title;
    return "Đã xảy ra lỗi khi đăng ký.";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "enterpriseId" ? (value === "" ? "" : parseInt(value, 10)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let response;
      const submitData = { ...formData, role };

      if (role === "Citizen") {
        const citizenPayload = {
          fullName: submitData.fullName?.trim() || "",
          email: submitData.email?.trim() || "",
          password: submitData.password || "",
          phone: submitData.phone?.trim() || "",
          role: "Citizen",
        };
        response = await authService.registerCitizen(citizenPayload);
      }
      else if (role === "Enterprise") response = await authService.registerEnterprise(submitData);
      else if (role === "Collector") response = await authService.registerCollector(submitData);

      if (response && typeof response === "object" && response.role) {
        localStorage.setItem("user", JSON.stringify(response));
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="wc-register" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div className="wc-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
            <Link
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(240,247,240,0.55)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={15} /> Quay lại đăng nhập
            </Link>

            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "#3ddc84",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Recycle size={15} color="#03150a" />
              </div>
              <span style={{ fontWeight: 900, fontSize: 14, letterSpacing: "-0.03em", color: "#f0f7f0" }}>
                WASTE<span style={{ color: "#3ddc84" }}>CYCLE</span>
              </span>
            </Link>
          </div>

          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 6 }}>
              Tạo tài khoản mới
            </h2>
            <p style={{ color: "rgba(240,247,240,0.42)", fontSize: 14 }}>
              Tham gia cộng đồng bảo vệ môi trường
            </p>
          </div>

          {error && (
            <div
              style={{
                marginBottom: 16,
                background: "rgba(245,96,122,0.09)",
                border: "1px solid rgba(245,96,122,0.22)",
                color: "#f5607a",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 8,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: 4,
              marginBottom: 20,
            }}
          >
            {[
              { id: "Citizen", icon: <User size={15} />, label: "Dân cư" },
              { id: "Enterprise", icon: <Factory size={15} />, label: "Doanh nghiệp" },
              { id: "Collector", icon: <Truck size={15} />, label: "Thu gom" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setRole(tab.id);
                  setFormData({});
                  setError("");
                }}
                className={`wc-role-tab ${role === tab.id ? "active" : ""}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
            <div className="wc-input-wrap" style={{ gridColumn: "span 1" }}>
              <UserCircle className="wc-input-icon" size={16} />
              <input name="fullName" required placeholder="Họ và tên" className="wc-input" onChange={handleInputChange} />
            </div>

            <div className="wc-input-wrap" style={{ gridColumn: "span 1" }}>
              <Mail className="wc-input-icon" size={16} />
              <input name="email" type="email" required placeholder="Email liên hệ" className="wc-input" onChange={handleInputChange} />
            </div>

            <div className="wc-input-wrap" style={{ gridColumn: "span 1" }}>
              <Lock className="wc-input-icon" size={16} />
              <input name="password" type="password" required placeholder="Mật khẩu" className="wc-input" onChange={handleInputChange} />
            </div>

            <div className="wc-input-wrap" style={{ gridColumn: "span 1" }}>
              <Phone className="wc-input-icon" size={16} />
              <input name="phone" required placeholder="Số điện thoại" className="wc-input" onChange={handleInputChange} />
            </div>

            {role === "Enterprise" && (
              <>
                <div className="wc-input-wrap" style={{ gridColumn: "1 / -1" }}>
                  <Factory className="wc-input-icon" size={16} />
                  <input
                    name="companyName"
                    required
                    placeholder="Tên doanh nghiệp tái chế"
                    className="wc-input"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="wc-input-wrap" style={{ gridColumn: "1 / -1" }}>
                  <MapPin className="wc-input-icon" size={16} />
                  <input name="address" required placeholder="Địa chỉ trụ sở" className="wc-input" onChange={handleInputChange} />
                </div>

                <div className="wc-input-wrap" style={{ gridColumn: "1 / -1" }}>
                  <Info className="wc-input-icon" size={16} style={{ top: 16, transform: "none" }} />
                  <textarea
                    name="companyDescription"
                    placeholder="Mô tả ngắn về doanh nghiệp..."
                    className="wc-textarea"
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {role === "Collector" && (
              <div className="wc-input-wrap" style={{ gridColumn: "1 / -1" }}>
                <Factory className="wc-input-icon" size={16} />
                <input
                  name="enterpriseId"
                  type="number"
                  required
                  placeholder="Nhập ID Doanh nghiệp quản lý (Enterprise ID)"
                  className="wc-input"
                  onChange={handleInputChange}
                />
                <p style={{ marginTop: 6, marginLeft: 2, fontSize: 11, color: "rgba(61,184,245,0.75)" }}>
                  * Collector phải thuộc về một doanh nghiệp tái chế đã đăng ký.
                </p>
              </div>
            )}

            <button type="submit" disabled={loading} className="wc-submit" style={{ gridColumn: "1 / -1", marginTop: 8 }}>
              {loading ? <Loader2 className="spin" size={18} /> : `Đăng ký làm ${role}`}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media(max-width: 768px){
          .wc-register form { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
