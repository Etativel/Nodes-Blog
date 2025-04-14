import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/PostCreation.css";
import { useContext, useState, useEffect } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";
import PostContext from "../contexts/context-create/PostContext";

function PostCreation() {
  const { author, loading } = useContext(ProfileContext);
  const [isEditing, setIsEditing] = useState(false);
  const { postToEdit, setPostToEdit } = useContext(PostContext);
  const location = useLocation();
  const isWriting = location.pathname.endsWith("write-post");
  console.log(location.pathname);
  console.log(isWriting);
  const [post, setPost] = useState({
    postId: "",
    title: "",
    published: false,
    authorId: "",
    content: "",
    excerpt: "",
    username: "",
    thumbnail: "",
    thumbnailFile: null,
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
        <div className="right-creator-mobile">
          {isWriting ? (
            <Link to="preview-post">
              <div className="preview-post-text">
                <p>Preview Post</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="white"
                  className="size-6 arrow-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </Link>
          ) : (
            <Link to="write-post">
              <div className="write-post-text">
                <p>Continue Editing</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="white"
                  className="size-6 arrow-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </Link>
          )}
        </div>
        <div className="left-creator">
          <Outlet
            context={{
              post,
              setPost,
              setPostToEdit,
              isEditing,
              setIsEditing,
              author,
              loading,
            }}
          />
        </div>
        <div className="right-creator">
          {isWriting ? (
            <Link to="preview-post">
              <div className="preview-post-text">
                <p>Preview Post</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="white"
                  className="size-6 arrow-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </Link>
          ) : (
            <Link to="write-post">
              <div className="write-post-text">
                <p>Continue Editing</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="white"
                  className="size-6 arrow-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default PostCreation;
