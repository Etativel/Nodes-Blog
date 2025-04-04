import { useContext, useRef, useState, useEffect } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";
import "../styles/CommentSection.css";

function CommentSection({ postId }) {
  const { author, loading } = useContext(ProfileContext);
  const [content, setContent] = useState("");
  const textareaInput = useRef(null);
  const [loadingPostComment, setLoadingPostComment] = useState(false);
  const disableSubmit = content.trim() === "" || loadingPostComment;

  useEffect(() => {
    if (textareaInput.current) {
      textareaInput.current.style.height = "auto";
      textareaInput.current.style.height =
        textareaInput.current.scrollHeight + "px";
    }
  }, [content]);

  function handleCommentChange(e) {
    setContent(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoadingPostComment(true);
      const response = await fetch("http://localhost:3000/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content,
          authorId: author.id,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoadingPostComment(false);
        console.error("Failed to post comment:", data.error || "Unknown error");
        return;
      }

      setLoadingPostComment(false);
      setContent("");
      if (textareaInput.current) {
        textareaInput.current.style.height = "auto";
      }
      console.log("comment posted");
    } catch (error) {
      setLoadingPostComment(false);
      console.log(error);
    }
  }
  return (
    <div className="comment-section-container">
      <div className="write-comment-ctr">
        <div className="user-info-cs">
          {loading ? (
            ""
          ) : author.profilePicture ? (
            <img
              className="profile-pict-cs"
              src={author.profilePicture}
              alt="profile-pict"
            />
          ) : (
            <div
              className="profile-pict-cs"
              style={{
                backgroundColor: author.userColor,
              }}
            >
              {loading ? "" : author.username.charAt(0)}
            </div>
          )}
          <p className="user-name">
            {loading ? "" : author.fullName || author.username}
          </p>
        </div>
        <div className="comment-input-ctr">
          <textarea
            ref={textareaInput}
            placeholder="Write a comment..."
            name="content"
            value={content}
            id=""
            className="comment-input"
            onChange={(e) => {
              handleCommentChange(e);
            }}
            style={{
              overflow: "hidden",
            }}
          />
          <div className="submit-comment-btn">
            <div>
              <button>I</button>
              <button>B</button>
            </div>
            <div>
              <button>Cancel</button>
              <button onClick={handleSubmit} disabled={disableSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="display-comment"></div>
    </div>
  );
}

export default CommentSection;
