import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import FastImage, { FastImageProps, ImageStyle } from '@d11/react-native-fast-image';

type ImageBackgroundImageProps = {
  source: FastImageProps['source'];
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>
  resizeMode?: FastImageProps['resizeMode'];
};

const ImageBackgroundImage: React.FC<ImageBackgroundImageProps> = ({
  source,
  children,
  style,
  imageStyle,
  resizeMode = FastImage.resizeMode.contain,
}) => {
  return (
    <View style={[styles.container, style]}>
      <FastImage
        source={source}
        style={[styles.imageContainer, imageStyle]}
        resizeMode={resizeMode}
      />
      <View style={{position: 'absolute'}}>
      {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
    // overflow: 'hidden',
  },
  imageContainer:{
    // position: 'absolute'
  }
});

export default ImageBackgroundImage;
