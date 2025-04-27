import { Link } from "react-router-dom";
import "./PostCard.css";
import { useAuthor } from "../../utils/useAuthor";
import formatCloudinaryUrl from "../../utils/cloudinaryUtils";
import { HeartIcon, CommentIcon } from "../../assets/svg";

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
              <div className="author-pict-div-skeleton"></div>
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
                <CommentIcon
                  isOutline={true}
                  strokeWidth={1}
                  color="currentColor"
                  className="comment-icon"
                />
              ) : (
                <CommentIcon
                  isOutline={false}
                  strokeWidth={1}
                  color="currentColor"
                  fill="#737373"
                  className="comment-icon"
                />
              )}

              <span>
                {post.comments.length > 100 ? "100+" : post.comments.length}
              </span>
            </div>
            <div className="heart-p">
              {post.likedCount < 1 ? (
                <HeartIcon
                  isOutline={true}
                  className="heart-icon-card"
                  color="red"
                  stroke="red"
                  strokeWidth={1.5}
                />
              ) : (
                <HeartIcon
                  isOutline={false}
                  className="heart-icon-card"
                  color="red"
                  stroke="red"
                />
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
