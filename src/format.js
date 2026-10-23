/*
 * NEW FILE (spotify-redesign): formatting helpers shared by the player bar
 * and track lists.
 */

// 215000 -> "3:35"
export function formatTime(ms) {
  if (!Number.isFinite(ms) || ms < 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// The old UI only ever showed artists[0], which dropped featured artists.
export function artistNames(track) {
  return (track?.artists || []).map((a) => a.name).join(', ');
}

// The SDK returns several image sizes. Pick the one closest to what we
// display, so we don't download a 640px image for a 56px thumbnail.
export function albumArt(track, displaySize = 300) {
  const images = track?.album?.images || [];
  if (images.length === 0) return '';
  const sorted = [...images].sort((a, b) => (a.width || 0) - (b.width || 0));
  const fit = sorted.find((img) => (img.width || 0) >= displaySize);
  return (fit || sorted[sorted.length - 1]).url;
}
