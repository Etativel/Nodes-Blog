import { Link, Outlet } from "react-router-dom";
import "../styles/PostCreation.css";
import { useContext, useState, useEffect } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";

function PostCreation() {
  const { author, loading } = useContext(ProfileContext);
  // console.log(author);
  const [post, setPost] = useState({
    title: "",
    published: false,
    authorId: "",
    content: "",
    excerpt: "",
    username: "",
  });
  useEffect(() => {
    if (!loading && author) {
      setPost((prev) => ({
        ...prev,
        authorId: author.id,
        username: author.username,
      }));
    }
  }, [loading, author]);
  console.log(post);
  return (
    <>
      <div className="creator-container">
        <Link to="write-post">
          <h3>write</h3>
        </Link>
        <Link to="preview-post">
          <h3>Preview</h3>
        </Link>
        <Outlet
          context={{
            post,
            setPost,
          }}
        />
      </div>
    </>
  );
}

export default PostCreation;
