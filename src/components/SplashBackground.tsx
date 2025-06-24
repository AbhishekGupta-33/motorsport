import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import FastImage, { FastImageProps, FastImageStaticProperties } from '@d11/react-native-fast-image';

interface Props {
  backgroundImage: any;
  controllerImage: any;
  children?: React.ReactNode;
  style?: ViewStyle;
  controllerImageStyle?: any
}

const AppBackground: React.FC<Props> = ({ backgroundImage, controllerImage, children, style, controllerImageStyle }) => {
  return (
    <View style={styles.container}>
      <FastImage source={backgroundImage} style={styles.bgImage} resizeMode={FastImage.resizeMode.stretch} />
      
      <FastImage source={controllerImage} style={[styles.controllerImage, controllerImageStyle]} resizeMode={FastImage.resizeMode.contain} />

      <View style={[styles.content, style]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  controllerImage: {
    position: 'absolute',
    width: '90%',
    height: '70%',
    alignSelf: 'center',
    bottom:0,
    // top: '15%',
  },
  content: {
    // position: 'absolute',
    // top: '50%',
    // width: '100%',
    // alignItems: 'center',
    // transform: [{ translateY: -20 }],
  },
});

export default AppBackground;
