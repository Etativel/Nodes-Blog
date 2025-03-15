import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../components/Navbar";
import "../styles/PostPage.css";
function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentPost() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/post/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const postData = await response.json();
        console.log("Fetched Post:", Object.keys(postData.post));
        setPost(postData.post);
      } catch (error) {
        console.error("Error fetching post: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentPost();
  }, [postId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="blog-post-container">
      <Navigation></Navigation>
      {post && post.content ? (
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      ) : (
        <p>No current post</p>
      )}
    </div>
  );
}

export default PostPage;
