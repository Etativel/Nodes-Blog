import { useOutletContext } from "react-router-dom";

function PreviewPost() {
  const { post } = useOutletContext();
  return (
    <>
      <h1>Preview</h1>
      <div className="blog-post-preview">
        <div className="preview-post-container">
          {post && post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>No current post</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PreviewPost;
