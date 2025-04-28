import { FeaturedPost, PostsContainer } from "../../components/Home";
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
