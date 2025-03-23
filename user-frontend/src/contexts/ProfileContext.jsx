import { createContext, useState, useEffect } from "react";
import { useAuthor } from "../utils/useAuthor";

export const ProfileContext = createContext();

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

  // You can pass additional data if needed, like author and loading.
  return (
    <ProfileContext.Provider value={{ profile, author, loading, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
