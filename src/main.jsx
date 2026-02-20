import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const THEME_KEY = 'md-theme';

const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'contrast') return stored;

  const prefersContrast = window.matchMedia?.('(prefers-contrast: more)').matches;
  if (prefersContrast) return 'contrast';

  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
};

try {
  document.documentElement.dataset.theme = getInitialTheme();
} catch {
  // ignore storage/matchMedia errors
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
