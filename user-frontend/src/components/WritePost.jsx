import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import imageCompression from "browser-image-compression";
import SmallLoader from "./SmallLoader";

function Write() {
  const { post, setPost, isEditing, setPostToEdit, setIsEditing } =
    useOutletContext();
  const imageInputRef = useRef(null);
  const editorRef = useRef(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate();
  const [loadingSave, setLoadingSave] = useState(false);
  useEffect(() => {
    if (post.thumbnail) {
      setThumbnailPreview(post.thumbnail);
    }
  }, [post.thumbnail]);

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const previewUrl = URL.createObjectURL(compressedFile);
      setThumbnailPreview(previewUrl);
      setPost((prev) => ({
        ...prev,
        thumbnail: previewUrl,
        thumbnailFile: compressedFile,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorChange = (content) => {
    setPost((prev) => ({ ...prev, content }));
  };

  const handleSave = async (asDraft) => {
    setLoadingSave(true);
    if (!post.title || !post.authorId || !post.content || !post.excerpt) {
      setLoadingSave(false);
      return alert("You need to fill all of the field");
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");
    const images = doc.querySelectorAll("img");

    for (let img of images) {
      if (img.src.startsWith("blob:")) {
        try {
          const response = await fetch(img.src);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.readAsDataURL(blob);
          await new Promise((resolve) => (reader.onloadend = resolve));

          img.src = reader.result;
        } catch (error) {
          setLoadingSave(false);
          console.error("Error converting blob to base64:", error);
        }
      }
    }

    const updatedContent = doc.body.innerHTML;

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("content", updatedContent);
    formData.append("excerpt", post.excerpt);

    formData.append("authorId", post.authorId);
    if (asDraft) {
      formData.append("status", "DRAFT");
      formData.append("published", false);
    } else {
      formData.append("status", "ACTIVE");
      formData.append("published", post.published);
    }
    if (post.thumbnailFile) {
      formData.append("thumbnail", post.thumbnailFile);
    }
    let editFormData;
    if (isEditing) {
      editFormData = new FormData();
      editFormData.append("title", post.title);
      editFormData.append("content", updatedContent);
      editFormData.append("excerpt", post.excerpt);

      if (asDraft) {
        editFormData.append("status", "DRAFT");
        editFormData.append("published", false);
      } else {
        editFormData.append("status", "ACTIVE");
        editFormData.append("published", post.published);
      }

      if (post.thumbnailFile) {
        editFormData.append("thumbnail", post.thumbnailFile);
      }
    }
    try {
      let response;
      if (!isEditing) {
        response = await fetch(
          "https://nodes-blog-api-production.up.railway.app/post/create",
          {
            method: "POST",
            body: formData,
          }
        );
      } else if (isEditing) {
        response = await fetch(
          `https://nodes-blog-api-production.up.railway.app/post/update/${post.postId}`,
          {
            method: "PUT",
            body: editFormData,
          }
        );
      }

      if (response.ok) {
        setLoadingSave(false);
        setTimeout(() => {
          alert("Post saved successfully!");
          navigate(`/@${post.username}`);
        }, 5);

        setPostToEdit(null);
        setIsEditing(false);
      } else {
        setLoadingSave(false);
        console.error("Error saving post");
      }
    } catch (error) {
      setLoadingSave(false);
      console.error("Error:", error);
    }
  };

  function handleCancel() {
    navigate(`/@${post.username}`);
    setPostToEdit(null);
    setIsEditing(false);
  }
  function handleImageClick() {
    imageInputRef.current.click();
  }
  return (
    <>
      <form className="post-form">
        <input
          className="blog-title"
          type="text"
          name="title"
          placeholder="Enter title"
          value={post.title || ""}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="authorId"
          placeholder="Author ID"
          defaultValue={post.authorId || ""}
          hidden
          // onChange={handleChange}
        />
        <textarea
          name="excerpt"
          placeholder="Write an intriguing subtitle..."
          value={post.excerpt || ""}
          onChange={handleChange}
          className="excerpt-input"
        ></textarea>
        <div className="sub-input-ctr">
          <div className="thumbnail-input-ctr">
            {/* <div className="post-preview-text">Post Preview</div> */}
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                className={
                  thumbnailPreview ? "preview-img active" : "preview-img"
                }
                onClick={() => handleImageClick()}
              />
            ) : (
              <div
                className="preview-img preview-placeholder"
                onClick={() => handleImageClick()}
              >
                Click to add thumbnail
              </div>
            )}
          </div>

          <label className="publish-checkbox">
            <input
              type="checkbox"
              name="published"
              className="p-cbox"
              checked={post.published || false}
              onChange={handleChange}
            />
            Publish Now
          </label>
        </div>
        <input
          type="file"
          ref={imageInputRef}
          name="thumbnail"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleThumbnailChange}
        />
      </form>

      <Editor
        apiKey="ohszzdask1vfnrdtf3o5quted1o3fg2xchacfnopeokho1am"
        onInit={(_, editor) => (editorRef.current = editor)}
        value={post.content}
        onEditorChange={handleEditorChange}
        init={{
          skin: "snow",
          icons: "thin",
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | image | help",
          images_dataimg_filter: () => false,
        }}
      />
      <div className="write-btn-selection">
        {loadingSave ? (
          <SmallLoader />
        ) : (
          <>
            <button
              disabled={loadingSave}
              className="btn-selection save-post-btn"
              onClick={() => handleSave(false)}
              style={{
                opacity: loadingSave ? 0.5 : 1,
              }}
            >
              Save Post
            </button>
            <button
              disabled={loadingSave}
              className="btn-selection save-draft-btn"
              onClick={() => handleSave(true)}
              style={{
                opacity: loadingSave ? 0.5 : 1,
              }}
            >
              Save as draft
            </button>
            <button
              disabled={loadingSave}
              className="btn-selection cancel-save-btn"
              onClick={() => handleCancel()}
              style={{
                opacity: loadingSave ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {/* <div className="blog-post-preview">
        <div className="preview-post-container-write">
          {post && post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p></p>
          )}
        </div>
      </div> */}
    </>
  );
}

function WritePost() {
  return (
    <div className="write-container">
      <Write />
    </div>
  );
}

export default WritePost;
