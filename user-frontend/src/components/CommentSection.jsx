import { useContext, useRef, useState, useEffect } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";
import "../styles/CommentSection.css";

function CommentSection({ postId, comments, timePosted }) {
  const { author, loading } = useContext(ProfileContext);
  const [content, setContent] = useState("");
  const textareaInput = useRef(null);
  const textareaEditInput = useRef(null);
  const [loadingPostComment, setLoadingPostComment] = useState(false);
  const disableSubmit = content.trim() === "" || loadingPostComment;
  const [commentList, setCommentList] = useState([]);
  const [openDropdownCommentId, setOpenDropdownCommentId] = useState(null);
  const [expandComment, setExpandComment] = useState({});
  const [onEdit, setOnEdit] = useState(null);
  const [editContent, setEditContent] = useState("");
  const currentEditValue = useRef("");
  const disableEditSubmit =
    !editContent ||
    editContent.trim() === "" ||
    editContent === currentEditValue.current ||
    loadingPostComment;
  useEffect(() => {
    function handleClickOutside(event) {
      if (openDropdownCommentId === null) return;

      const isInsideButton = event.target.closest(
        `[data-comment-id="${openDropdownCommentId}"]`
      );

      const isInsideDropdown = event.target.closest(
        `.edit-comment-dropdown[data-comment-id="${openDropdownCommentId}"]`
      );

      if (!isInsideButton && !isInsideDropdown) {
        setOpenDropdownCommentId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownCommentId]);

  function toggleDropdown(commentId) {
    setOpenDropdownCommentId((prev) => (prev === commentId ? null : commentId));
  }

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  useEffect(() => {
    if (textareaInput.current) {
      textareaInput.current.style.height = "auto";
      textareaInput.current.style.height =
        textareaInput.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    if (textareaEditInput.current) {
      textareaEditInput.current.style.height = "auto";
      textareaEditInput.current.style.height =
        textareaEditInput.current.scrollHeight + "px";
    }
  }, [editContent]);

  async function fetchComments() {
    try {
      const response = await fetch(`http://localhost:3000/post/${postId}`);
      const data = await response.json();
      setCommentList(data.post.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

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

      fetchComments();
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

  async function handleDeleteComment(e, commentId) {
    e.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:3000/comment/delete/${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        console.log("Error deleting comment ", response.status);
      }
      await response.json();
      console.log("Success deleting comment");
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  }

  function handleEditComment(e, commentId, content) {
    // Set onEdit with commentId
    currentEditValue.current = content;
    e.stopPropagation();
    setEditContent(content);
    setOnEdit(commentId);
  }

  function toggleExpanded(commentId) {
    setExpandComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }

  function handleEditChange(e) {
    setEditContent(e.target.value);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    console.log(editContent);
    console.log(onEdit);
    setLoadingPostComment(true);
    try {
      const response = await fetch(
        `http://localhost:3000/comment/update/${onEdit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({
            commentId: onEdit,
            content: editContent,
          }),
        }
      );
      if (!response.ok) {
        setLoadingPostComment(false);
        console.log("Failed to update comment");
      }

      setCommentList((prev) =>
        prev.map((comment) =>
          comment.id === onEdit ? { ...comment, content: editContent } : comment
        )
      );
      setLoadingPostComment(false);
      setEditContent("");
      setOnEdit(null);
      console.log("Update comment successfully");
    } catch (error) {
      console.log(error);
      setLoadingPostComment(false);
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
              <button onClick={(e) => handleSubmit(e)} disabled={disableSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="display-comment">
        {commentList.map((comment) => {
          return (
            <div key={comment.id}>
              {comment.id === onEdit ? (
                // Edit comment
                <div className="edit-comment-input-ctr">
                  <textarea
                    name="editContent"
                    value={editContent}
                    ref={textareaEditInput}
                    id=""
                    className="edit-comment-input"
                    onChange={(e) => {
                      handleEditChange(e);
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
                      <button
                        onClick={() => {
                          setOnEdit(null);
                          setEditContent(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => handleEditSubmit(e)}
                        disabled={disableEditSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Comment preview
                <div key={comment.id} className="comment-ctr">
                  <div className="comment-top">
                    <div className="comment-top-left">
                      {comment.author.profilePicture ? (
                        <img
                          className="user-comment-profilepicture"
                          src={comment.author.profilePicture}
                          alt=""
                        />
                      ) : (
                        <div
                          className="user-comment-profilepicture"
                          style={{
                            backgroundColor: comment.author.userColor,
                          }}
                        >
                          {comment.author.username.charAt(0)}
                        </div>
                      )}

                      <div className="comment-user-info">
                        <div className="comment-username">
                          {comment.author.fullName || comment.author.username}
                        </div>
                        <div className="comment-created-at">
                          {timePosted(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="comment-top-right">
                      {loading ? (
                        ""
                      ) : author?.username !== comment.author.username ? (
                        <div></div>
                      ) : (
                        <button
                          className="edit-comment-btn"
                          data-comment-id={comment.id}
                          onClick={() => toggleDropdown(comment.id)}
                        >
                          {openDropdownCommentId === comment.id && (
                            <div
                              data-comment-id={comment.id}
                              className="edit-comment-dropdown"
                            >
                              <div
                                className="click-to-edit cmnt-edit-btn"
                                onClick={(e) =>
                                  handleEditComment(
                                    e,
                                    comment.id,
                                    comment.content
                                  )
                                }
                              >
                                Edit Comment
                              </div>
                              <div
                                className="click-to-delete cmnt-edit-btn"
                                onClick={(e) =>
                                  handleDeleteComment(e, comment.id)
                                }
                              >
                                Delete comment
                              </div>
                            </div>
                          )}

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1}
                            stroke="currentColor"
                            className="size-6 edit-comment-icon"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="comment-middle">
                    <p className="comment-content">
                      {expandComment[comment.id] ||
                      comment.content.length <= 150
                        ? comment.content
                        : `${comment.content.slice(0, 200)}... `}
                    </p>
                    {comment.content.length > 200 && (
                      <button
                        className="show-more-btn"
                        onClick={() => toggleExpanded(comment.id)}
                      >
                        {expandComment[comment.id] ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                  <div className="comment-bottom">
                    <button>Like</button>
                    <button>Reply</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CommentSection;
