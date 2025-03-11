import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    async function fetchCurrentPost() {
      try {
        setLoading(true); // ✅ Set loading to true before fetching
        const response = await fetch(`http://localhost:3000/post/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const postData = await response.json();
        console.log("Fetched Post:", Object.keys(postData.post)); // ✅ Debugging: Check response structure
        setPost(postData.post);
      } catch (error) {
        console.error("Error fetching post: ", error);
      } finally {
        setLoading(false); // ✅ Ensure loading stops
      }
    }

    fetchCurrentPost();
  }, [postId]);

  if (loading) return <p>Loading...</p>; // ✅ Show loading while fetching data

  return (
    <div className="blog-post-container">
      {post && post.content ? (
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      ) : (
        <p>No current post</p>
      )}
    </div>
  );
}

export default PostPage;
