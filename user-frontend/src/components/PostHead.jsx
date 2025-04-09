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
        <div className="post-end">
          <button className="post-like" aria-label="like-post">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="red"
              className="size-6 post-like-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
          <button className="post-bookmark" aria-label="bookmark-post">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="#1a8917"
              className="size-6 post-bookmark-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </button>
          <button className="post-options" aria-label="post-options">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-6 post-options-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostHead;
