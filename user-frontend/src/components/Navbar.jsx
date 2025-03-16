import "../styles/Navbar.css";
import { useRef, useEffect } from "react";
function Navigation() {
  const navbarRef = useRef(null);
  const lastScrollTopRef = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (navbarRef.current) {
        if (currentScroll > lastScrollTopRef.current) {
          navbarRef.current.style.transform = "translateY(-100%)";
        } else {
          navbarRef.current.style.transform = "translateY(0)";
        }
      }
      lastScrollTopRef.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="navigation-container" ref={navbarRef}>
      <h2 className="webtitle">Nodes</h2>
      <input type="text" placeholder="Search" className="post-search-input" />
      <div className="profile-container">
        <button>Write</button>
        <a href="">
          {/* <img src="" alt="" /> */}
          PP
        </a>
      </div>
    </div>
  );
}

export default Navigation;
