/*
 * NEW FILE (spotify-redesign): the fixed playback bar at the bottom of the
 * screen, like Spotify's: track info on the left, transport controls and a
 * seekable progress bar in the middle, volume on the right.
 *
 * The old UI had previous/play/next only. There was no progress, seeking,
 * volume, shuffle or repeat.
 */
import React, { useEffect, useState } from 'react';
import { albumArt, artistNames, formatTime } from '../format';
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  RepeatOneIcon,
  ShuffleIcon,
  VolumeIcon,
  VolumeOffIcon,
} from './Icons';

// Re-render every half second while playing so the progress bar moves.
// The SDK only reports position when something changes.
function useTicker(active) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, [active]);
}

// A range input with the Spotify look: thin grey track, white fill that turns
// green on hover, and a thumb that only shows on hover.
function Slider({ value, max, onChange, onCommit, label, disabled }) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <input
      type="range"
      className="slider"
      min={0}
      max={max || 1}
      step="any"
      value={value}
      disabled={disabled}
      aria-label={label}
      style={{ '--fill': `${percent}%` }}
      onChange={(e) => onChange(Number(e.target.value))}
      onPointerUp={onCommit}
      onKeyUp={onCommit}
    />
  );
}

export default function PlayerBar({ player, onShuffle, onRepeat }) {
  const {
    playbackState,
    stateTimestamp,
    isActive,
    volume,
    setVolume,
    toggleMute,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
  } = player;

  const paused = playbackState?.paused ?? true;
  const track = playbackState?.track_window?.current_track;
  const duration = playbackState?.duration || 0;
  const shuffle = playbackState?.shuffle || false;
  const repeatMode = playbackState?.repeat_mode || 0; // 0 off, 1 context, 2 track

  useTicker(isActive && !paused);

  // While the user drags the progress slider, show their value, not the live one.
  const [scrubValue, setScrubValue] = useState(null);
  const livePosition = paused
    ? playbackState?.position || 0
    : Math.min(duration, (playbackState?.position || 0) + (Date.now() - stateTimestamp));
  const position = scrubValue ?? livePosition;

  const commitSeek = () => {
    if (scrubValue !== null) {
      seek(scrubValue);
      setScrubValue(null);
    }
  };

  const RepeatGlyph = repeatMode === 2 ? RepeatOneIcon : RepeatIcon;
  const repeatLabels = ['Enable repeat', 'Enable repeat one', 'Disable repeat'];

  return (
    <footer className="player-bar">
      <div className="player-bar__track">
        {track ? (
          <>
            <img className="player-bar__art" src={albumArt(track, 64)} alt="" />
            <div className="player-bar__text">
              <span className="player-bar__name">{track.name}</span>
              <span className="player-bar__artist">{artistNames(track)}</span>
            </div>
          </>
        ) : (
          <span className="player-bar__empty">Nothing playing</span>
        )}
      </div>

      <div className="player-bar__center">
        <div className="controls">
          <button
            type="button"
            className={`btn-icon btn-icon--extra ${shuffle ? 'btn-icon--on' : ''}`}
            onClick={onShuffle}
            disabled={!isActive}
            aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
            aria-pressed={shuffle}
          >
            <ShuffleIcon size={18} />
          </button>
          <button type="button" className="btn-icon" onClick={previousTrack} disabled={!isActive} aria-label="Previous">
            <PrevIcon size={18} />
          </button>
          <button
            type="button"
            className="btn-play"
            onClick={togglePlay}
            disabled={!isActive}
            aria-label={paused ? 'Play' : 'Pause'}
          >
            {paused ? <PlayIcon size={18} /> : <PauseIcon size={18} />}
          </button>
          <button type="button" className="btn-icon" onClick={nextTrack} disabled={!isActive} aria-label="Next">
            <NextIcon size={18} />
          </button>
          <button
            type="button"
            className={`btn-icon btn-icon--extra ${repeatMode ? 'btn-icon--on' : ''}`}
            onClick={onRepeat}
            disabled={!isActive}
            aria-label={repeatLabels[repeatMode]}
            aria-pressed={repeatMode > 0}
          >
            <RepeatGlyph size={18} />
          </button>
        </div>

        <div className="progress">
          <span className="progress__time">{formatTime(position)}</span>
          <Slider
            value={position}
            max={duration}
            onChange={setScrubValue}
            onCommit={commitSeek}
            label="Seek"
            disabled={!isActive}
          />
          <span className="progress__time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-bar__volume">
        <button type="button" className="btn-icon" onClick={toggleMute} aria-label={volume > 0 ? 'Mute' : 'Unmute'}>
          {volume > 0 ? <VolumeIcon size={18} /> : <VolumeOffIcon size={18} />}
        </button>
        <Slider value={volume} max={1} onChange={setVolume} label="Volume" />
      </div>
    </footer>
  );
}
