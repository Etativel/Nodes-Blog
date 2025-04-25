import Navigation from "./components/Navbar";
import { Outlet, Navigate } from "react-router-dom";
import { ProfileProvider } from "./contexts/ProfileProvider";
import { PostProvider } from "./contexts/PostPorvider";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import "../src/styles/Loader.css";
import "../src/styles/App.css";
import { ThemeProvider } from "./contexts/ThemeProvider";
import BottomNav from "./components/BottomNav";
function App() {
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
            <BottomNav />
          </PostProvider>
        </ThemeProvider>
      </ProfileProvider>
    </>
  );
}

export default App;
