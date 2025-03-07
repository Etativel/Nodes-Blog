import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./App.css";

export default function App() {
  const editorRef = useRef(null);

  // State for form inputs
  const [post, setPost] = useState({
    title: "",
    published: false,
    authorId: "",
    content: "",
  });

  // Update state on input change
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Sync editor content with state
  const handleEditorChange = (content) => {
    setPost((prev) => ({ ...prev, content }));
  };

  const handleSave = async () => {
    console.log("Saving post...", post);

    try {
      const response = await fetch("http://localhost:3000/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
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
          onChange={handleChange}
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
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <button onClick={handleSave}>Save Post</button>

      {/* Live Preview */}
      <div className="preview">
        <h2>Live preview</h2>
        <h3>{post.title}</h3>
        <p>
          <strong>Author Id: </strong>
          {post.authorId}
        </p>
        <p>
          <strong>Publish status: </strong>
          {post.published ? "Yes" : "No"}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </>
  );
}
