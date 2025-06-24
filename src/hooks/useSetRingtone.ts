import {useCallback, useState} from 'react';
import {
  Platform,
  ToastAndroid,
  NativeModules,
  Alert,
  Linking,
} from 'react-native';

const {RingtoneModule} = NativeModules;

export const useRingtoneSetter = () => {
  const [loading, setLoading] = useState(false);

  const ensureWriteSettingsPermission = async (): Promise<boolean> => {
    try {
      const hasPermission: boolean = await RingtoneModule.canWriteSettings();
      if (!hasPermission) {
        ToastAndroid.show(
          'Redirecting to settings to grant permission',
          ToastAndroid.SHORT,
        );
        RingtoneModule.openWriteSettingsIntent();
        return false;
      }
      return true;
    } catch (error) {
      console.error('WRITE_SETTINGS check failed:', error);
      return false;
    }
  };

  const copyAssetToExternal = async (
    assetName: string,
  ): Promise<string | null> => {
    try {
      const filePath: string = await RingtoneModule.copyAssetToExternalStorage(
        assetName,
      );
      return filePath;
    } catch (err) {
      console.error('Failed to copy asset', err);
      ToastAndroid.show('Failed to copy ringtone file.', ToastAndroid.SHORT);
      return null;
    }
  };

  const setRingtone = useCallback(async (assetName: string) => {
    if (Platform.OS !== 'android') return;

    setLoading(true);

    const granted = await ensureWriteSettingsPermission();
    if (!granted) {
      setLoading(false);
      return;
    }

    const filePath = await copyAssetToExternal(assetName);
    if (!filePath) {
      setLoading(false);
      return;
    }

    try {
      const simCount: number = await RingtoneModule.getSimCount();

      if (simCount > 1) {
        Alert.alert(
          'Multiple SIMs Detected',
          'Due to Android limitations, ringtone can only be set globally. You may set SIM-specific ringtones manually via system settings.',
          [
            {
              text: 'Set Globally',
              onPress: () => {
                RingtoneModule.setRingtone(filePath);
                ToastAndroid.show('Ringtone set globally!', ToastAndroid.SHORT);
              },
            },
            {
              text: 'Open Settings',
              onPress: () =>
                RingtoneModule.openRingtoneSettingsWithPath(filePath),
              style: 'default',
            },
            {text: 'Cancel', style: 'cancel'},
          ],
        );
      } else {
        RingtoneModule.setRingtone(filePath);
        ToastAndroid.show('Ringtone set!', ToastAndroid.SHORT);
      }
    } catch (e) {
      console.error('Error setting ringtone:', e);
      ToastAndroid.show('Failed to set ringtone.', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }, []);

  return {setRingtone, loading};
};
