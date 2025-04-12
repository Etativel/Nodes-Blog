import { Link, Outlet } from "react-router-dom";
import "../styles/PostCreation.css";
import { useContext, useState, useEffect } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";
import PostContext from "../contexts/context-create/PostContext";

function PostCreation() {
  const { author, loading } = useContext(ProfileContext);
  const [isEditing, setIsEditing] = useState(false);
  const { postToEdit, setPostToEdit } = useContext(PostContext);
  // console.log(author);
  const [post, setPost] = useState({
    postId: "",
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

  useEffect(() => {
    if (postToEdit) {
      setPost((prev) => ({
        ...prev,
        postId: postToEdit.postId,
        thumbnail: postToEdit.thumbnail,
        published: postToEdit.published,
        excerpt: postToEdit.excerpt,
        title: postToEdit.title,
        content: postToEdit.content,
      }));
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [postToEdit, setPost]);

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
            setPostToEdit,
            isEditing,
            setIsEditing,
          }}
        />
      </div>
    </>
  );
}

export default PostCreation;
