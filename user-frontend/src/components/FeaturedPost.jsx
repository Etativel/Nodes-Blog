import { useEffect, useState } from "react";
import "../styles/FeaturedPost.css";
// import SmallLoader from "./SmallLoader";
import timePosted from "../utils/formatTime";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";

function FeaturedPostCard({ post }) {
  function redirectToPost() {
    window.location.href = `/post/${post.id}`;
  }
  return (
    <div className="featured-post-card-container card" onClick={redirectToPost}>
      <div className="featured-profile">
        {post.author.profilePicture ? (
          <img
            src={formatCloudinaryUrl(post.author.profilePicture, {
              width: 25,
              height: 25,
              crop: "fit",
              quality: "auto:best",
              format: "auto",
              dpr: 3,
            })}
            alt="featured-profile-image"
            className="author-pict"
          />
        ) : (
          <div
            className="featured-profile-image"
            style={{
              backgroundColor: post.author.userColor,
            }}
          >
            <p>{post.author.username.charAt(0)}</p>
          </div>
        )}
        {/* <img
          className="featured-profile-image"
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGZlYXR1cmVkJTIwcG9zdHxlbnwwfHx8fDE2OTI3NTQ5MjE&ixlib=rb-4.0.3&q=80&w=400"
          alt="Profile"
        /> */}
        <div className="featured-profile-name">
          {post.author.fullName || post.author.username}
        </div>
      </div>
      <div className="featured-title">
        <p className="featured-post-title">
          {post.title.length > 80
            ? `${post.title.slice(0, 80)}...`
            : post.title}
        </p>
      </div>
      <div className="featured-date">
        <p className="featured-post-date">{timePosted(post.createdAt)}</p>
      </div>
    </div>
  );
}

function FeaturedPost() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(featuredPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://nodes-blog-api-production.up.railway.app/post/featured-n-trending-post",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.log("Failed to fetch posts");
          setLoading(false);
        }
        const data = await response.json();
        setFeaturedPosts(data.featuredPosts);
        setTrendingPosts(data.trendingPosts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="featured-post-container">
      {loading ? (
        ""
      ) : (
        <>
          <div className="card-title-fp">Featured Post</div>
          {featuredPosts.map((post) => (
            <FeaturedPostCard key={post.id} post={post} />
          ))}
          <div className="card-title-fp">Trending Post</div>
          {trendingPosts.map((post) => (
            <FeaturedPostCard key={post.id} post={post} />
          ))}
        </>
      )}
      {/* <div className="card-title-fp">Featured Post</div>
      <FeaturedPostCard />
      <FeaturedPostCard />
      <FeaturedPostCard />
      <br />
      <div className="card-title-fp">Trending Post</div>
      <FeaturedPostCard />
      <FeaturedPostCard />
      <FeaturedPostCard /> */}
    </div>
  );
}

export default FeaturedPost;
