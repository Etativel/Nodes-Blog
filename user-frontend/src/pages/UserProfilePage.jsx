import { Link } from "react-router-dom";
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import ProfileContext from "../contexts/context-create/ProfileContext";
import "../styles/UserProfilePage.css";
import { useContext, useEffect, useState, useRef } from "react";
import defaultProfileImage from "../assets/profilePict/profile-picture.png";
import Loader from "../components/Loader";
import PostContext from "../contexts/context-create/PostContext";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";
import imageCompression from "browser-image-compression";
import NotFound from "./NotFound";

function PostCard({ post }) {
  const stripExcerpt =
    post.excerpt?.substring(0, 100) + (post.excerpt?.length > 100 ? "..." : "");
  const stripTitle =
    post.title.substring(0, 50) + (post.title.length > 50 ? "..." : "");

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="postcard-flex">
      <Link className="postcard-container" to={`/post/${post.id}`}>
        <div className="top">
          <div className="left">
            <div className="profile">
              {post.author.profilePicture ? (
                <img
                  src={formatCloudinaryUrl(post.author.profilePicture, {
                    width: 25,
                    height: 25,
                    crop: "fit",
                    quality: "auto:best",
                    format: "auto",
                    dpr: 3,
                  })}
                  alt="profile-pict"
                  className="author-pict"
                />
              ) : (
                <div
                  className="author-pict-div"
                  style={{
                    backgroundColor: post.author.userColor,
                  }}
                >
                  <p>{post.author.username.charAt(0)}</p>
                </div>
              )}
              <span className="author-name">
                {post.author.fullName
                  ? post.author.fullName
                  : post.author?.username || post.authorId}
              </span>
            </div>
            <div className="post-title">{stripTitle}</div>
            <div className="post-subtext">{stripExcerpt}</div>
          </div>
          {post.thumbnail || null ? (
            <div
              className="right"
              style={{
                backgroundImage: `url(${
                  post.thumbnail
                    ? formatCloudinaryUrl(post.thumbnail, {
                        width: 200,
                        height: 150,
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
        <div className="bottom">
          <div className="post-info">
            <div className="left-info">
              <div className="date">{formattedDate}</div>
              <div className="comment-p">
                {post.comments.length < 1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-6  comment-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#737373"
                    className="size-6 comment-icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                <span>
                  {post.comments.length > 100 ? "100+" : post.comments.length}
                </span>
              </div>
              <div className="heart-p">
                {post._count.likedBy < 1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="size-6 heart-icon-card"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="red"
                    className="size-6 heart-icon-card"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                )}

                <span>
                  {post._count.likedBy > 100 ? "100+" : post._count.likedBy}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function EditProfileDialog({ setIsOpen }) {
  const { author, loading } = useContext(ProfileContext);
  const saveButton = useRef();
  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const imageInputRef = useRef(null);
  const [bio, setBio] = useState("");
  const [prevName, setPrevName] = useState("");
  const [prevBio, setPrevBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const isDisabled =
    fullName.length > 30 ||
    bio.length > 160 ||
    fullName.length <= 0 ||
    (fullName === prevName && bio === prevBio && previewImage === prevImage);
  useEffect(() => {
    if (!loading) {
      setFullName(author.fullName || author.username);
      setPrevName(author.fullName || author.username);
      setBio(author.biography || "");
      setPreviewImage(author.profilePicture || defaultProfileImage);
      setPrevImage(author.profilePicture || defaultProfileImage);
      setPrevBio(author.biography || "");
    }
  }, [loading, author]);

  function handleNameChange(e) {
    setFullName(e.target.value);
  }

  function handleBioChange(e) {
    setBio(e.target.value);
  }

  function handleImageClick() {
    imageInputRef.current.click();
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setImage(compressedFile);
      setPreviewImage(URL.createObjectURL(compressedFile));
    }
  }
  function handleRemoveImage(e) {
    e.preventDefault();
    setPreviewImage(defaultProfileImage);
    setImage(null); // clear the file state
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("biography", bio);
    formData.append("userId", author.id);

    if (image) {
      formData.append("profilePicture", image);
    }
    if (!image && previewImage === defaultProfileImage) {
      formData.append("removeProfilePicture", "true");
    }
    try {
      setUploading(true);
      const response = await fetch(
        "http://localhost:3000/user/profile/update",
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );
      setUploading(false);
      setIsOpen(false);
      if (!response.ok) {
        setUploading(false);
        console.log(response.status);
      }
      window.location.reload();
    } catch (error) {
      setUploading(false);
      console.log(error);
    }

    return;
  }

  return (
    <div className="form-container">
      <p className="form-title">Profile information</p>
      <form action="" className="profile-form-input">
        <label htmlFor="" className="photo-label">
          Photo
        </label>
        <div className="pp-ctr">
          <button
            type="button"
            className="pp-btn"
            onClick={(e) => {
              e.preventDefault();
              handleImageClick();
            }}
          >
            <img src={previewImage} alt="" className="pp" />
          </button>
          <div className="pp-right-div">
            <div className="pp-update-btn-ctr">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleImageClick();
                }}
                className="update-pp-btn"
              >
                Update
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveImage(e);
                  setPreviewImage(defaultProfileImage);
                }}
                className="remove-pp-btn"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        <input
          type="file"
          ref={imageInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
        <div>&nbsp;</div>
        <label htmlFor="full-name">Full name</label>
        <input
          type="text"
          // placeholder=""
          id="full-name"
          name="fullName"
          className="full-name"
          value={fullName}
          onChange={(e) => {
            handleNameChange(e);
          }}
        />
        <div className="full-name-length length-indicator">
          <span>{fullName.length}</span>
          <span className="max-length">/30</span>
        </div>
        <label htmlFor="bio">Bio</label>
        <textarea
          type="text"
          placeholder=""
          id="bio"
          name="biography"
          className="biography"
          value={bio}
          onChange={(e) => {
            handleBioChange(e);
          }}
        />
        <div className="biography-length length-indicator">
          <span>{bio.length}</span>
          <span className="max-length">/160</span>
        </div>

        <div className="form-btn-ctr">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            className="cancel-update-btn"
          >
            Cancel
          </button>
          <button
            ref={saveButton}
            onClick={(e) => handleSubmit(e)}
            disabled={uploading || isDisabled}
            style={{
              opacity: uploading || isDisabled ? 0.5 : 1,
            }}
            className="save-update-btn"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

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
  const handleClick = () => {
    sessionStorage.setItem("profilePosition", window.scrollY);
  };
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

  function handleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  async function handleDelete(postId) {
    try {
      setLoadingPostUpdate(true);
      const response = await fetch(
        `http://localhost:3000/post/delete/${postId}`,
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
        `http://localhost:3000/post/publish/${postId}`,
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#737373"
                    className="size-6 comment-icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span>
                    {comments.length > 100 ? "100+" : comments.length}
                  </span>
                </div>
                {post.status === "DRAFT" && (
                  <div className="draft-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="red"
                      className="size-6 draft-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-6 edit-user-post-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-6 delete-user-post-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
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
                <></>
                {publishStatus ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="size-6 publish-user-post-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                    Unpublish post
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="size-6 publish-user-post-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-6 edit-comment-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function UserSideProfile({
  pageUsername,
  dialogCtr,
  profileForm,
  isOpen,
  setIsOpen,
  loadingProfile,
  visitedUser,
  author,
  loading,
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
        const response = await fetch("http://localhost:3000/user/unfollow", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            followerId: author.id,
            followingId: visitedUser.id,
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

          credentials: "include",
          body: JSON.stringify({
            followerId: author.id,
            followingId: visitedUser.id,
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
        {/* <div className="profile-right">
          <div className="profile-top">
            <div className="profile-username">
              <p className="side-profile-username">@{visitedUser.username}</p>
            </div>
            {loading ? (
              ""
            ) : author.username === pageUsername ? (
              <button className="edit-profile">Edit profile</button>
            ) : (
              <button className="follow-profile">Follow</button>
            )}
          </div>
          <div className="profile-middle">
            <div className="profile-username"></div>
            {loading ? (
              ""
            ) : author.username === pageUsername ? (
              <button>Edit profile</button>
            ) : (
              <button>Follow</button>
            )}
          </div>
          <div className="profile-bottom">
            <div className="profile-username"></div>
            {loading ? (
              ""
            ) : author.username === pageUsername ? (
              <button>Edit profile</button>
            ) : (
              <button>Follow</button>
            )} */}
        {/* </div> */}
        <div className="side-profile-name-ctr">
          <span className="user-full-name">
            {loadingProfile
              ? ""
              : visitedUser.fullName
              ? visitedUser.fullName
              : visitedUser.username}
            <br />
            <p className="side-profile-username">@{visitedUser.username}</p>
          </span>
        </div>
        <div className="follower-ctr">
          <span className="user-follower-count">
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
        {/* </div> */}
      </div>
    </>
  );
}

function UserProfilePage() {
  const { username } = useParams();
  const dialogCtr = useRef(null);
  const profileForm = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

  const [loadingProfile, setLoadingProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingComp, setLoading] = useState(true);
  const [userPost, setUserPost] = useState([]);
  const [error, setError] = useState({});
  const [visitedUser, setVisitedUser] = useState(null);
  // const [isSuspended, setIsSuspended] = useState(false);

  const currentPage =
    location.pathname === `/${username}`
      ? ""
      : location.pathname.split("/").pop();
  const { author, loading } = useContext(ProfileContext);

  const handleRemovePostFromState = (deletedPostId) => {
    setUserPost((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId)
    );
  };

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("profilePosition");
    if (!loadingComp && savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, [loadingComp, location.pathname]);

  useEffect(() => {
    async function fetchUserPost() {
      try {
        const response = await fetch(
          `http://localhost:3000/post/by/${cleanUsername}`,
          {
            credentials: "include",
            method: "GET",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setUserPost(data.posts);
        setLoading(false);
      } catch (err) {
        setError({ fetchPostError: err.error });
        setLoading(false);
      }
    }
    fetchUserPost(cleanUsername);
  }, [cleanUsername]);

  async function fetchVisitedUser() {
    setLoadingProfile(true);
    try {
      const response = await fetch(
        `http://localhost:3000/user/user-by-username/${cleanUsername.toLowerCase()}`,
        {
          credentials: "include",
          method: "GET",
        }
      );
      if (!response.ok) {
        setLoadingProfile(false);
        console.log("no user found");
        return;
      }
      // if (response.status === 403) {
      //   setIsSuspended(true);
      //   return;
      // }

      const data = await response.json();

      setVisitedUser(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProfile(false);
    }
  }

  useEffect(() => {
    fetchVisitedUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanUsername]);

  function redirectChildren(children) {
    navigate(`/${username}/${children}`);
  }

  const CloseButton = () => (
    <button className="close-dialog-btn" onClick={() => setIsOpen(false)}>
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

  // if (isSuspended) {
  //   return (
  //     <NotFound
  //       top="403"
  //       title="User Suspended"
  //       subtitle="This user account has been suspended. Please contact the administrator for assistance."
  //     />
  //   );
  // }
  return (
    <>
      <div className="profile-page-container">
        <div className="update-profile-ctr" ref={dialogCtr}>
          <div className="profile-form" ref={profileForm}>
            <CloseButton />
            <EditProfileDialog isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
        {loadingProfile || visitedUser === null ? (
          <Loader />
        ) : !visitedUser ? (
          <div className="notfound-ctr">
            <NotFound
              title="Page not found"
              subtitle="Sorry, we couldn't find the page you're looking for"
            />
          </div>
        ) : (
          <>
            <div className="left-ctr">
              <span className="user-header">
                <div className="mobile-profile">
                  <UserSideProfile
                    pageUsername={cleanUsername}
                    author={author}
                    visitedUser={visitedUser}
                    loadingProfile={loadingProfile}
                    dialogCtr={dialogCtr}
                    profileForm={profileForm}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    loading={loading}
                  />
                </div>
                <div className="username">
                  {loadingProfile
                    ? ""
                    : visitedUser.fullName
                    ? visitedUser.fullName
                    : cleanUsername}
                </div>
              </span>
              <div className="user-nav">
                <div
                  className="home-btn-ctr"
                  style={{
                    borderBottom:
                      currentPage === "" ? "solid black 1px" : "none",
                  }}
                >
                  <button
                    className={`home-btn ${currentPage === "" ? "active" : ""}`}
                    onClick={() => redirectChildren("")}
                  >
                    Home
                  </button>
                </div>

                <div
                  className="about-btn-ctr"
                  style={{
                    borderBottom:
                      currentPage === "about" ? "solid black 1px" : "none",
                  }}
                >
                  <button
                    className={`about-btn ${
                      currentPage === "about" ? "active" : ""
                    }`}
                    onClick={() => {
                      redirectChildren("about");
                      sessionStorage.removeItem("profilePosition");
                    }}
                  >
                    About
                  </button>
                </div>
                <div
                  className="liked-btn-ctr"
                  style={{
                    borderBottom:
                      currentPage === "liked" ? "solid black 1px" : "none",
                  }}
                >
                  <button
                    className={`liked-btn ${
                      currentPage === "liked" ? "active" : ""
                    }`}
                    onClick={() => {
                      redirectChildren("liked");
                      sessionStorage.removeItem("profilePosition");
                    }}
                  >
                    Liked
                  </button>
                </div>
                <div
                  className="saved-btn-ctr"
                  style={{
                    borderBottom:
                      currentPage === "saved" ? "solid black 1px" : "none",
                  }}
                >
                  <button
                    className={`saved-btn ${
                      currentPage === "saved" ? "active" : ""
                    }`}
                    onClick={() => {
                      redirectChildren("saved");
                      sessionStorage.removeItem("profilePosition");
                    }}
                  >
                    Saved
                  </button>
                </div>
              </div>

              {currentPage === "" && (
                <div className="posts">
                  {loadingComp ? (
                    <Loader />
                  ) : error.fetchPostError ? (
                    <div>{error.fetchPostError}</div>
                  ) : userPost.length > 0 ? (
                    userPost.map((post) => {
                      return (
                        <UserPostCard
                          pageUsername={cleanUsername}
                          author={author}
                          key={crypto.randomUUID()}
                          title={post.title}
                          thumbnail={post.thumbnail}
                          excerpt={post.excerpt}
                          createdAt={post.createdAt}
                          comments={post.comments}
                          postId={post.id}
                          loading={loading}
                          published={post.published}
                          post={post}
                          onDelete={handleRemovePostFromState}
                        />
                      );
                    })
                  ) : (
                    <div className="no-post-container">
                      <div className="no-post-big-text">No Post Yet</div>
                      <div className="no-post-small-text">
                        {loadingProfile
                          ? ""
                          : loading
                          ? ""
                          : visitedUser.username === author?.username
                          ? // <span className="sub-small-text">
                            "You haven't posted anything yet."
                          : //   <p
                            //     className="start-writing"
                            //     onClick={() => redirectToAdminFrontend()}
                            //   >
                            //     Start writing!
                            //   </p>
                            // </span>
                            "Looks like this person hasn't posted anything yet."}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Outlet
                context={{
                  loadingProfile,
                  loading,
                  visitedUser,
                  author,
                  fetchVisitedUser,
                  UserPostCard,
                  PostCard,
                }}
              />
            </div>
            <div className="right-ctr">
              <UserSideProfile
                pageUsername={cleanUsername}
                visitedUser={visitedUser}
                loadingProfile={loadingProfile}
                dialogCtr={dialogCtr}
                profileForm={profileForm}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                author={author}
                loading={loading}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default UserProfilePage;
