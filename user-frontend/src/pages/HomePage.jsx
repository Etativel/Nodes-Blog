import Navigation from "../components/Navbar";
import PostsContainer from "../components/PostsContainer";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ProfileProvider } from "../contexts/ProfileContext.jsx";
function Homepage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3000/auth/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        setProfile(() => data);
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
    return <div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <div className="homepage-container">
      <ProfileProvider>
        <Navigation profile={profile}></Navigation>
      </ProfileProvider>
      <PostsContainer></PostsContainer>
    </div>
  );
}

export default Homepage;
