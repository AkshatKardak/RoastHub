export function getRatingColor(value) {
  if (value >= 80) return "#e74c3c";
  if (value >= 60) return "#f39c12";
  if (value >= 40) return "#27ae60";
  return "#95a5a6";
}