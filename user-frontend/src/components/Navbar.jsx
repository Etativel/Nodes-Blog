import "../styles/Navbar.css";
import { useRef, useEffect } from "react";
function Navigation() {
  const navbarRef = useRef(null);
  const lastScrollTopRef = useRef(window.scrollY);
  const hiddenAmountRef = useRef(0);
  const navHeightRef = useRef(0);

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

  return (
    <div className="navigation-container" ref={navbarRef}>
      <h2 className="webtitle">
        <a href="/posts">Nodes</a>
      </h2>
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
