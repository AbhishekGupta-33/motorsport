import { useCallback, useState } from 'react';
import {
  Platform,
  ToastAndroid,
  NativeModules,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';

const { RingtoneModule } = NativeModules;

export const useRingtoneSetter = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const ensureWriteSettingsPermission = async (): Promise<boolean> => {
    console.log('[Ringtone] Checking WRITE_SETTINGS permission...');
    try {
      const hasPermission: boolean = await RingtoneModule.canWriteSettings();
      console.log('[Ringtone] WRITE_SETTINGS permission:', hasPermission);
      if (!hasPermission) {
        ToastAndroid.show(
          t('ringtone.permission_redirect'),
          ToastAndroid.SHORT,
        );
        console.log('[Ringtone] Opening settings for WRITE_SETTINGS permission...');
        RingtoneModule.openWriteSettingsIntent();
        return false;
      }
      return true;
    } catch (error) {
      console.error('[Ringtone] WRITE_SETTINGS check failed:', error);
      return false;
    }
  };

  const copyAssetToExternal = async (
    assetName: string,
  ): Promise<string | null> => {
    console.log(`[Ringtone] Attempting to copy asset: ${assetName}`);
    try {
      const filePath: string = await RingtoneModule.copyAssetToExternalStorage(
        assetName,
      );
      console.log('[Ringtone] File copied to external path:', filePath);
      return filePath;
    } catch (err) {
      console.error('[Ringtone] Failed to copy asset:', err);
      ToastAndroid.show(t('ringtone.copy_failed'), ToastAndroid.SHORT);
      return null;
    }
  };

  const setRingtone = useCallback(async (assetName: string) => {
    console.log(`[Ringtone] setRingtone called with asset: ${assetName}`);
    if (Platform.OS !== 'android') {
      console.log('[Ringtone] Not an Android platform. Exiting...');
      return;
    }

    setLoading(true);

    const granted = await ensureWriteSettingsPermission();
    if (!granted) {
      console.log('[Ringtone] Permission not granted. Exiting...');
      setLoading(false);
      return;
    }

    const filePath = await copyAssetToExternal(assetName);
    if (!filePath) {
      console.log('[Ringtone] Failed to copy asset. Exiting...');
      setLoading(false);
      return;
    }

    try {
      console.log('[Ringtone] Getting SIM count...');
      const simCount: number = await RingtoneModule.getSimCount();
      console.log('[Ringtone] SIM count:', simCount);

      if (simCount > 1) {
        console.log('[Ringtone] Multiple SIMs detected. Showing alert...');
        Alert.alert(
          t('ringtone.multiple_sims_title'),
          t('ringtone.multiple_sims_message'),
          [
            {
              text: t('ringtone.set_globally'),
              onPress: () => {
                console.log('[Ringtone] Setting ringtone globally...');
                RingtoneModule.setRingtone(filePath);
                ToastAndroid.show(t('ringtone.set_globally_success'), ToastAndroid.SHORT);
              },
            },
            {
              text: t('ringtone.open_settings'),
              onPress: () => {
                console.log('[Ringtone] Opening ringtone settings with path...');
                RingtoneModule.openRingtoneSettingsWithPath(filePath);
              },
              style: 'default',
            },
            { text: t('cancel'), style: 'cancel' },
          ],
        );
      } else {
        console.log('[Ringtone] Single SIM. Setting ringtone...');
        RingtoneModule.setRingtone(filePath);
        ToastAndroid.show(t('ringtone.set_success'), ToastAndroid.SHORT);
      }
    } catch (e) {
      console.error('[Ringtone] Error setting ringtone:', e);
      ToastAndroid.show(t('ringtone.set_failed'), ToastAndroid.SHORT);
    } finally {
      console.log('[Ringtone] Done. Resetting loading state.');
      setLoading(false);
    }
  }, []);

  return { setRingtone, loading };
};
