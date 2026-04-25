import { useState } from "react";

const STORAGE_KEY = "roasthub_pinned";

function loadPinned() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function usePinnedTweets() {
  const [pinned, setPinned] = useState(loadPinned);

  const pin = (tweet) => {
    setPinned((prev) => {
      const exists = prev.find((t) => t.text === tweet.text);
      if (exists) return prev;
      const updated = [tweet, ...prev].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const unpin = (tweet) => {
    setPinned((prev) => {
      const updated = prev.filter((t) => t.text !== tweet.text);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isPinned = (tweet) => pinned.some((t) => t.text === tweet.text);

  const toggle = (tweet) => {
    if (isPinned(tweet)) unpin(tweet);
    else pin(tweet);
  };

  return { pinned, pin, unpin, isPinned, toggle };
}