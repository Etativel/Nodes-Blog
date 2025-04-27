import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostHead from "../../components/Post/PostHead";
import "./Post.css";
import Loader from "../../components/Loader/Loader";
import CommentSection from "../../components/Post/CommentSection";
import timePosted from "../../utils/formatTime";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCurrentPost() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://nodes-blog-api-production.up.railway.app/post/${postId}`,

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

            {/* This part bellow user the styling from PostPage.css */}
            {/* <div className="post-container">
              {post && post.content ? (
                <div
                  className="post-preview"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p>No current post</p>
              )}
            </div> */}

            {/* This part bellow use the styling from PostCreation.css */}
            <div className="blog-post-preview">
              <div className="preview-post-container">
                {post?.content ? (
                  <div
                    className="post-preview"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <p></p>
                )}
              </div>
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

export default Post;
