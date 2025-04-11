import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PostPage from "./pages/PostPage.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import UserAbout from "./components/UserAbout.jsx";
import Homepage from "./pages/HomePage.jsx";
import PostCreation from "./pages/PostCreation.jsx";
import PreviewPost from "./components/PreviewPost.jsx";
import WritePost from "./components/WritePost.jsx";

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
        path: "/creator",
        element: <PostCreation />,
        children: [
          {
            index: true,
            element: <div>Select an option above.</div>,
          },
          {
            path: "write-post",
            element: <WritePost />,
          },
          {
            path: "preview-post",
            element: <PreviewPost />,
          },
        ],
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
