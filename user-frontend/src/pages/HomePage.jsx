import PostsContainer from "../components/PostsContainer";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

function Homepage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/auth/profile", {
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
    <div className="homepage-container">
      <PostsContainer></PostsContainer>
    </div>
  );
}

export default Homepage;
