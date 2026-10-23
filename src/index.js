/*
 * CHANGED (spotify-redesign): upgraded from React 17's ReactDOM.render to
 * React 18's createRoot. ReactDOM.render is deprecated in React 18 and
 * removed in React 19.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
