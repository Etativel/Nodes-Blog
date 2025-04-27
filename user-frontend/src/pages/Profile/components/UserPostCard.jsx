import { useEffect, useRef, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PostContext } from "../../../contexts/context-create";
import formatCloudinaryUrl from "../../../utils/cloudinaryUtils";

import {
  CommentIcon,
  EditIcon,
  DeleteIcon,
  EyeWithLineIcon,
  ThreeDotsIcon,
  EyeIcon,
} from "../../../assets/svg";

function UserPostCard({
  title,
  thumbnail,
  createdAt,
  excerpt,
  comments,
  postId,
  onDelete,
  pageUsername,
  author,
  loading,
  published,
  post,
}) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const { setPostToEdit } = useContext(PostContext);
  const userPostDropdownRef = useRef(null);
  const toggleDropdownRef = useRef(null);
  const stripTitle = title.substring(0, 50) + (title.length > 50 ? "..." : "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingPostUpdate, setLoadingPostUpdate] = useState(false);
  const stripExcerpt =
    excerpt?.substring(0, 100) + (excerpt?.length > 100 ? "..." : "");
  const [publishStatus, setPublishStatus] = useState(published);
  const navigate = useNavigate();

  useEffect(() => {
    setPublishStatus(published);
  }, [published]);

  useEffect(() => {
    if (isDropdownOpen) {
      if (userPostDropdownRef.current) {
        userPostDropdownRef.current.classList.add("active");
      }
    } else {
      if (userPostDropdownRef.current) {
        userPostDropdownRef.current.classList.remove("active");
      }
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        userPostDropdownRef.current &&
        !userPostDropdownRef.current.contains(e.target) &&
        toggleDropdownRef.current &&
        !toggleDropdownRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  async function handleDelete(postId) {
    try {
      setLoadingPostUpdate(true);
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/post/delete/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log("failed to delete post", response.status);
        setLoadingPostUpdate(false);
      }
      await response.json();
      onDelete(postId);
      setLoadingPostUpdate(false);
    } catch (error) {
      console.error(error);
      setLoadingPostUpdate(false);
    }
  }

  async function handlePublish(newStatus) {
    setLoadingPostUpdate(true);
    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/post/publish/${postId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ published: newStatus }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log("Failed to update publish", response.status);
        setLoadingPostUpdate(false);
        return;
      }
      const data = await response.json();
      setPublishStatus(data.post.published);
      setLoadingPostUpdate(false);
    } catch (error) {
      console.error(error);
      setLoadingPostUpdate(false);
    }
  }

  function handleClick() {
    sessionStorage.setItem("profilePosition", window.scrollY);
  }

  function handleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
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

  return (
    <div className="postcard-flex">
      <Link
        className="postcard-parent-ctr"
        onClick={handleClick}
        to={`/post/${postId}`}
      >
        <div className="postcard-container-profile">
          <div className="top-p">
            <div className="left-p">
              <div className="post-title-p">{stripTitle}</div>
              <div className="post-subtext-p">
                {excerpt ? stripExcerpt : ""}
              </div>
            </div>
            {thumbnail ? (
              <div
                className="right-p"
                style={{
                  backgroundImage: `url(${
                    thumbnail
                      ? formatCloudinaryUrl(thumbnail, {
                          width: 170,
                          height: 120,
                          crop: "fit",
                          quality: "auto:best",
                          format: "auto",
                          dpr: 3,
                        })
                      : ""
                  })`,
                }}
              ></div>
            ) : (
              ""
            )}
          </div>
          <div className="bottom-p">
            <div className="post-info-p">
              <div className="left-info-p">
                <div className="date-p">{formattedDate}</div>

                <div className="comment-p">
                  {post.comments.length < 1 ? (
                    <CommentIcon
                      isOutline={true}
                      strokeWidth={1.5}
                      color="currentColor"
                      className="comment-icon"
                    />
                  ) : (
                    <CommentIcon
                      isOutline={false}
                      strokeWidth={1.5}
                      color="currentColor"
                      fill="#737373"
                      className="comment-icon"
                    />
                  )}

                  <span>
                    {comments.length > 100 ? "100+" : comments.length}
                  </span>
                </div>
                {post.status === "DRAFT" && (
                  <div className="draft-text">
                    <DraftIcon
                      stroke="red"
                      strokeWidth={1}
                      className="draft-icon"
                    />
                    <p>Draft</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      {loading ? (
        ""
      ) : author.username === pageUsername ? (
        <div className="user-post-dropdown-ctr">
          <div className="user-post-dropdown" ref={userPostDropdownRef}>
            <button
              className="edit-user-post"
              aria-label="edit-post"
              disabled={loadingPostUpdate}
              onClick={() => {
                handleEditPost();
              }}
            >
              <EditIcon
                strokeWidth={1}
                stroke="currentColor"
                className="edit-user-post-icon"
              />
              Edit post
            </button>
            <button
              className="delete-user-post"
              aria-label="delete-post"
              disabled={loadingPostUpdate}
              onClick={() => {
                setIsDropdownOpen(false);
                handleDelete(postId);
              }}
            >
              <DeleteIcon
                strokeWidth={1}
                stroke="currentColor"
                className="delete-user-post-icon"
              />
              Delete post
            </button>
            {post.status !== "DRAFT" ? (
              <button
                className="publish-user-post"
                aria-label="publish-post"
                disabled={loadingPostUpdate}
                onClick={() => {
                  const newPublishStatus = !publishStatus;
                  // setIsDropdownOpen(false);
                  handlePublish(newPublishStatus);
                }}
              >
                {publishStatus ? (
                  <>
                    <EyeWithLineIcon
                      stroke="currentColor"
                      strokeWidth={1}
                      className="publish-user-post-icon"
                    />
                    Unpublish post
                  </>
                ) : (
                  <>
                    <EyeIcon
                      strokeWidth={1}
                      stroke="currentColor"
                      className="publish-user-post-icon"
                    />
                    Publish post
                  </>
                )}
              </button>
            ) : (
              ""
            )}
          </div>
          <button
            className="user-post-dropdown-btn"
            ref={toggleDropdownRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDropdown();
            }}
          >
            <ThreeDotsIcon
              strokeWidth={1}
              stroke="currentColor"
              className="edit-comment-icon"
            />
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default UserPostCard;
