import { useOutletContext, Link } from "react-router-dom";

function LikedPost() {
  const { loading, loadingProfile, visitedUser, PostCard } = useOutletContext();

  return (
    <div className="saved-post-container">
      {visitedUser.bookmarkedPosts.length <= 0 ? (
        <div className="no-about-container">
          <div className="no-about-big-text">No Liked Post</div>
          <div className="no-about-small-text">
            {loadingProfile
              ? ""
              : loading
              ? ""
              : "You have not saved any post yet."}
          </div>
        </div>
      ) : (
        <div className="posts">
          {visitedUser.bookmarkedPosts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </div>
      )}
    </div>
  );
}

export default LikedPost;
