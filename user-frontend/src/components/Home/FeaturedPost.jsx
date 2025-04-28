import { useEffect, useState } from "react";
import { timePosted, formatCloudinaryUrl } from "../../utils";
import SmallLoader from "../Loader/SmallLoader";
import "./FeaturedPost.css";

function FeaturedPostCard({ post }) {
  function redirectToPost() {
    window.location.href = `https://nodes-blog.up.railway.app/post/${post.id}`;
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

  // cache time : 1 hour
  const CACHE_DURATION = 60 * 60 * 1000;

  useEffect(() => {
    const fetchPostsFromAPI = async () => {
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
          return null;
        }

        const data = await response.json();

        const cacheData = {
          featuredPosts: data.featuredPosts,
          trendingPosts: data.trendingPosts,
          timestamp: Date.now(),
        };

        localStorage.setItem("cached_posts", JSON.stringify(cacheData));

        setFeaturedPosts(data.featuredPosts);
        setTrendingPosts(data.trendingPosts);
        setLoading(false);

        return data;
      } catch (error) {
        setLoading(false);
        console.error("Error fetching posts:", error);
        return null;
      }
    };

    const loadPosts = async () => {
      const cachedDataString = localStorage.getItem("cached_posts");

      if (cachedDataString) {
        try {
          const cachedData = JSON.parse(cachedDataString);
          const currentTime = Date.now();

          // check if the cache is still valid (less than 1 hour old)
          if (currentTime - cachedData.timestamp < CACHE_DURATION) {
            // use cached data
            setFeaturedPosts(cachedData.featuredPosts);
            setTrendingPosts(cachedData.trendingPosts);
            return;
          }
        } catch (e) {
          console.error("Error parsing cached data:", e);
        }
      }

      // fetch fresh data if no cache exists or cache is expired
      await fetchPostsFromAPI();
    };

    loadPosts();
  }, [CACHE_DURATION]);

  return (
    <div className="featured-post-container">
      {loading ? (
        <SmallLoader />
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
    </div>
  );
}

export default FeaturedPost;
