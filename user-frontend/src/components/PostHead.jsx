import { useContext, useState, useEffect, useRef } from "react";
import "../styles/PostHead.css";
import { useNavigate } from "react-router-dom";
import ProfileContext from "../contexts/context-create/ProfileContext";
import PostContext from "../contexts/context-create/PostContext";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";

function ReportForm({
  setDialogOpen,
  reportType,
  setReportType,
  reportAdditionalInfo,
  setReportAdditionalInfo,
  handleReportSubmit,
  reportLoading,
}) {
  const disableButton =
    reportLoading || !reportType || reportAdditionalInfo.length > 160;
  return (
    <div className="report-from-ctr">
      <form onSubmit={(e) => handleReportSubmit(e)}>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="sexual-content"
            name="reportCategory"
            className="report-radio"
            value="sexual_content"
            checked={reportType === "sexual_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="sexual-content">Sexual content</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="violent-content"
            name="reportCategory"
            className="report-radio"
            value="violent_content"
            checked={reportType === "violent_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="violent-content">Violent or repulsive content</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="hateful-content"
            name="reportCategory"
            className="report-radio"
            value="hateful_content"
            checked={reportType === "hateful_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="hateful-content">Hateful or abusive content</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="harassment"
            name="reportCategory"
            className="report-radio"
            value="harassment"
            checked={reportType === "harassment"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="harassment">Harassment or bullying</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="dangerous-acts"
            name="reportCategory"
            className="report-radio"
            value="dangerous_acts"
            checked={reportType === "dangerous_acts"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="dangerous-acts">Harmful or dangerous acts</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="misinformation"
            name="reportCategory"
            className="report-radio"
            value="misinformation"
            checked={reportType === "misinformation"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="misinformation">Misinformation</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="child-abuse"
            name="reportCategory"
            className="report-radio"
            value="child_abuse"
            checked={reportType === "child_abuse"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="child-abuse">Child abuse</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="terrorism"
            name="reportCategory"
            className="report-radio"
            value="terrorism"
            checked={reportType === "terrorism"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="terrorism">Promotes terrorism</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="spam-misleading"
            name="reportCategory"
            className="report-radio"
            value="spam_misleading"
            checked={reportType === "spam_misleading"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="spam-misleading">Spam or misleading</label>
        </div>
        <div className="additional-info-ctr">
          <label htmlFor="add-info" className="add-info-text">
            Additional information
          </label>
          <textarea
            name="report-message"
            id="add-info"
            className="additional-info-txt"
            placeholder="Write here..."
            value={reportAdditionalInfo}
            onChange={(e) => {
              setReportAdditionalInfo(e.target.value);
            }}
          ></textarea>
          <div className="biography-length length-indicator">
            <span>{reportAdditionalInfo.length}</span>
            <span className="max-length">/160</span>
          </div>
        </div>
        <div className="submit-report-btn-ctr">
          <button
            aria-label="cancel-report"
            type="button"
            className="cancel-report-btn"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            aria-label="submit-report"
            type="submit"
            className={`submit-report-btn ${disableButton ? "disabled" : ""}`}
            disabled={disableButton}
          >
            Report
          </button>
        </div>
      </form>
    </div>
  );
}

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
  // console.log(author);
  const postReportFormRef = useRef(null);
  const reportCtrRef = useRef(null);
  const postDropdownRef = useRef(null);
  const toggleDropdownRef = useRef(null);
  const [postLike, setPostLike] = useState(false);
  const [postBookmark, setPostBookmark] = useState(false);
  const [postFeatured, setPostFeatured] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportAdditionalInfo, setReportAdditionalInfo] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => {
        if (reportCtrRef.current) {
          reportCtrRef.current.classList.add("active");
          postReportFormRef.current.classList.add("active");
        }
      }, 10);
    } else {
      if (reportCtrRef.current) {
        postReportFormRef.current.classList.remove("active");
        reportCtrRef.current.classList.remove("active");
      }
    }
  }, [dialogOpen, reportCtrRef, postReportFormRef]);

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

  useEffect(() => {
    if (likedBy && author) {
      setPostLike(likedBy.some((u) => u.id === author.id));
    }
    if (bookmarkedBy && author) {
      setPostBookmark(bookmarkedBy.some((u) => u.id === author.id));
    }
    if (post && post.isFeatured) {
      setPostFeatured(post.isFeatured);
    }
  }, [likedBy, bookmarkedBy, author, post]);

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
        `https://nodes-blog-api-production.up.railway.app/post/${postId}/like`,
        {
          method: "POST",
          credentials: "include",
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

  async function toggleFeature(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/post/feature-post/${postId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        console.error("Toggle feature failed", response.status);
        return;
      }
      const data = await response.json();
      setPostFeatured(data.featured);
    } catch (error) {
      console.log(error);
    }
  }

  async function toggleBookmark(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/post/${postId}/bookmark`,
        {
          method: "POST",
          credentials: "include",
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
        const response = await fetch(
          "https://nodes-blog-api-production.up.railway.app/user/unfollow",
          {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              followerId: author.id,
              followingId: postAuthor.id,
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
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              followerId: author.id,
              followingId: postAuthor.id,
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

  function redirectUserPage() {
    navigate(`/@${username}`);
  }

  function handleEditPost() {
    // console.log(post);
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

  function handleReportDialog() {
    setDialogOpen(!dialogOpen);
  }

  const CloseButton = () => (
    <button className="close-dialog-btn" onClick={() => setDialogOpen(false)}>
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
  );

  async function handleReportSubmit(e) {
    e.preventDefault();
    setReportLoading(true);
    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/post/report/${postId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reporterId: author?.id,
            type: reportType,
            message: reportAdditionalInfo,
          }),
        }
      );
      if (!response.ok) {
        setReportLoading(false);
        console.log("failed to fetch report", response.status);
      }
      await response.json();
      setReportLoading(false);
      setDialogOpen(false);
      setReportAdditionalInfo("");
      setReportType("");
    } catch (error) {
      setReportLoading(false);
      console.error("failed to report post", error);
    }
  }

  return (
    <div className="post-head-container">
      <div className="post-report-ctr" ref={reportCtrRef}>
        <div className="report-form" ref={postReportFormRef}>
          <div className="report-post-title">Report post</div>
          <CloseButton />
          <ReportForm
            setDialogOpen={setDialogOpen}
            reportType={reportType}
            setReportType={setReportType}
            reportAdditionalInfo={reportAdditionalInfo}
            setReportAdditionalInfo={setReportAdditionalInfo}
            handleReportSubmit={handleReportSubmit}
            reportLoading={reportLoading}
          />
        </div>
      </div>
      <p className="post-title-head">{title}</p>
      <div className="author-and-post-info">
        <div className="left-head">
          {profilePicture ? (
            <img
              onClick={redirectUserPage}
              className="profile-pict"
              src={formatCloudinaryUrl(profilePicture, {
                width: 55,
                height: 55,
                crop: "fit",
                quality: "auto:best",
                format: "auto",
                dpr: 3,
              })}
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
          {author?.role === "SUPERADMIN" ? (
            <button
              className="post-feature"
              aria-label="feature-post"
              onClick={(e) => toggleFeature(e)}
            >
              {!postFeatured ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="yellow"
                    className="size-6 post-featured-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="yellow"
                    className="size-6 post-featured-icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          ) : (
            ""
          )}
          <div
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
                    handleReportDialog();
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostHead;
