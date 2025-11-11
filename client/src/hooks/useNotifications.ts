import { useEffect, useState, useCallback } from 'react';
import { useSoundEffects } from './useSoundEffects';

const NOTIFICATIONS_ENABLED_KEY = 'metahers_notifications_enabled';

export function useNotifications() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return stored ? stored === 'true' : false; // Default disabled (requires permission)
  });

  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'true');
        return true;
      } else {
        setNotificationsEnabled(false);
        localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const toggleNotifications = useCallback(async () => {
    if (!notificationsEnabled) {
      // Trying to enable - request permission
      const granted = await requestPermission();
      if (granted) {
        // Send test notification directly (state hasn't updated yet)
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            const notification = new Notification('Notifications Enabled', {
              body: 'You\'ll now receive updates for achievements and milestones',
              icon: '/icon-192.png',
              badge: '/icon-192.png',
            });
            playSound('notification');
            setTimeout(() => notification.close(), 5000);
          } catch (error) {
            console.error('Error sending test notification:', error);
          }
        }
      }
    } else {
      // Disabling
      setNotificationsEnabled(false);
      localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
    }
  }, [notificationsEnabled, requestPermission, playSound]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!notificationsEnabled || permission !== 'granted' || !('Notification' in window)) {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });

      // Play achievement sound if this is an achievement notification
      if (title.includes('Achievement') || title.includes('Unlocked')) {
        playSound('achievement');
      } else {
        playSound('notification');
      }

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [notificationsEnabled, permission, playSound]);

  const notifyAchievement = useCallback((achievementName: string, description: string) => {
    sendNotification(`🏆 Achievement Unlocked!`, {
      body: `${achievementName}\n${description}`,
      icon: '/icon-512.png',
      tag: 'achievement',
      requireInteraction: true,
    });
  }, [sendNotification]);

  const notifyMilestone = useCallback((title: string, message: string) => {
    sendNotification(`✨ ${title}`, {
      body: message,
      icon: '/icon-192.png',
      tag: 'milestone',
    });
  }, [sendNotification]);

  return {
    notificationsEnabled,
    permission,
    toggleNotifications,
    requestPermission,
    sendNotification,
    notifyAchievement,
    notifyMilestone,
    isSupported: 'Notification' in window,
  };
}
