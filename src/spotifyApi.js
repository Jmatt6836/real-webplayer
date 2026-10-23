/*
 * NEW FILE (spotify-redesign): small helpers for talking to our auth server
 * and the Spotify Web API.
 *
 * Why: the original app fetched the token once and passed it down forever,
 * so the player broke after the token expired (1 hour). Fetching through
 * `getToken()` always returns a fresh token, because the server refreshes it.
 */

export async function getToken() {
  const response = await fetch('/auth/token');
  const json = await response.json();
  return json.access_token || '';
}

export async function logout() {
  await fetch('/auth/logout', { method: 'POST' });
}

// Thin wrapper around the Web API for the few calls the Playback SDK itself
// can't make (transferring playback, shuffle, repeat).
async function webApi(path, options = {}) {
  const token = await getToken();
  const response = await fetch('https://api.spotify.com/v1' + path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok && response.status !== 204) {
    throw new Error(`Spotify API ${path} failed with ${response.status}`);
  }
}

// Moves playback to this browser tab. Before, users had to open the Spotify
// app and pick the device manually.
export function transferPlayback(deviceId) {
  return webApi('/me/player', {
    method: 'PUT',
    body: JSON.stringify({ device_ids: [deviceId], play: true }),
  });
}

export function setShuffle(deviceId, state) {
  return webApi(`/me/player/shuffle?state=${state}&device_id=${deviceId}`, { method: 'PUT' });
}

// mode is 'off' | 'context' | 'track'
export function setRepeat(deviceId, mode) {
  return webApi(`/me/player/repeat?state=${mode}&device_id=${deviceId}`, { method: 'PUT' });
}
