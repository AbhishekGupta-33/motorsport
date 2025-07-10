import { Platform, Alert } from 'react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';
import Share from 'react-native-share';

export const downloadAndShareMP3 = async (fileName: string) => {
  try {
    const destPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
    let sourcePath = '';

    console.log('🔧 Start MP3 download:', fileName);
    console.log('📁 Destination path:', destPath);

    if (Platform.OS === 'ios') {
      // iOS uses MainBundlePath
      sourcePath = `${RNFS.MainBundlePath}/${fileName}`;
      console.log('📁 iOS source path:', sourcePath);
      await RNFS.copyFile(sourcePath, destPath);
    } else if (Platform.OS === 'android') {
      // Android: file must be placed in android/app/src/main/assets/
      const assetFilePath = `audio/${fileName}`;
      console.log('📁 Android asset path:', assetFilePath);

      const exists = await RNFS.existsAssets(assetFilePath);
      console.log('✅ Asset exists:', exists);

      if (!exists) {
        console.warn(`⚠️ Asset not found: ${assetFilePath}`);
        return;
      }

      const assetData = await RNFS.readFileAssets(assetFilePath, 'base64');
      await RNFS.writeFile(destPath, assetData, 'base64');
      console.log('✅ File written to temp path');
    }

    await Share.open({
      url: `file://${destPath}`,
      type: 'audio/mpeg',
      title: 'Save MP3',
    });

    // Show path in alert
    Alert.alert('✅ File Saved', `Path to file:\n${destPath}`);
  } catch (error: any) {
    console.error('❌ Failed to share MP3:', error);
    Alert.alert('❌ Error', error?.message || 'Something went wrong while saving the MP3 file.');
  }
};
