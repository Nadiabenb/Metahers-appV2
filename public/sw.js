// Increment version whenever code changes to force cache refresh
const CACHE_VERSION = '1.2.0'; // Updated: 2025-11-14 - Fixed layout overlapping
const CACHE_NAME = `metahers-v${CACHE_VERSION}-offline`;
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // API requests - network first, fallback to cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (event.request.method === 'GET' && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
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
  // Feature detection
  if (typeof indexedDB === 'undefined') {
    console.warn('IndexedDB not available for background sync');
    return;
  }

  try {
    const db = await openDB();
    const entries = await getEntries(db);

    for (const entry of entries) {
      try {
        const response = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry.data),
          credentials: 'include',
        });

        if (response.ok) {
          await deleteEntry(db, entry.id);
          if (self.registration && self.registration.showNotification) {
            self.registration.showNotification('Journal Synced', {
              body: 'Your offline entry has been saved',
              icon: '/icon-192.png',
              tag: 'journal-sync',
            });
          }
        }
      } catch (err) {
        console.error('Sync failed:', err);
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MetaHersOffline', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('pendingJournalEntries')) {
        db.createObjectStore('pendingJournalEntries', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getEntries(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['pendingJournalEntries'], 'readonly');
    const store = tx.objectStore('pendingJournalEntries');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteEntry(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['pendingJournalEntries'], 'readwrite');
    const store = tx.objectStore('pendingJournalEntries');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
