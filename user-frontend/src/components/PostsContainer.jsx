import { useEffect, useState } from "react";
import "../styles/PostsContainer.css";
import PostCard from "./PostCard";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";

function PostsContainer() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");

    if (!loading && location.pathname === "/posts" && savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, [loading, location.pathname]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("http://localhost:3000/post");
        if (!response) {
          throw new Error(`Http error! status ${response.status}`);
        }
        const data = await response.json();
        const published = data.posts.filter(
          (post) => post.published === true && post.status !== "BLOCKED"
        );
        setPosts(published);
        return data;
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="posts-container">
      {loading ? (
        <Loader />
      ) : posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              postTitle={post.title}
              authorId={post.authorId}
              postDate={post.createdAt}
              postComment={post.comments}
              postId={post.id}
              excerpt={post.excerpt || ""}
              thumbnail={post.thumbnail || null}
            ></PostCard>
          ))}
        </>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default PostsContainer;
