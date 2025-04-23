import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import DashboardLogin from "./pages/DashboardLogin.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <DashboardLogin />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        lazy: () => import("./pages/Dashboard.jsx"),
      },
      {
        path: "posts",
        lazy: () => import("./pages/Posts.jsx"),
      },
      {
        path: "users",
        lazy: () => import("./pages/Users.jsx"),
      },
      {
        path: "comments",
        lazy: () => import("./pages/Comments.jsx"),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
