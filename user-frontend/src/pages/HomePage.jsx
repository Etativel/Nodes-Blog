import FeaturedPost from "../components/FeaturedPost";
import PostsContainer from "../components/PostsContainer";
import "../styles/HomePage.css";

function Homepage() {
  return (
    <div className="homepage-container">
      <PostsContainer></PostsContainer>
      <FeaturedPost></FeaturedPost>
    </div>
  );
}

export default Homepage;
