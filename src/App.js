/*
 * CHANGES (spotify-redesign):
 * - Added a loading state. Before, the Login screen flashed for a moment
 *   even for logged-in users while the token request was in flight.
 * - If the token request failed (server not running), the app crashed with
 *   an unhandled rejection. It now falls back to the login screen.
 * - Login errors returned by the server (?error=...) are shown on the login
 *   screen instead of being ignored.
 * - Added log out.
 */
import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import { getToken, logout } from './spotifyApi';
import './App.css';

function App() {
  // null = still checking, '' = logged out, otherwise logged in.
  const [token, setToken] = useState(null);
  const [loginError] = useState(() => new URLSearchParams(window.location.search).get('error'));

  useEffect(() => {
    getToken()
      .then(setToken)
      .catch(() => setToken(''));

    // Tidy the URL so a refresh doesn't keep showing an old error.
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setToken('');
  };

  if (token === null) {
    return (
      <div className="splash" aria-label="Loading">
        <div className="spinner" />
      </div>
    );
  }

  return token === '' ? <Login error={loginError} /> : <WebPlayback onLogout={handleLogout} />;
}

export default App;
