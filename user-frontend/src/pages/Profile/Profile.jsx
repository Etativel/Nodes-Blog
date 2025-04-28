import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import { SideProfile, UserPostCard, PostCard, EditDialog } from "./components";
import { useContext, useEffect, useState, useRef } from "react";
import { Loader, SmallLoader } from "../../components/Loader";
import FollowerDialog from "../../components/Profile/FollowerDialog";
import ProfileContext from "../../contexts/context-create/ProfileContext";
import PageNotFound from "../PageNotFound/PageNotFound";
import { CloseButton } from "../../shared";
import "./Profile.css";

function Profile() {
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
  const [isFollowerDialogOpen, setIsFollowerDialogOpen] = useState(false);

  const currentPage =
    location.pathname === `/${username}`
      ? ""
      : location.pathname.split("/").pop();
  const { author, loading } = useContext(ProfileContext);

  useEffect(() => {
    if (isFollowerDialogOpen) {
      setIsFollowerDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
          `https://nodes-blog-api-production.up.railway.app/post/by/${cleanUsername}`,
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
        `https://nodes-blog-api-production.up.railway.app/user/user-by-username/${cleanUsername.toLowerCase()}`,
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

  function toggleFollowerDialog() {
    setIsFollowerDialogOpen((prev) => !prev);
  }

  return (
    <>
      <div className="profile-page-container">
        <div className="update-profile-ctr" ref={dialogCtr}>
          <div className="profile-form" ref={profileForm}>
            <CloseButton onClick={() => setIsOpen(false)} />
            <EditDialog isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
        {/* <div className="follower-dialog-ctr"> */}
        {isFollowerDialogOpen && (
          <FollowerDialog
            isOpen={isFollowerDialogOpen}
            onClose={toggleFollowerDialog}
            followers={[{ id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }, { id: 4 }]}
            author={author}
            visitedUser={visitedUser}
          />
        )}
        {/* </div> */}
        {loadingProfile || visitedUser === null ? (
          <Loader />
        ) : !visitedUser ? (
          <div className="notfound-ctr">
            <PageNotFound
              title="Page not found"
              subtitle="Sorry, we couldn't find the page you're looking for"
            />
          </div>
        ) : (
          <>
            <div className="left-ctr">
              <span className="user-header">
                <div className="mobile-profile">
                  <SideProfile
                    pageUsername={cleanUsername}
                    author={author}
                    visitedUser={visitedUser}
                    loadingProfile={loadingProfile}
                    dialogCtr={dialogCtr}
                    profileForm={profileForm}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    loading={loading}
                    toggleFollowerDialog={toggleFollowerDialog}
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
                    <SmallLoader />
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
                          ? "You haven't posted anything yet."
                          : "Looks like this person hasn't posted anything yet."}
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
              <SideProfile
                pageUsername={cleanUsername}
                visitedUser={visitedUser}
                loadingProfile={loadingProfile}
                dialogCtr={dialogCtr}
                profileForm={profileForm}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                author={author}
                loading={loading}
                toggleFollowerDialog={toggleFollowerDialog}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
