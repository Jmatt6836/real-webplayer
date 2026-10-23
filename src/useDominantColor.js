/*
 * NEW FILE (spotify-redesign): picks a colour from the album art for the
 * header gradient, the way Spotify tints its "Now Playing" view.
 *
 * It downsamples the image onto a tiny canvas and averages the pixels. If the
 * image can't be read (e.g. the CDN doesn't send CORS headers), we quietly
 * fall back to a neutral colour instead of breaking the page.
 */
import { useEffect, useState } from 'react';

const FALLBACK = 'rgb(83, 83, 83)';

export default function useDominantColor(imageUrl) {
  const [color, setColor] = useState(FALLBACK);

  useEffect(() => {
    if (!imageUrl) {
      setColor(FALLBACK);
      return undefined;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0;
        let g = 0;
        let b = 0;
        const pixels = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        // Darken a little so white text on top always stays readable.
        const shade = (v) => Math.round((v / pixels) * 0.75);
        setColor(`rgb(${shade(r)}, ${shade(g)}, ${shade(b)})`);
      } catch (e) {
        setColor(FALLBACK);
      }
    };
    img.onerror = () => !cancelled && setColor(FALLBACK);
    img.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return color;
}
