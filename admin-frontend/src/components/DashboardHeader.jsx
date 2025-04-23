import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileContext from "../contexts/context-create/ProfileContext";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { loading, author } = useContext(ProfileContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownToggleRef = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        dropdown.current.classList.add("active");
      }, 10);
    } else {
      dropdown.current.classList.remove("active");
    }
  }, [isOpen]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        dropdownToggleRef.current &&
        !dropdownToggleRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  async function handleLogout() {
    try {
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/adminauth/logout ",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log("Failed to logout: ", response.statusText);
      } else {
        await response.json();
        navigate("/login");
        sessionStorage.removeItem("scrollPosition");
        console.log("Logout success");
      }
    } catch (error) {
      console.log("Error loging out: ", error);
    }
  }
  return (
    <header className="dashboard-header">
      <div className="profile-dropdown" ref={dropdown}>
        <ul className="profile-dropdown-list">
          {/* <li className="profile-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-6 profile-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            Profile
          </li> */}
          <li className="sign-out-btn" onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-6 logout-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
            Logout
          </li>
        </ul>
      </div>
      <button
        ref={dropdownToggleRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="redirectToProfilePage"
        className="nav-profile"
        style={{
          backgroundColor: loading ? "white" : author.userColor,
        }}
      >
        {loading ? (
          ""
        ) : author?.profilePicture ? (
          <img
            src={formatCloudinaryUrl(author.profilePicture, {
              width: 41,
              height: 41,
              crop: "fit",
              quality: "auto:best",
              format: "auto",
              dpr: 3,
            })}
            alt=""
            className="nav-pp"
          />
        ) : (
          author?.username.charAt(0)
        )}
      </button>
    </header>
  );
}
