import { useCallback, useEffect, useState } from 'react';

const SOUNDS_ENABLED_KEY = 'metahers_sounds_enabled';

type SoundType = 'click' | 'success' | 'achievement' | 'notification' | 'subtle';

export function useSoundEffects() {
  const [soundsEnabled, setSoundsEnabled] = useState(() => {
    const stored = localStorage.getItem(SOUNDS_ENABLED_KEY);
    return stored ? stored === 'true' : true; // Default enabled
  });

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on user interaction (required by browsers)
    if (soundsEnabled && !audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }

    // Cleanup: close AudioContext when disabled or unmounting
    if (!soundsEnabled && audioContext && audioContext.state !== 'closed') {
      audioContext.close().catch(console.error);
      setAudioContext(null);
    }

    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(console.error);
      }
    };
  }, [soundsEnabled, audioContext]);

  const playSound = useCallback((type: SoundType) => {
    if (!soundsEnabled || !audioContext) return;

    const ctx = audioContext;
    const now = ctx.currentTime;

    switch (type) {
      case 'click': {
        // Subtle click sound
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;
      }
      
      case 'success': {
        // Pleasant ascending chime
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          
          const startTime = now + (i * 0.1);
          gainNode.gain.setValueAtTime(0.15, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.3);
        });
        break;
      }
      
      case 'achievement': {
        // Triumphant chord
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'triangle';
          
          gainNode.gain.setValueAtTime(0.12, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
          
          oscillator.start(now);
          oscillator.stop(now + 0.8);
        });
        break;
      }
      
      case 'notification': {
        // Gentle notification tone
        [880, 1108.73].forEach((freq, i) => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          
          const startTime = now + (i * 0.15);
          gainNode.gain.setValueAtTime(0.1, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.4);
        });
        break;
      }
      
      case 'subtle': {
        // Very subtle UI feedback
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        oscillator.start(now);
        oscillator.stop(now + 0.05);
        break;
      }
    }
  }, [soundsEnabled, audioContext]);

  const toggleSounds = useCallback(() => {
    const newValue = !soundsEnabled;
    setSoundsEnabled(newValue);
    localStorage.setItem(SOUNDS_ENABLED_KEY, String(newValue));
    
    // Play a test sound when enabling
    if (newValue && audioContext) {
      setTimeout(() => playSound('subtle'), 100);
    }
  }, [soundsEnabled, audioContext, playSound]);

  return {
    soundsEnabled,
    toggleSounds,
    playSound,
  };
}
