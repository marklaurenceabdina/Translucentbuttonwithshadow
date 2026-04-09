import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SEED_REVIEWS } from "../data/games";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Review {
  id: string;
  gameId: string;
  username: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

export type BacklogStatus = "want" | "playing" | "finished";
export type Backlog = Record<string, BacklogStatus>;

interface AppState {
  user: User | null;
  darkMode: boolean;
  backlog: Backlog;
  wishlist: Set<string>;
  reviews: Review[];
  userRatings: Record<string, number>;
  toggleDarkMode: () => void;
  login: (email: string, password: string, username?: string) => boolean;
  signup: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  addToBacklog: (gameId: string, status: BacklogStatus) => void;
  removeFromBacklog: (gameId: string) => void;
  getBacklogStatus: (gameId: string) => BacklogStatus | null;
  isInBacklog: (gameId: string) => boolean;
  addToWishlist: (gameId: string) => void;
  removeFromWishlist: (gameId: string) => void;
  isInWishlist: (gameId: string) => boolean;
  addReview: (gameId: string, rating: number, text: string) => void;
  editReview: (reviewId: string, rating: number, text: string) => void;
  getReviewsForGame: (gameId: string) => Review[];
  hasReviewedGame: (gameId: string) => boolean;
  setUserRating: (gameId: string, rating: number) => void;
  getUserRating: (gameId: string) => number;
}

const AppContext = createContext<AppState | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromStorage("spwn_user", null));
  const [darkMode, setDarkMode] = useState<boolean>(() => loadFromStorage("spwn_dark", true));
  const [backlog, setBacklog] = useState<Backlog>(() => loadFromStorage("spwn_backlog", {}));
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    const stored = loadFromStorage<string[]>("spwn_wishlist", []);
    return new Set(stored);
  });
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage("spwn_reviews", SEED_REVIEWS));
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => loadFromStorage("spwn_ratings", {}));

  useEffect(() => saveToStorage("spwn_user", user), [user]);
  useEffect(() => saveToStorage("spwn_dark", darkMode), [darkMode]);
  useEffect(() => saveToStorage("spwn_backlog", backlog), [backlog]);
  useEffect(() => saveToStorage("spwn_wishlist", Array.from(wishlist)), [wishlist]);
  useEffect(() => saveToStorage("spwn_reviews", reviews), [reviews]);
  useEffect(() => saveToStorage("spwn_ratings", userRatings), [userRatings]);

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  function login(email: string, _password: string, username?: string): boolean {
    if (!email) return false;
    const id = btoa(email);
    setUser({ id, username: username ?? email.split("@")[0], email });
    return true;
  }

  function signup(username: string, email: string, _password: string): boolean {
    if (!username || !email) return false;
    const id = btoa(email + Date.now());
    setUser({ id, username, email });
    return true;
  }

  function logout() {
    setUser(null);
  }

  function addToBacklog(gameId: string, status: BacklogStatus) {
    setBacklog((prev) => ({ ...prev, [gameId]: status }));
  }

  function removeFromBacklog(gameId: string) {
    setBacklog((prev) => {
      const next = { ...prev };
      delete next[gameId];
      return next;
    });
  }

  function getBacklogStatus(gameId: string): BacklogStatus | null {
    return backlog[gameId] ?? null;
  }

  function isInBacklog(gameId: string): boolean {
    return gameId in backlog;
  }

  function addToWishlist(gameId: string) {
    setWishlist((prev) => new Set([...prev, gameId]));
  }

  function removeFromWishlist(gameId: string) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.delete(gameId);
      return next;
    });
  }

  function isInWishlist(gameId: string): boolean {
    return wishlist.has(gameId);
  }

  function addReview(gameId: string, rating: number, text: string) {
    if (!user) return;
    const newReview: Review = {
      id: `r_${Date.now()}`,
      gameId,
      username: user.username,
      rating,
      text,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    setUserRatings((prev) => ({ ...prev, [gameId]: rating }));
  }

  function editReview(reviewId: string, rating: number, text: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, rating, text, date: new Date().toISOString().split("T")[0] }
          : r
      )
    );
    const review = reviews.find((r) => r.id === reviewId);
    if (review) {
      setUserRatings((prev) => ({ ...prev, [review.gameId]: rating }));
    }
  }

  function getReviewsForGame(gameId: string) {
    return reviews.filter((r) => r.gameId === gameId);
  }

  function hasReviewedGame(gameId: string) {
    if (!user) return false;
    return reviews.some((r) => r.gameId === gameId && r.username === user.username);
  }

  function setUserRating(gameId: string, rating: number) {
    setUserRatings((prev) => ({ ...prev, [gameId]: rating }));
  }

  function getUserRating(gameId: string) {
    return userRatings[gameId] ?? 0;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        darkMode,
        backlog,
        wishlist,
        reviews,
        userRatings,
        toggleDarkMode,
        login,
        signup,
        logout,
        addToBacklog,
        removeFromBacklog,
        getBacklogStatus,
        isInBacklog,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addReview,
        editReview,
        getReviewsForGame,
        hasReviewedGame,
        setUserRating,
        getUserRating,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
