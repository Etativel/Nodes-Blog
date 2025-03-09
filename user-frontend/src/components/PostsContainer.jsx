import { useEffect, useState } from "react";

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
    <div>
      <h2>📢 Blog Posts</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{post.title}</h3>
              {/* Render TinyMCE content safely */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              <small>
                📝 By {post.authorId} | 🕒{" "}
                {new Date(post.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default PostsContainer;
