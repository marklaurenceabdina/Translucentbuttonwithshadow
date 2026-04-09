import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import spwnLogo from "figma:asset/862a555786bebc44e5002344c87af57ac09ecffb.png";

type View = "login" | "signup";

const ACCENT = "#00aaff";
const BORDER = "rgba(255,255,255,0.08)";
const CARD = "#0e0e1c";

function SpwnInput({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/50 text-xs tracking-widest uppercase" style={{ fontWeight: 600 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder-white/25 outline-none transition-all duration-200"
        style={{
          background: "#141425",
          border: `1px solid ${BORDER}`,
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(0,170,255,0.5)")}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </div>
  );
}

function GlassButton({
  onClick,
  children,
  variant = "primary",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className="w-full py-3.5 rounded-lg text-white text-sm transition-all duration-150"
      style={
        variant === "primary"
          ? {
              background: ACCENT,
              fontWeight: 700,
              boxShadow: pressed
                ? `0 2px 8px rgba(0,170,255,0.3)`
                : `0 4px 16px rgba(0,170,255,0.35), 0 8px 24px rgba(0,170,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)`,
              transform: pressed ? "scale(0.98) translateY(1px)" : "scale(1)",
            }
          : {
              background: "rgba(255,255,255,0.06)",
              border: `1px solid rgba(255,255,255,0.15)`,
              fontWeight: 600,
              transform: pressed ? "scale(0.98)" : "scale(1)",
            }
      }
    >
      {children}
    </button>
  );
}

function LoginView({
  onSwitch,
  onSuccess,
}: {
  onSwitch: () => void;
  onSuccess: () => void;
}) {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const ok = login(email, password);
    if (ok) onSuccess();
    else setError("Invalid credentials. Try again.");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-1">
        <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>Welcome Back</h1>
        <p className="text-white/40 text-sm mt-1">Log in to review games and manage your wishlist.</p>
      </div>

      <SpwnInput label="Email Address" type="email" placeholder="gamer@example.com" value={email} onChange={setEmail} />
      <SpwnInput label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />

      <div className="flex items-center justify-end">
        <button className="text-xs" style={{ color: ACCENT }}>Forgot Password?</button>
      </div>

      {error && (
        <div className="text-xs text-red-400 text-center px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </div>
      )}

      <GlassButton onClick={handleLogin}>Sign In</GlassButton>

      <p className="text-center text-white/40 text-sm">
        Don't have an account?{" "}
        <button onClick={onSwitch} style={{ color: ACCENT, fontWeight: 600 }}>
          Sign up
        </button>
      </p>
    </div>
  );
}

function SignupView({
  onSwitch,
  onSuccess,
}: {
  onSwitch: () => void;
  onSuccess: () => void;
}) {
  const { signup } = useApp();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = () => {
    setError("");
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    const ok = signup(username, email, password);
    if (ok) onSuccess();
    else setError("Could not create account. Try again.");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-1">
        <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>Join Spwn</h1>
        <p className="text-white/40 text-sm mt-1 px-4">Create an account to review games, rate titles, and build your wishlist.</p>
      </div>

      <SpwnInput label="Username" type="text" placeholder="e.g. AlexGamer99" value={username} onChange={setUsername} />
      <SpwnInput label="Email Address" type="email" placeholder="gamer@example.com" value={email} onChange={setEmail} />
      <SpwnInput label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={setPassword} />

      <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => setAgreed(!agreed)}>
        <div
          className="w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 transition-all"
          style={{ borderColor: agreed ? ACCENT : "rgba(255,255,255,0.25)", background: agreed ? ACCENT : "transparent" }}
        >
          {agreed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-white/45 text-xs leading-relaxed">
          I agree to the <span style={{ color: ACCENT }}>Terms of Service</span> and <span style={{ color: ACCENT }}>Privacy Policy</span>.
        </span>
      </label>

      {error && (
        <div className="text-xs text-red-400 text-center px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </div>
      )}

      <GlassButton onClick={handleSignup}>Create Account</GlassButton>

      <p className="text-center text-white/40 text-sm">
        Already have an account?{" "}
        <button onClick={onSwitch} style={{ color: ACCENT, fontWeight: 600 }}>Log in</button>
      </p>
    </div>
  );
}

export function AuthPage() {
  const [view, setView] = useState<View>("login");
  const { user } = useApp();
  const navigate = useNavigate();

  // Already logged in → go to app
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  if (user) return null;

  const handleSuccess = () => navigate("/app");

  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: "#08080f" }}>
      {/* Top nav bar */}
      <div
        className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.4)" }}
      >
        <img src={spwnLogo} alt="SPWN" className="w-7 h-7 object-contain" />
        <span className="text-white text-base" style={{ fontWeight: 800, letterSpacing: "0.05em" }}>SPWN</span>
      </div>

      {/* Card */}
      <div className="flex flex-col items-center justify-center px-5 py-10 min-h-[calc(100%-52px)]">
        <div className="w-full rounded-xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <form onSubmit={(e) => e.preventDefault()}>
            {view === "login" ? (
              <LoginView onSwitch={() => setView("signup")} onSuccess={handleSuccess} />
            ) : (
              <SignupView onSwitch={() => setView("login")} onSuccess={handleSuccess} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}