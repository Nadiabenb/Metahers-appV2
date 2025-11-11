import { useEffect, useState, useCallback } from 'react';
import { useNotifications } from './useNotifications';

const isIndexedDBSupported = () => {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
};

const isSyncManagerSupported = () => {
  try {
    return 'serviceWorker' in navigator && 'SyncManager' in window;
  } catch {
    return false;
  }
};

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [hasPendingSync, setHasPendingSync] = useState(false);
  const [isSupported] = useState(isIndexedDBSupported());
  const { notifyMilestone } = useNotifications();

  const checkPendingSync = useCallback(async () => {
    if (!isSupported) return;
    
    try {
      const db = await openIndexedDB();
      const entries = await getPendingEntries(db);
      setHasPendingSync(entries.length > 0);
    } catch (error) {
      console.error('Failed to check pending sync:', error);
    }
  }, [isSupported]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      
      // Trigger background sync if available
      if (isSyncManagerSupported()) {
        navigator.serviceWorker.ready.then((registration: any) => {
          return registration.sync.register('sync-journal-entries');
        }).catch(console.error);
      }
      
      notifyMilestone('Back Online', 'Your journal entries are being synced');
    };

    const handleOffline = () => {
      setIsOnline(false);
      notifyMilestone('Offline Mode', 'Your entries will sync when you\'re back online');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending sync on mount if supported
    if (isSupported) {
      checkPendingSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [notifyMilestone, isSupported, checkPendingSync]);

  const saveOfflineEntry = useCallback(async (entryData: any) => {
    if (!isSupported) {
      console.warn('Offline storage not supported in this browser');
      return false;
    }
    
    try {
      const db = await openIndexedDB();
      await addPendingEntry(db, entryData);
      setHasPendingSync(true);
      
      // Try to register sync if online and supported
      if (isOnline && isSyncManagerSupported()) {
        navigator.serviceWorker.ready.then((registration: any) => {
          return registration.sync.register('sync-journal-entries');
        }).catch(console.error);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save offline entry:', error);
      return false;
    }
  }, [isOnline, isSupported]);

  return {
    isOnline,
    hasPendingSync,
    saveOfflineEntry,
    checkPendingSync,
    isSupported,
  };
}

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MetaHersOffline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('pendingJournalEntries')) {
        db.createObjectStore('pendingJournalEntries', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getPendingEntries(db: IDBDatabase): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingJournalEntries'], 'readonly');
    const store = transaction.objectStore('pendingJournalEntries');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function addPendingEntry(db: IDBDatabase, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingJournalEntries'], 'readwrite');
    const store = transaction.objectStore('pendingJournalEntries');
    const request = store.add({ data, timestamp: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
