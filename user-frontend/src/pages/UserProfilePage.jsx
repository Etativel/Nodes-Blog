import { Link } from "react-router-dom";
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import Navigation from "../components/Navbar";
import { ProfileContext, ProfileProvider } from "../contexts/ProfileContext";
import "../styles/UserProfilePage.css";
import { useContext, useEffect, useState, useRef, use } from "react";

function EditProfileDialog({ setIsOpen }) {
  const { author, loading } = useContext(ProfileContext);
  const saveButton = useRef();
  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const imageInputRef = useRef(null);
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const isDisabled = fullName.length > 30 || bio.length > 100;
  const defaultProfileImage =
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/419d4eb5-b299-4786-9afa-eeb6d90fff89/dj8ki66-e739f5e5-2a64-47e7-a705-0eef9f14a44a.jpg/v1/fill/w_1280,h_979,q_75,strp/lazing_around_pillows_and_quilts_by_pascuau_dj8ki66-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTc5IiwicGF0aCI6IlwvZlwvNDE5ZDRlYjUtYjI5OS00Nzg2LTlhZmEtZWViNmQ5MGZmZjg5XC9kajhraTY2LWU3MzlmNWU1LTJhNjQtNDdlNy1hNzA1LTBlZWY5ZjE0YTQ0YS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.AGJ7UasaCID6Vxda84Wyze_snXF9NJQ-Xz8P_05wkDY";
  useEffect(() => {
    if (!loading) {
      setFullName(author.fullName || author.username);
      setBio(author.biography || "");
      setPreviewImage(author.profilePicture || defaultProfileImage);
    }
  }, [loading, author]);

  // useEffect(() => {
  //   if (saveButton.current) {
  //     saveButton.current.disabled = fullName.length > 30 || bio.length > 100;
  //   }
  // }, [fullName, bio]);

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
                onClick={(e) => {
                  e.preventDefault();
                  handleImageClick();
                }}
              >
                Update
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveImage(e);
                  setPreviewImage(defaultProfileImage);
                }}
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
          <span className="max-length">/100</span>
        </div>

        <div className="form-btn-ctr">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            ref={saveButton}
            onClick={(e) => handleSubmit(e)}
            disabled={uploading || isDisabled}
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
}) {
  const { author, loading } = useContext(ProfileContext);
  console.log(visitedUser);
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
  return (
    <>
      <div className="side-profile-ctr">
        {/* <div className="side-profile-picture"> */}
        <img
          src={
            loadingProfile
              ? ""
              : visitedUser.profilePicture
              ? visitedUser.profilePicture
              : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/419d4eb5-b299-4786-9afa-eeb6d90fff89/dj8ki66-e739f5e5-2a64-47e7-a705-0eef9f14a44a.jpg/v1/fill/w_1280,h_979,q_75,strp/lazing_around_pillows_and_quilts_by_pascuau_dj8ki66-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTc5IiwicGF0aCI6IlwvZlwvNDE5ZDRlYjUtYjI5OS00Nzg2LTlhZmEtZWViNmQ5MGZmZjg5XC9kajhraTY2LWU3MzlmNWU1LTJhNjQtNDdlNy1hNzA1LTBlZWY5ZjE0YTQ0YS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.AGJ7UasaCID6Vxda84Wyze_snXF9NJQ-Xz8P_05wkDY"
          }
          alt=""
          className="side-profile-pict"
        />
        {/* </div> */}
        <div className="side-profile-name-ctr">
          <span className="user-full-name">
            {loadingProfile
              ? ""
              : visitedUser.fullName
              ? visitedUser.fullName
              : visitedUser.username}
          </span>
        </div>
        <div className="follower-ctr">
          <span className="user-follower-count">0 Followers</span>
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
          ""
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
  const [loading, setLoading] = useState(true);
  const [userPost, setUserPost] = useState([]);
  const [error, setError] = useState({});
  const [visitedUser, setVisitedUser] = useState({});
  const currentPage =
    location.pathname === `/${username}`
      ? ""
      : location.pathname.split("/").pop();
  useEffect(() => {
    // Restore scroll position after posts load
    const savedPosition = sessionStorage.getItem("profilePosition");

    if (!loading && savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
      // sessionStorage.removeItem("scrollPosition");
    }
  }, [loading, location.pathname]);
  useEffect(() => {
    //
    async function fetchUserPost() {
      try {
        const response = await fetch(
          // TODO: FETCH USER AND INCLUDE POST
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
        }
        const data = await response.json();
        setVisitedUser(data.user);
        setLoadingProfile(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchVisitedUser();
  }, [cleanUsername]);

  function redirectChildren(children) {
    // setCurrentPage(children);
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
      <ProfileProvider>
        <div className="update-profile-ctr" ref={dialogCtr}>
          <div className="profile-form" ref={profileForm}>
            <CloseButton />
            <EditProfileDialog isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
        <Navigation></Navigation>
        <div className="profile-page-container">
          {loadingProfile ? (
            <div></div>
          ) : !visitedUser || Object.keys(visitedUser || {}).length === 0 ? (
            <div>No user found</div>
          ) : (
            <>
              <div className="left-ctr">
                <span className="user-header">
                  <div className="mobile-profile">hello</div>
                  <div className="username">{cleanUsername}</div>
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
                      className={`home-btn ${
                        currentPage === "" ? "active" : ""
                      }`}
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
                    {loading ? (
                      <div>Loading...</div>
                    ) : error.fetchPostError ? (
                      <div>{error.fetchPostError}</div>
                    ) : userPost.length > 0 ? (
                      userPost.map((post) => {
                        return (
                          <UserPostCard
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
                />
              </div>
            </>
          )}
        </div>
      </ProfileProvider>
    </>
  );
}

export default UserProfilePage;
