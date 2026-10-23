/*
 * NEW FILE (spotify-redesign): the left sidebar, modelled on Spotify's
 * desktop app. It shows connection status (which used to be visible only in
 * the browser console), a keyboard-shortcut cheat sheet and a log-out button.
 */
import React from 'react';
import { KeyboardIcon, LogoutIcon, MusicIcon, SpeakerIcon } from './Icons';

function deviceStatus(isReady, isActive) {
  if (isActive) return { label: 'Playing in this browser', tone: 'live' };
  if (isReady) return { label: 'Ready to play', tone: 'ready' };
  return { label: 'Connecting…', tone: 'idle' };
}

export default function Sidebar({ isReady, isActive, onLogout }) {
  const status = deviceStatus(isReady, isActive);

  return (
    <aside className="sidebar">
      <div className="sidebar__panel">
        <div className="brand">
          <span className="brand__mark">
            <MusicIcon size={18} />
          </span>
          Real Web Player
        </div>
      </div>

      <div className="sidebar__panel sidebar__panel--grow">
        <h2 className="sidebar__heading">
          <SpeakerIcon size={18} /> Device
        </h2>
        <div className={`device-status device-status--${status.tone}`}>
          <span className="device-status__dot" title={status.label} />
          <span className="device-status__label">{status.label}</span>
        </div>

        <h2 className="sidebar__heading">
          <KeyboardIcon size={18} /> Shortcuts
        </h2>
        <dl className="shortcuts">
          <dt><kbd>Space</kbd></dt><dd>Play / pause</dd>
          <dt><kbd>→</kbd></dt><dd>Next track</dd>
          <dt><kbd>←</kbd></dt><dd>Previous track</dd>
          <dt><kbd>M</kbd></dt><dd>Mute</dd>
        </dl>

        <button type="button" className="btn-ghost sidebar__logout" onClick={onLogout}>
          <LogoutIcon size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}
