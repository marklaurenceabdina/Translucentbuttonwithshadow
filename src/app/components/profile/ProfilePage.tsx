import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import {
  ChevronLeft,
  LogOut,
  Moon,
  Sun,
  Heart,
  Star,
  Shield,
  Bell,
  HelpCircle,
  ChevronRight,
  Pencil,
  Camera,
  BookOpen,
} from "lucide-react";

const ACCENT = "var(--spwn-accent)";
const BORDER = "var(--spwn-border)";
const CARD = "var(--spwn-card)";
const BG = "var(--spwn-bg)";

function SettingRow({
  icon: Icon,
  label,
  subtitle,
  right,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3.5 transition-all active:opacity-70"
      style={{
        borderBottom: `1px solid ${BORDER}`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: danger ? "rgba(239,68,68,0.1)" : "var(--spwn-glass)",
          border: `1px solid ${danger ? "rgba(239,68,68,0.2)" : BORDER}`,
        }}
      >
        <Icon size={15} style={{ color: danger ? "#ef4444" : ACCENT }} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm" style={{ color: danger ? "#ef4444" : "var(--spwn-text)", fontWeight: 600 }}>
          {label}
        </p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--spwn-faint)" }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        {right ?? (onClick ? <ChevronRight size={14} style={{ color: "var(--spwn-faint)" }} /> : null)}
      </div>
    </div>
  );
}

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative rounded-full transition-all duration-300"
      style={{
        width: 44,
        height: 24,
        background: value ? "var(--spwn-accent)" : "var(--spwn-glass)",
        border: `1px solid ${value ? "var(--spwn-accent)" : "var(--spwn-border-s)"}`,
      }}
    >
      <div
        className="absolute top-[2px] w-[18px] h-[18px] rounded-full transition-all duration-300"
        style={{
          left: value ? "calc(100% - 20px)" : "2px",
          background: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

function useImageUpload(initial: string | null = null) {
  const [image, setImage] = useState<string | null>(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  const trigger = () => inputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return { image, trigger, inputRef, handleFile };
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, darkMode, toggleDarkMode, logout, backlog, reviews } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const cover = useImageUpload(null);
  const avatar = useImageUpload(null);

  const userReviews = reviews.filter((r) => r.username === user?.username);
  const avgRating =
    userReviews.length > 0
      ? (userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length).toFixed(1)
      : "—";

  const backlogCount = Object.keys(backlog).length;

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: BG }}>
        <p className="text-sm" style={{ color: "var(--spwn-faint)" }}>Not signed in.</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-xl text-white text-sm"
          style={{ background: "var(--spwn-accent)", fontWeight: 700 }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: BG }}>

      {/* ── Cover Photo ── */}
      <div className="relative shrink-0" style={{ height: 160 }}>
        {cover.image ? (
          <img src={cover.image} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, #0d0d2b 0%, #0f1f40 40%, #0a1628 70%, #080b20 100%)",
            }}
          >
            {/* Decorative grid lines */}
            <div className="w-full h-full opacity-20" style={{
              backgroundImage: "linear-gradient(rgba(0,136,221,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,136,221,0.4) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
            {/* Glow orbs */}
            <div className="absolute top-4 left-1/4 w-20 h-20 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,136,221,0.35) 0%, transparent 70%)" }} />
            <div className="absolute bottom-3 right-1/4 w-14 h-14 rounded-full" style={{ background: "radial-gradient(circle, rgba(109,40,217,0.4) 0%, transparent 70%)" }} />
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 40%, var(--spwn-bg) 100%)",
          }}
        />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-white"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
            fontWeight: 600,
          }}
        >
          <ChevronLeft size={13} />
          Back
        </button>

        {/* Change cover button */}
        <button
          onClick={cover.trigger}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
            fontWeight: 600,
          }}
        >
          <Camera size={12} />
          Cover
        </button>
        <input ref={cover.inputRef} type="file" accept="image/*" className="hidden" onChange={cover.handleFile} />
      </div>

      {/* ── Avatar + Name ── */}
      <div className="px-5 -mt-12 mb-4 flex items-end gap-4 relative z-10">
        <div className="relative shrink-0">
          {/* Avatar circle */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white overflow-hidden"
            style={{
              background: avatar.image ? "transparent" : "linear-gradient(135deg, #6d28d9, #00aaff)",
              fontSize: 28,
              fontWeight: 800,
              border: `3px solid ${CARD}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
            {avatar.image ? (
              <img src={avatar.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>

          {/* Camera button on avatar */}
          <button
            onClick={avatar.trigger}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: "var(--spwn-accent)",
              border: `2px solid ${CARD}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            <Camera size={11} color="white" />
          </button>
          <input ref={avatar.inputRef} type="file" accept="image/*" className="hidden" onChange={avatar.handleFile} />
        </div>

        <div className="pb-2">
          <h1 className="text-xl" style={{ fontWeight: 800, color: "var(--spwn-text)" }}>
            {user.username}
          </h1>
          <p className="text-xs" style={{ color: "var(--spwn-muted)" }}>
            {user.email}
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Heart, label: "Backlog", value: backlogCount, color: "#00aaff" },
            { icon: Pencil, label: "Reviews", value: userReviews.length, color: "#8b5cf6" },
            { icon: Star, label: "Avg Rating", value: avgRating, color: "#f59e0b" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3 text-center"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              <stat.icon size={16} style={{ color: stat.color, margin: "0 auto 4px" }} />
              <p className="text-lg" style={{ color: "var(--spwn-text)", fontWeight: 800 }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Appearance ── */}
      <div className="px-4 mb-3">
        <p className="text-xs tracking-widest uppercase mb-2 px-1" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
          Appearance
        </p>
        <div className="rounded-xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--spwn-glass)", border: `1px solid ${BORDER}` }}
            >
              {darkMode ? (
                <Moon size={15} style={{ color: "var(--spwn-accent)" }} />
              ) : (
                <Sun size={15} style={{ color: "#f59e0b" }} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm" style={{ color: "var(--spwn-text)", fontWeight: 600 }}>
                {darkMode ? "Dark Mode" : "Light Mode"}
              </p>
              <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>
                {darkMode ? "Gaming dark aesthetic" : "Bright & clean"}
              </p>
            </div>
            <Toggle value={darkMode} onToggle={toggleDarkMode} />
          </div>
        </div>
      </div>

      {/* ── Preferences ── */}
      <div className="px-4 mb-3">
        <p className="text-xs tracking-widest uppercase mb-2 px-1" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
          Preferences
        </p>
        <div className="rounded-xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <SettingRow
            icon={Bell}
            label="Notifications"
            subtitle={notifications ? "Community & game alerts on" : "All notifications off"}
            right={<Toggle value={notifications} onToggle={() => setNotifications(!notifications)} />}
          />
          <SettingRow
            icon={BookOpen}
            label="My Reviews"
            subtitle={`${userReviews.length} review${userReviews.length !== 1 ? "s" : ""} written`}
            onClick={() => navigate("/app/my-reviews")}
          />
          <SettingRow
            icon={Heart}
            label="My Backlog"
            subtitle={`${backlogCount} game${backlogCount !== 1 ? "s" : ""} tracked`}
            onClick={() => navigate("/app/wishlist")}
          />
        </div>
      </div>

      {/* ── Account ── */}
      <div className="px-4 mb-3">
        <p className="text-xs tracking-widest uppercase mb-2 px-1" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
          Account
        </p>
        <div className="rounded-xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <SettingRow
            icon={Shield}
            label="Privacy & Security"
            subtitle="Manage data and account security"
          />
          <SettingRow
            icon={HelpCircle}
            label="Help & Support"
            subtitle="FAQs and contact"
          />
          <SettingRow
            icon={LogOut}
            label="Sign Out"
            onClick={() => setShowSignOutConfirm(true)}
            danger
            right={null}
          />
        </div>
      </div>

      <p className="text-center text-xs pb-6" style={{ color: "var(--spwn-fainter)" }}>
        Spwn Mobile v1.0.0
      </p>

      {/* ── Sign-out confirm sheet ── */}
      {showSignOutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={() => setShowSignOutConfirm(false)}
        >
          <div
            className="w-full rounded-t-3xl p-6"
            style={{ background: CARD, border: `1px solid ${BORDER}`, maxWidth: 390 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--spwn-border-s)" }} />
            <h3 className="text-lg mb-1" style={{ fontWeight: 700, color: "var(--spwn-text)" }}>Sign Out?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--spwn-muted)" }}>
              Your wishlist and reviews are saved. You can sign back in anytime.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSignOut}
                className="w-full py-3.5 rounded-xl text-white text-sm"
                style={{ background: "#ef4444", fontWeight: 700 }}
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="w-full py-3.5 rounded-xl text-sm"
                style={{ background: "var(--spwn-glass)", color: "var(--spwn-text)", fontWeight: 600, border: `1px solid ${BORDER}` }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}