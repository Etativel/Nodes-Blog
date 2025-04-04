import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PostPage from "./pages/PostPage.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import UserAbout from "./components/UserAbout.jsx";
import Homepage from "./pages/HomePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    element: <App />,
    children: [
      {
        path: "/posts",
        element: <Homepage />,
      },
      {
        path: "/post/:postId",
        element: <PostPage />,
      },
      {
        path: "/:username",
        element: <UserProfilePage />,
        children: [
          {
            path: "about",
            element: <UserAbout />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
