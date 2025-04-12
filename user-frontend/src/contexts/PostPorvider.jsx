// PostContext.js
import { useState } from "react";
import PostContext from "./context-create/PostContext";

export const PostProvider = ({ children }) => {
  const [postToEdit, setPostToEditState] = useState(() => {
    const stored = localStorage.getItem("postToEdit");
    return stored ? JSON.parse(stored) : null;
  });

  // Keep localStorage in sync
  const setPostToEdit = (post) => {
    if (post) {
      localStorage.setItem("postToEdit", JSON.stringify(post));
    } else {
      localStorage.removeItem("postToEdit");
    }
    setPostToEditState(post);
  };

  return (
    <PostContext.Provider value={{ postToEdit, setPostToEdit }}>
      {children}
    </PostContext.Provider>
  );
};
