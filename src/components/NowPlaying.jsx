/*
 * NEW FILE (spotify-redesign): the main "Now Playing" view.
 *
 * Replaces the old layout (a 300px cover floated next to three green buttons)
 * with a Spotify-style page: a header tinted by the album art, a big title,
 * a round green play button, and the queue the SDK already gives us but the
 * old UI never showed.
 */
import React from 'react';
import useDominantColor from '../useDominantColor';
import { albumArt, artistNames, formatTime } from '../format';
import { PauseIcon, PlayIcon } from './Icons';

function TrackRow({ track, index }) {
  return (
    <li className="track-row">
      <span className="track-row__index">{index}</span>
      <img className="track-row__art" src={albumArt(track, 64)} alt="" loading="lazy" />
      <div className="track-row__text">
        <span className="track-row__name">{track.name}</span>
        <span className="track-row__artist">{artistNames(track)}</span>
      </div>
      <span className="track-row__album">{track.album?.name}</span>
      <span className="track-row__duration">{formatTime(track.duration_ms)}</span>
    </li>
  );
}

function TrackSection({ title, tracks }) {
  if (!tracks || tracks.length === 0) return null;
  return (
    <section className="track-section">
      <h2 className="section-title">{title}</h2>
      <ol className="track-list">
        {tracks.map((track, i) => (
          <TrackRow key={`${track.uri}-${i}`} track={track} index={i + 1} />
        ))}
      </ol>
    </section>
  );
}

export default function NowPlaying({ playbackState, togglePlay }) {
  const { paused } = playbackState;
  const { current_track: track, next_tracks, previous_tracks } = playbackState.track_window || {};
  const cover = albumArt(track, 300);
  const color = useDominantColor(cover);

  if (!track) return null;

  return (
    <div className="now-playing">
      {/* The tint comes from the album art; the CSS fades it into the background. */}
      <header className="now-playing__hero" style={{ '--hero-color': color }}>
        <img className="now-playing__cover" src={cover} alt={`${track.album?.name} cover`} />
        <div className="now-playing__info">
          <span className="eyebrow">Now playing</span>
          <h1 className="now-playing__title">{track.name}</h1>
          <p className="now-playing__meta">
            <strong>{artistNames(track)}</strong>
            <span className="dot">•</span>
            {track.album?.name}
            <span className="dot">•</span>
            {formatTime(track.duration_ms)}
          </p>
        </div>
      </header>

      <div className="now-playing__body" style={{ '--hero-color': color }}>
        <div className="action-bar">
          <button
            type="button"
            className="btn-play btn-play--large"
            onClick={togglePlay}
            aria-label={paused ? 'Play' : 'Pause'}
          >
            {paused ? <PlayIcon size={28} /> : <PauseIcon size={28} />}
          </button>
        </div>

        <TrackSection title="Next in queue" tracks={next_tracks} />
        <TrackSection title="Recently played" tracks={previous_tracks && [...previous_tracks].reverse()} />
      </div>
    </div>
  );
}
