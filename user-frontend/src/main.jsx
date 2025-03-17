import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PostPage from "./pages/PostPage.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandinPage from "./pages/LandingPage.jsx";
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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
