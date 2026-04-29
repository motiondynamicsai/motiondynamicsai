import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './index.css';

const THEME_KEY = 'md-theme';
type Theme = 'dark' | 'light' | 'contrast';

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'contrast') return stored;

  const prefersContrast = window.matchMedia?.('(prefers-contrast: more)').matches;
  if (prefersContrast) return 'contrast';

  return 'dark';
};

try {
  document.documentElement.dataset.theme = getInitialTheme();
} catch {
  // ignore storage/matchMedia errors
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
