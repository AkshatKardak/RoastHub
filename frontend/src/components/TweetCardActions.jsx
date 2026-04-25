export default function TweetCardActions({
  tweet,
  isPinned,
  onPin,
  onTranslate,
  onMeme,
  onCopy,
  onShare,
  copied,
}) {
  return (
    <div className="tweet-actions">
      <button
        className={`action-btn pin-btn ${isPinned ? "active" : ""}`}
        onClick={onPin}
        title={isPinned ? "Unpin" : "Pin tweet"}
      >
        📌 {isPinned ? "Unpin" : "Pin"}
      </button>

      <button
        className="action-btn translate-btn"
        onClick={onTranslate}
        title="Translate roast"
      >
        🌍 Translate
      </button>

      <button
        className="action-btn meme-btn"
        onClick={onMeme}
        title="Make a meme"
      >
        🖼️ Meme
      </button>

      <button
        className="action-btn copy-btn"
        onClick={onCopy}
        title="Copy text"
      >
        {copied ? "✅ Copied!" : "📋 Copy"}
      </button>

      <button
        className="action-btn share-btn"
        onClick={onShare}
        title="Share tweet"
      >
        🔗 Share
      </button>
    </div>
  );
}