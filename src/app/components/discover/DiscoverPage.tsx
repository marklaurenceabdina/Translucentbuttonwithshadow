import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { GAMES, Game } from "../../data/games";
import { useApp } from "../../context/AppContext";
import { Search, X, Grid3X3, List, Star, Heart, SlidersHorizontal } from "lucide-react";

const ACCENT = "#00aaff";
const BORDER = "rgba(255,255,255,0.07)";
const CARD = "#0e0e1c";

const ALL_GENRES = Array.from(new Set(GAMES.flatMap((g) => g.genres))).sort();
const ALL_PLATFORMS = Array.from(new Set(GAMES.flatMap((g) => g.platform))).sort();

type SortKey = "rating" | "popularity" | "year" | "title";
type ViewMode = "grid" | "list";

function GameGridCard({ game, onNavigate, wishlisted, onToggleWishlist }: { game: Game; onNavigate: () => void; wishlisted: boolean; onToggleWishlist: (e: React.MouseEvent) => void }) {
  return (
    <div
      onClick={onNavigate}
      className="rounded-xl overflow-hidden cursor-pointer active:scale-[0.97] transition-transform"
      style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
    >
      <div className="relative">
        <img src={game.image} alt={game.title} className="w-full h-32 object-cover" />
        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
          style={{ background: "rgba(0,0,0,0.8)", fontWeight: 700 }}>
          <Star size={9} fill="#f59e0b" stroke="none" />
          <span style={{ color: "#f59e0b" }}>{game.rating}</span>
        </div>
        <button
          onClick={onToggleWishlist}
          className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <Heart size={11} fill={wishlisted ? "var(--spwn-accent)" : "none"} stroke={wishlisted ? "var(--spwn-accent)" : "rgba(255,255,255,0.7)"} />
        </button>
      </div>
      <div className="p-2.5">
        <p className="text-white text-xs truncate" style={{ fontWeight: 600 }}>{game.title}</p>
        <p className="text-white/35 text-xs mt-0.5 truncate">{game.year} • {game.genres[0]}</p>
      </div>
    </div>
  );
}

function GameListCard({ game, onNavigate, wishlisted, onToggleWishlist }: { game: Game; onNavigate: () => void; wishlisted: boolean; onToggleWishlist: (e: React.MouseEvent) => void }) {
  return (
    <div
      onClick={onNavigate}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer active:scale-[0.98] transition-all"
      style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
    >
      <img src={game.image} alt={game.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>{game.title}</p>
        <p className="text-white/40 text-xs mt-0.5">{game.year} • {game.developer}</p>
        <p className="text-white/25 text-xs mt-0.5 truncate">{game.genres.join(" • ")}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ background: "rgba(0,0,0,0.5)", fontWeight: 700 }}>
          <Star size={10} fill="#f59e0b" stroke="none" />
          <span style={{ color: "#f59e0b" }}>{game.rating}</span>
        </div>
        <button onClick={onToggleWishlist}>
          <Heart size={15} fill={wishlisted ? "var(--spwn-accent)" : "none"} stroke={wishlisted ? "var(--spwn-accent)" : "rgba(255,255,255,0.3)"} />
        </button>
      </div>
    </div>
  );
}

export function DiscoverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useApp();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get("genre") ?? "");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("popularity");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const PER_PAGE = 6;

  useEffect(() => {
    const genre = searchParams.get("genre");
    if (genre) setSelectedGenre(genre);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...GAMES];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.developer.toLowerCase().includes(q) ||
          g.genres.some((gen) => gen.toLowerCase().includes(q)) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedGenre) list = list.filter((g) => g.genres.includes(selectedGenre));
    if (selectedPlatform) list = list.filter((g) => g.platform.some((p) => p.includes(selectedPlatform)));
    list.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popularity") return b.popularity - a.popularity;
      if (sortBy === "year") return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [query, selectedGenre, selectedPlatform, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleWishlist = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    if (isInWishlist(gameId)) removeFromWishlist(gameId);
    else addToWishlist(gameId);
  };

  const hasFilters = query || selectedGenre || selectedPlatform || sortBy !== "popularity";

  return (
    <div className="flex flex-col" style={{ background: "var(--spwn-bg)" }}>
      {/* Search bar */}
      <div className="px-4 pt-4 pb-3 sticky top-0 z-20" style={{ background: "var(--spwn-nav)" }}>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl"
            style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
          >
            <Search size={14} style={{ color: "var(--spwn-faint)", flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search games, genres, tags…"
              className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none"
              style={{ color: "var(--spwn-text)" }}
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={13} style={{ color: "var(--spwn-faint)" }} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
            style={{
              background: showFilters ? "rgba(0,136,221,0.15)" : "var(--spwn-card)",
              border: `1px solid ${showFilters ? "rgba(0,136,221,0.35)" : "var(--spwn-border)"}`,
              color: showFilters ? "var(--spwn-accent)" : "var(--spwn-faint)",
            }}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="rounded-xl p-3 mb-3" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
            {/* Sort by */}
            <p className="text-white/40 text-xs mb-2 tracking-widest uppercase" style={{ fontWeight: 700 }}>Sort By</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(["popularity", "rating", "year", "title"] as SortKey[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className="px-3 py-1 rounded-full text-xs capitalize transition-all"
                  style={{
                    background: sortBy === s ? "var(--spwn-accent)" : "var(--spwn-glass)",
                    color: sortBy === s ? "white" : "var(--spwn-faint)",
                    fontWeight: sortBy === s ? 700 : 400,
                  }}
                >
                  {s === "popularity" ? "Popular" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Genre */}
            <p className="text-white/40 text-xs mb-2 tracking-widest uppercase" style={{ fontWeight: 700 }}>Genre</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => { setSelectedGenre(""); setPage(1); }}
                className="px-3 py-1 rounded-full text-xs transition-all"
                style={{ background: !selectedGenre ? "var(--spwn-accent)" : "var(--spwn-glass)", color: !selectedGenre ? "white" : "var(--spwn-faint)", fontWeight: !selectedGenre ? 700 : 400 }}
              >
                All
              </button>
              {ALL_GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => { setSelectedGenre(g === selectedGenre ? "" : g); setPage(1); }}
                  className="px-3 py-1 rounded-full text-xs transition-all"
                  style={{ background: selectedGenre === g ? "var(--spwn-accent)" : "var(--spwn-glass)", color: selectedGenre === g ? "white" : "var(--spwn-faint)", fontWeight: selectedGenre === g ? 700 : 400 }}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Platform */}
            <p className="text-white/40 text-xs mb-2 tracking-widest uppercase" style={{ fontWeight: 700 }}>Platform</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => { setSelectedPlatform(""); setPage(1); }}
                className="px-3 py-1 rounded-full text-xs transition-all"
                style={{ background: !selectedPlatform ? "var(--spwn-accent)" : "var(--spwn-glass)", color: !selectedPlatform ? "white" : "var(--spwn-faint)", fontWeight: !selectedPlatform ? 700 : 400 }}
              >
                All
              </button>
              {["PC", "PlayStation", "Xbox", "Nintendo"].map((p) => (
                <button
                  key={p}
                  onClick={() => { setSelectedPlatform(p === selectedPlatform ? "" : p); setPage(1); }}
                  className="px-3 py-1 rounded-full text-xs transition-all"
                  style={{ background: selectedPlatform === p ? "var(--spwn-accent)" : "var(--spwn-glass)", color: selectedPlatform === p ? "white" : "var(--spwn-faint)", fontWeight: selectedPlatform === p ? 700 : 400 }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {hasFilters ? " found" : ""}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className="p-1.5 rounded-lg transition-colors"
              style={{ background: viewMode === "grid" ? "rgba(0,136,221,0.15)" : "transparent", color: viewMode === "grid" ? "var(--spwn-accent)" : "var(--spwn-faint)" }}
            >
              <Grid3X3 size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="p-1.5 rounded-lg transition-colors"
              style={{ background: viewMode === "list" ? "rgba(0,136,221,0.15)" : "transparent", color: viewMode === "list" ? "var(--spwn-accent)" : "var(--spwn-faint)" }}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pb-4">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Search size={32} style={{ color: "var(--spwn-fainter)" }} />
            <p className="text-sm text-center" style={{ color: "var(--spwn-faint)" }}>No games match your search.<br />Try different keywords or filters.</p>
            <button
              onClick={() => { setQuery(""); setSelectedGenre(""); setSelectedPlatform(""); setSortBy("popularity"); }}
              className="px-4 py-2 rounded-lg text-xs"
              style={{ background: "rgba(0,136,221,0.15)", color: "var(--spwn-accent)", fontWeight: 600 }}
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {paginated.map((game) => (
              <GameGridCard
                key={game.id}
                game={game}
                onNavigate={() => navigate(`/app/game/${game.id}`)}
                wishlisted={isInWishlist(game.id)}
                onToggleWishlist={(e) => toggleWishlist(e, game.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {paginated.map((game) => (
              <GameListCard
                key={game.id}
                game={game}
                onNavigate={() => navigate(`/app/game/${game.id}`)}
                wishlisted={isInWishlist(game.id)}
                onToggleWishlist={(e) => toggleWishlist(e, game.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)", color: "var(--spwn-faint)", opacity: page === 1 ? 0.4 : 1 }}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all"
                style={{
                  background: page === p ? "var(--spwn-accent)" : "var(--spwn-card)",
                  border: `1px solid ${page === p ? "var(--spwn-accent)" : "var(--spwn-border)"}`,
                  color: page === p ? "white" : "var(--spwn-faint)",
                  fontWeight: page === p ? 700 : 400,
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)", color: "var(--spwn-faint)", opacity: page === totalPages ? 0.4 : 1 }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}