import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // best-effort: the game works fine without it (non-HTTPS, private mode, ...)
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
