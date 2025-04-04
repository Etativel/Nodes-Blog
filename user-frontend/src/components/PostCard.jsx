import { Link } from "react-router-dom";
import "../styles/PostCard.css";
import profile from "../assets/img/cat.jpg";
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
            {loading ? (
              ""
            ) : author.profilePicture ? (
              <img
                src={author.profilePicture}
                alt="profile-pict"
                className="author-pict"
              />
            ) : (
              <div
                className="author-pict-div"
                style={{
                  backgroundColor: loading
                    ? ""
                    : error
                    ? ""
                    : author?.userColor,
                }}
              >
                <p>{loading ? "" : error ? "" : author?.username.charAt(0)}</p>
              </div>
            )}
            <span className="author-name">
              {loading
                ? ""
                : error
                ? ""
                : author.fullName
                ? author.fullName
                : author?.username || authorId}
            </span>
          </div>
          <div className="post-title">{stripTitle}</div>
          <div className="post-subtext">{stripExcerpt}</div>
        </div>
        {thumbnail ? (
          <div
            className="right"
            style={{
              backgroundImage: `url(${thumbnail ? thumbnail : profile})`,
            }}
          ></div>
        ) : (
          ""
        )}
      </div>
      <div className="bottom">
        <div className="post-info">
          <div className="left-info">
            <div className="date">{formattedDate}</div>
            <div className="comment-p">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#737373"
                className="size-6 comment-icon"
              >
                <path
                  fillRule="evenodd"
                  d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                  clipRule="evenodd"
                />
              </svg>

              <span>
                {postComment.length > 100 ? "100+" : postComment.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
