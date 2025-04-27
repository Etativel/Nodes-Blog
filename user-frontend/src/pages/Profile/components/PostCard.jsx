import formatCloudinaryUrl from "../../../utils/cloudinaryUtils";
import { CommentIcon, HeartIcon } from "../../../assets/svg";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  const stripExcerpt =
    post.excerpt?.substring(0, 100) + (post.excerpt?.length > 100 ? "..." : "");
  const stripTitle =
    post.title.substring(0, 50) + (post.title.length > 50 ? "..." : "");

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="postcard-flex">
      <Link className="postcard-container" to={`/post/${post.id}`}>
        <div className="top">
          <div className="left">
            <div className="profile">
              {post.author.profilePicture ? (
                <img
                  src={formatCloudinaryUrl(post.author.profilePicture, {
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
                    backgroundColor: post.author.userColor,
                  }}
                >
                  <p>{post.author.username.charAt(0)}</p>
                </div>
              )}
              <span className="author-name">
                {post.author.fullName
                  ? post.author.fullName
                  : post.author?.username || post.authorId}
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
                {post._count.likedBy < 1 ? (
                  <HeartIcon
                    isOutline={true}
                    className="heart=icon-card"
                    color="red"
                    strokeWidth={1.5}
                    stroke="red
                    "
                  />
                ) : (
                  <>
                    <HeartIcon
                      isOutline={false}
                      className="heart-icon-card"
                      color="red"
                      strokeWidth={1.5}
                      stroke="red"
                    />
                  </>
                )}

                <span>
                  {post._count.likedBy > 100 ? "100+" : post._count.likedBy}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PostCard;
