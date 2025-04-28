import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CloseButton, ReportForm } from "../../shared";
import { ThreeDotsIcon, LikeIcon, DislikeIcon } from "../../assets/svg";
import { formatCloudinaryUrl, formatNumber } from "../../utils";
import ProfileContext from "../../contexts/context-create/ProfileContext";
import "./CommentSection.css";

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
  postAuthorId,
}) {
  const textareaReplyRef = useRef(null);
  const [replyContent, setReplyContent] = useState("");
  const disableReplySubmit = replyContent.trim() === "";
  const [isOnReply, setIsOnReply] = useState(false);
  const [totalLike, setTotalLike] = useState(0);
  const [totalDislike, setTotalDislike] = useState(0);
  const [reactions, setReactions] = useState(comment.reactions);
  const [isLike, setIsLike] = useState(false);
  const [isDislike, setIsDislike] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const navigate = useNavigate();
  const [reportLoading, setReportLoading] = useState(false);
  const reportCtrRef = useRef(null);
  const postReportFormRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportAdditionalInfo, setReportAdditionalInfo] = useState("");

  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => {
        if (reportCtrRef.current) {
          reportCtrRef.current.classList.add("active");
          postReportFormRef.current.classList.add("active");
        }
      }, 10);
    } else {
      if (reportCtrRef.current) {
        postReportFormRef.current.classList.remove("active");
        reportCtrRef.current.classList.remove("active");
      }
    }
  }, [dialogOpen, reportCtrRef, postReportFormRef]);
  useEffect(() => {
    if (!author) return;

    const liked = reactions?.some(
      (like) => like.userId === author.id && like.reaction === "LIKE"
    );
    setIsLike(liked);
  }, [reactions, author]);

  useEffect(() => {
    if (!author) return;

    const disliked = reactions?.some(
      (like) => like.userId === author.id && like.reaction === "DISLIKE"
    );
    setIsDislike(disliked);
  }, [reactions, author]);

  useEffect(() => {
    const likeCount = comment.reactions.filter(
      (r) => r.reaction === "LIKE"
    ).length;
    const dislikeCount = comment.reactions.filter(
      (r) => r.reaction === "DISLIKE"
    ).length;

    setTotalLike(likeCount);
    setTotalDislike(dislikeCount);
  }, [comment]);

  useEffect(() => {
    if (textareaReplyRef.current) {
      textareaReplyRef.current.style.height = "auto";
      textareaReplyRef.current.style.height =
        textareaReplyRef.current.scrollHeight + "px";
    }
  }, [replyContent]);

  async function toggleReaction(newReactionType) {
    let previousState;
    try {
      previousState = {
        reactions: [...reactions],
        totalLike,
        totalDislike,
        isLike,
        isDislike,
      };

      const existingReaction = reactions.find((r) => r.userId === author?.id);
      let newReactions = [...reactions];

      if (existingReaction) {
        if (existingReaction.reaction === newReactionType) {
          newReactions = newReactions.filter((r) => r.userId !== author?.id);
        } else {
          newReactions = newReactions.map((r) =>
            r.userId === author?.id ? { ...r, reaction: newReactionType } : r
          );
        }
      } else {
        newReactions.push({
          userId: author?.id,
          reaction: newReactionType,
          user: author,
        });
      }

      // Optimistic UI update
      setReactions(newReactions);
      setTotalLike(newReactions.filter((r) => r.reaction === "LIKE").length);
      setTotalDislike(
        newReactions.filter((r) => r.reaction === "DISLIKE").length
      );
      setIsLike(
        newReactionType === "LIKE" &&
          existingReaction?.reaction !== newReactionType
      );
      setIsDislike(
        newReactionType === "DISLIKE" &&
          existingReaction?.reaction !== newReactionType
      );

      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/comment/reaction/toggle",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            commentId: comment.id,
            userId: author.id,
            reaction: newReactionType,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update reaction");

      const data = await response.json();
      setReactions(data.comment.reactions);
      setTotalLike(
        data.comment.reactions.filter((r) => r.reaction === "LIKE").length
      );
      setTotalDislike(
        data.comment.reactions.filter((r) => r.reaction === "DISLIKE").length
      );
      setIsLike(
        data.comment.reactions.some(
          (r) => r.userId === author.id && r.reaction === "LIKE"
        )
      );
      setIsDislike(
        data.comment.reactions.some(
          (r) => r.userId === author.id && r.reaction === "DISLIKE"
        )
      );
    } catch (error) {
      setReactions(previousState.reactions);
      setTotalLike(previousState.totalLike);
      setTotalDislike(previousState.totalDislike);
      setIsLike(previousState.isLike);
      setIsDislike(previousState.isDislike);
      console.error("Error toggling reaction:", error);
    } finally {
      setIsReacting(false);
    }
  }

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
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/comment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            postId,
            content: replyContent,
            authorId: author.id,
            parentId,
          }),
        }
      );
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
    } catch (error) {
      setLoadingPostComment(false);
      console.log(error);
    }
  }

  function redirectToProfilePage(profile) {
    navigate(`/@${profile}`);
  }

  function handleOpenReport() {
    setDialogOpen(true);
  }

  async function handleReportSubmit(e, commentId) {
    e.preventDefault();
    setReportLoading(true);
    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/comment/report/${commentId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reporterId: author?.id,
            type: reportType,
            message: reportAdditionalInfo,
          }),
        }
      );
      if (!response.ok) {
        setReportLoading(false);
        console.log("failed to fetch report", response.status);
      }
      await response.json();
      setReportLoading(false);
      setDialogOpen(false);
      setReportAdditionalInfo("");
      setReportType("");
    } catch (error) {
      setReportLoading(false);
      console.error("failed to report post", error);
    }
  }
  return (
    <div key={comment.id}>
      <div className="comment-report-ctr" ref={reportCtrRef}>
        <div className="report-form" ref={postReportFormRef}>
          <div className="report-post-title">Report Comment</div>
          <CloseButton onClick={() => setDialogOpen(false)} />
          <ReportForm
            uniqueClassname="comment"
            contentId={comment.id}
            setDialogOpen={setDialogOpen}
            reportType={reportType}
            setReportType={setReportType}
            reportAdditionalInfo={reportAdditionalInfo}
            setReportAdditionalInfo={setReportAdditionalInfo}
            handleReportSubmit={handleReportSubmit}
            reportLoading={reportLoading}
          />
        </div>
      </div>
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
                  onClick={() => redirectToProfilePage(comment.author.username)}
                  className={
                    comment.parentId === null
                      ? "user-comment-profilepicture"
                      : "user-comment-profilepicture-subcomment"
                  }
                  src={formatCloudinaryUrl(comment.author.profilePicture, {
                    width: 40,
                    height: 40,
                    crop: "fit",
                    quality: "auto:best",
                    format: "auto",
                    dpr: 3,
                  })}
                  alt=""
                />
              ) : (
                <div
                  className={
                    comment.parentId === null
                      ? "user-comment-profilepicture"
                      : "user-comment-profilepicture-subcomment"
                  }
                  style={{
                    backgroundColor: comment.author.userColor,
                  }}
                >
                  {comment.author.username.charAt(0)}
                </div>
              )}

              <div className="comment-user-info">
                <div
                  className="comment-username"
                  onClick={() => redirectToProfilePage(comment.author.username)}
                >
                  {comment.author.fullName || comment.author.username}
                  {(comment.authorId === postAuthorId ||
                    comment.author.role === "SUPERADMIN") && (
                    <>
                      {comment.authorId === postAuthorId && (
                        <span className="is-author">Author</span>
                      )}
                      {comment.author.role === "SUPERADMIN" && (
                        <span className="is-dev">Dev</span>
                      )}
                    </>
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
                <button
                  className="edit-comment-btn"
                  aria-label="edit-comment"
                  data-comment-id={comment.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(comment.id);
                  }}
                >
                  {openDropdownCommentId === comment.id && (
                    <div
                      data-comment-id={comment.id}
                      className="edit-comment-dropdown"
                    >
                      <div
                        className="click-to-delete cmnt-edit-btn"
                        onClick={() => handleOpenReport()}
                      >
                        Report comment
                      </div>
                    </div>
                  )}
                  <ThreeDotsIcon
                    strokeWidth={1}
                    stroke="currentColor"
                    className="edit-comment-icon"
                  />
                </button>
              ) : (
                <button
                  className="edit-comment-btn"
                  aria-label="edit-comment"
                  data-comment-id={comment.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(comment.id);
                  }}
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
                  <ThreeDotsIcon
                    strokeWidth={1}
                    stroke="currentColor"
                    className="edit-comment-icon"
                  />
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
            <button
              className="like-btn hover-effect"
              disabled={isReacting}
              aria-label="like"
              onClick={() => toggleReaction("LIKE")}
            >
              {loading ? (
                ""
              ) : isLike ? (
                <>
                  <LikeIcon
                    isOutline={false}
                    fill="#1a8917"
                    className="outline-like-icon like-icon"
                  />
                </>
              ) : (
                <LikeIcon
                  isOutline={true}
                  strokeWidth={1}
                  stroke="currentColor"
                  className="outline-like-icon like-icon"
                />
              )}
            </button>
            <span className="total-like-on-comment">
              {formatNumber(totalLike)}
            </span>
            <button
              className="dislike-btn hover-effect"
              aria-label="dislike"
              disabled={isReacting}
              onClick={() => toggleReaction("DISLIKE")}
            >
              {isDislike ? (
                <>
                  <DislikeIcon
                    isOutline={false}
                    fill="#f44336"
                    className="outline-dislike-icon dislike-icon"
                  />
                </>
              ) : (
                <>
                  <DislikeIcon
                    isOutline={true}
                    strokeWidth={1}
                    stroke="currentColor"
                    className="outline-dislike-icon dislike-icon"
                  />
                </>
              )}
            </button>
            <span className="total-dislike-on-comment">
              {formatNumber(totalDislike)}
            </span>
            <div className="author-like-ctr"></div>
            <button
              className="reply-comment-btn hover-effect"
              onClick={() => toggleReply()}
            >
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

function CommentNode({
  comment,
  allComments,
  toggleDropdown,
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
  toggleReplies,
  expandedReplies,
  openDropdownCommentId,
  handleDeleteComment,
  fetchComments,
  setLoadingPostComment,
  postId,
  setCommentList,
  postAuthorId,
}) {
  const replies = allComments.filter((c) => c.parentId === comment.id);

  return (
    <div
      className="comment-node"
      style={{ marginLeft: comment.parentId ? "1rem" : "0" }}
    >
      <CommentPreview
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
        setCommentList={setCommentList}
        parentId={comment.id}
        postAuthorId={postAuthorId}
      />

      {replies.length > 0 && (
        <>
          <button
            onClick={() => toggleReplies(comment.id)}
            className="toggle-replies-btn"
          >
            {expandedReplies[comment.id] ? "Hide Replies" : "Show Replies"}
          </button>
          {expandedReplies[comment.id] && (
            <div className="nested-replies">
              {replies.map((reply) => (
                <CommentNode
                  key={reply.id}
                  comment={reply}
                  allComments={allComments}
                  toggleReplies={toggleReplies}
                  expandedReplies={expandedReplies}
                  toggleDropdown={toggleDropdown}
                  timePosted={timePosted}
                  onEdit={onEdit}
                  handleEditChange={handleEditChange}
                  handleEditComment={handleEditComment}
                  handleEditSubmit={handleEditSubmit}
                  editContent={editContent}
                  setOnEdit={setOnEdit}
                  setEditContent={setEditContent}
                  disableEditSubmit={disableEditSubmit}
                  author={author}
                  loading={loading}
                  expandComment={expandComment}
                  toggleExpanded={toggleExpanded}
                  textareaEditInput={textareaEditInput}
                  handleDeleteComment={handleDeleteComment}
                  fetchComments={fetchComments}
                  setLoadingPostComment={setLoadingPostComment}
                  postId={postId}
                  setCommentList={setCommentList}
                  openDropdownCommentId={openDropdownCommentId}
                  postAuthorId={postAuthorId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CommentSection({ postId, comments, timePosted, postAuthorId }) {
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

  function handleClickOutside(event) {
    const isInsideAnyButton = event.target.closest("[data-comment-id]");

    const isInsideAnyDropdown = event.target.closest(".edit-comment-dropdown");

    if (!isInsideAnyButton && !isInsideAnyDropdown) {
      setOpenDropdownCommentId(null);
    }
  }

  useEffect(() => {
    if (openDropdownCommentId === null) return;

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
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/post/${postId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
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
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/comment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            postId,
            content,
            authorId: author.id,
          }),
        }
      );
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
      // console.log("comment posted");
    } catch (error) {
      setLoadingPostComment(false);
      console.log(error);
    }
  }

  async function handleDeleteComment(e, commentId) {
    e.stopPropagation();
    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/comment/delete/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log("Error deleting comment ", response.status);
      }
      await response.json();
      // console.log("Success deleting comment");
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
    setLoadingPostComment(true);
    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/comment/update/${onEdit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          method: "PATCH",
          body: JSON.stringify({
            commentId: onEdit,
            content: editContent,
          }),
        }
      );
      if (!response.ok) {
        setLoadingPostComment(false);
        console.log("Failed to update comment", response.statusText);
      }

      setCommentList((prev) =>
        prev.map((comment) =>
          comment.id === onEdit ? { ...comment, content: editContent } : comment
        )
      );
      setLoadingPostComment(false);
      setEditContent("");
      setOnEdit(null);
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
              src={formatCloudinaryUrl(author.profilePicture, {
                width: 40,
                height: 40,
                crop: "fit",
                quality: "auto:best",
                format: "auto",
                dpr: 3,
              })}
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
        {commentList
          .filter((comment) => comment.parentId === null)
          .map((comment) => (
            <CommentNode
              key={comment.id}
              // postAuthorId = {}
              allComments={commentList}
              toggleReplies={toggleReplies}
              expandedReplies={expandedReplies}
              toggleDropdown={toggleDropdown}
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
              openDropdownCommentId={openDropdownCommentId}
              handleDeleteComment={handleDeleteComment}
              fetchComments={fetchComments}
              setLoadingPostComment={setLoadingPostComment}
              postId={postId}
              parentId={comment.id}
              setCommentList={setCommentList}
              postAuthorId={postAuthorId}
            />
          ))}
      </div>
    </div>
  );
}

export default CommentSection;
