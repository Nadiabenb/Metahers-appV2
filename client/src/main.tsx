import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Clear old caches and register fresh service worker
if ('serviceWorker' in navigator) {
  // Clear ALL caches first
  caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName.startsWith('metahers-')) {
          console.log('Clearing cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  }).then(() => {
    // Unregister old service workers
    return navigator.serviceWorker.getRegistrations();
  }).then((registrations) => {
    return Promise.all(
      registrations.map((registration) => {
        console.log('Unregistering old service worker');
        return registration.unregister();
      })
    );
  }).then(() => {
    // Register new service worker
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('✓ Fresh service worker registered:', registration.scope);
        
        // Force update on first install
        registration.update();
      })
      .catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
