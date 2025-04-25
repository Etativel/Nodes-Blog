import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostHead from "../components/PostHead";
import "../styles/PostPage.css";
import Loader from "../components/Loader";
import CommentSection from "../components/CommentSection";
import timePosted from "../utils/formatTime";

function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCurrentPost() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/post/${postId}`,

          {
            credentials: "include",
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const postData = await response.json();
        if (!postData.post) {
          navigate("/404"); // Redirect to 404 page if post doesn't exist
          return;
        }
        setPost(postData.post);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching post: ", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentPost();
  }, [postId, navigate]);

  useEffect(() => {
    if (post?.content && window.hljs) {
      setTimeout(() => {
        document.querySelectorAll("pre code").forEach((block) => {
          window.hljs.highlightElement(block);
        });
      }, 1000);
    }
  }, [post?.content]);

  return (
    <>
      <div className="blog-post-container">
        {loading ? (
          <Loader />
        ) : (
          // <div class Name="sd">ddd</div>
          <>
            <PostHead postId={postId} post={post}></PostHead>

            <div className="post-container">
              {post && post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p>No current post</p>
              )}
            </div>

            <div className="liner">&nbsp;</div>
            <CommentSection
              postId={postId}
              comments={post?.comments}
              timePosted={timePosted}
              postAuthorId={post.authorId}
            />
          </>
        )}
      </div>
    </>
  );
}

export default PostPage;
