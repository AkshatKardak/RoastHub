import { useState, useRef, useEffect } from "react";
import useSearchHistory from "../hooks/useSearchHistory";

export default function SearchWithHistory({ onSearch, loading }) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addToHistory(trimmed);
    onSearch(trimmed);
    setShowDropdown(false);
  };

  const handleHistoryClick = (term) => {
    setInput(term);
    addToHistory(term);
    onSearch(term);
    setShowDropdown(false);
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Enter a topic to roast..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          disabled={loading}
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? "🔥 Roasting..." : "🔥 Roast It"}
        </button>
      </form>

      {showDropdown && history.length > 0 && (
        <div className="search-dropdown">
          <div className="dropdown-header">
            <span>Recent Searches</span>
            <button className="clear-history-btn" onClick={clearHistory}>
              Clear
            </button>
          </div>
          <ul>
            {history.map((term, i) => (
              <li key={i}>
                <button
                  className="history-item"
                  onClick={() => handleHistoryClick(term)}
                >
                  🕘 {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}