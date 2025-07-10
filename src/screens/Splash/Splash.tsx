import React, { useEffect, useRef, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NavgationNames } from '../../constants/NavgationNames';

import AppBackground from '../../components/SplashBackground';
import ImageBackgroundImage from '../../components/ImageBackgroundImage';
import FastImage from '@d11/react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { APP_IMAGE } from '../../../assets/images';
import { storage } from '../../utils/storage';

const { height, width } = Dimensions.get('window');
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const SplashScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const scale = useSharedValue(0.1);

  const animate = useCallback(() => {
    scale.value = withTiming(1.5, {
      duration: 500,
      easing: Easing.out(Easing.linear),
    });

    setTimeout(() => {
      const isLangSelected = storage.getString('lang');
           navigation.replace(isLangSelected ? NavgationNames.homeTwo :  NavgationNames.home);
    }, 900);
  }, []);

  useEffect(() => {
    animate();
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <>
      <AppBackground
        backgroundImage={APP_IMAGE.splashBG}
        controllerImage={APP_IMAGE.controler}
        style={styles.mainView}>
        <ImageBackgroundImage
          source={APP_IMAGE.RectangleBlur}
          imageStyle={styles.blurImage}
          style={styles.centeredContent}>
          <Text style={styles.title}>{t('splash_title').toUpperCase()}</Text>
        </ImageBackgroundImage>
      </AppBackground>

      <View style={styles.animatedLayer}>
        <AnimatedFastImage
          source={APP_IMAGE.Lineanimation}
          style={[styles.fullSize, animatedStyle]}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: 'white',
    fontWeight: '400',
    textAlign: 'center',
  },
  mainView: {
    top: height * 0.5,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurImage: {
    height: height * 0.4,
    width: width * 0.4,
  },
  animatedLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullSize: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default SplashScreen;
