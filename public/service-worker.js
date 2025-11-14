// Increment version whenever code changes to force cache refresh
const CACHE_VERSION = '1.3.0'; // Updated: 2025-11-14 - Fixed cache strategy: network-first for HTML
const CACHE_NAME = `metahers-v${CACHE_VERSION}`;
const OFFLINE_URL = '/';

// Only cache truly static assets (not HTML)
const STATIC_ASSETS = [
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const { request } = event;
  const url = new URL(request.url);

  // API requests - network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful GET requests
          if (request.method === 'GET' && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request);
        })
    );
    return;
  }

  // HTML/Navigation requests - ALWAYS network first (critical for updates)
  if (request.mode === 'navigate' || request.destination === 'document' || 
      url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fresh HTML for offline use
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached version if offline
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Static assets (images, fonts, CSS, JS) - cache first for performance
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      });
    })
  );
});

// Background sync for journal entries
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-journal-entries') {
    event.waitUntil(syncJournalEntries());
  }
});

async function syncJournalEntries() {
  try {
    // Get pending journal entries from IndexedDB
    const db = await openIndexedDB();
    const entries = await getPendingEntries(db);

    if (entries.length === 0) {
      return;
    }

    // Try to sync each entry
    for (const entry of entries) {
      try {
        const response = await fetch('/api/journal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry.data),
          credentials: 'include',
        });

        if (response.ok) {
          // Remove from pending queue
          await removeEntry(db, entry.id);
          
          // Show success notification
          if (self.registration.showNotification) {
            self.registration.showNotification('Journal Synced', {
              body: 'Your offline journal entry has been saved',
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              tag: 'journal-sync',
            });
          }
        }
      } catch (error) {
        console.error('Failed to sync entry:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MetaHersOffline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingJournalEntries')) {
        db.createObjectStore('pendingJournalEntries', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getPendingEntries(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingJournalEntries'], 'readonly');
    const store = transaction.objectStore('pendingJournalEntries');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function removeEntry(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingJournalEntries'], 'readwrite');
    const store = transaction.objectStore('pendingJournalEntries');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
