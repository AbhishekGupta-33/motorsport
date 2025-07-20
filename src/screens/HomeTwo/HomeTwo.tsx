import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {APP_IMAGE} from '../../../assets/images';
import {useGyroSound} from '../../hooks/useGyroSound';
import Controller from '../../components/Controller';
import StackedFastImageLayout from '../../components/StackedFastImageLayout';
import {
  ControllerButtonId,
  NavgationNames,
} from '../../constants/NavgationNames';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const imageGroups = [
  [APP_IMAGE.BMW_1_1, APP_IMAGE.BMW_1_2, APP_IMAGE.BMW_1_3],
  [APP_IMAGE.BMW_1_1],
  [APP_IMAGE.BMW_3_1, APP_IMAGE.BMW_3_2, APP_IMAGE.BMW_3_3],
  [APP_IMAGE.BMW_4_1, APP_IMAGE.BMW_4_2, APP_IMAGE.BMW_4_3, APP_IMAGE.BMW_4_4],
  [APP_IMAGE.BMW_5_1, APP_IMAGE.BMW_5_2],
  [APP_IMAGE.BMW_6_1],
  [APP_IMAGE.BMW_1_1],
  [APP_IMAGE.BMW_1_1],
  [APP_IMAGE.BMW_1_1],
  [APP_IMAGE.BMW_10_1, APP_IMAGE.BMW_10_2],
];

const sounds = [
  ['bmw_1.m4a', 'bmw_2.m4a'],
  ['bmw_2.m4a'],
  ['bmw_2.m4a'],
  ['bmw_3.m4a'],
  ['bmw_4.m4a'],
  ['bmw_5.m4a'],
  ['bmw_6.m4a'],
  ['bmw_7.m4a'],
  ['bmw_8.m4a'],
  ['bmw_9.m4a'],
  ['bmw_10.m4a'],
];

const HomeTwo = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const [currentID, setCurrentID] = useState<string | null>(null);

  const motorsportData = useMemo(() => {
    return imageGroups.map((images, index) => {
      const key = `moterListText.${index}`;
      return {
        id: Object.values(ControllerButtonId)[index],
        title: t(`${key}.title`),
        model: t(`${key}.model`),
        engine: t(`${key}.engine`),
        topSpeed: t(`${key}.topSpeed`),
        yearRange: t(`${key}.yearRange`),
        bhp: t(`${key}.bhp`),
        chassis: t(`${key}.chassis`),
        images,
        sound: sounds[index],
      };
    });
  }, [t]);

  const {startSound, stop, isPlaying} = useGyroSound(
    [motorsportData.find(elem => elem.id === currentID)?.sound] || '',
  );

  const anim = {
    childrenOpacity: useSharedValue(1),
    middleImageScale: useSharedValue(1),
    middleImageTop: useSharedValue(SCREEN_HEIGHT * 0.2),
    middleImageWidth: useSharedValue(SCREEN_WIDTH * 0.35),
    middleImageHeight: useSharedValue(SCREEN_HEIGHT * 0.35),
    topImageScale: useSharedValue(1),
  };

  const applyAnimation = useCallback((expanded: boolean) => {
    const duration = 800;
    const easing = Easing.inOut(Easing.ease);

    anim.childrenOpacity.value = withTiming(expanded ? 1 : 0, {duration: 300});
    anim.middleImageScale.value = withTiming(1, {duration, easing});
    anim.middleImageTop.value = withTiming(expanded ? SCREEN_HEIGHT * 0.2 : 0, {
      duration,
      easing,
    });
    anim.middleImageWidth.value = withTiming(
      expanded ? SCREEN_WIDTH * 0.35 : SCREEN_WIDTH,
      {duration, easing},
    );
    anim.middleImageHeight.value = withTiming(
      expanded ? SCREEN_HEIGHT * 0.35 : SCREEN_HEIGHT,
      {duration, easing},
    );
    anim.topImageScale.value = withTiming(expanded ? 1 : 0, {duration, easing});
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.noAnimation) {
        applyAnimation(true);
      } else {
        applyAnimation(true); // Animate in normally
      }

      return () => {
        navigation.setParams({noAnimation: false});
        stop();
      };
    }, [route.params?.noAnimation]),
  );

  useEffect(() => {
    if (currentID) startSound();
  }, [currentID]);

  const childrenAnimStyle = useAnimatedStyle(() => ({
    opacity: anim.childrenOpacity.value,
  }));

  const middleImageAnimStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: anim.middleImageTop.value,
    width: anim.middleImageWidth.value,
    height: anim.middleImageHeight.value,
    transform: [{scale: anim.middleImageScale.value}],
  }));

  const topImageAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: anim.topImageScale.value}],
  }));

  const handleNextPageNavigation = (buttonId: string) => {
    applyAnimation(false);
    setTimeout(() => {
      const selectedCar = motorsportData.find(elem => elem.id === buttonId);
      navigation.navigate(NavgationNames.EngineDetail, {selectedCar});
    }, 800);
  };

  const handleButtonPress = (buttonId: string) =>
    handleNextPageNavigation(buttonId);

  const handleButtonLongPress = (buttonId: string) => {
    setCurrentID(prev => (prev === buttonId ? null : buttonId));
  };

  const handleOnPressOut = () => {
    if (isPlaying) stop();
  };

  return (
    <StackedFastImageLayout
      backgroundImage={APP_IMAGE.HomeBG}
      middleImage={APP_IMAGE.LinearGradiant}
      topImage={APP_IMAGE.FullController}
      containerStyle={{height: '100%'}}
      childrenStyle={styles.viewStyle}
      childrenAnimStyle={childrenAnimStyle}
      middleImageAnimStyle={middleImageAnimStyle}
      topImageAnimStyle={topImageAnimStyle}>
      <Controller
        onButtonPress={handleButtonPress}
        onButtonLongPress={handleButtonLongPress}
        onPressOut={handleOnPressOut}
        disabled={false}
      />
    </StackedFastImageLayout>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    top: '0%',
  },
});

export default HomeTwo;
