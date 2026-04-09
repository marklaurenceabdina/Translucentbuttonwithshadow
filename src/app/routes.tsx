import { createBrowserRouter } from "react-router";
import { AuthPage } from "./components/auth/AuthPage";
import { MobileLayout } from "./components/layout/MobileLayout";
import { HomePage } from "./components/home/HomePage";
import { DiscoverPage } from "./components/discover/DiscoverPage";
import { GamesPage } from "./components/games/GamesPage";
import { GameDetailPage } from "./components/games/GameDetailPage";
import { CommunityPage } from "./components/community/CommunityPage";
import { WishlistPage } from "./components/wishlist/WishlistPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { MyReviewsPage } from "./components/profile/MyReviewsPage";
import { ErrorPage } from "./components/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthPage,
    errorElement: <ErrorPage />,
  },
  {
    path: "/app",
    Component: MobileLayout,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: HomePage },
      { path: "discover", Component: DiscoverPage },
      { path: "games", Component: GamesPage },
      { path: "game/:id", Component: GameDetailPage },
      { path: "community", Component: CommunityPage },
      { path: "wishlist", Component: WishlistPage },
      { path: "profile", Component: ProfilePage },
      { path: "my-reviews", Component: MyReviewsPage },
    ],
  },
]);
