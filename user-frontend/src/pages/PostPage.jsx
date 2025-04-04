import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../components/Navbar";
import PostHead from "../components/PostHead";
import "../styles/PostPage.css";
import Loader from "../components/Loader";
import CommentSection from "../components/CommentSection";
function timePosted(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const units = [
    { unit: "year", value: 31536000 },
    { unit: "month", value: 2592000 },
    { unit: "week", value: 604800 },
    { unit: "day", value: 86400 },
    { unit: "hour", value: 3600 },
    { unit: "minute", value: 60 },
    { unit: "second", value: 1 },
  ];

  for (const { unit, value } of units) {
    const diff = Math.floor(seconds / value);
    if (Math.abs(diff) >= 1) {
      return rtf.format(-diff, unit);
    }
  }

  return "just now";
}
function estimateReadingTime(text, wordsPerMinute = 400) {
  const words = text.trim().split(/\s+/).length;
  const minutes = words / wordsPerMinute;

  if (minutes < 1) {
    return `${Math.ceil(minutes * 60)} sec read`;
  }
  return `${Math.ceil(minutes)} min read`;
}
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
        setPost(postData.post);
      } catch (error) {
        console.error("Error fetching post: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentPost();
  }, [postId]);

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
            ></PostHead>

            <div className="post-container">
              {post && post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p>No current post</p>
              )}
            </div>
            <div className="liner">&nbsp;</div>
            <CommentSection postId={postId} />
          </>
        )}
      </div>
    </>
  );
}

export default PostPage;
