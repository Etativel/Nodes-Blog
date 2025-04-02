import { Link } from "react-router-dom";
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import Navigation from "../components/Navbar";
import { ProfileContext } from "../contexts/ProfileContext";
import "../styles/UserProfilePage.css";
import { useContext, useEffect, useState, useRef } from "react";
import defaultProfileImage from "../assets/profilePict/profile-picture.png";

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

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
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
          placeholder=""
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
}) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const stripTitle = title.substring(0, 50) + (title.length > 50 ? "..." : "");

  const stripExcerpt =
    excerpt?.substring(0, 100) + (excerpt?.length > 100 ? "..." : "");
  const handleClick = () => {
    sessionStorage.setItem("profilePosition", window.scrollY);
  };
  return (
    <Link
      className="postcard-container-profile"
      onClick={handleClick}
      to={`/post/${postId}`}
    >
      <div className="top-p">
        <div className="left-p">
          <div className="post-title-p">{stripTitle}</div>
          <div className="post-subtext-p">{excerpt ? stripExcerpt : ""}</div>
        </div>
        <div
          className="right-p"
          style={{
            backgroundImage: `url(${thumbnail ? thumbnail : ""})`,
          }}
        ></div>
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

              <span>{comments.length > 100 ? "100+" : comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
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
  console.log(isFollowing);
  return (
    <>
      <div className="side-profile-ctr">
        {loadingProfile ? (
          ""
        ) : visitedUser.profilePicture ? (
          <img
            src={visitedUser.profilePicture}
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
  const currentPage =
    location.pathname === `/${username}`
      ? ""
      : location.pathname.split("/").pop();
  const { author, loading } = useContext(ProfileContext);
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
          `http://localhost:3000/post/by/${cleanUsername}`
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

  useEffect(() => {
    async function fetchVisitedUser() {
      setLoadingProfile(true);
      try {
        const response = await fetch(
          `http://localhost:3000/user/user-by-username/${cleanUsername.toLowerCase()}`
        );
        if (!response.ok) {
          setLoadingProfile(false);
          console.log("no user found");
          return;
        }
        const data = await response.json();
        setVisitedUser(data.user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchVisitedUser();
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
        strokeWidth={1.5}
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

  return (
    <>
      <div className="update-profile-ctr" ref={dialogCtr}>
        <div className="profile-form" ref={profileForm}>
          <CloseButton />
          <EditProfileDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
      <Navigation></Navigation>
      <div className="profile-page-container">
        {loadingProfile || visitedUser === null ? (
          <div></div>
        ) : !visitedUser ? (
          <div>No user found</div>
        ) : (
          <>
            <div className="left-ctr">
              <span className="user-header">
                <div className="mobile-profile">hello</div>
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
                      currentPage === "about  " ? "active" : ""
                    }`}
                    onClick={() => {
                      redirectChildren("about");
                      sessionStorage.removeItem("profilePosition");
                    }}
                  >
                    About
                  </button>
                </div>
              </div>

              {currentPage === "" && (
                <div className="posts">
                  {loadingComp ? (
                    <div>Loading...</div>
                  ) : error.fetchPostError ? (
                    <div>{error.fetchPostError}</div>
                  ) : userPost.length > 0 ? (
                    userPost.map((post) => {
                      return (
                        <UserPostCard
                          key={crypto.randomUUID()}
                          title={post.title}
                          thumbnail={post.thumbnail}
                          excerpt={post.excerpt}
                          createdAt={post.createdAt}
                          comments={post.comments}
                          postId={post.id}
                        />
                      );
                    })
                  ) : (
                    <div>No post</div>
                  )}
                </div>
              )}
              <Outlet />
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
