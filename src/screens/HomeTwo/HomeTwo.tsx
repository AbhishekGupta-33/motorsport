import React, {useCallback} from 'react';
import {Text, StyleSheet, Dimensions} from 'react-native';
import {APP_IMAGE} from '../../../assets/images';
import {useTranslation} from 'react-i18next';
import Tooltip from '../../components/ToolTip';
import {useRingtoneSetter} from '../../hooks/useSetRingtone';
import StackedFastImageLayout from '../../components/StackedFastImageLayout';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Get device dimensions
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const HomeTwo = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // When screen is focused, do nothing

      return () => {
        // When screen is unfocused (navigated away), reset all values
        childrenOpacity.value = 1;
        middleImageScale.value = 1;
        middleImageTop.value = SCREEN_HEIGHT * 0.2;
        middleImageWidth.value = SCREEN_WIDTH * 0.35;
        middleImageHeight.value = SCREEN_HEIGHT * 0.35;
        topImageScale.value = 1;
      };
    }, []),
  );

  // Animation shared values
  const childrenOpacity = useSharedValue(1);
  const middleImageScale = useSharedValue(1);
  const middleImageTop = useSharedValue(SCREEN_HEIGHT * 0.2);
  const middleImageWidth = useSharedValue(SCREEN_WIDTH * 0.35);
  const middleImageHeight = useSharedValue(SCREEN_HEIGHT * 0.35);
  const topImageScale = useSharedValue(1);

  // Children fade out
  const childrenAnimStyle = useAnimatedStyle(() => ({
    opacity: childrenOpacity.value,
  }));

  // Middle image zooms in & expands full screen
  const middleImageAnimStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: middleImageTop.value,
    width: middleImageWidth.value,
    height: middleImageHeight.value,
    transform: [{scale: middleImageScale.value}],
    // zIndex: 2,
  }));

  // Top image shrinks or disappears
  const topImageAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: topImageScale.value}],
  }));

  // On Tooltip press, trigger animations
  const handleTooltipPress = () => {
    // Step 1: Hide children
    childrenOpacity.value = withTiming(0, {duration: 300});

    // Step 2: Animate middle image to full screen
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

    // Step 3: Animate top image out
    topImageScale.value = withTiming(0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
    setTimeout(() => {
      navigation.navigate('EngineDetail');
    }, 800);
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
      <Text style={styles.title}>{t('homeTwoTitle').toUpperCase()}</Text>
      <Text style={styles.description}>{t('homeTwoDes')}</Text>

      <Tooltip onPress={handleTooltipPress} viewStyle={styles.tollTipStyle} />
    </StackedFastImageLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: 'white',
    fontWeight: '400',
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '400',
    color: '#929292',
    textAlign: 'center',
  },
  tollTipStyle: {
    alignSelf: 'flex-end',
    right: '8%',
    top: -50,
  },
  viewStyle: {
    top: '28%',
  },
});

export default HomeTwo;
