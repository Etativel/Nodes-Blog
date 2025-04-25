import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../styles/SearchPage.css";
import formatCloudinaryUrl from "../utils/cloudinaryUtils";
import estimateReadingTime from "../utils/estimateReadingTime";

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
      // if empty search or same as previous search, don't fetch
      if (!searchQuery.trim() || searchQuery === prevSearchQuery) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(
          `https://nodes-blog-api-production.up.railway.app/post/search?q=${encodeURIComponent(
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
        setPrevSearchQuery(searchQuery);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, prevSearchQuery]);

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

  function redirectToPostPage(postId) {
    navigate(`/post/${postId}`);
  }

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
              <div
                key={post.id}
                className="post-card"
                onClick={() => redirectToPostPage(post.id)}
              >
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
                    <span className="read-time">
                      {estimateReadingTime(post.content)}
                    </span>
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
