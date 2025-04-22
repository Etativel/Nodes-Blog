import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import PostHead from "../components/PostHead";
import "../styles/PostPage.css";
import Loader from "../components/Loader";
import CommentSection from "../components/CommentSection";
import timePosted from "../utils/formatTime";
import estimateReadingTime from "../utils/estimateReadingTime";

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

  return (
    <>
      <div className="blog-post-container">
        {loading ? (
          <Loader />
        ) : (
          // <div class Name="sd">ddd</div>
          <>
            <PostHead
              title={post.title}
              username={post.author.username}
              authorId={post.authorId}
              profilePicture={post.author.profilePicture}
              timePosted={timePosted(post.createdAt)}
              estimateReadingTime={estimateReadingTime(post.content)}
              userColor={post.author.userColor}
              fullName={post.author.fullName}
              postAuthor={post.author}
              likedBy={post.likedBy}
              bookmarkedBy={post.bookmarkedBy}
              postId={postId}
              post={post}
            ></PostHead>

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
