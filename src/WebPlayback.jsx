/*
 * The logged-in player screen.
 *
 * CHANGES (spotify-redesign):
 * - Rebuilt as a Spotify-style layout: sidebar + main "Now Playing" view +
 *   fixed playback bar at the bottom. See components/ for each piece.
 * - SDK setup moved into the useSpotifyPlayer hook (with proper cleanup and
 *   error handling). This file just lays out the screen.
 * - The "Instance not active" screen told users to go and transfer playback
 *   from another Spotify app. There's now a one-click "Play here" button
 *   that does it for them.
 * - Added keyboard shortcuts (space, arrows, M).
 * - SDK errors (e.g. "Premium required") are shown in a banner instead of
 *   failing silently.
 */
import React, { useEffect, useState } from 'react';
import useSpotifyPlayer from './useSpotifyPlayer';
import { setRepeat, setShuffle, transferPlayback } from './spotifyApi';
import Sidebar from './components/Sidebar';
import NowPlaying from './components/NowPlaying';
import PlayerBar from './components/PlayerBar';
import { SpeakerIcon } from './components/Icons';

const REPEAT_MODES = ['off', 'context', 'track'];

function InactiveView({ isReady, onPlayHere, transferring }) {
  return (
    <div className="inactive">
      <div className="inactive__icon">
        <SpeakerIcon size={40} />
      </div>
      <h1 className="inactive__title">{isReady ? 'Ready when you are' : 'Connecting to Spotify…'}</h1>
      <p className="inactive__text">
        Start playback in this browser, or open Spotify on any device and pick <strong>Real Web Player</strong> from
        the devices menu.
      </p>
      <button type="button" className="btn-primary" onClick={onPlayHere} disabled={!isReady || transferring}>
        {transferring ? 'Starting…' : 'Play here'}
      </button>
    </div>
  );
}

function WebPlayback({ onLogout }) {
  const player = useSpotifyPlayer();
  const { deviceId, isReady, isActive, playbackState, error, clearError, togglePlay, nextTrack, previousTrack, toggleMute } =
    player;
  const [transferring, setTransferring] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Web API calls can fail (e.g. nothing to resume yet). Show a message
  // instead of an unhandled promise rejection.
  const run = async (action, failureMessage) => {
    try {
      setApiError(null);
      await action();
    } catch (e) {
      console.error(e);
      setApiError(failureMessage);
    }
  };

  const playHere = async () => {
    setTransferring(true);
    await run(() => transferPlayback(deviceId), "Couldn't start playback here. Try playing something in Spotify first.");
    setTransferring(false);
  };

  const toggleShuffle = () => run(() => setShuffle(deviceId, !playbackState?.shuffle), "Couldn't change shuffle.");

  const cycleRepeat = () => {
    const next = REPEAT_MODES[((playbackState?.repeat_mode || 0) + 1) % REPEAT_MODES.length];
    run(() => setRepeat(deviceId, next), "Couldn't change repeat.");
  };

  // NEW: keyboard shortcuts. Ignored while typing in a field or when a button
  // has focus (so Space doesn't trigger the button *and* toggle playback).
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.closest('input, textarea, button, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        nextTrack();
      } else if (e.key === 'ArrowLeft') {
        previousTrack();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [togglePlay, nextTrack, previousTrack, toggleMute]);

  const bannerMessage = error || apiError;

  return (
    <div className="app-shell">
      <Sidebar isReady={isReady} isActive={isActive} onLogout={onLogout} />

      <main className="main">
        {bannerMessage && (
          <div className="banner" role="alert">
            <span>{bannerMessage}</span>
            <button
              type="button"
              className="banner__close"
              aria-label="Dismiss"
              onClick={() => {
                clearError();
                setApiError(null);
              }}
            >
              ×
            </button>
          </div>
        )}

        {isActive ? (
          <NowPlaying playbackState={playbackState} togglePlay={togglePlay} />
        ) : (
          <InactiveView isReady={isReady} onPlayHere={playHere} transferring={transferring} />
        )}
      </main>

      <PlayerBar player={player} onShuffle={toggleShuffle} onRepeat={cycleRepeat} />
    </div>
  );
}

export default WebPlayback;
