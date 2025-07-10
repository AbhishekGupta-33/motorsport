import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Animated, {
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

const HomeTwo = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [currentID, setCurrentID] = useState<string | null>(null);

  const imageGroups = [
    [APP_IMAGE.BMW_1_1, APP_IMAGE.BMW_1_2, APP_IMAGE.BMW_1_3],
    [APP_IMAGE.BMW_1_1],
    [APP_IMAGE.BMW_3_1, APP_IMAGE.BMW_3_2, APP_IMAGE.BMW_3_3],
    [
      APP_IMAGE.BMW_4_1,
      APP_IMAGE.BMW_4_2,
      APP_IMAGE.BMW_4_3,
      APP_IMAGE.BMW_4_4,
    ],
    [APP_IMAGE.BMW_5_1, APP_IMAGE.BMW_5_2],
    [APP_IMAGE.BMW_6_1],
    [APP_IMAGE.BMW_1_1],
    [APP_IMAGE.BMW_1_1],
    [APP_IMAGE.BMW_1_1],
    [APP_IMAGE.BMW_10_1, APP_IMAGE.BMW_10_2],
  ];

  const sounds = [
    'bmw_1.m4a',
    'bmw_2.m4a',
    'bmw_3.m4a',
    'bmw_4.m4a',
    'bmw_5.m4a',
    'bmw_6.m4a',
    'bmw_7.m4a',
    'bmw_8.m4a',
    'bmw_9.m4a',
    'bmw_10.m4a',
  ];

  const motorsportData = imageGroups.map((images, index) => {
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

  const {startSound, stop, isPlaying} = useGyroSound(
    motorsportData.find(elem => elem.id === currentID)?.sound || '',
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        childrenOpacity.value = 1;
        middleImageScale.value = 1;
        middleImageTop.value = SCREEN_HEIGHT * 0.2;
        middleImageWidth.value = SCREEN_WIDTH * 0.35;
        middleImageHeight.value = SCREEN_HEIGHT * 0.35;
        topImageScale.value = 1;
        stop();
      };
    }, []),
  );

  useEffect(() => {
    console.log('isPlaying------start', currentID);

    if (currentID) startSound();
  }, [currentID]);

  const childrenOpacity = useSharedValue(1);
  const middleImageScale = useSharedValue(1);
  const middleImageTop = useSharedValue(SCREEN_HEIGHT * 0.2);
  const middleImageWidth = useSharedValue(SCREEN_WIDTH * 0.35);
  const middleImageHeight = useSharedValue(SCREEN_HEIGHT * 0.35);
  const topImageScale = useSharedValue(1);

  const childrenAnimStyle = useAnimatedStyle(() => ({
    opacity: childrenOpacity.value,
  }));
  const middleImageAnimStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: middleImageTop.value,
    width: middleImageWidth.value,
    height: middleImageHeight.value,
    transform: [{scale: middleImageScale.value}],
  }));
  const topImageAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: topImageScale.value}],
  }));

  const handleNextPageNavigation = (buttonId: string) => {
    childrenOpacity.value = withTiming(0, {duration: 300});
    middleImageScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
    middleImageTop.value = withTiming(0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
    middleImageWidth.value = withTiming(SCREEN_WIDTH, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
    middleImageHeight.value = withTiming(SCREEN_HEIGHT, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
    topImageScale.value = withTiming(0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });

    setTimeout(() => {
      const selectedCar = motorsportData.find(elem => elem.id === buttonId);
      navigation.navigate(NavgationNames.EngineDetail, {selectedCar});
    }, 800);
  };

  const handleButtonPress = (buttonId: string) =>
    handleNextPageNavigation(buttonId);

  const handleButtonLongPress = (buttonId: string) => {
    if (currentID === buttonId) {
      // Reset first, then set again
      setCurrentID(null);
      setTimeout(() => {
        setCurrentID(buttonId);
      }, 50); // short delay
    } else {
      setCurrentID(buttonId);
    }
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
