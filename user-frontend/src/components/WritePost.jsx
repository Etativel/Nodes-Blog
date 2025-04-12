import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useOutletContext } from "react-router-dom";

function Write() {
  const { post, setPost, isEditing, setPostToEdit, setIsEditing } =
    useOutletContext();

  const editorRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      setThumbnailPreview(post.thumbnail);
    }
  }, [isEditing, post]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
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
    if (!post.title || !post.authorId || !post.content || !post.excerpt) {
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
      formData.append("status", "DEFAULT");
      formData.append("published", post.published);
    }
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
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
        editFormData.append("status", "DEFAULT");
        editFormData.append("published", post.published);
      }

      if (thumbnail) {
        editFormData.append("thumbnail", thumbnail);
      }
    }
    try {
      let response;
      if (!isEditing) {
        response = await fetch("http://localhost:3000/post/create", {
          method: "POST",
          body: formData,
        });
      } else if (isEditing) {
        response = await fetch(
          `http://localhost:3000/post/update/${post.postId}`,
          {
            method: "PUT",
            body: editFormData,
          }
        );
      }

      if (response.ok) {
        alert("Post saved successfully!");
        navigate(`/@${post.username}`);
        setPostToEdit(null);
        setIsEditing(false);
      } else {
        console.error("Error saving post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <form>
        <input
          className="blog-title"
          type="text"
          name="title"
          placeholder="Enter title"
          value={post.title || ""}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="published"
            checked={post.published || false}
            onChange={handleChange}
          />
          Publish
        </label>
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
          placeholder="Intriguing summary or hook"
          value={post.excerpt || ""}
          onChange={handleChange}
        ></textarea>
        <input
          type="file"
          name="thumbnail"
          onChange={handleThumbnailChange}
          accept="image/*"
        />
      </form>
      {thumbnailPreview ? (
        <img
          src={thumbnailPreview}
          alt="Thumbnail Preview"
          style={{ width: "100px", height: "100px" }}
        />
      ) : (
        post.thumbnail && (
          <img
            src={post.thumbnail}
            alt="Existing Thumbnail"
            style={{ width: "100px", height: "100px" }}
          />
        )
      )}
      <Editor
        apiKey="ohszzdask1vfnrdtf3o5quted1o3fg2xchacfnopeokho1am"
        onInit={(_, editor) => (editorRef.current = editor)}
        value={post.content}
        onEditorChange={handleEditorChange}
        init={{
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
      <button onClick={() => handleSave(false)}>Save Post</button>
      <button onClick={() => handleSave(true)}>Save as draft</button>
      {/* Live Preview */}
      <div className="blog-post-preview">
        {/* <div className="post-container"> */}
        <div className="preview-post-container">
          {post && post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </>
  );
}

function WritePost() {
  return (
    <div className="wirte-post-container">
      <Write />
    </div>
  );
}

export default WritePost;
