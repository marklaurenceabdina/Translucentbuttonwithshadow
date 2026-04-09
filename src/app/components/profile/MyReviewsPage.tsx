import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { GAMES } from "../../data/games";
import { ChevronLeft, Star, Pencil, Check, X, Trash2 } from "lucide-react";

function StarRating({ value, onChange, size = 18, readonly = false }: {
  value: number; onChange?: (v: number) => void; size?: number; readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} disabled={readonly}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => onChange?.(n)}
          style={{ cursor: readonly ? "default" : "pointer" }}
        >
          <Star size={size}
            fill={(hover || value) >= n ? "#f59e0b" : "none"}
            stroke={(hover || value) >= n ? "#f59e0b" : "rgba(255,255,255,0.2)"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

export function MyReviewsPage() {
  const navigate = useNavigate();
  const { user, reviews, editReview } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editText, setEditText] = useState("");

  const myReviews = reviews.filter((r) => r.username === user?.username);
  const avgRating = myReviews.length
    ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1)
    : null;

  const startEdit = (reviewId: string, rating: number, text: string) => {
    setEditingId(reviewId);
    setEditRating(rating);
    setEditText(text);
  };

  const saveEdit = () => {
    if (!editingId || !editText.trim() || editRating === 0) return;
    editReview(editingId, editRating, editText.trim());
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "var(--spwn-bg)" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--spwn-border)" }}>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-xl"
            style={{ background: "var(--spwn-glass)", border: "1px solid var(--spwn-border)" }}
          >
            <ChevronLeft size={16} style={{ color: "var(--spwn-text)" }} />
          </button>
          <h1 className="text-xl" style={{ fontWeight: 800, color: "var(--spwn-text)" }}>My Reviews</h1>
        </div>

        {myReviews.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
              <Star size={14} fill="#f59e0b" stroke="none" />
              <span className="text-sm" style={{ color: "#f59e0b", fontWeight: 800 }}>{avgRating}</span>
              <span className="text-xs" style={{ color: "var(--spwn-faint)" }}>avg</span>
            </div>
            <div className="px-3 py-2 rounded-xl" style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}>
              <span className="text-sm" style={{ color: "var(--spwn-text)", fontWeight: 800 }}>{myReviews.length}</span>
              <span className="text-xs ml-1" style={{ color: "var(--spwn-faint)" }}>review{myReviews.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
        {myReviews.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--spwn-glass)", border: "1px solid var(--spwn-border)" }}>
              <Star size={24} style={{ color: "var(--spwn-fainter)" }} />
            </div>
            <div className="text-center">
              <p className="text-sm mb-1" style={{ color: "var(--spwn-faint)", fontWeight: 600 }}>No reviews yet</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--spwn-fainter)" }}>Visit a game's page and leave your first review!</p>
            </div>
            <button
              onClick={() => navigate("/app/games")}
              className="px-5 py-2.5 rounded-xl text-sm"
              style={{ background: "rgba(0,136,221,0.12)", border: "1px solid rgba(0,136,221,0.25)", color: "var(--spwn-accent)", fontWeight: 700 }}
            >
              Browse Games
            </button>
          </div>
        ) : (
          myReviews.map((review) => {
            const game = GAMES.find((g) => g.id === review.gameId);
            const isEditing = editingId === review.id;

            return (
              <div
                key={review.id}
                className="rounded-xl overflow-hidden"
                style={{ background: "var(--spwn-card)", border: "1px solid var(--spwn-border)" }}
              >
                {/* Game info row */}
                <div
                  onClick={() => !isEditing && navigate(`/app/game/${review.gameId}`)}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                  style={{ borderBottom: "1px solid var(--spwn-border)" }}
                >
                  {game && (
                    <img src={game.image} alt={game.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>
                      {game?.title ?? review.gameId}
                    </p>
                    <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>{review.date}</p>
                  </div>
                  {!isEditing && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(review.id, review.rating, review.text); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg"
                        style={{ background: "rgba(0,136,221,0.1)", border: "1px solid rgba(0,136,221,0.2)" }}
                      >
                        <Pencil size={11} style={{ color: "var(--spwn-accent)" }} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Review content */}
                <div className="p-3">
                  {isEditing ? (
                    <div>
                      <div className="mb-2.5">
                        <p className="text-xs mb-1.5" style={{ color: "var(--spwn-faint)" }}>Rating</p>
                        <StarRating value={editRating} onChange={setEditRating} size={20} />
                      </div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none mb-3"
                        style={{ background: "var(--spwn-input)", border: "1px solid var(--spwn-border)", color: "var(--spwn-text)" }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white"
                          style={{ background: "var(--spwn-accent)", fontWeight: 700 }}
                        >
                          <Check size={11} /> Save Changes
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                          style={{ background: "var(--spwn-glass)", color: "var(--spwn-muted)", border: "1px solid var(--spwn-border)", fontWeight: 600 }}
                        >
                          <X size={11} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2">
                        <StarRating value={review.rating} size={14} readonly />
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--spwn-muted)" }}>{review.text}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
