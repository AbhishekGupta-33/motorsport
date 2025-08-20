import React, {useEffect, useCallback} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NavgationNames} from '../../constants/NavgationNames';

import AppBackground from '../../components/SplashBackground';
import ImageBackgroundImage from '../../components/ImageBackgroundImage';
import FastImage from '@d11/react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {APP_IMAGE} from '../../../assets/images';
import {storage} from '../../utils/storage';
import AppText from '../../components/AppText';
import {theme} from '../../constants/theme';
import i18n from '../../localization/i18n';

const {height, width} = Dimensions.get('window');
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const SplashScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const scale = useSharedValue(0.1);

  const animate = useCallback(() => {
    scale.value = withTiming(1.5, {
      duration: 1000,
      easing: Easing.out(Easing.linear),
    });

    setTimeout(() => {
      const isLangSelected = storage.getString('lang');
      isLangSelected && i18n.changeLanguage(isLangSelected);
      navigation.replace(
        isLangSelected ? NavgationNames.homeTwo : NavgationNames.home, { noAnimation: true }
      );
    }, 1200);
  }, []);

  useEffect(() => {
    storage.set('isFirstLoaded', '');
    setTimeout(() => {
      animate();
    }, 300);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
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
          <AppText size={'xs'} style={styles.title}>
            {t('splash_title').toUpperCase()}
          </AppText>
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
    color: theme.color.green,
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
