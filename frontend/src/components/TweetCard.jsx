import { useState } from "react";
import RatingBars from "./RatingBars";
import TweetCardActions from "./TweetCardActions";
import TranslateRoast from "./TranslateRoast";
import MemeGenerator from "./MemeGenerator";

const TONE_EMOJI = {
  savage: "🔥",
  sarcastic: "😏",
  deadpan: "😐",
  absurd: "🤪",
  poetic: "🎭",
  wholesome: "🌸",
};

function getTopBadge(tweet) {
  const scores = [
    tweet.viral,
    tweet.relatable,
    tweet.savage,
    tweet.brutal,
    tweet.humor,
    tweet.originality,
    tweet.shareability,
  ];
  const max = Math.max(...scores);
  if (max >= 90) return { label: "🏆 Viral Bomb", color: "#ff6b35" };
  if (max >= 80) return { label: "⚡ Savage Hit", color: "#e74c3c" };
  if (max >= 70) return { label: "🎯 Relatable AF", color: "#9b59b6" };
  return { label: "💬 Solid Roast", color: "#3498db" };
}

export default function TweetCard({ tweet, index, isPinned, onPin }) {
  const [showTranslate, setShowTranslate] = useState(false);
  const [showMeme, setShowMeme] = useState(false);
  const [copied, setCopied] = useState(false);
  const badge = getTopBadge(tweet);

  const handleCopy = () => {
    navigator.clipboard.writeText(tweet.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: tweet.text });
    } else {
      handleCopy();
    }
  };

  return (
    <div className={`tweet-card ${isPinned ? "pinned" : ""}`}>
      <div className="tweet-card-header">
        <span className="tweet-index">#{index + 1}</span>
        <span className="tweet-badge" style={{ color: badge.color }}>
          {badge.label}
        </span>
        {isPinned && <span className="pinned-tag">📌 Pinned</span>}
      </div>

      <p className="tweet-text">{tweet.text}</p>

      <div className="tweet-tone">
        <span>{TONE_EMOJI[tweet.tone] || "💬"}</span>
        <span className="tone-label">{tweet.tone}</span>
      </div>

      {tweet.hashtags?.length > 0 && (
        <div className="tweet-hashtags">
          {tweet.hashtags.map((tag, i) => (
            <span key={i} className="hashtag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {tweet.reason && (
        <p className="tweet-reason">💡 {tweet.reason}</p>
      )}

      <RatingBars tweet={tweet} />

      <TweetCardActions
        tweet={tweet}
        isPinned={isPinned}
        onPin={onPin}
        onTranslate={() => setShowTranslate(true)}
        onMeme={() => setShowMeme(true)}
        onCopy={handleCopy}
        onShare={handleShare}
        copied={copied}
      />

      {showTranslate && (
        <TranslateRoast
          text={tweet.text}
          onClose={() => setShowTranslate(false)}
        />
      )}

      {showMeme && (
        <MemeGenerator
          text={tweet.text}
          onClose={() => setShowMeme(false)}
        />
      )}
    </div>
  );
}