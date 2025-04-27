import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import "./UserAbout.css";

function UserAbout() {
  const { loading, loadingProfile, visitedUser, author, fetchVisitedUser } =
    useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    setAbout(visitedUser?.about || "");
  }, [visitedUser]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: about || "",
    editorProps: {
      attributes: {
        class: "bio-editor-content",
        style:
          "min-height: 400px; padding: 1rem; overflow-y: auto; text-align: left;",
      },
    },
    onUpdate: ({ editor }) => {
      setAbout(editor.getHTML());
    },
  });

  useEffect(() => {
    if (visitedUser?.about && editor) {
      editor.commands.setContent(visitedUser.about);
      setAbout(visitedUser.about);
    }
  }, [visitedUser, editor]);

  const toggleEditor = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    setLoadingUpdate(true);

    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/user/update-about/${visitedUser.id}`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ about }),
        }
      );
      if (!response.ok) {
        setLoadingUpdate(false);
        return console.log("Failed to save about");
      }
      await response.json();
      fetchVisitedUser();
      setLoadingUpdate(false);
      toggleEditor();
    } catch (error) {
      setLoadingUpdate(false);
      console.error("Failed to save about:", error);
    }
  };

  const renderToolbar = () => {
    if (!editor) return null;

    return (
      <div className="toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`toolbar-btn ${
              editor.isActive("italic") ? "active" : ""
            }`}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`toolbar-btn ${
              editor.isActive("underline") ? "active" : ""
            }`}
            title="Underline"
          >
            U
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`toolbar-btn ${
              editor.isActive("bulletList") ? "active" : ""
            }`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`toolbar-btn ${
              editor.isActive("orderedList") ? "active" : ""
            }`}
            title="Numbered List"
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`toolbar-btn ${
              editor.isActive("codeBlock") ? "active" : ""
            }`}
            title="Code Block"
          >
            Code
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={`toolbar-btn ${editor.isActive("link") ? "active" : ""}`}
            title="Insert Link"
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter Image URL");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className="toolbar-btn"
            title="Insert Image"
          >
            Image
          </button>
        </div>
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`toolbar-btn ${
              editor.isActive({ textAlign: "left" }) ? "active" : ""
            }`}
            title="Align Left"
          >
            Left
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`toolbar-btn ${
              editor.isActive({ textAlign: "center" }) ? "active" : ""
            }`}
            title="Align Center"
          >
            Center
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`toolbar-btn ${
              editor.isActive({ textAlign: "right" }) ? "active" : ""
            }`}
            title="Align Right"
          >
            Right
          </button>
        </div>
      </div>
    );
  };

  const isOwnProfile = visitedUser?.username === author?.username;
  const isLoading = loadingProfile || loading;

  return (
    <div className="about-container">
      {loadingUpdate && <div className="loading-spinner-container"></div>}
      {isEditing ? (
        <div className="editor-container">
          {renderToolbar()}
          <div className="editor-box">
            <EditorContent editor={editor} />
          </div>
          <div className="editor-actions">
            <button
              className="btn btn-cancel"
              onClick={() => {
                toggleEditor();
                setAbout(visitedUser?.about || "");
              }}
            >
              Cancel
            </button>
            <button
              disabled={loadingUpdate}
              className="btn btn-save"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-bio">
          {isLoading ? (
            <div className="bio-loading">
              <div className="loading-spinner"></div>
              <p>Loading profile...</p>
            </div>
          ) : about !== "<p></p>" && about ? (
            <div className="bio-content">
              {/* <h2 className="bio-title">About {visitedUser?.username}</h2> */}
              <div
                className="bio-text"
                dangerouslySetInnerHTML={{ __html: about }}
              />
              {isOwnProfile && (
                <button className="btn btn-edit" onClick={toggleEditor}>
                  Edit Bio
                </button>
              )}
            </div>
          ) : (
            // <div className="bio-empty">
            //   <h2 className="bio-empty-title">Still a Mystery</h2>
            //   <p className="bio-empty-message">
            //     {isOwnProfile
            //       ? "Tell people a little about yourself!"
            //       : "This user hasn't shared any details yet."}
            //   </p>
            //   {isOwnProfile && (
            //     <button className="btn btn-primary" onClick={toggleEditor}>
            //       Write Your Bio
            //     </button>
            //   )}
            // </div>
            <div className="no-about-container">
              <div className="no-about-big-text">Still a Mystery</div>
              <div className="no-about-small-text">
                {loadingProfile
                  ? ""
                  : loading
                  ? ""
                  : visitedUser.username === author?.username
                  ? "Tell people a little about yourself!"
                  : "This user hasn’t shared any details yet."}
                {isOwnProfile && (
                  <button className="btn btn-primary" onClick={toggleEditor}>
                    Write Your Bio
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserAbout;
