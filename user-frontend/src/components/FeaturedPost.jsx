import { useEffect, useState } from "react";
import "../styles/FeaturedPost.css";

function FeaturedPostCard() {
  function redirectToPost() {
    window.location.href = "/posts/featured-post";
  }
  return (
    <div className="featured-post-card-container card" onClick={redirectToPost}>
      <div className="featured-profile">
        <img
          className="featured-profile-image"
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGZlYXR1cmVkJTIwcG9zdHxlbnwwfHx8fDE2OTI3NTQ5MjE&ixlib=rb-4.0.3&q=80&w=400"
          alt="Profile"
        />
        <div className="featured-profile-name">John Doe</div>
      </div>
      <div className="featured-title">
        <p className="featured-post-title">
          The Future of Technology Lorem ipsum dolor sit amet consectetur
          adipisicing elit.
        </p>
      </div>
      <div className="featured-date">
        <p className="featured-post-date">6 days ago</p>
      </div>
    </div>
  );
}

function FeaturedPost() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/featured");
        const data = await response.json();
        setFeaturedPosts(data.featuredPosts);
        setTrendingPosts(data.trendingPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  });
  return (
    <div className="featured-post-container">
      <div className="card-title-fp">Featured Post</div>
      <FeaturedPostCard />
      <FeaturedPostCard />
      <FeaturedPostCard />
      <br />
      <div className="card-title-fp">Trending Post</div>
      <FeaturedPostCard />
      <FeaturedPostCard />
      <FeaturedPostCard />
    </div>
  );
}

export default FeaturedPost;
