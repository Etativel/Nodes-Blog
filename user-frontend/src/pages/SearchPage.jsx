import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../styles/SearchPage.css";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";

// Dummy data for demonstration
const DUMMY_POSTS = [
  {
    _id: "1",
    title:
      "Getting Started with React and TypeScript Getting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScriptGetting Started with React and TypeScript",
    excerpt:
      "Learn how to set up a new project with React and TypeScript. This guide covers installation, configuration, and basic concepts. ",
    author: {
      username: "reactdev",
      profilePicture: "",
      userColor: "#3498db",
    },
    createdAt: "2025-03-15T10:20:30Z",
    tags: ["react", "typescript", "frontend"],
    readTime: 5,
  },
  {
    _id: "2",
    title: "Advanced Node.js Patterns",
    excerpt:
      "Explore advanced design patterns for Node.js applications. Topics include dependency injection, module architecture, and performance optimization.",
    author: {
      username: "nodemaster",
      profilePicture: "",
      userColor: "#27ae60",
    },
    createdAt: "2025-04-01T09:15:22Z",
    tags: ["node.js", "javascript", "backend"],
    readTime: 8,
  },
  {
    _id: "2",
    title: "Advanced Node.js Patterns",
    excerpt:
      "Explore advanced design patterns for Node.js applications. Topics include dependency injection, module architecture, and performance optimization.",
    author: {
      username: "nodemaster",
      profilePicture: "",
      userColor: "#27ae60",
    },
    createdAt: "2025-04-01T09:15:22Z",
    tags: ["node.js", "javascript", "backend"],
    readTime: 8,
  },
  {
    _id: "2",
    title: "Advanced Node.js Patterns",
    excerpt:
      "Explore advanced design patterns for Node.js applications. Topics include dependency injection, module architecture, and performance optimization.",
    author: {
      username: "nodemaster",
      profilePicture: "",
      userColor: "#27ae60",
    },
    createdAt: "2025-04-01T09:15:22Z",
    tags: ["node.js", "javascript", "backend"],
    readTime: 8,
  },
  {
    _id: "2",
    title: "Advanced Node.js Patterns",
    excerpt:
      "Explore advanced design patterns for Node.js applications. Topics include dependency injection, module architecture, and performance optimization.",
    author: {
      username: "nodemaster",
      profilePicture: "",
      userColor: "#27ae60",
    },
    createdAt: "2025-04-01T09:15:22Z",
    tags: ["node.js", "javascript", "backend"],
    readTime: 8,
  },
  {
    _id: "2",
    title: "Advanced Node.js Patterns",
    excerpt:
      "Explore advanced design patterns for Node.js applications. Topics include dependency injection, module architecture, and performance optimization.",
    author: {
      username: "nodemaster",
      profilePicture: "",
      userColor: "#27ae60",
    },
    createdAt: "2025-04-01T09:15:22Z",
    tags: ["node.js", "javascript", "backend"],
    readTime: 8,
  },
  {
    _id: "3",
    title: "CSS Grid vs Flexbox",
    excerpt:
      "A comprehensive comparison of CSS Grid and Flexbox. Learn when to use each layout system for optimal results in your web projects.",
    author: {
      username: "cssartist",
      profilePicture: "",
      userColor: "#9b59b6",
    },
    createdAt: "2025-04-10T14:30:45Z",
    tags: ["css", "web design", "frontend"],
    readTime: 6,
  },
  {
    _id: "4",
    title: "Building RESTful APIs with Express",
    excerpt:
      "This tutorial walks through creating a complete RESTful API using Express.js. Includes authentication, validation, and error handling.",
    author: {
      username: "apibuilder",
      profilePicture: "",
      userColor: "#e74c3c",
    },
    createdAt: "2025-04-18T11:25:18Z",
    tags: ["express", "node.js", "api", "backend"],
    readTime: 10,
  },
  {
    _id: "5",
    title: "State Management in React",
    excerpt:
      "An overview of different state management approaches in React applications, from useState and useContext to Redux and Zustand.",
    author: {
      username: "reactdev",
      profilePicture: "",
      userColor: "#3498db",
    },
    createdAt: "2025-04-22T16:40:12Z",
    tags: ["react", "state management", "frontend"],
    readTime: 7,
  },
];

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [prevSearchQuery, setPrevSearchQuery] = useState("");
  const searchQuery = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      // If empty search or same as previous search, don't fetch
      if (!searchQuery.trim() || searchQuery === prevSearchQuery) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(
          `http://localhost:3000/post/search?q=${encodeURIComponent(
            searchQuery
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        // Make sure data is an array before setting state
        setSearchResults(Array.isArray(data) ? data : []);
        // Update previous search query
        setPrevSearchQuery(searchQuery);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(
          `http://localhost:3000/post/search?q=${encodeURIComponent(
            searchQuery
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="search-page-container">
      <div className="search-header">
        <h1>Search</h1>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="search-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search posts, tags, or authors"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            {searchInput && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="clear-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="search-button"
            disabled={!searchInput.trim() || searchInput.trim() === searchQuery}
          >
            Search
          </button>
        </form>

        {searchQuery && (
          <p className="search-query">
            {searchResults.length}{" "}
            {searchResults.length === 1 ? "result" : "results"} for "
            {searchQuery}"
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching posts...</p>
        </div>
      ) : (
        <>
          {!searchQuery && (
            <div className="no-query-message">
              <p>Enter a search term to find posts</p>
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="no-results">
              <p className="no-results-title">
                No posts found matching "{searchQuery}"
              </p>
              <p>Try different keywords or check your spelling</p>
            </div>
          )}

          <div className="search-results-list">
            {searchResults.map((post) => (
              <div key={post._id} className="post-card">
                <Link to={`/post/${post.id}`} className="post-link">
                  <h2 className="post-title">
                    {post.title.length > 50
                      ? post.title.slice(0, 50) + "..."
                      : post.title}
                  </h2>
                </Link>
                <div className="post-meta">
                  <div className="author-info">
                    <div
                      className="author-avatar"
                      style={{ backgroundColor: post.author.userColor }}
                    >
                      {post.author.profilePicture ? (
                        <img
                          className="author-avatar"
                          src={formatCloudinaryUrl(post.author.profilePicture, {
                            width: 32,
                            height: 32,
                            crop: "fit",
                            quality: "auto:best",
                            format: "auto",
                            dpr: 3,
                          })}
                          alt=""
                        />
                      ) : (
                        post.author.username.charAt(0)
                      )}
                    </div>
                    <span className="author-name">@{post.author.username}</span>
                  </div>
                  <div className="post-details">
                    <span className="post-date">
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="read-time">{post.readTime} min read</span>
                  </div>
                </div>
                <p className="post-excerpt">
                  {post.excerpt.length > 150
                    ? `${post.excerpt.substring(0, 150)}...`
                    : post.excerpt}
                </p>
                {/* <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div> */}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;
