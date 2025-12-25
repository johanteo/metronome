import { loadSound, playTick, unloadSound } from "@/services/audio";
import { triggerBeatHaptic } from "@/services/haptics";
import { useEffect, useRef, useState } from "react";

export function useMetronome(initialBpm: number = 60) {
  const [bpm, setBpm] = useState(initialBpm);
  const [isRunning, setIsRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  // Load sound when component mounts and sound is enabled
  useEffect(() => {
    if (soundEnabled) {
      loadSound().catch((error) => {
        console.warn('Failed to load sound:', error);
      });
    }
    
    return () => {
      unloadSound().catch((error) => {
        console.warn('Failed to unload sound:', error);
      });
    };
  }, [soundEnabled]);

  // Manage interval based on isRunning and bpm
  useEffect(() => {
    if (isRunning) {
      const intervalMs = 60000 / bpm;
      
      intervalRef.current = setInterval(() => {
        setBeat((prev) => prev + 1);
        if (hapticsEnabled) {
          triggerBeatHaptic();
        }
        if (soundEnabled) {
          playTick();
        }
      }, intervalMs);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRunning, bpm, hapticsEnabled, soundEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      unloadSound().catch(() => {
        // Ignore errors during cleanup
      });
    };
  }, []);

  return {
    bpm,
    setBpm,
    isRunning,
    beat,
    start,
    stop,
    hapticsEnabled,
    setHapticsEnabled,
    soundEnabled,
    setSoundEnabled,
  };
}
