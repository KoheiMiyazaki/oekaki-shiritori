import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update & cache-clean harness for GitHub Pages
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Automatically purge old caches and reload to newest build
    updateSW(true);
  },
  onRegisteredSW(_swScriptUrl, registration) {
    if (registration) {
      // Check for updates on visibility change (e.g. switching back to tab/app)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update().catch(() => {});
        }
      });
      // Periodic check every 30 minutes
      setInterval(() => {
        registration.update().catch(() => {});
      }, 30 * 60 * 1000);
    }
  },
});

createRoot(document.getElementById('root')!).render(<App />);
