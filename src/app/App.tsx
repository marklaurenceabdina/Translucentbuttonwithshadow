import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider, useApp } from "./context/AppContext";

function PhoneShell() {
  const { darkMode } = useApp();

  const themeVars = darkMode
    ? {
        "--spwn-bg": "#08080f",
        "--spwn-card": "#0e0e1c",
        "--spwn-input": "#141425",
        "--spwn-border": "rgba(255,255,255,0.07)",
        "--spwn-border-s": "rgba(255,255,255,0.13)",
        "--spwn-text": "#ffffff",
        "--spwn-muted": "rgba(255,255,255,0.55)",
        "--spwn-faint": "rgba(255,255,255,0.32)",
        "--spwn-fainter": "rgba(255,255,255,0.18)",
        "--spwn-accent": "#00aaff",
        "--spwn-nav": "rgba(8,8,15,0.98)",
        "--spwn-glass": "rgba(255,255,255,0.06)",
      }
    : {
        "--spwn-bg": "#eef2f9",
        "--spwn-card": "#ffffff",
        "--spwn-input": "#f3f6fb",
        "--spwn-border": "rgba(0,0,0,0.07)",
        "--spwn-border-s": "rgba(0,0,0,0.12)",
        "--spwn-text": "#0d1117",
        "--spwn-muted": "rgba(13,17,23,0.55)",
        "--spwn-faint": "rgba(13,17,23,0.38)",
        "--spwn-fainter": "rgba(13,17,23,0.22)",
        "--spwn-accent": "#0088dd",
        "--spwn-nav": "rgba(238,242,249,0.98)",
        "--spwn-glass": "rgba(0,0,0,0.04)",
      };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center py-8"
      style={{ background: "linear-gradient(135deg, #050508 0%, #08080f 60%, #0a080f 100%)" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 25% 30%, rgba(0,160,255,0.04) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(100,40,255,0.05) 0%, transparent 55%)",
        }}
      />

      <p className="text-white/15 text-xs tracking-[0.35em] uppercase mb-4 relative z-10" style={{ fontWeight: 600 }}>
        Spwn Mobile
      </p>

      {/* Phone shell */}
      <div
        className={`relative z-10 flex flex-col overflow-hidden ${darkMode ? "" : "spwn-light"}`}
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          background: "var(--spwn-bg)",
          boxShadow:
            "0 0 0 9px #12121f, 0 0 0 10px #0a0a16, 0 0 0 12px rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.85), 0 0 80px rgba(0,120,255,0.04)",
          ...(themeVars as React.CSSProperties),
        }}
      >
        {/* Status bar */}
        <div
          className="relative shrink-0 flex items-center justify-between px-8"
          style={{ height: 50, background: darkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.05)" }}
        >
          <div className="absolute left-1/2 -translate-x-1/2 top-3 rounded-full" style={{ width: 118, height: 30, background: "#000" }} />
          <span className="text-white text-xs relative z-10" style={{ fontWeight: 600, color: darkMode ? "white" : "#0d1117" }}>9:41</span>
          <div className="flex items-center gap-1.5 relative z-10">
            <div className="flex items-end gap-[2px]">
              {[3, 5, 7, 10].map((h, i) => (
                <div key={i} className="w-[3px] rounded-[1px]" style={{ height: h, background: i < 3 ? (darkMode ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)") : (darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)") }} />
              ))}
            </div>
            <svg width="13" height="11" viewBox="0 0 14 12" fill="none">
              <path d="M7 9.5a1 1 0 100 2 1 1 0 000-2z" fill={darkMode ? "white" : "#0d1117"} fillOpacity={0.9} />
              <path d="M4 7.5C4.9 6.6 5.9 6 7 6s2.1.6 3 1.5" stroke={darkMode ? "white" : "#0d1117"} strokeOpacity={0.9} strokeWidth="1.3" strokeLinecap="round" fill="none" />
              <path d="M1.5 5C3 3.4 5 2.5 7 2.5s4 .9 5.5 2.5" stroke={darkMode ? "white" : "#0d1117"} strokeOpacity={0.45} strokeWidth="1.3" strokeLinecap="round" fill="none" />
            </svg>
            <div className="flex items-center">
              <div className="rounded-[3px] relative overflow-hidden" style={{ width: 22, height: 11, border: `1px solid ${darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}` }}>
                <div className="absolute left-[2px] top-[2px] bottom-[2px] rounded-[2px]" style={{ width: "75%", background: darkMode ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.7)" }} />
              </div>
              <div className="rounded-r-[1px]" style={{ width: 2, height: 5, background: darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }} />
            </div>
          </div>
        </div>

        {/* Router content */}
        <div className="flex-1 overflow-hidden">
          <RouterProvider router={router} />
        </div>

        {/* Home bar */}
        <div className="shrink-0 flex items-center justify-center" style={{ height: 30, background: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)" }}>
          <div className="rounded-full" style={{ width: 118, height: 4, background: darkMode ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)" }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <PhoneShell />
    </AppProvider>
  );
}
