import Navigation from "../components/Navbar";
import PostsContainer from "../components/PostsContainer";
function Homepage() {
  return (
    <div className="homepage-container">
      <Navigation></Navigation>
      <PostsContainer></PostsContainer>
    </div>
  );
}

export default Homepage;
