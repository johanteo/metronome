import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function triggerBeatHaptic(): void {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (error) {
    // Silently fail if haptics aren't available
  }
}

