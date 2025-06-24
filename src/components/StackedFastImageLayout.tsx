import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FastImage, { Source, ImageStyle } from '@d11/react-native-fast-image';
import Animated from 'react-native-reanimated';

interface StackedFastImageLayoutProps {
  backgroundImage: Source;
  middleImage: Source;
  topImage: Source;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundImageStyle?: StyleProp<ImageStyle>;
  middleImageStyle?: StyleProp<ImageStyle>;
  topImageStyle?: StyleProp<ImageStyle>;
  children?: React.ReactNode;
  childrenStyle?: StyleProp<ViewStyle>;
  middleImageAnimStyle?: StyleProp<ImageStyle>;
  topImageAnimStyle?: StyleProp<ImageStyle>;
  childrenAnimStyle?: StyleProp<ViewStyle>;
}

const StackedFastImageLayout: React.FC<StackedFastImageLayoutProps> = ({
  backgroundImage,
  middleImage,
  topImage,
  containerStyle,
  backgroundImageStyle,
  middleImageStyle,
  topImageStyle,
  children,
  childrenStyle,
  middleImageAnimStyle,
  topImageAnimStyle,
  childrenAnimStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <FastImage
        source={backgroundImage}
        resizeMode={FastImage.resizeMode.stretch}
        style={[styles.backgroundImage, backgroundImageStyle]}
      />
      <Animated.Image
        source={middleImage}
        resizeMode={FastImage.resizeMode.stretch}
        style={[styles.middleImage, middleImageStyle, middleImageAnimStyle]}
      />
      <Animated.Image
        source={topImage}
        resizeMode={FastImage.resizeMode.contain}
        style={[styles.topImage, topImageStyle, topImageAnimStyle]}
      />
      <Animated.View style={[styles.childrenContainer, childrenStyle, childrenAnimStyle]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  middleImage: {
    position: 'absolute',
    top: '20%',
    width: '35%',
    height: '35%',
  },
  topImage: {
    position: 'absolute',
    bottom: -10,
    width: '100%',
    height: '100%',
  },
  childrenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default StackedFastImageLayout;
