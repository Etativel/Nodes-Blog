import { useOutletContext } from "react-router-dom";

function UserAbout() {
  const { loading, loadingProfile, visitedUser, author } = useOutletContext();
  return (
    <div className="about-container">
      <div className="no-about-container">
        <div className="no-about-big-text">Still a Mystery</div>
        <div className="no-about-small-text">
          {loadingProfile
            ? ""
            : loading
            ? ""
            : visitedUser.username === author?.username
            ? "Tell people a little about yourself!"
            : "This user hasn’t shared any details yet."}
        </div>
      </div>
    </div>
  );
}

export default UserAbout;
