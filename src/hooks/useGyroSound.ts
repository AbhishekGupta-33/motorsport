import {useEffect, useRef, useState} from 'react';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {Subscription} from 'rxjs'; // ✅ Correct type
import Sound from 'react-native-sound';

const SAMPLE_INTERVAL_MS = 50;
const BASE_VOLUME = 0.3;
const MAX_VOLUME = 1.0;

export const useGyroSound = (SOUND_FILE: string) => {
  const soundRef = useRef<Sound | null>(null);
  const accelSubscription = useRef<Subscription | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const initialY = useRef<number | null>(null);
  const initialZ = useRef<number | null>(null);

  const handleAccelerometer = ({x, z}: {x: number; z: number}) => {
    // Calculate tilt angle using X-axis (landscape mode)
    const tiltRadians = Math.atan2(x, z);
    const tiltDegrees = Math.abs(tiltRadians * (180 / Math.PI)); // Always positive

    // Clamp max to 45 degrees
    const clamped = Math.min(tiltDegrees, 40);
    const normalized = clamped / 40;

    // 🔁 Reverse the mapping (0° → high volume, 45° → low volume)
    const reversed = 1 - normalized;

    // Scale to volume range
    const volume = BASE_VOLUME + (MAX_VOLUME - BASE_VOLUME) * reversed;

    // Apply to sound
    soundRef.current?.setVolume(volume);

    // Debug log
    console.log(
      `Tilt: ${tiltDegrees.toFixed(1)}° → Normalized: ${normalized.toFixed(
        2,
      )} → Reversed: ${reversed.toFixed(2)} → Volume: ${volume.toFixed(2)}`,
    );
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
    const sound = new Sound(SOUND_FILE, Sound.MAIN_BUNDLE, error => {
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

  const playSoundInFullVolume = (isContinueSoundPlay: boolean) => {
    console.log('playSoundInFullVolume: ->isPlaying', isPlaying);

    if (isPlaying || soundRef.current) return false;
    const sound = new Sound(SOUND_FILE, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Failed to load sound:', error);
        return;
      }
    });

    sound.setVolume(1);
    sound.play();
    soundRef.current = sound;
    setIsPlaying(true);
    isContinueSoundPlay && sound.setNumberOfLoops(-1);
    return new Promise(resolve => {
      if (isContinueSoundPlay) {
        resolve(false);
      } else {
        setTimeout(() => {
          soundRef.current?.stop();
          soundRef.current?.release();
          soundRef.current = null;
          setIsPlaying(false);
          console.log(
            'playSoundInFullVolume: ->soundRef.current',
            soundRef.current,
          );
          resolve(true);
        }, 3000);
      }
    });
  };

  useEffect(() => {
    return cleanupResources;
  }, []);

  return {
    startSound,
    stop: cleanupResources,
    isPlaying,
    playSoundInFullVolume,
  };
};
