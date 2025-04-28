import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  timePosted,
  formatCloudinaryUrl,
  estimateReadingTime,
} from "../../utils";

function PreviewPost() {
  const { post, author, loading } = useOutletContext();
  const date = new Date();
  const time = timePosted(date);
  const readingTime = estimateReadingTime(post.content);

  useEffect(() => {
    if (window.hljs && post?.content) {
      document.querySelectorAll("pre code").forEach((block) => {
        window.hljs.highlightElement(block);
      });
    }
  }, [post.content]);

  return (
    <>
      <div className="post-head-container">
        <p className="post-title-head">{post.title}</p>
        <div className="author-and-post-info">
          <div className="left-head">
            {loading ? (
              ""
            ) : author.profilePicture ? (
              <img
                className="profile-pict"
                src={formatCloudinaryUrl(author.profilePicture, {
                  width: 55,
                  height: 55,
                  crop: "fit",
                  quality: "auto:best",
                  format: "auto",
                  dpr: 3,
                })}
                alt="profile-pict"
              />
            ) : (
              <div
                className="profile-pict"
                style={{ backgroundColor: author.userColor }}
              >
                {post.username.charAt(0)}
              </div>
            )}
          </div>
          <div className="right-head">
            <div className="r-h-flex">
              <p className="post-author">{post.username}</p>
            </div>
            <div className="post-info">
              <p className="time-to-read">{time}</p>·
              <p className="post-date">{readingTime}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="blog-post-preview">
        <div className="preview-post-container">
          {post?.content ? (
            <div
              className="post-preview"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </>
  );
}

export default PreviewPost;
