import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useRef, useEffect, useContext } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
function Navigation() {
  const navbarRef = useRef(null);
  const lastScrollTopRef = useRef(window.scrollY);
  const hiddenAmountRef = useRef(0);
  const navHeightRef = useRef(0);
  const navigate = useNavigate();
  const { author, loading } = useContext(ProfileContext);
  console.log(author);
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
        console.log("Logout success");
        // setProfile(null);
      }
    } catch (error) {
      console.log("Error loging out: ", error);
    }
  }

  function redirectToAdminFrontend() {
    window.location = "http://localhost:5174/";
    sessionStorage.removeItem("scrollPosition");
  }

  return (
    <div className="navigation-container" ref={navbarRef}>
      <h2 className="webtitle">
        <a href="/posts">Nodes</a>
      </h2>
      <input type="text" placeholder="Search" className="post-search-input" />
      <div className="profile-container">
        <button onClick={redirectToAdminFrontend}>Write</button>
        <button onClick={handleLogout}>Log out</button>
        <button
          className="nav-profile"
          style={{
            backgroundColor: loading ? "white" : author.userColor,
          }}
        >
          {loading ? "" : author.username.charAt(0)}
        </button>
      </div>
    </div>
  );
}

export default Navigation;
