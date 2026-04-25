export default function SkeletonGrid({ count = 5 }) {
  return (
    <div className="tweets-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="tweet-card skeleton-card">
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: "80%" }} />
          <div className="skeleton skeleton-text" style={{ width: "60%" }} />
          <div className="skeleton-ratings">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="skeleton-row">
                <div className="skeleton" style={{ width: "70px", height: "12px" }} />
                <div className="skeleton" style={{ flex: 1, height: "8px" }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}