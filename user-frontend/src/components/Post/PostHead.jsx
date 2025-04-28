import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext, PostContext } from "../../contexts/context-create";
import { ReportForm, CloseButton } from "../../shared";
import {
  formatCloudinaryUrl,
  estimateReadingTime,
  timePosted,
} from "../../utils";
import {
  HeartIcon,
  BookmarkIcon,
  StarIcon,
  ThreeDotsIcon,
  PencilIcon,
  FlagIcon,
} from "../../assets/svg";
import "./PostHead.css";

function PostHead({ postId, post }) {
  const { author, loading } = useContext(ProfileContext);
  const { setPostToEdit } = useContext(PostContext);
  const [followers, setFollowers] = useState(post.author?.following || []);
  const [isFollowing, setIsFollowing] = useState(
    followers.some((f) => f.followerId === author?.id)
  );
  const navigate = useNavigate();
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
  const readTime = useMemo(
    () => estimateReadingTime(post.content),
    [post.content]
  );
  const when = useMemo(() => timePosted(post.createdAt), [post.createdAt]);
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

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (post.likedBy && author) {
      setPostLike(post.likedBy.some((u) => u.id === author.id));
    }
    if (post.bookmarkedBy && author) {
      setPostBookmark(post.bookmarkedBy.some((u) => u.id === author.id));
    }
    if (post && post.isFeatured) {
      setPostFeatured(post.isFeatured);
    }
  }, [post.likedBy, post.bookmarkedBy, author, post]);

  useEffect(() => {
    if (post.author && author) {
      const list = post.author.following || [];
      setFollowers(list);
      setIsFollowing(list.some((f) => f.followerId === author.id));
    }
  }, [post.author, author]);

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
              followingId: post.author.id,
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
              followingId: post.author.id,
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
    navigate(`/@${post.author.username}`);
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
          <CloseButton onClick={() => setDialogOpen(false)} />
          <ReportForm
            contentId=""
            uniqueClassname="post-head"
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
      <p className="post-title-head">{post.title}</p>
      <div className="author-and-post-info">
        <div className="left-head">
          {post.author.profilePicture ? (
            <img
              onClick={redirectUserPage}
              className="profile-pict"
              src={formatCloudinaryUrl(post.author.profilePicture, {
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
                backgroundColor: post.author.userColor,
              }}
            >
              {post.author.username.charAt(0)}
            </div>
          )}
        </div>
        <div className="right-head">
          <div className="r-h-flex">
            <p className="post-author" onClick={redirectUserPage}>
              {post.author.fullName || post.author.username}
            </p>
            {loading ? (
              ""
            ) : author.username === post.author.username ? (
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
            <p className="time-to-read">{readTime}</p>·
            <p className="post-date">{when}</p>
          </div>
        </div>
        <div className="post-end">
          <button
            className="post-like hover-effect"
            aria-label="like-post"
            onClick={(e) => {
              toggleLike(e);
            }}
          >
            {postLike ? (
              <HeartIcon
                isOutline={false}
                className="post-like-icon"
                fill="red"
              />
            ) : (
              <HeartIcon
                isOutline={true}
                className="post-like-icon"
                stroke="red"
                strokeWidth={1}
                fill="red"
              />
            )}
          </button>
          <button
            className="post-bookmark hover-effect"
            aria-label="bookmark-post"
            onClick={(e) => toggleBookmark(e)}
          >
            {!postBookmark ? (
              <BookmarkIcon
                isOutline={true}
                className="post-bookmark-icon"
                stroke="#1a8917"
                strokeWidth={1}
              />
            ) : (
              <BookmarkIcon
                isOutline={false}
                className="post-bookmark-icon"
                fill="#1a8917"
              />
            )}
          </button>
          {author?.role === "SUPERADMIN" ? (
            <button
              className="post-feature hover-effect"
              aria-label="feature-post"
              onClick={(e) => toggleFeature(e)}
            >
              {!postFeatured ? (
                <StarIcon
                  className="post-featured-icon"
                  stroke="yellow"
                  strokeWidth={1}
                />
              ) : (
                <StarIcon
                  isOutline={false}
                  className="post-featured-icon"
                  fill="yellow"
                />
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
              {post.author?.id === author?.id ? (
                <button
                  className="edit-post"
                  aria-label="edit-post"
                  onClick={() => {
                    handleEditPost();
                  }}
                >
                  <PencilIcon
                    stroke="currentColor"
                    strokeWidth={1}
                    className="edit-post-icon"
                  />
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
                  <FlagIcon
                    strokeWidth={1}
                    stroke="currentColor"
                    className="report-post-icon"
                  />
                  Report post
                </button>
              )}
            </div>

            <ThreeDotsIcon
              strokeWidth={1}
              stroke="currentColor"
              className="post-options-icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostHead;
