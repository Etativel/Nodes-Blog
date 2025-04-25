import { useContext, useRef, useState, useEffect } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";
import "../styles/CommentSection.css";
import { useNavigate } from "react-router-dom";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";

function formatLike(like) {
  const number = parseInt(like, 10);

  if (isNaN(number)) return "0";

  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return number.toString();
  }
}

function ReportForm({
  setDialogOpen,
  reportType,
  setReportType,
  reportAdditionalInfo,
  setReportAdditionalInfo,
  handleReportSubmit,
  reportLoading,
  commentId,
}) {
  const disableButton =
    !reportType || reportLoading || reportAdditionalInfo.length > 160;

  return (
    <div className="report-from-ctr">
      <form onSubmit={(e) => handleReportSubmit(e, commentId)}>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="sexual-content-comment"
            name="reportCategory"
            className="report-radio"
            value="sexual_content"
            checked={reportType === "sexual_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="sexual-content-comment">Sexual content</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="violent-content-comment"
            name="reportCategory"
            className="report-radio"
            value="violent_content"
            checked={reportType === "violent_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="violent-content-comment">
            Violent or repulsive content
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="hateful-content-comment"
            name="reportCategory"
            className="report-radio"
            value="hateful_content"
            checked={reportType === "hateful_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="hateful-content-comment">
            Hateful or abusive content
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="harassment-comment"
            name="reportCategory"
            className="report-radio"
            value="harassment"
            checked={reportType === "harassment"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="harassment-comment">Harassment or bullying</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="dangerous-acts-comment"
            name="reportCategory"
            className="report-radio"
            value="dangerous_acts"
            checked={reportType === "dangerous_acts"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="dangerous-acts-comment">
            Harmful or dangerous acts
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="misinformation-comment"
            name="reportCategory"
            className="report-radio"
            value="misinformation"
            checked={reportType === "misinformation"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="misinformation-comment">Misinformation</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="child-abuse-comment"
            name="reportCategory"
            className="report-radio"
            value="child_abuse"
            checked={reportType === "child_abuse"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="child-abuse-comment">Child abuse</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="terrorism-comment"
            name="reportCategory"
            className="report-radio"
            value="terrorism"
            checked={reportType === "terrorism"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="terrorism-comment">Promotes terrorism</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="spam-misleading-comment"
            name="reportCategory"
            className="report-radio"
            value="spam_misleading"
            checked={reportType === "spam_misleading"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="spam-misleading-comment">Spam or misleading</label>
        </div>
        <div className="additional-info-ctr">
          <label htmlFor="add-info" className="add-info-text">
            Additional information
          </label>
          <textarea
            name="report-message"
            id="add-info"
            className="additional-info-txt"
            placeholder="Write here..."
            value={reportAdditionalInfo}
            onChange={(e) => {
              setReportAdditionalInfo(e.target.value);
            }}
          ></textarea>
          <div className="biography-length length-indicator">
            <span>{reportAdditionalInfo.length}</span>
            <span className="max-length">/160</span>
          </div>
        </div>
        <div className="submit-report-btn-ctr">
          <button
            aria-label="cancel-report"
            type="button"
            className="cancel-report-btn"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            aria-label="submit-report"
            type="submit"
            className={`submit-report-btn ${disableButton ? "disabled" : ""}`}
            disabled={disableButton}
          >
            Report
          </button>
        </div>
      </form>
    </div>
  );
}

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
      // console.log("comment posted");
    } catch (error) {
      setLoadingPostComment(false);
      console.log(error);
    }
  }

  function redirectToProfilePage(profile) {
    navigate(`/@${profile}`);
  }

  function CloseButton() {
    return (
      <button className="close-dialog-btn" onClick={() => setDialogOpen(false)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="size-6 x-logo"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    );
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
          <CloseButton />
          <ReportForm
            commentId={comment.id}
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
            <button
              className="like-btn"
              disabled={isReacting}
              aria-label="like"
              onClick={() => toggleReaction("LIKE")}
            >
              {loading ? (
                ""
              ) : isLike ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#1a8917"
                    className="size-6 outline-like-icon like-icon"
                  >
                    <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                  </svg>
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
            <span className="total-like-on-comment">
              {formatLike(totalLike)}
            </span>
            <button
              className="dislike-btn"
              aria-label="dislike"
              disabled={isReacting}
              onClick={() => toggleReaction("DISLIKE")}
            >
              {isDislike ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#f44336"
                    className="size-6 outline-dislike-icon dislike-icon"
                  >
                    <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                  </svg>
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
            <span className="total-dislike-on-comment">
              {formatLike(totalDislike)}
            </span>
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
