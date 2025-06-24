import { useEffect, useRef, useState } from 'react';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { Subscription } from 'rxjs'; // ✅ Correct type
import Sound from 'react-native-sound';

const SAMPLE_INTERVAL_MS = 50;
const BASE_VOLUME = 0.05;
const MAX_VOLUME = 1.0;

export const useGyroSound = (SOUND_FILE: string) => {
  const soundRef = useRef<Sound | null>(null);
  const accelSubscription = useRef<Subscription | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const initialY = useRef<number | null>(null);
  const initialZ = useRef<number | null>(null);

  const handleAccelerometer = ({ y, z }: { y: number; z: number }) => {
    if (initialY.current === null || initialZ.current === null) {
      initialY.current = y;
      initialZ.current = z;
      return;
    }

    const deltaY = initialY.current - y;
    const deltaZ = initialZ.current - z;

    // Combine influence (you can apply different weights here)
    const deviation = -(deltaY + deltaZ);

    const scaledVolume = BASE_VOLUME + deviation; // Scaling factor tweakable
    const volume = Math.min(Math.max(scaledVolume, BASE_VOLUME), MAX_VOLUME);

    soundRef.current?.setVolume(volume);
  };

  const cleanupResources = () => {
    accelSubscription.current?.unsubscribe();
    accelSubscription.current = null;

    soundRef.current?.stop();
    soundRef.current?.release();
    soundRef.current = null;

    setIsPlaying(false);
    initialY.current = null;
    initialZ.current = null;
  };

  const startSound = () => {
    if (isPlaying || soundRef.current) return;

    const sound = new Sound(SOUND_FILE, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load sound:', error);
        return;
      }

      sound.setVolume(BASE_VOLUME);
      sound.setNumberOfLoops(-1);
      sound.play();
      soundRef.current = sound;
      setIsPlaying(true);

      setUpdateIntervalForType(SensorTypes.accelerometer, SAMPLE_INTERVAL_MS);
      accelSubscription.current = accelerometer.subscribe(handleAccelerometer);
    });
  };

  useEffect(() => {
    return cleanupResources;
  }, []);

  return {
    startSound,
    stop: cleanupResources,
    isPlaying,
  };
};
