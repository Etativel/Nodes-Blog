import Navigation from "./components/Navigation/Navigation";
import Loader from "./components/Loader/Loader";

import { Outlet, Navigate } from "react-router-dom";

import { ProfileProvider } from "./contexts/ProfileProvider";
import { PostProvider } from "./contexts/PostPorvider";
import { ThemeProvider } from "./contexts/ThemeProvider";

import { useEffect, useState } from "react";

import "../src/components/Loader/Loader.css";
import "../src/styles/App.css";

function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://nodes-blog-api-production.up.railway.app/auth/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <ProfileProvider>
        <ThemeProvider>
          <PostProvider>
            <Navigation />
            <Outlet />
          </PostProvider>
        </ThemeProvider>
      </ProfileProvider>
    </>
  );
}

export default Layout;
