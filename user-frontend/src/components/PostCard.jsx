import { Link } from "react-router-dom";
import "../styles/PostCard.css";
import profile from "../assets/img/cat.jpg";

function PostCard({
  authorName,
  postTitle,
  postSubtext,
  postDate,
  postComment,
  postId,
}) {
  const formattedDate = new Date(postDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

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
            <span className="author-name">{authorName}</span>
          </div>
          <div className="post-title">{postTitle}</div>
          <div className="post-subtext">{postSubtext}</div>
        </div>
        <div className="right">
          <img src={profile} alt="" className="post-header-img" />
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
