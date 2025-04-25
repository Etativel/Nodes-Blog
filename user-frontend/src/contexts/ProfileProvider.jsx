import { useState, useEffect } from "react";
import { useAuthor } from "../utils/useAuthor";
import ProfileContext from "./context-create/ProfileContext";

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const { author, loading } = useAuthor(profile ? profile.user.id : null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/profile", {
          credentials: "include",
        });
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, author, loading, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
