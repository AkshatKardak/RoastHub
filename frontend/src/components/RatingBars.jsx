const RATING_CONFIG = [
  { key: "viral", label: "Viral", color: "#ff6b35" },
  { key: "relatable", label: "Relatable", color: "#f39c12" },
  { key: "savage", label: "Savage", color: "#e74c3c" },
  { key: "brutal", label: "Brutal", color: "#8e44ad" },
  { key: "humor", label: "Humor", color: "#27ae60" },
  { key: "originality", label: "Originality", color: "#2980b9" },
  { key: "shareability", label: "Shareability", color: "#16a085" },
];

export default function RatingBars({ tweet }) {
  return (
    <div className="rating-bars">
      {RATING_CONFIG.map(({ key, label, color }) => (
        <div key={key} className="rating-row">
          <span className="rating-label">{label}</span>
          <div className="rating-bar-track">
            <div
              className="rating-bar-fill"
              style={{
                width: `${tweet[key] || 0}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <span className="rating-value">{tweet[key] || 0}</span>
        </div>
      ))}
    </div>
  );
}