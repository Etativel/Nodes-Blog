import { useEffect, useState } from "react";
import "../styles/PostsContainer.css";
import PostCard from "./PostCard";

function PostsContainer() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("http://localhost:3000/post");
        if (!response) {
          throw new Error(`Http error! status ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.posts);
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
      <h2>📢 Blog Posts</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        <>
          {posts.map((post) => (
            //   <div>{post}</div>
            <PostCard
              postTitle={post.title}
              authorName={post.authorId}
              postSubtext="I’ve used these features of Git for years across teams and projects. I’m still developing opinions around some workflows (like to squash or not) but the core tooling is powerful and flexible (and scriptable!"
              postDate={post.createdAt}
              postComment={post.comments}
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
