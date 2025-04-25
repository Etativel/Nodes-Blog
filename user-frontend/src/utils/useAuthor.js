import { useState, useEffect } from "react";

const authorCache = {};

export function useAuthor(authorId) {
  const [author, setAuthor] = useState(authorCache[authorId] || null);
  const [loading, setLoading] = useState(!author);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authorId) return;

    if (authorCache[authorId]) {
      setAuthor(authorCache[authorId]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:3000/user/${authorId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        authorCache[authorId] = data.user;
        setAuthor(data.user);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [authorId]);
  return { author, loading, error };
}
