import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, BacklogStatus } from "../../context/AppContext";
import { GAMES } from "../../data/games";
import { Star, X, LogIn, ChevronRight, Gamepad2, Play, CheckCircle2, Clock, Plus, Search } from "lucide-react";

const TABS: { key: BacklogStatus; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { key: "want", label: "Want to Play", icon: Clock, color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  { key: "playing", label: "Playing", icon: Play, color: "#00aaff", bg: "rgba(0,170,255,0.12)" },
  { key: "finished", label: "Finished", icon: CheckCircle2, color: "#34d399", bg: "rgba(52,211,153,0.12)" },
];

function StatusBadge({ status }: { status: BacklogStatus }) {
  const tab = TABS.find((t) => t.key === status)!;
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
      style={{ background: tab.bg, color: tab.color, border: `1px solid ${tab.color}30`, fontWeight: 600, fontSize: 10 }}
    >
      <tab.icon size={9} />
      {tab.label}
    </span>
  );
}

export function WishlistPage() {
  const navigate = useNavigate();
  const { user, backlog, addToBacklog, removeFromBacklog } = useApp();
  const [activeTab, setActiveTab] = useState<BacklogStatus>("want");
  const [search, setSearch] = useState("");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 gap-5" style={{ background: "var(--spwn-bg)" }}>
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(0,170,255,0.08)", border: "1px solid rgba(0,170,255,0.2)" }}
        >
          <Gamepad2 size={32} style={{ color: "rgba(0,170,255,0.4)" }} />
        </div>
        <div className="text-center">
          <h2 className="text-lg mb-2" style={{ fontWeight: 700, color: "var(--spwn-text)" }}>Your Backlog</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--spwn-faint)" }}>
            Sign in to track games you want to play, are playing, and have finished.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm"
          style={{ background: "var(--spwn-accent)", fontWeight: 700 }}
        >
          <LogIn size={15} />
          Sign In to Continue
        </button>
      </div>
    );
  }

  const allBacklogIds = Object.keys(backlog);
  const totalGames = allBacklogIds.length;

  const tabGames = GAMES.filter((g) => backlog[g.id] === activeTab);
  const filtered = search.trim()
    ? tabGames.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()))
    : tabGames;

  const counts: Record<BacklogStatus, number> = {
    want: GAMES.filter((g) => backlog[g.id] === "want").length,
    playing: GAMES.filter((g) => backlog[g.id] === "playing").length,
    finished: GAMES.filter((g) => backlog[g.id] === "finished").length,
  };

  const handleStatusChange = (gameId: string, status: BacklogStatus) => {
    addToBacklog(gameId, status);
  };

  return (
    <div className="flex flex-col pb-6" style={{ background: "var(--spwn-bg)" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl" style={{ fontWeight: 800, color: "var(--spwn-text)" }}>My Backlog</h1>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--spwn-glass)", color: "var(--spwn-muted)", fontWeight: 600 }}>
            {totalGames} game{totalGames !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--spwn-faint)" }}>Track your gaming journey</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {TABS.map((tab) => (
            <div
              key={tab.key}
              className="rounded-xl p-2.5 text-center"
              style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
            >
              <tab.icon size={14} style={{ color: tab.color, margin: "0 auto 3px" }} />
              <p className="text-base" style={{ color: "var(--spwn-text)", fontWeight: 800 }}>{counts[tab.key]}</p>
              <p style={{ fontSize: 9, color: "var(--spwn-faint)", fontWeight: 600 }}>
                {tab.key === "want" ? "WANT" : tab.key === "playing" ? "PLAYING" : "DONE"}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-3" style={{ borderColor: "var(--spwn-border)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 pb-2.5 mr-4 text-xs transition-all"
              style={{
                color: activeTab === tab.key ? tab.color : "var(--spwn-faint)",
                fontWeight: activeTab === tab.key ? 700 : 400,
                borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : "2px solid transparent",
              }}
            >
              <tab.icon size={12} />
              {tab.label}
              {counts[tab.key] > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: activeTab === tab.key ? tab.color : "var(--spwn-glass)", fontSize: 9, fontWeight: 700 }}
                >
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search within tab */}
        {tabGames.length > 4 && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
            style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
          >
            <Search size={13} style={{ color: "var(--spwn-faint)", flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab === "want" ? "want to play" : activeTab === "playing" ? "playing" : "finished"} games…`}
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: "var(--spwn-text)" }}
            />
            {search && <button onClick={() => setSearch("")}><X size={11} style={{ color: "var(--spwn-faint)" }} /></button>}
          </div>
        )}
      </div>

      {/* Game list */}
      <div className="px-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-14 gap-4">
            {(() => { const tab = TABS.find((t) => t.key === activeTab)!; return (
              <>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: tab.bg, border: `1px solid ${tab.color}30` }}>
                  <tab.icon size={22} style={{ color: tab.color }} />
                </div>
                <div className="text-center">
                  <p className="text-sm mb-1" style={{ color: "var(--spwn-faint)", fontWeight: 600 }}>
                    {search ? "No games match your search" : `No games ${activeTab === "want" ? "in want to play" : activeTab === "playing" ? "currently playing" : "finished yet"}`}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--spwn-fainter)" }}>
                    {search ? "Try a different search term" : "Browse games and add them to your backlog from the game detail page."}
                  </p>
                </div>
                {!search && (
                  <button
                    onClick={() => navigate("/app/discover")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
                    style={{ background: tab.bg, border: `1px solid ${tab.color}30`, color: tab.color, fontWeight: 700 }}
                  >
                    <Plus size={14} />
                    Discover Games
                  </button>
                )}
              </>
            ); })()}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((game) => {
              const currentStatus = backlog[game.id];
              return (
                <div
                  key={game.id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
                >
                  <div
                    onClick={() => navigate(`/app/game/${game.id}`)}
                    className="flex items-center gap-3 p-3 cursor-pointer active:opacity-80"
                  >
                    <img src={game.image} alt={game.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate mb-0.5" style={{ fontWeight: 700, color: "var(--spwn-text)" }}>{game.title}</p>
                      <p className="text-xs mb-1.5" style={{ color: "var(--spwn-faint)" }}>{game.year} · {game.developer}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star size={10} fill="#f59e0b" stroke="none" />
                          <span className="text-xs" style={{ color: "#f59e0b", fontWeight: 700 }}>{game.rating}</span>
                        </div>
                        <StatusBadge status={currentStatus} />
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromBacklog(game.id); }}
                      className="w-7 h-7 flex items-center justify-center rounded-full shrink-0 transition-colors"
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}
                    >
                      <X size={12} style={{ color: "#ef4444" }} />
                    </button>
                  </div>

                  {/* Status switcher */}
                  <div className="px-3 pb-3 flex gap-1.5">
                    {TABS.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => handleStatusChange(game.id, tab.key)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs transition-all"
                        style={{
                          background: currentStatus === tab.key ? tab.bg : "var(--spwn-glass)",
                          color: currentStatus === tab.key ? tab.color : "var(--spwn-fainter)",
                          border: `1px solid ${currentStatus === tab.key ? tab.color + "40" : "var(--spwn-border)"}`,
                          fontWeight: currentStatus === tab.key ? 700 : 500,
                        }}
                      >
                        <tab.icon size={10} />
                        {tab.key === "want" ? "Want" : tab.key === "playing" ? "Playing" : "Done"}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => navigate("/app/discover")}
              className="flex items-center justify-center gap-2 py-3 rounded-xl mt-1 text-sm"
              style={{ border: "2px dashed rgba(0,170,255,0.18)", color: "rgba(0,170,255,0.45)", fontWeight: 600 }}
            >
              <Plus size={14} />
              Add More Games
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
