import "../styles/PostHead.css";
import defaultProfile from "../assets/profilePict/profile-picture.png";

function PostHead({ title, username, timePosted, estimateReadingTime }) {
  return (
    <div className="post-head-container">
      <p className="post-title-head">{title}</p>
      <div className="author-and-post-info">
        <div className="left-head">
          <img
            className="profile-pict"
            src={defaultProfile}
            alt="profile-pict"
          />
        </div>
        <div className="right-head">
          <p className="post-author">{username}</p>
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
