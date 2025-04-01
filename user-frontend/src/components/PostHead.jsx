import "../styles/PostHead.css";
import { useNavigate } from "react-router-dom";

function PostHead({
  title,
  username,
  timePosted,
  estimateReadingTime,
  profilePicture,
  userColor,
  fullName,
}) {
  const navigate = useNavigate();
  function redirectUserPage() {
    navigate(`/@${username}`);
  }
  return (
    <div className="post-head-container">
      <p className="post-title-head">{title}</p>
      <div className="author-and-post-info">
        <div className="left-head">
          {profilePicture ? (
            <img
              onClick={redirectUserPage}
              className="profile-pict"
              src={profilePicture}
              alt="profile-pict"
            />
          ) : (
            <div
              onClick={redirectUserPage}
              className="profile-pict"
              style={{
                backgroundColor: userColor,
              }}
            >
              {username.charAt(0)}
            </div>
          )}
        </div>
        <div className="right-head">
          <div className="r-h-flex">
            <p className="post-author" onClick={redirectUserPage}>
              {fullName || username}
            </p>
            <button className="follow-btn followed">
              ·<p>Follow</p>
            </button>
          </div>

          <div className="post-info">
            <p className="time-to-read">{estimateReadingTime}</p>·
            <p className="post-date">{timePosted}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostHead;
