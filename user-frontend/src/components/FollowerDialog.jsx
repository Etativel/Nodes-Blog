import { useRef, useEffect, useState } from "react";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";
import "../styles/FollowerDialog.css";
import { Link } from "react-router-dom";

function FollowedUserCard({ follower, onClose }) {
  return (
    <Link
      key={follower.id}
      className="follower-item"
      to={`/@${follower.username}`}
      onClick={onClose}
    >
      <div className="follower-profile">
        {follower.profilePicture ? (
          <img
            src={formatCloudinaryUrl(follower.profilePicture, {
              width: 40,
              height: 40,
              crop: "fit",
              quality: "auto:best",
              format: "auto",
              dpr: 3,
            })}
            alt=""
            className="follower-profile-pic"
          />
        ) : (
          <div
            className="follower-profile-pic-placeholder"
            style={{
              backgroundColor: follower.userColor,
            }}
          >
            <p>{follower.username.charAt(0).toUpperCase()}</p>
          </div>
        )}

        <div className="follower-info">
          <div className="follower-name">
            {follower.fullName || follower.username}
          </div>
          <div className="follower-username">@{follower.username}</div>
          <div className="follower-bio">{follower.biography}</div>
        </div>
      </div>
    </Link>
  );
}

function FollowerDialog({ isOpen, onClose, visitedUser }) {
  const followerDialogRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [visitedUserFollower, setVisitedUserFollower] = useState([]);

  useEffect(() => {
    console.log(visitedUserFollower);
  }, [visitedUserFollower]);

  useEffect(() => {
    async function fetchFollowers() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nodes-blog-api-production.up.railway.app/user/user-follow/${visitedUser.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.log("Failed to retrieve data ", response.statusText);
        }

        const data = await response.json();
        setVisitedUserFollower(data.followers);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch user follow", error);
        setLoading(false);
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (followerDialogRef.current) {
          followerDialogRef.current.classList.add("active");
        }
      }, 10);
      fetchFollowers();
    } else {
      document.body.style.overflow = "auto";
      if (followerDialogRef.current) {
        followerDialogRef.current.classList.remove("active");
      }
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, visitedUser]);

  if (!isOpen) return null;

  return (
    <div className="follower-dialog-overlay" onClick={onClose}>
      <div
        className="follower-dialog"
        ref={followerDialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="follower-dialog-header">
          <h2>Followers</h2>
          <button className="close-dialog-btn" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-6 x-logo"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="follower-dialog-content">
          {loading ? (
            <div className="follower-loading">Loading followers...</div>
          ) : visitedUserFollower.length === 0 ? (
            <div className="no-followers">No followers yet</div>
          ) : (
            <ul className="follower-list">
              {visitedUserFollower.map((follower) => (
                <FollowedUserCard
                  key={follower.id}
                  follower={follower}
                  onClose={onClose}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowerDialog;
