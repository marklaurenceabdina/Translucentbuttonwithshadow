import { useState } from "react";
import { useNavigate } from "react-router";
import { GAMES } from "../../data/games";
import { useApp } from "../../context/AppContext";
import { Star, Heart, ChevronRight } from "lucide-react";
import { BookOpen, Sword, LayoutGrid, Crosshair, Cpu, Zap, Shield, Ghost } from "lucide-react";

const ACCENT = "#00aaff";
const BORDER = "rgba(255,255,255,0.07)";
const CARD = "#0e0e1c";

const genreIcons: Record<string, React.ElementType> = {
  RPG: BookOpen,
  Action: Sword,
  "Open World": LayoutGrid,
  FPS: Crosshair,
  Strategy: Cpu,
  "Action RPG": Sword,
  "Souls-like": Shield,
  Horror: Ghost,
  Fantasy: Zap,
};

const ALL_GENRES = Array.from(new Set(GAMES.flatMap((g) => g.genres)));

const byRating = [...GAMES].sort((a, b) => b.rating - a.rating);

export function GamesPage() {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const filteredByGenre = activeGenre
    ? GAMES.filter((g) => g.genres.includes(activeGenre)).sort((a, b) => b.rating - a.rating)
    : null;

  const toggleWishlist = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    if (isInWishlist(gameId)) removeFromWishlist(gameId);
    else addToWishlist(gameId);
  };

  return (
    <div className="flex flex-col pb-6" style={{ background: "var(--spwn-bg)" }}>
      {/* Browse by Genre */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: "var(--spwn-accent)" }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>Browse by Genre</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {ALL_GENRES.slice(0, 9).map((genre) => {
            const Icon = genreIcons[genre] ?? Zap;
            const isActive = activeGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setActiveGenre(isActive ? null : genre)}
                className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all duration-200 active:scale-95"
                style={{
                  background: isActive ? "rgba(0,136,221,0.15)" : "var(--spwn-card)",
                  border: `1px solid ${isActive ? "rgba(0,136,221,0.4)" : "var(--spwn-border)"}`,
                }}
              >
                <Icon size={20} style={{ color: isActive ? "var(--spwn-accent)" : "rgba(100,120,255,0.8)" }} />
                <span
                  className="text-xs tracking-wide text-center px-1"
                  style={{ color: isActive ? "var(--spwn-accent)" : "rgba(100,120,255,0.8)", fontWeight: isActive ? 700 : 500, fontSize: 10 }}
                >
                  {genre.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Genre-filtered results */}
      {filteredByGenre && (
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ background: "var(--spwn-accent)" }} />
              <span className="text-sm" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>{activeGenre} Games</span>
            </div>
            <button onClick={() => setActiveGenre(null)} className="text-xs" style={{ color: "var(--spwn-faint)" }}>Clear</button>
          </div>
          <div className="flex flex-col gap-2.5">
            {filteredByGenre.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/app/game/${game.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer active:scale-[0.98] transition-all"
                style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
              >
                <img src={game.image} alt={game.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate" style={{ fontWeight: 600, color: "var(--spwn-text)" }}>{game.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--spwn-faint)" }}>{game.year} • {game.developer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(0,0,0,0.5)", fontWeight: 700 }}>
                    <Star size={9} fill="#f59e0b" stroke="none" />
                    <span style={{ color: "#f59e0b" }}>{game.rating}</span>
                  </div>
                  <button onClick={(e) => toggleWishlist(e, game.id)}>
                    <Heart size={15} fill={isInWishlist(game.id) ? "var(--spwn-accent)" : "none"} stroke={isInWishlist(game.id) ? "var(--spwn-accent)" : "var(--spwn-faint)"} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Rated Games */}
      {!filteredByGenre && (
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ background: "var(--spwn-accent)" }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>Highest Rated</span>
            </div>
            <button onClick={() => navigate("/app/discover")} className="flex items-center gap-0.5 text-xs" style={{ color: "var(--spwn-accent)", fontWeight: 600 }}>
              SEE ALL <ChevronRight size={13} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {byRating.slice(0, 5).map((game, i) => (
              <div
                key={game.id}
                onClick={() => navigate(`/app/game/${game.id}`)}
                className="rounded-xl overflow-hidden relative cursor-pointer active:scale-[0.98] transition-all"
                style={{ height: 100, background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
              >
                <img src={game.image} alt={game.title} className="absolute inset-0 w-full h-full object-cover opacity-35" />
                <div className="absolute inset-0 p-3 flex items-end"
                  style={{ background: "linear-gradient(to top, rgba(8,8,15,0.97) 30%, rgba(8,8,15,0.4) 100%)" }}>
                  <div className="flex-1">
                    <p className="text-white text-sm" style={{ fontWeight: 700 }}>{game.title}</p>
                    <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>{game.year} • {game.developer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.6)" }}>
                      <Star size={11} fill="#f59e0b" stroke="none" />
                      <span className="text-xs" style={{ color: "#f59e0b", fontWeight: 700 }}>{game.rating}</span>
                    </div>
                    <button onClick={(e) => toggleWishlist(e, game.id)}>
                      <Heart size={15} fill={isInWishlist(game.id) ? "var(--spwn-accent)" : "none"} stroke={isInWishlist(game.id) ? "var(--spwn-accent)" : "rgba(255,255,255,0.5)"} />
                    </button>
                  </div>
                </div>
                <div className="absolute top-2.5 left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: i < 3 ? ["#f59e0b", "#94a3b8", "#cd7c2f"][i] : "var(--spwn-card)", border: "1px solid var(--spwn-border)", fontWeight: 800, color: i < 3 ? "white" : "var(--spwn-faint)" }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}