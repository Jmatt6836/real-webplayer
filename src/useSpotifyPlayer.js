/*
 * NEW FILE (spotify-redesign): all Web Playback SDK wiring lives here, so the
 * UI components only deal with plain state and callbacks.
 *
 * Fixes compared to the old logic inside WebPlayback.jsx:
 * - The SDK <script> was appended on every mount and the player was never
 *   disconnected, so remounts (and React 18 StrictMode, which mounts twice in
 *   development) created duplicate players. We now load the script once and
 *   disconnect on unmount.
 * - Errors (no Premium account, bad token, ...) were silently ignored, so
 *   users just saw a blank "not active" screen. They're now surfaced.
 * - The old code called getCurrentState() inside every state change just to
 *   check whether the player was active. The state passed to the listener
 *   already tells us that (it's null when playback moved elsewhere).
 * - We now track position/duration (for the progress bar), volume, shuffle,
 *   repeat and the queue, which the new player UI needs.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { getToken } from './spotifyApi';

const SDK_URL = 'https://sdk.scdn.co/spotify-player.js';
const PLAYER_NAME = 'Real Web Player';

// The SDK reports these error types; map them to messages users can act on.
const ERROR_MESSAGES = {
  initialization_error: "Your browser can't run the Spotify player. Try a recent version of Chrome, Firefox or Edge.",
  authentication_error: 'Your Spotify session expired. Please log in again.',
  account_error: 'Playing music in the browser needs a Spotify Premium account.',
  playback_error: "Spotify couldn't play that track. Try skipping to another one.",
};

// Load the SDK script once, however many times the hook mounts.
let sdkPromise;
function loadSdk() {
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve) => {
      if (window.Spotify) {
        resolve(window.Spotify);
        return;
      }
      window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify);
      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      document.body.appendChild(script);
    });
  }
  return sdkPromise;
}

export default function useSpotifyPlayer() {
  const playerRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);
  const [playbackState, setPlaybackState] = useState(null);
  // When we last received a state update, so the progress bar can count up
  // between updates (the SDK only reports position on changes).
  const [stateTimestamp, setStateTimestamp] = useState(0);
  const [volume, setVolumeState] = useState(0.5);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadSdk().then((Spotify) => {
      if (cancelled) return;

      const player = new Spotify.Player({
        name: PLAYER_NAME,
        // Ask the server each time, so we always get a fresh (refreshed) token.
        getOAuthToken: (cb) => {
          getToken().then(cb);
        },
        volume: 0.5,
      });
      playerRef.current = player;

      player.addListener('ready', ({ device_id }) => setDeviceId(device_id));
      player.addListener('not_ready', () => setDeviceId(null));

      player.addListener('player_state_changed', (state) => {
        // `state` is null when playback was transferred to another device.
        setPlaybackState(state);
        setStateTimestamp(Date.now());
      });

      Object.keys(ERROR_MESSAGES).forEach((type) => {
        player.addListener(type, ({ message }) => {
          console.error(type, message);
          setError(ERROR_MESSAGES[type]);
        });
      });

      player.connect();
    });

    return () => {
      cancelled = true;
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, []);

  const setVolume = useCallback((value) => {
    setVolumeState(value);
    playerRef.current?.setVolume(value);
  }, []);

  // Remember the pre-mute volume so unmuting restores it. Lives here (not in
  // the player bar) so the "M" keyboard shortcut can use it too.
  const lastVolumeRef = useRef(0.5);
  const toggleMute = useCallback(() => {
    if (volume > 0) {
      lastVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(lastVolumeRef.current || 0.5);
    }
  }, [volume, setVolume]);

  // Stable callbacks so child components don't re-render needlessly.
  const togglePlay = useCallback(() => playerRef.current?.togglePlay(), []);
  const nextTrack = useCallback(() => playerRef.current?.nextTrack(), []);
  const previousTrack = useCallback(() => playerRef.current?.previousTrack(), []);
  const seek = useCallback((ms) => playerRef.current?.seek(ms), []);

  return {
    deviceId,
    isReady: Boolean(deviceId),
    isActive: Boolean(playbackState),
    playbackState,
    stateTimestamp,
    volume,
    error,
    clearError: () => setError(null),
    setVolume,
    toggleMute,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
  };
}
