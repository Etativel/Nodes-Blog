import { useContext, useState, useEffect, useRef } from "react";
import "../styles/PostHead.css";
import { useNavigate } from "react-router-dom";
import ProfileContext from "../contexts/context-create/ProfileContext";
import PostContext from "../contexts/context-create/PostContext";

function PostHead({
  title,
  username,
  timePosted,
  estimateReadingTime,
  profilePicture,
  userColor,
  fullName,
  postAuthor,
  likedBy,
  bookmarkedBy,
  postId,
  post,
}) {
  const { author, loading } = useContext(ProfileContext);
  const { setPostToEdit } = useContext(PostContext);
  const [followers, setFollowers] = useState(postAuthor?.following || []);
  const [isFollowing, setIsFollowing] = useState(
    followers.some((f) => f.followerId === author?.id)
  );
  const postDropdownRef = useRef(null);
  const toggleDropdownRef = useRef(null);
  const [postLike, setPostLike] = useState(false);
  const [postBookmark, setPostBookmark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (postDropdownRef.current) {
        postDropdownRef.current.classList.add("active");
      }
    } else {
      if (postDropdownRef.current) {
        postDropdownRef.current.classList.remove("active");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        postDropdownRef.current &&
        !postDropdownRef.current.contains(e.target) &&
        toggleDropdownRef.current &&
        !toggleDropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });
  console.log(postAuthor);
  useEffect(() => {
    if (likedBy && author) {
      setPostLike(likedBy.some((u) => u.id === author.id));
    }
    if (bookmarkedBy && author) {
      setPostBookmark(bookmarkedBy.some((u) => u.id === author.id));
    }
  }, [likedBy, bookmarkedBy, author]);

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

  async function toggleLike(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/post/${postId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: author.id,
          }),
        }
      );
      if (!response.ok) {
        console.error("Toggle like failed", response.status);
      }
      const data = await response.json();
      setPostLike(data.liked);
    } catch (error) {
      console.log(error);
    }
  }

  async function toggleBookmark(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/post/${postId}/bookmark`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: author.id,
          }),
        }
      );
      if (!response.ok) {
        console.error("Toggle bookmark failed", response.status);
      }
      const data = await response.json();
      setPostBookmark(data.bookmarked);
    } catch (error) {
      console.log(error);
    }
  }

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

  function handleEditPost() {
    console.log(post);
    setPostToEdit({
      postId: post.id,
      content: post.content,
      excerpt: post.excerpt,
      published: post.published,
      title: post.title,
      thumbnail: post.thumbnail,
    });
    navigate("/creator/write-post");
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
          <button
            className="post-like"
            aria-label="like-post"
            onClick={(e) => {
              toggleLike(e);
            }}
          >
            {postLike ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="red"
                  className="size-6 post-like-icon"
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </>
            ) : (
              <>
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
              </>
            )}
          </button>
          <button
            className="post-bookmark"
            aria-label="bookmark-post"
            onClick={(e) => toggleBookmark(e)}
          >
            {!postBookmark ? (
              <>
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
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#1a8917"
                  className="size-6 post-bookmark-icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
          <button
            ref={toggleDropdownRef}
            className="post-options"
            aria-label="post-options"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <div className="post-options-dropdown" ref={postDropdownRef}>
              {postAuthor?.id === author?.id ? (
                <button
                  className="edit-post"
                  aria-label="edit-post"
                  onClick={() => {
                    handleEditPost();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-6 edit-post-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                  Edit post
                </button>
              ) : (
                <button
                  className="report-post"
                  onClick={() => {
                    console.log("report");
                  }}
                  aria-label="report-post"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-6 report-post-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                    />
                  </svg>
                  Report post
                </button>
              )}
            </div>
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
