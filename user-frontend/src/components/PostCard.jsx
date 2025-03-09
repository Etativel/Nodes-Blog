import "../styles/PostCard.css";
import profile from "../assets/img/cat.jpg";

function PostCard({
  authorName,
  postTitle,
  postSubtext,
  postDate,
  postComment,
}) {
  const formattedDate = new Date(postDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return (
    <a className="postcard-container" href="/">
      <div className="top">
        <div className="left">
          <div className="profile">
            <img src={profile} alt="profile-pict" className="author-pict" />
            <a className="author-name" href="/youtube.com">
              {authorName}
            </a>
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
          <div className="right-info">
            <div className="save-post"></div>
            <div className="post-sett"></div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default PostCard;
