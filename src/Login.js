/*
 * CHANGES (spotify-redesign):
 * - Replaced the bare "Login with Spotify" button (leftover create-react-app
 *   `.App-header` styling) with a proper landing page in the Spotify style.
 * - Shows a friendly message when login fails or is cancelled.
 */
import React from 'react';
import { MusicIcon } from './components/Icons';

const ERROR_MESSAGES = {
  access_denied: 'Login was cancelled. You need to allow access to play music here.',
  state_mismatch: 'Login link expired or was tampered with. Please try again.',
  token_exchange_failed: "Spotify didn't accept the login. Check your client ID and secret in .env.",
};

function Login({ error }) {
  return (
    <div className="login">
      <div className="login__card">
        <span className="brand__mark brand__mark--large">
          <MusicIcon size={36} />
        </span>
        <h1 className="login__title">Real Web Player</h1>
        <p className="login__subtitle">Your Spotify library, playing right here in the browser.</p>

        {error && (
          <p className="login__error" role="alert">
            {ERROR_MESSAGES[error] || 'Something went wrong while logging in. Please try again.'}
          </p>
        )}

        <a className="btn-primary btn-primary--large" href="/auth/login">
          Log in with Spotify
        </a>
        <p className="login__fineprint">Requires a Spotify Premium account.</p>
      </div>
    </div>
  );
}

export default Login;
