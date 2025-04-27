import FeaturedPost from "../../components/Home/FeaturedPost";
import PostsContainer from "../../components/Home/PostsContainer";
import "./Home.css";

function Home() {
  return (
    <div className="homepage-container">
      <PostsContainer></PostsContainer>
      <FeaturedPost></FeaturedPost>
    </div>
  );
}

export default Home;
