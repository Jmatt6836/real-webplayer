/*
 * CHANGED (spotify-redesign): the old test was create-react-app boilerplate
 * that looked for a "learn react" link which doesn't exist, so it always
 * failed. These tests cover the app's actual behaviour.
 */
import { render, screen } from '@testing-library/react';
import App from './App';
import { albumArt, artistNames, formatTime } from './format';

function mockToken(accessToken) {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ access_token: accessToken }) }));
}

afterEach(() => {
  jest.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

test('shows the login screen when there is no token', async () => {
  mockToken('');
  render(<App />);
  expect(await screen.findByRole('link', { name: /log in with spotify/i })).toHaveAttribute('href', '/auth/login');
});

test('shows the login screen if the auth server is unreachable', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('offline')));
  render(<App />);
  expect(await screen.findByRole('link', { name: /log in with spotify/i })).toBeInTheDocument();
});

test('explains a cancelled login', async () => {
  window.history.replaceState(null, '', '/?error=access_denied');
  mockToken('');
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent(/login was cancelled/i);
});

describe('format helpers', () => {
  test('formatTime', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(215000)).toBe('3:35');
    expect(formatTime(undefined)).toBe('0:00');
  });

  test('artistNames joins every artist', () => {
    expect(artistNames({ artists: [{ name: 'A' }, { name: 'B' }] })).toBe('A, B');
    expect(artistNames(undefined)).toBe('');
  });

  test('albumArt picks the smallest image that is big enough', () => {
    const track = {
      album: {
        images: [
          { url: 'big', width: 640 },
          { url: 'small', width: 64 },
          { url: 'medium', width: 300 },
        ],
      },
    };
    expect(albumArt(track, 64)).toBe('small');
    expect(albumArt(track, 200)).toBe('medium');
    expect(albumArt(track, 1000)).toBe('big');
    expect(albumArt({}, 64)).toBe('');
  });
});
