import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PostPage from "./pages/PostPage.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandinPage from "./pages/LandingPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import UserAbout from "./components/UserAbout.jsx";
import { ProfileProvider } from "./contexts/ProfileContext.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandinPage />,
  },
  {
    path: "/posts",
    element: <App />,
  },
  {
    path: "/post/:postId",
    element: <PostPage />,
  },
  {
    path: "/:username",
    element: (
      <ProfileProvider>
        <UserProfilePage />
      </ProfileProvider>
    ),
    children: [
      {
        path: "/:username/about",
        element: <UserAbout />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
