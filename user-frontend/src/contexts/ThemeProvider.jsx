import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import ThemeContext from "./context-create/ThemeContext";
import ProfileContext from "./context-create/ProfileContext";

export function ThemeProvider({ children }) {
  const initializedRef = useRef(false);
  const serverSyncedRef = useRef(false);

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const [loaded, setLoaded] = useState(false);
  const { author, loading } = useContext(ProfileContext);

  useLayoutEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    console.log("Initial theme applied:", theme);
  }, [isDark]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    console.log("Theme updated:", theme);
  }, [isDark]);

  useEffect(() => {
    if (serverSyncedRef.current || loading || !author || !author.id) return;

    console.log("Syncing theme with server for user:", author.id);

    fetch(`http://localhost:3000/user/get-theme/${author.id}`, {
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      })
      .then((data) => {
        console.log("Server theme data:", data);
        serverSyncedRef.current = true;

        const savedTheme = localStorage.getItem("theme");
        const hasLocalPreference =
          savedTheme === "dark" || savedTheme === "light";

        if (
          !hasLocalPreference &&
          Object.prototype.hasOwnProperty.call(data, "isDark")
        ) {
          console.log(
            "Applying theme from server:",
            data.isDark ? "dark" : "light"
          );
          setIsDark(data.isDark);
        }
      })
      .catch((error) => {
        console.error("Failed to load theme preference:", error);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, [author, loading]);

  useEffect(() => {
    if (!serverSyncedRef.current || loading || !author || !author.id) return;

    console.log("Saving theme to server:", isDark ? "dark" : "light");

    fetch(`http://localhost:3000/user/toggle-theme/${author.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDark }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed to save theme: ${response.status}`);
        return response.json();
      })
      .then(() => {
        console.log("Theme saved successfully");
      })
      .catch((error) => {
        console.error("Failed to save theme preference:", error);
      });
  }, [isDark, author, loading]);

  const toggleDark = () => {
    setIsDark((prevState) => !prevState);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark, loaded }}>
      {children}
    </ThemeContext.Provider>
  );
}
