import { Audio } from 'expo-av';

let soundObject: Audio.Sound | null = null;
let isLoaded = false;
let isLoading = false;

// Initialize audio mode for iOS/Android
async function initializeAudioMode(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: false,
    });
  } catch (error) {
    console.warn('Failed to set audio mode:', error);
  }
}

// Load the tick sound file
export async function loadSound(): Promise<void> {
  if (isLoaded || isLoading) return;
  
  try {
    isLoading = true;
    await initializeAudioMode();
    
    // Load the sound file - try .mp3 first, then .wav
    let soundSource;
    try {
      soundSource = require('@/assets/sounds/tick.mp3');
    } catch {
      try {
        soundSource = require('@/assets/sounds/tick.wav');
      } catch {
        throw new Error('Sound file not found. Please add tick.mp3 or tick.wav to assets/sounds/');
      }
    }
    
    const { sound } = await Audio.Sound.createAsync(
      soundSource,
      {
        volume: 0.7, // 70% volume - clearly audible but not harsh
        shouldPlay: false,
      }
    );
    
    soundObject = sound;
    isLoaded = true;
    isLoading = false;
  } catch (error) {
    isLoading = false;
    // Only log warning, don't throw - allows app to continue without sound
    console.warn('Failed to load sound:', error);
  }
}

// Play the tick sound
export async function playTick(): Promise<void> {
  try {
    // Ensure sound is loaded
    if (!isLoaded) {
      await loadSound();
    }
    
    if (soundObject && isLoaded) {
      // Reset to beginning and play
      await soundObject.replayAsync();
    }
  } catch (error) {
    console.warn('Failed to play tick sound:', error);
  }
}

// Unload the sound
export async function unloadSound(): Promise<void> {
  try {
    if (soundObject && isLoaded) {
      await soundObject.unloadAsync();
      soundObject = null;
      isLoaded = false;
    }
  } catch (error) {
    console.warn('Failed to unload sound:', error);
  }
}
