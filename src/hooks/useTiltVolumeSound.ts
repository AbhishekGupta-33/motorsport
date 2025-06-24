import { useEffect, useRef } from 'react';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { Subscription } from 'rxjs';
import Sound from 'react-native-sound';
import { useSharedValue, withTiming } from 'react-native-reanimated';

const SAMPLE_INTERVAL_MS = 100;
const BASE_VOLUME = 0.05;
const MAX_VOLUME = 1.0;

export const useTiltVolumeSound = (SOUND_FILE: string) => {
  const soundRef = useRef<Sound | null>(null);
  const accelSubscription = useRef<Subscription | null>(null);
  const initialY = useRef<number | null>(null);
  const initialZ = useRef<number | null>(null);
  const volumeValue = useSharedValue(BASE_VOLUME);

  const handleAccelerometer = ({ y, z }: { y: number; z: number }) => {
    if (initialY.current === null || initialZ.current === null) {
      initialY.current = y;
      initialZ.current = z;
      return;
    }

    const deltaY = initialY.current - y;
    const deltaZ = initialZ.current - z;

    // Combine y and z influence (weighted sum can be tuned)
    const deviation = -(deltaY + deltaZ);

    // Scale and clamp volume
    const rawVolume = BASE_VOLUME + deviation * 1.5; // Tweak sensitivity here
    const clampedVolume = Math.min(Math.max(rawVolume, BASE_VOLUME), MAX_VOLUME);

    // Animate volume for UI
    volumeValue.value = withTiming(clampedVolume, { duration: 300 });

    // Set on sound
    soundRef.current?.setVolume(clampedVolume);
  };

  const startSound = () => {
    if (soundRef.current) return;

    const sound = new Sound(SOUND_FILE, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load sound:', error);
        return;
      }

      sound.setVolume(BASE_VOLUME);
      sound.setNumberOfLoops(-1);
      sound.play();
      soundRef.current = sound;

      setUpdateIntervalForType(SensorTypes.accelerometer, SAMPLE_INTERVAL_MS);
      accelSubscription.current = accelerometer.subscribe(handleAccelerometer);
    });
  };

  const stopSound = () => {
    accelSubscription.current?.unsubscribe();
    accelSubscription.current = null;

    soundRef.current?.stop();
    soundRef.current?.release();
    soundRef.current = null;
    initialY.current = null;
    initialZ.current = null;

    volumeValue.value = withTiming(BASE_VOLUME);
  };

  useEffect(() => {
    return stopSound;
  }, []);

  return {
    startSound,
    stopSound,
    volumeValue,
  };
};
