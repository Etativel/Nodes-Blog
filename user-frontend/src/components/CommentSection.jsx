import { useContext, useRef, useState, useEffect } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";
import "../styles/CommentSection.css";

function CommentPreview({
  comment,
  onEdit,
  handleEditChange,
  handleEditComment,
  handleEditSubmit,
  editContent,
  setOnEdit,
  setEditContent,
  disableEditSubmit,
  author,
  timePosted,
  loading,
  expandComment,
  toggleExpanded,
  textareaEditInput,
  toggleDropdown,
  openDropdownCommentId,
  handleDeleteComment,
  fetchComments,
  setLoadingPostComment,
  postId,
  parentId,
}) {
  const textareaReplyRef = useRef(null);
  const [replyContent, setReplyContent] = useState("");
  const disableReplySubmit = replyContent.trim() === "";
  const [isOnReply, setIsOnReply] = useState(false);

  useEffect(() => {
    if (textareaReplyRef.current) {
      textareaReplyRef.current.style.height = "auto";
      textareaReplyRef.current.style.height =
        textareaReplyRef.current.scrollHeight + "px";
    }
  }, [replyContent]);

  function handleReplyChange(e) {
    setReplyContent(e.target.value);
  }
  function toggleReply() {
    setIsOnReply(!isOnReply);
  }

  async function handleReplySubmit(e) {
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
          content: replyContent,
          authorId: author.id,
          parentId,
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
      setReplyContent("");
      setIsOnReply(!isOnReply);
      if (textareaReplyRef.current) {
        textareaReplyRef.current.style.height = "auto";
      }
      console.log("comment posted");
    } catch (error) {
      setLoadingPostComment(false);
      console.log(error);
    }
  }

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
              {/* <button>I</button> */}
              {/* <button>B</button> */}
            </div>
            <div className="edit-submit-ctr">
              <button
                className="cancel-comment"
                onClick={() => {
                  setOnEdit(null);
                  setEditContent(null);
                }}
              >
                Cancel
              </button>
              <button
                className={`submit-comment ${
                  disableEditSubmit ? "disabled" : "active"
                }`}
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
                  {comment.authorId === author?.id ? (
                    <span className="is-author">Author</span>
                  ) : (
                    ""
                  )}
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
                          handleEditComment(e, comment.id, comment.content)
                        }
                      >
                        Edit Comment
                      </div>
                      <div
                        className="click-to-delete cmnt-edit-btn"
                        onClick={(e) => handleDeleteComment(e, comment.id)}
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
              {expandComment[comment.id] || comment.content.length <= 200
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
            <button className="like-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-6 outline-like-icon like-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                />
              </svg>
            </button>
            <span className="total-like-on-comment">1</span>
            <button className="dislike-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-6 outline-dislike-icon dislike-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                />
              </svg>
            </button>
            <span className="total-dislike-on-comment">12k</span>
            <div className="author-like-ctr"></div>
            <button className="reply-comment-btn" onClick={() => toggleReply()}>
              Reply
            </button>
          </div>
          {/* Reply content */}
          {isOnReply ? (
            <div className="reply-input-container">
              <textarea
                ref={textareaReplyRef}
                placeholder="Write a reply..."
                name="reply"
                value={replyContent}
                id=""
                className="reply-input"
                onChange={(e) => {
                  handleReplyChange(e);
                }}
                style={{
                  overflow: "hidden",
                }}
              />
              <div className="submit-reply-btn">
                <div>
                  {/* <button>I</button> */}
                  {/* <button>B</button> */}
                </div>
                <div>
                  <button
                    className={`submit-reply ${
                      disableReplySubmit ? "disabled" : "active"
                    }`}
                    onClick={(e) => handleReplySubmit(e)}
                    disabled={disableReplySubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}

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
  const [expandedReplies, setExpandedReplies] = useState({});
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

  function toggleExpanded(commentId) {
    setExpandComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }

  function handleEditComment(e, commentId, content) {
    // Set onEdit with commentId
    currentEditValue.current = content;
    e.stopPropagation();
    setEditContent(content);
    setOnEdit(commentId);
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
  function toggleReplies(commentId) {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
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
              {/* <button>I</button> */}
              {/* <button>B</button> */}
            </div>
            <div>
              <button
                className={`submit-comment ${
                  disableSubmit ? "disabled" : "active"
                }`}
                onClick={(e) => handleSubmit(e)}
                disabled={disableSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="display-comment">
        {commentList.map((comment) => {
          return (
            <>
              {comment.parentId === null && (
                <>
                  <CommentPreview
                    key={comment.id}
                    comment={comment}
                    onEdit={onEdit}
                    handleEditChange={handleEditChange}
                    handleEditComment={handleEditComment}
                    handleEditSubmit={handleEditSubmit}
                    editContent={editContent}
                    setOnEdit={setOnEdit}
                    setEditContent={setEditContent}
                    disableEditSubmit={disableEditSubmit}
                    author={author}
                    timePosted={timePosted}
                    loading={loading}
                    expandComment={expandComment}
                    toggleExpanded={toggleExpanded}
                    textareaEditInput={textareaEditInput}
                    toggleDropdown={toggleDropdown}
                    openDropdownCommentId={openDropdownCommentId}
                    handleDeleteComment={handleDeleteComment}
                    fetchComments={fetchComments}
                    setLoadingPostComment={setLoadingPostComment}
                    postId={postId}
                    parentId={comment.id}
                    setCommentList={setCommentList}
                  />
                  <div className="reply-container">
                    {expandedReplies[comment.id] &&
                      comments
                        .filter((reply) => reply.parentId === comment.id)
                        .map((reply) => (
                          <CommentPreview
                            key={reply.id}
                            comment={reply}
                            onEdit={onEdit}
                            handleEditChange={handleEditChange}
                            handleEditComment={handleEditComment}
                            handleEditSubmit={handleEditSubmit}
                            editContent={editContent}
                            setOnEdit={setOnEdit}
                            setEditContent={setEditContent}
                            disableEditSubmit={disableEditSubmit}
                            author={author}
                            timePosted={timePosted}
                            loading={loading}
                            expandComment={expandComment}
                            toggleExpanded={toggleExpanded}
                            textareaEditInput={textareaEditInput}
                            toggleDropdown={toggleDropdown}
                            openDropdownCommentId={openDropdownCommentId}
                            handleDeleteComment={handleDeleteComment}
                            fetchComments={fetchComments}
                            setLoadingPostComment={setLoadingPostComment}
                            postId={postId}
                            parentId={comment.id}
                            setCommentList={setCommentList}
                          />
                        ))}
                  </div>

                  <button onClick={() => toggleReplies(comment.id)}>
                    {expandedReplies[comment.id]
                      ? "Hide Replies"
                      : "Show Replies"}
                  </button>
                </>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}

export default CommentSection;
