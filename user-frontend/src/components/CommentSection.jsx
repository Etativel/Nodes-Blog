import { useContext, useRef } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";
import "../styles/CommentSection.css";
function CommentSection() {
  const { author, loading } = useContext(ProfileContext);
  const textareaInput = useRef(null);
  function handleCommentInput() {
    const textarea = textareaInput.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
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
            name=""
            id=""
            className="comment-input"
            onChange={handleCommentInput}
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
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
