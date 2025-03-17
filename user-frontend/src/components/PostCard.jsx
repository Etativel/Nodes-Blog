import { Link } from "react-router-dom";
import "../styles/PostCard.css";
import profile from "../assets/img/cat.jpg";
// import { useEffect, useState } from "react";
import { useAuthor } from "../utils/useAuthor";
function PostCard({
  authorId,
  postTitle,
  postDate,
  postComment,
  postId,
  thumbnail,
  excerpt,
}) {
  const { author, loading, error } = useAuthor(authorId);

  const formattedDate = new Date(postDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const stripTitle =
    postTitle.substring(0, 50) + (postTitle.length > 50 ? "..." : "");

  const stripExcerpt =
    excerpt.substring(0, 100) + (excerpt.length > 100 ? "..." : "");

  const handleClick = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
  };

  return (
    <Link
      className="postcard-container"
      to={`/post/${postId}`}
      onClick={handleClick}
    >
      <div className="top">
        <div className="left">
          <div className="profile">
            <img src={profile} alt="profile-pict" className="author-pict" />
            <span className="author-name">
              {loading ? "" : error ? "" : author?.username || authorId}
            </span>
          </div>
          <div className="post-title">{stripTitle}</div>
          <div className="post-subtext">{stripExcerpt}</div>
        </div>
        <div
          className="right"
          style={{
            backgroundImage: `url(${thumbnail ? thumbnail : profile})`,
          }}
        >
          {/* <img
            src={thumbnail ? thumbnail : profile}
            alt=""
            className="post-header-img"
          /> */}
        </div>
      </div>
      <div className="bottom">
        <div className="post-info">
          <div className="left-info">
            <div className="date">{formattedDate}</div>
            <div className="comment">{postComment.length}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
