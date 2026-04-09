import { Outlet, useNavigate, useLocation } from "react-router";
import { useApp } from "../../context/AppContext";
import spwnLogo from "figma:asset/862a555786bebc44e5002344c87af57ac09ecffb.png";
import { Home, Compass, Gamepad2, Users, Search, UserCircle } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/app" },
  { icon: Compass, label: "Discover", path: "/app/discover" },
  { icon: Gamepad2, label: "Games", path: "/app/games" },
  { icon: Users, label: "Community", path: "/app/community" },
];

export function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();

  const isProfile = location.pathname === "/app/profile";

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: "var(--spwn-bg)" }}>
      {/* Top nav bar */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b z-30"
        style={{ borderColor: "var(--spwn-border)", background: "var(--spwn-nav)" }}
      >
        <button onClick={() => navigate("/app")} className="flex items-center gap-2">
          <img src={spwnLogo} alt="SPWN" className="w-6 h-6 object-contain" />
          <span className="text-sm" style={{ color: "var(--spwn-text)", fontWeight: 800, letterSpacing: "0.06em" }}>
            SPWN
          </span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app/discover")}
            style={{ color: "var(--spwn-faint)" }}
          >
            <Search size={17} />
          </button>

          {user ? (
            <button
              onClick={() => navigate("/app/profile")}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white transition-all"
              style={{
                background: isProfile
                  ? "linear-gradient(135deg, #00aaff, #6d28d9)"
                  : "linear-gradient(135deg, #6d28d9, #00aaff)",
                fontWeight: 800,
                boxShadow: isProfile ? "0 0 0 2px var(--spwn-accent)" : "none",
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button onClick={() => navigate("/")} style={{ color: "var(--spwn-faint)" }}>
              <UserCircle size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>

      {/* Bottom nav */}
      <div
        className="shrink-0 border-t z-30"
        style={{ borderColor: "var(--spwn-border)", background: "var(--spwn-nav)" }}
      >
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map((item) => {
            const isActive =
              item.path === "/app"
                ? location.pathname === "/app" || location.pathname === "/app/"
                : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 relative"
              >
                <item.icon
                  size={20}
                  style={{ color: isActive ? "var(--spwn-accent)" : "var(--spwn-faint)" }}
                />
                <span
                  className="text-[10px]"
                  style={{
                    color: isActive ? "var(--spwn-accent)" : "var(--spwn-faint)",
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}