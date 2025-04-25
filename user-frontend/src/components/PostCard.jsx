import { Link } from "react-router-dom";
import "../styles/PostCard.css";
import { useAuthor } from "../utils/useAuthor";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";

function PostCard({ post }) {
  const { author, loading, error } = useAuthor(post.authorId);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const titleLength = post.thumbnail === null ? 200 : 80;

  const stripTitle =
    post.title.substring(0, titleLength) +
    (post.title.length > titleLength ? "..." : "");

  const stripExcerpt =
    post.excerpt?.substring(0, 100) + (post.excerpt?.length > 100 ? "..." : "");

  const handleClick = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
  };

  return (
    <Link
      className="postcard-container"
      to={`/post/${post.id}`}
      onClick={handleClick}
    >
      <div className="top">
        <div className="left">
          <div className="profile">
            {loading ? (
              ""
            ) : author.profilePicture ? (
              <img
                src={formatCloudinaryUrl(author.profilePicture, {
                  width: 25,
                  height: 25,
                  crop: "fit",
                  quality: "auto:best",
                  format: "auto",
                  dpr: 3,
                })}
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
                : author?.username || post.authorId}
            </span>
          </div>
          <div className="post-title">{stripTitle}</div>
          <div className="post-subtext">{stripExcerpt}</div>
        </div>
        {post.thumbnail || null ? (
          <div
            className="right"
            style={{
              backgroundImage: `url(${
                post.thumbnail
                  ? formatCloudinaryUrl(post.thumbnail, {
                      width: 200,
                      height: 150,
                      crop: "fit",
                      quality: "auto:best",
                      format: "auto",
                      dpr: 3,
                    })
                  : ""
              })`,
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
              {post.comments.length < 1 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-6  comment-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                  />
                </svg>
              ) : (
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
              )}

              <span>
                {post.comments.length > 100 ? "100+" : post.comments.length}
              </span>
            </div>
            <div className="heart-p">
              {post.likedCount < 1 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="red"
                  className="size-6 heart-icon-card"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="red"
                  className="size-6 heart-icon-card"
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              )}

              <span>{post.likedCount > 100 ? "100+" : post.likedCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
