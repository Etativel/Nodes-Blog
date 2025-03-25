import { useParams, Outlet, useNavigate } from "react-router-dom";
import Navigation from "../components/Navbar";
import { ProfileProvider } from "../contexts/ProfileContext";
import "../styles/UserProfilePage.css";
import { useEffect, useState } from "react";

function UserPostCard({ title, thumbnail, createdAt, excerpt, comments }) {
  return (
    <div className="user-post">
      <div>{title}</div>
      <div>{excerpt}</div>
      <div>{createdAt}</div>
      <div>{comments.length}</div>
      <img src={thumbnail} alt="" />
    </div>
  );
}

function UserProfilePage() {
  const { username } = useParams();
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
  const [currentPage, setCurrentPage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userPost, setUserPost] = useState([]);
  const [error, setError] = useState({});

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

  function redirectChildren(children) {
    setCurrentPage(children);
    navigate(`/${username}/${children}`);
  }
  return (
    <>
      <ProfileProvider>
        <Navigation></Navigation>
        <div className="profile-page-container">
          <div className="left-ctr">
            <span className="user-header">
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
                  onClick={() => redirectChildren("about")}
                >
                  About
                </button>
              </div>
            </div>

            {currentPage === "" && (
              <div>
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
          <div className="right-ctr">hello</div>
        </div>
      </ProfileProvider>
    </>
  );
}

export default UserProfilePage;
