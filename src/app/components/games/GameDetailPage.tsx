import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { GAMES } from "../../data/games";
import { useApp } from "../../context/AppContext";
import { BacklogStatus } from "../../context/AppContext";
import { Review } from "../../context/AppContext";
import {
  ChevronLeft,
  Star,
  Monitor,
  Cpu,
  HardDrive,
  MemoryStick,
  Play,
  ThumbsUp,
  Send,
  Lock,
  Pencil,
  Check,
  X,
  BookmarkPlus,
  Clock,
  CheckCircle2,
} from "lucide-react";

type Tab = "overview" | "specs" | "reviews";

// ── Star Rating ────────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
  size = 22,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          disabled={readonly}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => onChange?.(n)}
          style={{ cursor: readonly ? "default" : "pointer" }}
        >
          <Star
            size={size}
            fill={(hover || value) >= n ? "#f59e0b" : "none"}
            stroke={(hover || value) >= n ? "#f59e0b" : "rgba(255,255,255,0.25)"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

// ── Spec Row ───────────────────────────────────────────────────────────────
function SpecRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: "1px solid var(--spwn-border)" }}>
      <Icon size={14} style={{ color: "rgba(0,170,255,0.6)", flexShrink: 0, marginTop: 1 }} />
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 10, color: "var(--spwn-faint)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 2 }}>
          {label}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--spwn-text)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Editable Review Card ───────────────────────────────────────────────────
function ReviewCard({
  review,
  isOwn,
  onEdit,
}: {
  review: Review;
  isOwn: boolean;
  onEdit?: (reviewId: string, newRating: number, newText: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editText, setEditText] = useState(review.text);

  const handleSave = () => {
    if (!editText.trim() || editRating === 0) return;
    onEdit?.(review.id, editRating, editText.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setEditRating(review.rating);
    setEditText(review.text);
    setEditing(false);
  };

  return (
    <div
      className="rounded-xl p-3.5"
      style={{
        background: isOwn ? "rgba(0,136,221,0.05)" : "var(--spwn-card)",
        border: isOwn ? "1px solid rgba(0,136,221,0.2)" : "1px solid var(--spwn-border)",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 text-white"
            style={{ background: isOwn ? "linear-gradient(135deg, #0088dd, #6d28d9)" : "linear-gradient(135deg, #6d28d9, #00aaff)", fontWeight: 700 }}
          >
            {review.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>
                {review.username}
              </p>
              {isOwn && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(0,136,221,0.15)", color: "var(--spwn-accent)", fontSize: 9, fontWeight: 700 }}
                >
                  YOU
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: "var(--spwn-fainter)" }}>
              {review.date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!editing && <StarRating value={review.rating} size={12} readonly />}
          {isOwn && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="w-6 h-6 flex items-center justify-center rounded-lg ml-1 transition-opacity active:opacity-60"
              style={{ background: "rgba(0,136,221,0.12)", border: "1px solid rgba(0,136,221,0.25)" }}
            >
              <Pencil size={11} style={{ color: "var(--spwn-accent)" }} />
            </button>
          )}
        </div>
      </div>

      {/* View or Edit mode */}
      {editing ? (
        <div>
          <div className="mb-2">
            <p className="text-xs mb-1.5" style={{ color: "var(--spwn-faint)" }}>Rating</p>
            <StarRating value={editRating} onChange={setEditRating} size={20} />
          </div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none mb-2.5"
            style={{
              background: "var(--spwn-input)",
              border: "1px solid var(--spwn-border)",
              color: "var(--spwn-text)",
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white"
              style={{ background: "var(--spwn-accent)", fontWeight: 700 }}
            >
              <Check size={12} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "var(--spwn-glass)", color: "var(--spwn-muted)", border: "1px solid var(--spwn-border)", fontWeight: 600 }}
            >
              <X size={12} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs leading-relaxed mb-2.5" style={{ color: "var(--spwn-muted)" }}>
            {review.text}
          </p>
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--spwn-fainter)" }}>
            <ThumbsUp size={11} />
            <span>{review.helpful} found this helpful</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Backlog Button ────────────────────────────────────────────────────────
function BacklogButton({ gameId }: { gameId: string }) {
  const { user, addToBacklog, removeFromBacklog, getBacklogStatus, isInBacklog } = useApp();
  const [showPicker, setShowPicker] = useState(false);
  const status = getBacklogStatus(gameId);
  const inBacklog = isInBacklog(gameId);

  if (!user) return null;

  const OPTIONS: { key: BacklogStatus; label: string; icon: React.ElementType; color: string }[] = [
    { key: "want", label: "Want to Play", icon: Clock, color: "#a78bfa" },
    { key: "playing", label: "Currently Playing", icon: Play, color: "#00aaff" },
    { key: "finished", label: "Finished", icon: CheckCircle2, color: "#34d399" },
  ];

  const activeOption = OPTIONS.find((o) => o.key === status);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all"
        style={{
          background: inBacklog ? `${activeOption?.color}30` : "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${inBacklog ? activeOption?.color + "80" : "rgba(255,255,255,0.15)"}`,
        }}
      >
        {inBacklog && activeOption
          ? <activeOption.icon size={15} style={{ color: activeOption.color }} />
          : <BookmarkPlus size={16} color="white" />
        }
      </button>

      {showPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
          <div
            className="absolute top-14 right-3 rounded-2xl z-50 overflow-hidden"
            style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)", minWidth: 180 }}
          >
            <p className="text-xs px-3 pt-3 pb-1.5" style={{ color: "var(--spwn-faint)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Add to Backlog
            </p>
            {OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => { addToBacklog(gameId, opt.key); setShowPicker(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-left transition-opacity active:opacity-60"
                style={{
                  background: status === opt.key ? `${opt.color}15` : "transparent",
                  color: status === opt.key ? opt.color : "var(--spwn-text)",
                  fontWeight: status === opt.key ? 700 : 500,
                  borderBottom: "1px solid var(--spwn-border)",
                }}
              >
                <opt.icon size={13} style={{ color: opt.color }} />
                {opt.label}
                {status === opt.key && <Check size={11} style={{ color: opt.color, marginLeft: "auto" }} />}
              </button>
            ))}
            {inBacklog && (
              <button
                onClick={() => { removeFromBacklog(gameId); setShowPicker(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-left"
                style={{ color: "#ef4444", fontWeight: 600 }}
              >
                <X size={13} />
                Remove from Backlog
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    user,
    getReviewsForGame,
    hasReviewedGame,
    addReview,
    editReview,
    getUserRating,
    setUserRating,
  } = useApp();

  const game = GAMES.find((g) => g.id === id);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showTrailer, setShowTrailer] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ background: "var(--spwn-bg)" }}>
        <p className="text-sm" style={{ color: "var(--spwn-faint)" }}>Game not found.</p>
        <button onClick={() => navigate(-1)} className="text-xs" style={{ color: "var(--spwn-accent)" }}>
          ← Go Back
        </button>
      </div>
    );
  }

  const reviews = getReviewsForGame(game.id);
  const alreadyReviewed = hasReviewedGame(game.id);
  const userRating = getUserRating(game.id);

  const handleSubmitReview = () => {
    if (!reviewText.trim() || reviewRating === 0) return;
    addReview(game.id, reviewRating, reviewText.trim());
    setReviewSubmitted(true);
    setReviewText("");
    setReviewRating(0);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : game.rating.toFixed(1);

  const tabs: Tab[] = ["overview", "specs", "reviews"];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "var(--spwn-bg)" }}>
      {/* Hero */}
      <div className="relative shrink-0" style={{ height: 220 }}>
        <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 60%, var(--spwn-bg) 100%)" }}
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-white"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", fontWeight: 600 }}
        >
          <ChevronLeft size={14} />
          Back
        </button>

        {/* Backlog button replaces heart */}
        <BacklogButton gameId={game.id} />

        <button
          onClick={() => setShowTrailer(true)}
          className="absolute bottom-5 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", fontWeight: 600 }}
        >
          <Play size={11} fill="white" stroke="none" />
          Watch Trailer
        </button>
      </div>

      {/* Title block */}
      <div className="px-4 -mt-2 pb-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {game.genres.map((g) => (
            <span
              key={g}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,136,221,0.12)", color: "var(--spwn-accent)", border: "1px solid rgba(0,136,221,0.25)", fontWeight: 600, fontSize: 10 }}
            >
              {g}
            </span>
          ))}
        </div>
        <h1 className="text-2xl leading-tight mb-1" style={{ color: "var(--spwn-text)", fontWeight: 800 }}>
          {game.title}
        </h1>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs" style={{ color: "var(--spwn-faint)" }}>{game.developer}</span>
          <span className="text-xs" style={{ color: "var(--spwn-fainter)" }}>•</span>
          <span className="text-xs" style={{ color: "var(--spwn-faint)" }}>{game.year}</span>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-3 mt-2.5">
          <div className="flex items-center gap-1.5">
            <Star size={16} fill="#f59e0b" stroke="none" />
            <span className="text-xl" style={{ color: "var(--spwn-text)", fontWeight: 800 }}>{avgRating}</span>
          </div>
          <div>
            <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>{reviews.length.toLocaleString()} reviews</p>
            <StarRating value={Math.round(Number(avgRating) / 2)} size={11} readonly />
          </div>
          {user && (
            <div className="ml-auto flex flex-col items-end">
              <p className="text-xs mb-1" style={{ color: "var(--spwn-fainter)" }}>Your Rating</p>
              <StarRating value={userRating} onChange={(v) => setUserRating(game.id, v)} size={16} />
            </div>
          )}
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {game.platform.map((p) => (
            <span
              key={p}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "var(--spwn-glass)", color: "var(--spwn-faint)", border: "1px solid var(--spwn-border)" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="px-4 flex border-b shrink-0 sticky top-0 z-10"
        style={{ borderColor: "var(--spwn-border)", background: "var(--spwn-nav)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="pb-2.5 mr-6 text-sm transition-all duration-200 capitalize"
            style={{
              color: activeTab === tab ? "var(--spwn-text)" : "var(--spwn-faint)",
              fontWeight: activeTab === tab ? 700 : 400,
              borderBottom: activeTab === tab ? "2px solid var(--spwn-accent)" : "2px solid transparent",
            }}
          >
            {tab === "reviews" ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 pt-4 pb-8 flex-1">
        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs mb-2 tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>About</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--spwn-muted)" }}>{game.longDescription}</p>
            </div>
            <div>
              <p className="text-xs mb-2 tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>Publisher</p>
              <p className="text-sm" style={{ color: "var(--spwn-muted)" }}>{game.publisher}</p>
            </div>
            <div>
              <p className="text-xs mb-2 tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>Tags</p>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "var(--spwn-glass)", color: "var(--spwn-muted)", border: "1px solid var(--spwn-border)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SPECS ── */}
        {activeTab === "specs" && (
          <div className="flex flex-col gap-4">
            {[
              { label: "MINIMUM", specs: game.minSpecs, badgeBg: "rgba(239,68,68,0.15)", badgeColor: "#ef4444" },
              { label: "RECOMMENDED", specs: game.recSpecs, badgeBg: "rgba(0,136,221,0.15)", badgeColor: "var(--spwn-accent)" },
            ].map(({ label, specs, badgeBg, badgeColor }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-2.5 py-1 rounded text-xs" style={{ background: badgeBg, color: badgeColor, fontWeight: 700 }}>
                    {label}
                  </div>
                  <div className="flex-1 h-px" style={{ background: "var(--spwn-border)" }} />
                </div>
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
                  <div className="px-4">
                    <SpecRow icon={Monitor} label="OS" value={specs.os} />
                    <SpecRow icon={Cpu} label="CPU" value={specs.cpu} />
                    <SpecRow icon={MemoryStick} label="RAM" value={specs.ram} />
                    <SpecRow icon={Monitor} label="GPU" value={specs.gpu} />
                    <div className="py-2.5 flex items-start gap-3">
                      <HardDrive size={14} style={{ color: "rgba(0,170,255,0.6)", flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <p style={{ fontSize: 10, color: "var(--spwn-faint)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 2 }}>
                          Storage
                        </p>
                        <p className="text-xs" style={{ color: "var(--spwn-text)" }}>{specs.storage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── REVIEWS ── */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-4">
            {/* Rating summary */}
            <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
              <div className="text-center">
                <p className="text-4xl" style={{ color: "var(--spwn-text)", fontWeight: 800 }}>{avgRating}</p>
                <StarRating value={Math.round(Number(avgRating) / 2)} size={12} readonly />
                <p className="text-xs mt-1" style={{ color: "var(--spwn-fainter)" }}>{reviews.length} reviews</p>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs w-2" style={{ color: "var(--spwn-fainter)" }}>{star}</span>
                      <Star size={9} fill="#f59e0b" stroke="none" />
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--spwn-glass)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#f59e0b" }} />
                      </div>
                      <span className="text-xs w-4 text-right" style={{ color: "var(--spwn-fainter)" }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write review */}
            {!user ? (
              <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
                <Lock size={16} style={{ color: "var(--spwn-fainter)" }} />
                <div>
                  <p className="text-sm" style={{ color: "var(--spwn-muted)", fontWeight: 600 }}>Sign in to leave a review</p>
                  <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>Share your experience with other gamers.</p>
                </div>
              </div>
            ) : reviewSubmitted ? (
              <div className="rounded-xl p-4 text-center" style={{ background: "rgba(0,136,221,0.08)", border: "1px solid rgba(0,136,221,0.2)" }}>
                <p className="text-sm" style={{ color: "var(--spwn-text)", fontWeight: 600 }}>Review submitted! Thank you.</p>
              </div>
            ) : !alreadyReviewed ? (
              <div className="rounded-xl p-4" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
                <p className="text-sm mb-3" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>Write a Review</p>
                <div className="mb-3">
                  <p className="text-xs mb-2" style={{ color: "var(--spwn-faint)" }}>Your Rating</p>
                  <StarRating value={reviewRating} onChange={setReviewRating} size={24} />
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts…"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none mb-3"
                  style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewText.trim() || reviewRating === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-all"
                  style={{
                    background: reviewText.trim() && reviewRating > 0 ? "var(--spwn-accent)" : "var(--spwn-glass)",
                    color: reviewText.trim() && reviewRating > 0 ? "white" : "var(--spwn-fainter)",
                    fontWeight: 700,
                  }}
                >
                  <Send size={13} />
                  Submit Review
                </button>
              </div>
            ) : null}

            {/* Review list */}
            <div className="flex flex-col gap-3">
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star size={28} style={{ color: "var(--spwn-fainter)", margin: "0 auto 8px" }} />
                  <p className="text-sm" style={{ color: "var(--spwn-faint)" }}>No reviews yet. Be the first!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isOwn={user?.username === review.username}
                    onEdit={editReview}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{ maxWidth: 350, border: "1px solid var(--spwn-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--spwn-card)" }}>
              <p className="text-sm" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>{game.title} — Trailer</p>
              <button onClick={() => setShowTrailer(false)} style={{ color: "var(--spwn-faint)", fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ position: "relative", paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${game.trailerVideoId}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: "none" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}