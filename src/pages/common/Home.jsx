import {
  Recycle,
  Truck,
  Award,
  ShieldCheck,
  ArrowRight,
  Leaf,
  Globe,
  Zap,
  MapPin,
  BarChart3,
  ClipboardList,
  Trash2,
  CheckCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const STATS = [
  {
    value: "1.2M",
    unit: "kg",
    label: "Rác đã thu gom",
    sub: "Giảm thiểu ô nhiễm môi trường",
    Icon: Globe,
    accent: "#3ddc84",
    bg: "rgba(61,220,132,0.08)",
    border: "rgba(61,220,132,0.15)",
  },
  {
    value: "450+",
    unit: "",
    label: "Yêu cầu mỗi ngày",
    sub: "Xử lý nhanh trong 24h",
    Icon: Zap,
    accent: "#f5a623",
    bg: "rgba(245,166,35,0.08)",
    border: "rgba(245,166,35,0.15)",
  },
  {
    value: "150K",
    unit: "pts",
    label: "Điểm thưởng",
    sub: "Đã quy đổi cho người dùng",
    Icon: Award,
    accent: "#9b7ff4",
    bg: "rgba(155,127,244,0.08)",
    border: "rgba(155,127,244,0.15)",
  },
  {
    value: "98%",
    unit: "",
    label: "Hài lòng",
    sub: "Phản hồi từ người dùng",
    Icon: Star,
    accent: "#3db8f5",
    bg: "rgba(61,184,245,0.08)",
    border: "rgba(61,184,245,0.15)",
  },
];

const FEATURES = [
  {
    Icon: ClipboardList,
    title: "Báo cáo thông minh",
    desc: "Gửi ảnh + GPS + mô tả rác thải chỉ trong 30 giây. AI hỗ trợ phân loại tự động.",
    tag: "Citizen",
    accent: "#3ddc84",
    bg: "rgba(61,220,132,0.07)",
    border: "rgba(61,220,132,0.13)",
  },
  {
    Icon: Truck,
    title: "Thu gom thời gian thực",
    desc: "Collector nhận nhiệm vụ, cập nhật trạng thái trực tiếp từ hiện trường.",
    tag: "Collector",
    accent: "#3db8f5",
    bg: "rgba(61,184,245,0.07)",
    border: "rgba(61,184,245,0.13)",
  },
  {
    Icon: BarChart3,
    title: "Phân tích & báo cáo",
    desc: "Dashboard theo dõi lượng rác, khu vực nóng, hiệu suất tái chế theo thời gian.",
    tag: "Enterprise",
    accent: "#f5a623",
    bg: "rgba(245,166,35,0.07)",
    border: "rgba(245,166,35,0.13)",
  },
  {
    Icon: Award,
    title: "Hệ thống điểm thưởng",
    desc: "Gamification khuyến khích người dân phân loại đúng và báo cáo đều đặn.",
    tag: "Citizen",
    accent: "#9b7ff4",
    bg: "rgba(155,127,244,0.07)",
    border: "rgba(155,127,244,0.13)",
  },
  {
    Icon: ShieldCheck,
    title: "Xác minh & minh bạch",
    desc: "Toàn bộ quy trình từ báo cáo đến tái chế được ghi nhận và kiểm chứng.",
    tag: "Admin",
    accent: "#f5607a",
    bg: "rgba(245,96,122,0.07)",
    border: "rgba(245,96,122,0.13)",
  },
  {
    Icon: MapPin,
    title: "Bản đồ khu vực",
    desc: "Xem điểm thu gom, khu vực phủ sóng và tình trạng rác theo từng quận/huyện.",
    tag: "Tất cả",
    accent: "#2dd4bf",
    bg: "rgba(45,212,191,0.07)",
    border: "rgba(45,212,191,0.13)",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Phát hiện rác",
    desc: "Người dân chụp ảnh và gửi báo cáo với vị trí GPS",
  },
  {
    num: "02",
    title: "Phân loại & duyệt",
    desc: "AI hỗ trợ phân loại, doanh nghiệp xác nhận xử lý",
  },
  {
    num: "03",
    title: "Điều phối thu gom",
    desc: "Collector được phân công và di chuyển đến điểm thu gom",
  },
  {
    num: "04",
    title: "Tái chế & thưởng",
    desc: "Rác được tái chế, điểm thưởng tự động trao cho người báo cáo",
  },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  .wc-home * { box-sizing: border-box; margin: 0; padding: 0; }
  .wc-home {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #080c08;
    color: #f0f7f0;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .wc-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  @keyframes wc-rise { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes wc-spin { to { transform: rotate(360deg); } }
  @keyframes wc-glow {
    0%,100% { box-shadow: 0 0 18px rgba(61,220,132,0.30); }
    50% { box-shadow: 0 0 42px rgba(61,220,132,0.55); }
  }
  @keyframes wc-float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-18px); }
  }

  .wc-rise { animation: wc-rise 0.65s cubic-bezier(.22,.61,.36,1) both; }
  .wc-d1 { animation-delay: 0.08s; }
  .wc-d2 { animation-delay: 0.18s; }
  .wc-d3 { animation-delay: 0.30s; }
  .wc-d4 { animation-delay: 0.42s; }
  .wc-spin { animation: wc-spin 80s linear infinite; }
  .wc-glow { animation: wc-glow 3s ease-in-out infinite; }
  .wc-float { animation: wc-float 10s ease-in-out infinite; }

  .wc-h1 {
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: clamp(30px, 4.2vw, 64px);
    line-height: 1.04;
    letter-spacing: -0.03em;
    color: #f0f7f0;
    white-space: nowrap;
  }
  .wc-h1 .em { color: #3ddc84; }

  .wc-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #3ddc84;
    margin-bottom: 10px;
    display: block;
  }

  .wc-h2 {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: clamp(24px, 3vw, 40px);
    line-height: 1.15;
    color: #f0f7f0;
  }

  .wc-stat-num {
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: clamp(30px, 3vw, 44px);
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .wc-step-num {
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-size: 52px;
    line-height: 1;
    letter-spacing: -0.04em;
    color: rgba(61,220,132,0.22);
    margin-bottom: 16px;
    display: block;
  }

  .wc-card {
    background: #0f150f;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    transition: border-color 0.2s, background 0.2s;
  }
  .wc-card:hover {
    background: #151d15;
    border-color: rgba(61,220,132,0.20);
  }

  .wc-stat-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 1px;
    background: rgba(255,255,255,0.06);
  }
  @media(max-width: 768px){ .wc-stat-grid { grid-template-columns: repeat(2,1fr); } }

  .wc-step-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 14px;
  }
  @media(max-width: 1024px){ .wc-step-grid { grid-template-columns: repeat(2,1fr); } }
  @media(max-width: 600px){ .wc-step-grid { grid-template-columns: 1fr; } }

  .wc-feat-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 14px;
  }
  @media(max-width: 1024px){ .wc-feat-grid { grid-template-columns: repeat(2,1fr); } }
  @media(max-width: 600px){ .wc-feat-grid { grid-template-columns: 1fr; } }

  .wc-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 28px;
    border-radius: 12px;
    background: #3ddc84;
    color: #03150a;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.18s, transform 0.12s;
  }
  .wc-btn-primary:hover { background: #5ee89c; transform: translateY(-1px); }

  .wc-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 28px;
    border-radius: 12px;
    background: transparent;
    color: #a8bfa8;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.12);
    transition: border-color 0.18s, color 0.18s;
  }
  .wc-btn-outline:hover { border-color: rgba(255,255,255,0.28); color: #f0f7f0; }

  .wc-btn-ghost-green {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 26px;
    border-radius: 12px;
    background: transparent;
    color: #3ddc84;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid rgba(61,220,132,0.25);
    transition: border-color 0.18s, color 0.18s;
  }
  .wc-btn-ghost-green:hover { border-color: rgba(61,220,132,0.50); color: #5ee89c; }

  .wc-trust {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(240,247,240,0.35);
  }

  .wc-divider { border-top: 1px solid rgba(255,255,255,0.07); }
`;

export default function Home() {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="wc-home">
        <section
          className="wc-grid-bg"
          style={{
            position: "relative",
            minHeight: "90vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            padding: "0 clamp(20px, 3vw, 40px)",
          }}
        >
          <div
            className="wc-float"
            style={{
              position: "absolute",
              top: "15%",
              left: "25%",
              width: 640,
              height: 640,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(61,220,132,0.06) 0%, transparent 65%)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: "8%",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(45,212,191,0.04) 0%, transparent 65%)",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />

          <div
            className="wc-spin"
            style={{
              position: "absolute",
              right: "5%",
              top: "50%",
              marginTop: -110,
              opacity: 0.06,
              pointerEvents: "none",
            }}
          >
            <Recycle size={220} color="#3ddc84" />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 60,
              left: 40,
              opacity: 0.04,
              pointerEvents: "none",
              transform: "rotate(-15deg)",
            }}
          >
            <Trash2 size={70} color="#3ddc84" />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 680,
              paddingTop: 80,
              paddingBottom: 80,
              marginLeft: "clamp(0px, 7vw, 120px)",
            }}
          >
            <div
              className="wc-rise"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid rgba(61,220,132,0.22)",
                background: "rgba(61,220,132,0.07)",
                fontSize: 12,
                fontWeight: 600,
                color: "#3ddc84",
                marginBottom: 28,
                letterSpacing: "0.01em",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#3ddc84",
                  display: "inline-block",
                  boxShadow: "0 0 8px #3ddc84",
                }}
              />
              Nền tảng tái chế hàng đầu Việt Nam
            </div>

            <h1 className="wc-h1 wc-rise wc-d1" style={{ marginBottom: 22 }}>
              Biến rác thải thành <span className="em" style={{ position: "relative", display: "inline-block" }}>
                giá trị
                <span
                  style={{
                    position: "absolute",
                    bottom: -5,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "linear-gradient(90deg,#3ddc84,transparent)",
                    borderRadius: 99,
                  }}
                />
              </span>.
            </h1>

            <p
              className="wc-rise wc-d2"
              style={{
                fontSize: 16,
                lineHeight: 1.75,
                fontWeight: 400,
                color: "rgba(240,247,240,0.50)",
                maxWidth: 460,
                marginBottom: 34,
              }}
            >
              Kết nối người dân, doanh nghiệp tái chế và đơn vị thu gom trong
              một hệ sinh thái minh bạch, hiệu quả và bền vững.
            </p>

            <div
              className="wc-rise wc-d3"
              style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 36 }}
            >
              <Link
                to={user ? `/${user.role.toLowerCase()}/report` : "/register"}
                className="wc-btn-primary wc-glow"
              >
                {user ? "Báo cáo rác ngay" : "Bắt đầu miễn phí"}
                <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="wc-btn-outline">
                Xem hoạt động →
              </a>
            </div>

            <div className="wc-rise wc-d4" style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {[
                "Đã xử lý 1.2M kg rác",
                "450+ collector hoạt động",
                "Phủ sóng 15 tỉnh thành",
              ].map((t, i) => (
                <div key={i} className="wc-trust">
                  <CheckCircle size={13} color="#3ddc84" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="wc-stat-grid">
            {STATS.map((s, i) => {
              const Icon = s.Icon;
              return (
                <div
                  key={i}
                  style={{
                    background: "#0f150f",
                    padding: "30px 26px",
                    transition: "background 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#151d15";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0f150f";
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    <Icon size={18} color={s.accent} />
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 4 }}>
                    <span className="wc-stat-num" style={{ color: s.accent }}>
                      {s.value}
                    </span>
                    {s.unit && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(240,247,240,0.30)",
                          fontWeight: 600,
                        }}
                      >
                        {s.unit}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#c8dcc8", marginBottom: 3 }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(240,247,240,0.30)", lineHeight: 1.5 }}>
                    {s.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" style={{ padding: "72px 40px" }}>
          <span className="wc-label">Quy trình vận hành</span>
          <h2 className="wc-h2" style={{ marginBottom: 36 }}>
            4 bước đơn giản
          </h2>

          <div className="wc-step-grid">
            {STEPS.map((s, i) => (
              <div key={i} className="wc-card" style={{ padding: "24px 22px" }}>
                <span className="wc-step-num">{s.num}</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f7f0", marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 13, color: "rgba(240,247,240,0.45)", lineHeight: 1.65 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="wc-divider" style={{ padding: "72px 40px" }}>
          <span className="wc-label">Tính năng nổi bật</span>
          <h2 className="wc-h2" style={{ marginBottom: 36 }}>
            Đầy đủ công cụ
            <br />
            cho mọi vai trò.
          </h2>

          <div className="wc-feat-grid">
            {FEATURES.map((f, i) => {
              const Icon = f.Icon;
              return (
                <div key={i} className="wc-card" style={{ padding: 22 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: f.bg,
                        border: `1px solid ${f.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={19} color={f.accent} />
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        padding: "3px 9px",
                        borderRadius: 999,
                        background: f.bg,
                        color: f.accent,
                        border: `1px solid ${f.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f7f0", marginBottom: 7 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 12, color: "rgba(240,247,240,0.42)", lineHeight: 1.65 }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ padding: "60px 40px 90px" }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, #0c1f0e 0%, #091609 100%)",
              border: "1px solid rgba(61,220,132,0.14)",
              borderRadius: 24,
              padding: "52px 52px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20%",
                right: "-5%",
                width: 320,
                height: 320,
                background:
                  "radial-gradient(circle, rgba(61,220,132,0.10) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(50px)",
                pointerEvents: "none",
              }}
            />
            <div
              className="wc-spin"
              style={{
                position: "absolute",
                right: -30,
                bottom: -30,
                opacity: 0.07,
                pointerEvents: "none",
              }}
            >
              <Recycle size={240} color="#3ddc84" />
            </div>

            <div style={{ position: "relative", zIndex: 1, maxWidth: 500 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "rgba(61,220,132,0.09)",
                  border: "1px solid rgba(61,220,132,0.20)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#3ddc84",
                  marginBottom: 18,
                }}
              >
                <Leaf size={12} /> Tham gia miễn phí ngay hôm nay
              </div>
              <h2
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(24px,3vw,38px)",
                  lineHeight: 1.15,
                  color: "#f0f7f0",
                  letterSpacing: "-0.025em",
                  marginBottom: 14,
                }}
              >
                Sẵn sàng tạo
                <br />
                tác động xanh?
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(240,247,240,0.45)",
                  marginBottom: 26,
                  lineHeight: 1.7,
                }}
              >
                Dù bạn là người dân, doanh nghiệp hay đơn vị thu gom —
                <br />
                WasteCycle có chỗ dành cho bạn.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link to="/register" className="wc-btn-primary">
                  Tạo tài khoản <ArrowRight size={15} />
                </Link>
                <Link to="/login" className="wc-btn-ghost-green">
                  Đã có tài khoản →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
