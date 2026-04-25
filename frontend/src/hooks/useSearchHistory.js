import { useState } from "react";

const STORAGE_KEY = "roasthub_search_history";
const MAX_HISTORY = 10;

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function useSearchHistory() {
  const [history, setHistory] = useState(loadHistory);

  const addToHistory = (term) => {
    setHistory((prev) => {
      const filtered = prev.filter((t) => t !== term);
      const updated = [term, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  return { history, addToHistory, clearHistory };
}