import { useContext, useState, useEffect } from "react";
import "../styles/PostHead.css";
import { useNavigate } from "react-router-dom";
import ProfileContext from "../contexts/context-create/ProfileContext";

function PostHead({
  title,
  username,
  timePosted,
  estimateReadingTime,
  profilePicture,
  userColor,
  fullName,
  postAuthor,
}) {
  const { author, loading } = useContext(ProfileContext);
  const [followers, setFollowers] = useState(postAuthor?.following || []);
  const [isFollowing, setIsFollowing] = useState(
    followers.some((f) => f.followerId === author?.id)
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (postAuthor && author) {
      setFollowers(postAuthor.following || []);
      setIsFollowing(
        postAuthor.following?.some((f) => f.followerId === author.id)
      );
    }
  }, [postAuthor, author]);

  useEffect(() => {
    if (postAuthor) {
      setFollowers(postAuthor.following);
    }
  }, [postAuthor]);

  async function toggleFollow(e) {
    e.preventDefault();
    setIsFollowing((prevState) => !prevState);

    setFollowers((prev) => {
      if (isFollowing) {
        return prev.filter((f) => f.followerId !== author.id);
      } else {
        return [...prev, { followerId: author.id }];
      }
    });

    try {
      let updatedFollowers;
      if (isFollowing) {
        const response = await fetch("http://localhost:3000/user/unfollow", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            followerId: author.id,
            followingId: postAuthor.id,
          }),
        });

        if (response.ok) {
          updatedFollowers = followers.filter(
            (f) => f.followerId !== author.id
          );
        } else {
          return;
        }
      } else {
        const response = await fetch("http://localhost:3000/user/follow", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            followerId: author.id,
            followingId: postAuthor.id,
          }),
        });
        if (response.ok) {
          updatedFollowers = [...followers, { followerId: author.id }];
        } else {
          return;
        }
      }
      setFollowers(updatedFollowers);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  }

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
            {loading ? (
              ""
            ) : author.username === username ? (
              ""
            ) : (
              <button
                className="follow-btn followed"
                onClick={(e) => toggleFollow(e)}
              >
                ·
                <p className={`follow-text ${isFollowing ? "" : "follow"}`}>
                  {isFollowing ? "Following" : "Follow"}
                </p>
              </button>
            )}
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
