import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./Layout.jsx";
import Loader from "./components/Loader/Loader.jsx";

import Landing from "./pages/Landing/Landing.jsx";
import Home from "./pages/Home/Home.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import Post from "./pages/Post/Post.jsx";
import Search from "./pages/Search/Search.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import PostCreation from "./pages/Creation/PostCreation.jsx";

import UserAbout from "./components/Profile/UserAbout.jsx";
import PreviewPost from "./components/Creation/PreviewPost.jsx";
import WritePost from "./components/Creation/WritePost.jsx";
import LikedPost from "./components/Profile/LikedPost.jsx";
import SavedPost from "./components/Profile/SavedPost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/posts",
        element: <Home />,
      },
      {
        path: "/post/:postId",
        element: <Post />,
      },
      {
        path: "/search",
        element: <Search />,
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
        element: <Profile />,
        children: [
          {
            path: "about",
            element: <UserAbout />,
          },
          {
            path: "liked",
            element: <LikedPost />,
          },
          {
            path: "saved",
            element: <SavedPost />,
          },
        ],
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
