import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect, useContext, useState } from "react";
import formatCloudinaryUrl from "../../utils/cloudinaryUtils";
import {
  ProfileContext,
  PostContext,
  ThemeContext,
} from "../../contexts/context-create";

import {
  SearchIcon,
  ProfileIcon,
  WriteIcon,
  KeyIcon,
  MoonIcon,
  SunIcon,
  LogoutIcon,
} from "../../assets/svg/";

import "./Navigation.css";

function Navigation() {
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const lastScrollTopRef = useRef(window.scrollY);
  const hiddenAmountRef = useRef(0);
  const navHeightRef = useRef(0);
  const dropdown = useRef(null);
  const toggleRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const { author, loading } = useContext(ProfileContext);
  const { setPostToEdit } = useContext(PostContext);
  const { isDark, toggleDark } = useContext(ThemeContext);

  const location = useLocation();
  const hideSearchBar = location.pathname.includes("/search");
  const [searchQuery, setSearchQuery] = useState("");

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

  function redirectToWrite() {
    setPostToEdit(null);
    navigate("/creator/write-post");
    sessionStorage.removeItem("scrollPosition");
    setIsOpen(false);
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
    setIsOpen(false);
  }

  function redirectAdminPortal() {
    window.location = "https://nodes-admin.up.railway.app";
  }

  function redirectToSearch() {
    navigate("/search");
  }

  function redirectToHome() {
    navigate("/posts");
  }

  function handleSearch(e) {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }

  return (
    <div className="navigation-container" ref={navbarRef}>
      <div className="profile-dropdown" ref={dropdown}>
        <ul className="profile-dropdown-list">
          <li className="profile-btn" onClick={redirectProfile}>
            <ProfileIcon
              stroke="currentColor"
              strokeWidth={1}
              className="profile-icon"
            />
            Profile
          </li>
          <li className="write-btn-dropdown" onClick={redirectToWrite}>
            <WriteIcon
              stroke="currentColor"
              strokeWidth={1}
              className="write-icon"
            />
            Write
          </li>
          <li className="admin-portal-btn" onClick={redirectAdminPortal}>
            <KeyIcon
              className="admin-icon"
              stroke="currentColor"
              strokeWidth={1}
            />
            Admin portal
          </li>
          <li className="sign-out-btn" onClick={handleLogout}>
            <LogoutIcon
              strokeWidth={1}
              stroke="currentColor"
              className="logout-icon"
            />
            Logout
          </li>
        </ul>
      </div>
      <h2 className="webtitle">
        <p className="webtitle-text" onClick={redirectToHome}>
          Nodes
        </p>
      </h2>
      <button
        className={`search-btn ${hideSearchBar && "hidden"}`}
        onClick={redirectToSearch}
        aria-label="search button"
      >
        <SearchIcon
          strokeWidth={1.5}
          stroke="currentColor"
          className="search-icon"
        />
      </button>
      <div className={`search-container ${hideSearchBar && "hidden"}`}>
        <SearchIcon
          strokeWidth={1.5}
          stroke="currentColor"
          className="search-icon"
        />
        <input
          type="text"
          placeholder="Search"
          className="post-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="profile-container">
        <div className="toggle-theme-btn-ctr">
          <button
            aria-label="toggle theme"
            className="toggle-theme-btn"
            onClick={toggleDark}
          >
            {isDark ? (
              <>
                <MoonIcon className="moon-icon" />
              </>
            ) : (
              <>
                <SunIcon className="sun-icon" />
              </>
            )}
          </button>
        </div>
        <button
          aria-label="write button"
          onClick={redirectToWrite}
          className="write-btn"
        >
          <WriteIcon
            className="write-icon"
            strokeWidth={1}
            stroke="currentColor"
          />
          Write
        </button>
        <button
          ref={toggleRef}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="redirect To ProfilePage"
          className="nav-profile"
          style={{
            backgroundColor: loading ? "transparent" : author?.userColor,
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
