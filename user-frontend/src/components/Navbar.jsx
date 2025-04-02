import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useRef, useEffect, useContext, useState } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
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
  // console.log(author);
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
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
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
    window.location = "http://localhost:5174/";
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

  return (
    <div className="navigation-container" ref={navbarRef}>
      <div className="profile-dropdown" ref={dropdown}>
        <ul className="profile-dropdown-list">
          <li className="profile-btn" onClick={redirectProfile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
          <li className="sign-out-btn" onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 logout-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
            logout
          </li>
        </ul>
      </div>
      <h2 className="webtitle">
        <a href="/posts">Nodes</a>
      </h2>
      <input type="text" placeholder="Search" className="post-search-input" />
      <div className="profile-container">
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
          className="nav-profile"
          style={{
            backgroundColor: loading ? "white" : author.userColor,
          }}
        >
          {loading ? (
            ""
          ) : author.profilePicture ? (
            <img src={author.profilePicture} alt="" className="nav-pp" />
          ) : (
            author.username.charAt(0)
          )}
        </button>
      </div>
    </div>
  );
}

export default Navigation;
