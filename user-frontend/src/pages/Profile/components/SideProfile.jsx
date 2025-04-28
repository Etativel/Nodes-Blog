import { useState, useEffect } from "react";
import { formatCloudinaryUrl } from "../../../utils";

function SideProfile({
  pageUsername,
  dialogCtr,
  profileForm,
  isOpen,
  setIsOpen,
  loadingProfile,
  visitedUser,
  author,
  loading,
  toggleFollowerDialog,
}) {
  const [followers, setFollowers] = useState(visitedUser?.following || []);

  const [isFollowing, setIsFollowing] = useState(
    followers.some((f) => f.followerId === author?.id)
  );

  useEffect(() => {
    if (visitedUser && author) {
      setFollowers(visitedUser.following || []);
      setIsFollowing(
        visitedUser.following?.some((f) => f.followerId === author.id)
      );
    }
  }, [visitedUser, author]);

  useEffect(() => {
    if (visitedUser) {
      setFollowers(visitedUser.following);
    }
  }, [visitedUser]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (dialogCtr.current) {
          profileForm.current.classList.add("active");
          dialogCtr.current.classList.add("active");
        }
      }, 10);
    } else {
      if (dialogCtr.current) {
        profileForm.current.classList.remove("active");
        dialogCtr.current.classList.remove("active");
      }
    }
  }, [isOpen, dialogCtr, profileForm]);

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
        const response = await fetch(
          "https://nodes-blog-api-production.up.railway.app/user/unfollow",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              followerId: author.id,
              followingId: visitedUser.id,
            }),
          }
        );

        if (response.ok) {
          updatedFollowers = followers.filter(
            (f) => f.followerId !== author.id
          );
        } else {
          return;
        }
      } else {
        const response = await fetch(
          "https://nodes-blog-api-production.up.railway.app/user/follow",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },

            credentials: "include",
            body: JSON.stringify({
              followerId: author.id,
              followingId: visitedUser.id,
            }),
          }
        );
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

  return (
    <>
      <div className="side-profile-ctr">
        <div className="profile-left">
          {loadingProfile ? (
            ""
          ) : visitedUser.profilePicture ? (
            <img
              src={formatCloudinaryUrl(visitedUser.profilePicture, {
                width: 80,
                height: 80,
                crop: "fit",
                quality: "auto:best",
                format: "auto",
                dpr: 3,
              })}
              alt=""
              className="side-profile-pict"
            />
          ) : (
            <div
              className="side-profile-pict"
              style={{
                backgroundColor: visitedUser.userColor,
              }}
            >
              <p>{visitedUser.username.charAt(0)}</p>
            </div>
          )}
        </div>

        <div className="side-profile-name-ctr">
          <span className="user-full-name">
            <div className="text-full-name-ctr">
              {loadingProfile
                ? ""
                : visitedUser.fullName
                ? visitedUser.fullName
                : visitedUser.username}
              {visitedUser.username === "etativel" && (
                <span className="is-user-dev">Dev</span>
              )}
            </div>

            <p className="side-profile-username">@{visitedUser.username}</p>
          </span>
        </div>
        <div className="follower-ctr">
          <span className="user-follower-count" onClick={toggleFollowerDialog}>
            {followers.length} Followers
          </span>
        </div>
        <div className="bio-ctr">
          <span className="user-biography">
            {loadingProfile ? "" : visitedUser.biography}
          </span>
        </div>
        {loading ? (
          ""
        ) : author.username === pageUsername ? (
          <div className="edit-profile-btn-ctr">
            <button
              className="edit-profile-btn"
              onClick={() => setIsOpen(!isOpen)}
            >
              Edit profile
            </button>
          </div>
        ) : (
          <button
            className={`user-side-follow-btn ${
              isFollowing ? "follow" : "unfollow"
            }`}
            onClick={(e) => toggleFollow(e)}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    </>
  );
}

export default SideProfile;
