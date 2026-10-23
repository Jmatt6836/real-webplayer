/*
 * NEW FILE (spotify-redesign): inline SVG icons.
 *
 * Why: the old buttons used text like "<<", "PLAY" and ">>". Real icons look
 * far more polished, scale crisply at any size, and pick up `currentColor`, so
 * hover/active colours come straight from CSS. Inline SVG means no icon font
 * or extra dependency. Paths are from Google's Material Icons (Apache 2.0).
 */
import React from 'react';

function Icon({ path, size = 16, title, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d={path} />
    </svg>
  );
}

export const PlayIcon = (p) => <Icon {...p} path="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />;
export const PauseIcon = (p) => <Icon {...p} path="M6 4.5h4v15H6zM14 4.5h4v15h-4z" />;
export const NextIcon = (p) => <Icon {...p} path="M5 5.5v13l9-6.5zM16 5.5h2.5v13H16z" />;
export const PrevIcon = (p) => <Icon {...p} path="M19 5.5v13l-9-6.5zM5.5 5.5H8v13H5.5z" />;
export const ShuffleIcon = (p) => (
  <Icon {...p} path="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
);
export const RepeatIcon = (p) => <Icon {...p} path="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />;
export const RepeatOneIcon = (p) => (
  <Icon {...p} path="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
);
export const VolumeIcon = (p) => (
  <Icon {...p} path="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
);
export const VolumeOffIcon = (p) => (
  <Icon {...p} path="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
);
export const MusicIcon = (p) => (
  <Icon {...p} path="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
);
export const SpeakerIcon = (p) => (
  <Icon {...p} path="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 1.99L17 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-5 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 16a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
);
export const LogoutIcon = (p) => (
  <Icon {...p} path="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v-2H4V5z" />
);
export const KeyboardIcon = (p) => (
  <Icon {...p} path="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" />
);
