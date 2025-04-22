import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useRef, useEffect, useContext, useState } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";
import PostContext from "../contexts/context-create/PostContext";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";
import LightModeSharpIcon from "@mui/icons-material/LightModeSharp";
import ModeNightSharpIcon from "@mui/icons-material/ModeNightSharp";
import ThemeContext from "../contexts/context-create/ThemeContext";
function Navigation() {
  const navbarRef = useRef(null);
  const lastScrollTopRef = useRef(window.scrollY);
  const hiddenAmountRef = useRef(0);
  const navHeightRef = useRef(0);
  const dropdown = useRef(null);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { author, loading } = useContext(ProfileContext);
  const { setPostToEdit } = useContext(PostContext);
  const { isDark, toggleDark } = useContext(ThemeContext);

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
    if (navbarRef.current) {
      navHeightRef.current = navbarRef.current.offsetHeight;
    }

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollTopRef.current;
      let newHiddenAmount = hiddenAmountRef.current + delta;

      newHiddenAmount = Math.min(
        Math.max(newHiddenAmount, 0),
        navHeightRef.current
      );

      hiddenAmountRef.current = newHiddenAmount;

      if (navbarRef.current) {
        navbarRef.current.style.transform = `translateY(-${newHiddenAmount}px)`;
      }
      lastScrollTopRef.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log("Failed to logout: ", response.statusText);
      } else {
        await response.json();
        navigate("/");
        sessionStorage.removeItem("scrollPosition");
        console.log("Logout success");
      }
    } catch (error) {
      console.log("Error loging out: ", error);
    }
  }

  function redirectToAdminFrontend() {
    setPostToEdit(null);
    navigate("/creator/write-post");
    sessionStorage.removeItem("scrollPosition");
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  function redirectProfile() {
    navigate(`/@${author.username}`);
  }

  function redirectAdminPortal() {
    window.location = "https://nodes-blog-user-frontend.up.railway.app/login";
  }

  return (
    <div className="navigation-container" ref={navbarRef}>
      <div className="profile-dropdown" ref={dropdown}>
        <ul className="profile-dropdown-list">
          <li className="profile-btn" onClick={redirectProfile}>
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
          </li>
          <li className="admin-portal-btn" onClick={redirectAdminPortal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-6 admin-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
            Admin portal
          </li>
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
      <h2 className="webtitle">
        <a href="/posts">Nodes</a>
      </h2>
      <input type="text" placeholder="Search" className="post-search-input" />
      <div className="profile-container">
        <div className="toggle-theme-btn-ctr">
          <button className="toggle-theme-btn" onClick={toggleDark}>
            {isDark ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="size-6 moon-icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="yellow"
                  className="size-6 sun-icon"
                >
                  <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
                </svg>
              </>
            )}
          </button>
        </div>
        <button onClick={redirectToAdminFrontend} className="write-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="size-6 write-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Write
        </button>
        <button
          ref={toggleRef}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="redirectToProfilePage"
          className="nav-profile"
          style={{
            backgroundColor: loading ? "white" : author.userColor,
          }}
        >
          {loading ? (
            ""
          ) : author.profilePicture ? (
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
            author.username.charAt(0)
          )}
        </button>
      </div>
    </div>
  );
}

export default Navigation;
