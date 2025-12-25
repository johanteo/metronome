import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMetronome } from '@/hooks/useMetronome';

export default function HomeScreen() {
  const {
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
  } = useMetronome();
  const insets = useSafeAreaInsets();
  const dotOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRunning && beat > 0) {
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      dotOpacity.setValue(0);
    }
  }, [beat, isRunning, dotOpacity]);

  const increaseBpm = () => {
    if (bpm < 240) {
      setBpm(bpm + 1);
    }
  };

  const decreaseBpm = () => {
    if (bpm > 30) {
      setBpm(bpm - 1);
    }
  };

  const toggleMetronome = () => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.content, { paddingTop: Math.max(insets.top + 60, 80) }]}>
        <ThemedText type="title" style={styles.bpmText}>
          {bpm} BPM
        </ThemedText>

        <ThemedView style={styles.bpmControls}>
          <TouchableOpacity
            style={[styles.button, bpm <= 30 && styles.buttonDisabled]}
            onPress={decreaseBpm}
            disabled={bpm <= 30}>
            <ThemedText type="subtitle" style={styles.buttonText}>
              −
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, bpm >= 240 && styles.buttonDisabled]}
            onPress={increaseBpm}
            disabled={bpm >= 240}>
            <ThemedText type="subtitle" style={styles.buttonText}>
              +
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity style={styles.startStopButton} onPress={toggleMetronome}>
          <ThemedText type="subtitle" style={styles.startStopButtonText}>
            {isRunning ? 'Stop' : 'Start'}
          </ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, hapticsEnabled && styles.toggleButtonActive]}
            onPress={() => setHapticsEnabled(!hapticsEnabled)}>
            <ThemedText style={[styles.toggleButtonText, hapticsEnabled && styles.toggleButtonTextActive]}>
              Haptics {hapticsEnabled ? 'ON' : 'OFF'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, soundEnabled && styles.toggleButtonActive]}
            onPress={() => setSoundEnabled(!soundEnabled)}>
            <ThemedText style={[styles.toggleButtonText, soundEnabled && styles.toggleButtonTextActive]}>
              Sound {soundEnabled ? 'ON' : 'OFF'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <Animated.View style={[styles.beatDot, { opacity: dotOpacity }]} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bpmText: {
    fontSize: 48,
    lineHeight: 56,
  },
  bpmControls: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 32,
  },
  startStopButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
  },
  startStopButtonText: {
    color: '#FFF',
  },
  beatDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#FFF',
  },
});
