import { Link } from "react-router-dom";
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import Navigation from "../components/Navbar";
import { ProfileContext, ProfileProvider } from "../contexts/ProfileContext";
import "../styles/UserProfilePage.css";
import { useContext, useEffect, useState } from "react";

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

function UserSideProfile({ pageUsername }) {
  const { author, loading } = useContext(ProfileContext);

  return (
    <div className="side-profile-ctr">
      <div className="side-profile-picture">
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/419d4eb5-b299-4786-9afa-eeb6d90fff89/dj8ki66-e739f5e5-2a64-47e7-a705-0eef9f14a44a.jpg/v1/fill/w_1280,h_979,q_75,strp/lazing_around_pillows_and_quilts_by_pascuau_dj8ki66-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTc5IiwicGF0aCI6IlwvZlwvNDE5ZDRlYjUtYjI5OS00Nzg2LTlhZmEtZWViNmQ5MGZmZjg5XC9kajhraTY2LWU3MzlmNWU1LTJhNjQtNDdlNy1hNzA1LTBlZWY5ZjE0YTQ0YS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.AGJ7UasaCID6Vxda84Wyze_snXF9NJQ-Xz8P_05wkDY"
          alt=""
          className="side-profile-pict"
        />
      </div>
      <div className="side-profile-name-ctr">
        <span>Nicholas Wozniak</span>
      </div>
      <div className="follower-ctr">
        <span>0 Followers</span>
      </div>
      <div className="bio-ctr">
        <span>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis
          modi pariatur iure itaque ad enim, optio illo praesentium reiciendis
          at quaerat tempore amet quas deleniti officia exercitationem totam.
          Doloremque, saepe.
        </span>
      </div>
      {/* <button>Edit profile</button> */}
      <div className="edit-profile-btn-ctr">
        {loading ? (
          ""
        ) : author.username === pageUsername ? (
          <button>Edit profile</button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function UserProfilePage() {
  const { username } = useParams();
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
  const location = useLocation();
  //   const [currentPage, setCurrentPage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userPost, setUserPost] = useState([]);
  const [error, setError] = useState({});
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

  function redirectChildren(children) {
    // setCurrentPage(children);
    navigate(`/${username}/${children}`);
  }
  return (
    <>
      <ProfileProvider>
        <Navigation></Navigation>
        <div className="profile-page-container">
          <div className="left-ctr">
            <span className="user-header">
              <div className="mobile-profile">hello</div>
              <div className="username">{cleanUsername}</div>
            </span>
            <div className="user-nav">
              <div
                className="home-btn-ctr"
                style={{
                  borderBottom: currentPage === "" ? "solid black 1px" : "none",
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
            <UserSideProfile pageUsername={cleanUsername} />
          </div>
        </div>
      </ProfileProvider>
    </>
  );
}

export default UserProfilePage;
