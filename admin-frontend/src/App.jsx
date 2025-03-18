import { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./App.css";
import { Navigate } from "react-router-dom";

export default function App() {
  const editorRef = useRef(null);
  const user = localStorage.getItem("user");
  const [post, setPost] = useState({
    title: "",
    published: false,
    authorId: user,
    content: "",
    excerpt: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };
  // State for form inputs
  useEffect(() => {
    fetch("http://localhost:3000/auth/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        // You can set user data here if needed.
        setPost((prev) => ({ ...prev, authorId: data.user.id }));
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
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

  const handleSave = async () => {
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
    formData.append("published", post.published);
    formData.append("authorId", post.authorId);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail); // Key must match server expectation
    }
    try {
      const response = await fetch("http://localhost:3000/post/create", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ ...post, content: updatedContent }),
        body: formData,
      });

      if (response.ok) {
        alert("Post saved successfully!");
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
          value={post.title}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="published"
            checked={post.published}
            onChange={handleChange}
          />{" "}
          Publish
        </label>
        <input
          type="text"
          name="authorId"
          placeholder="Author ID"
          value={post.authorId}
          hidden
          // onChange={handleChange}
        />
        <textarea
          name="excerpt"
          placeholder="Intriguing summary or hook"
          value={post.excerpt}
          onChange={handleChange}
        ></textarea>
        <input
          type="file"
          name="thumbnail"
          onChange={handleThumbnailChange}
          accept="image/*"
        />
      </form>
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
      <button onClick={handleSave}>Save Post</button>

      {/* Live Preview */}
      <div className="preview">
        {/* <h2>Live preview</h2>
        <h3>{post.title}</h3>
        <p>
          <strong>Author Id: </strong>
          {post.authorId}
        </p>
        <p>
          <strong>Publish status: </strong>
          {post.published ? "Yes" : "No"}
        </p> */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </>
  );
}
