import { useOutletContext, Link } from "react-router-dom";

function LikedPost() {
  const { loading, loadingProfile, visitedUser, PostCard, author } =
    useOutletContext();

  return (
    <div className="saved-post-container">
      {visitedUser?.likedPosts.length <= 0 ? (
        <div className="no-about-container">
          <div className="no-about-big-text">No Liked Post</div>
          <div className="no-about-small-text">
            {loadingProfile
              ? ""
              : loading
              ? ""
              : visitedUser.username === author?.username
              ? "You have not liked any post yet."
              : "This user have not liked any post yet."}
            {/* {loadingProfile
              ? ""
              : loading
              ? ""
              : "You have not liked any post yet."} */}
          </div>
        </div>
      ) : (
        <div className="posts">
          {visitedUser.likedPosts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </div>
      )}
    </div>
  );
}

export default LikedPost;
