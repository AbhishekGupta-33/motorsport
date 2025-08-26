import FastImage from '@d11/react-native-fast-image';
import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../constants/theme';
import {storage} from '../utils/storage';
import {ControllerButtonId, NavgationNames} from '../constants/NavgationNames';
import {isTablet} from 'react-native-device-info';
import AppText from './AppText';
import {APP_IMAGE} from '../../assets/images';
import Share from 'react-native-share';
import ArrowAnimated from './AnimatedArrow';

const Controller = ({
  onButtonPress = (buttonId: string) => {},
  onButtonLongPress = (buttonId: string) => {},
  onPressOut = () => {},
  containerStyle = {},
  buttonStyle = {},
  disabled = false,
}) => {
  const {height: screenHeight, width: screenWidth} = useWindowDimensions();
  const [showToolTip, setShowToolTip] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // Track arrow tutorial step
  const {t} = useTranslation();
  const navigation = useNavigation();

  // Button positions as percentages of the image dimensions
  const buttonPositions = [
    {
      id: ControllerButtonId.LeftPaddle,
      left: '24%',
      top: '27%',
      arrowLeft: isTablet() ? '25%' : '21%',
      arrowTop:  isTablet() ? '20%' : '13%',
      width: screenHeight * 0.2,
      height: screenHeight * 0.2,
    },
    {
      id: ControllerButtonId.LeftWhite,
      left: isTablet() ? '34%' : '33.5%',
      top: '49%',
      arrowLeft: isTablet() ? '33%' : '28%',
      arrowTop:  isTablet() ? '39%' : '31%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.LeftBlue,
      left: isTablet() ? '34%' : '33%',
      top: isTablet() ? '60%' : '61%',
      arrowLeft: isTablet() ? '33%' : '28%',
      arrowTop:  isTablet() ? '52%' : '44%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.LeftYellow,
      left: isTablet() ? '34%' : '33%',
      top: isTablet() ? '71.5%' : '73%',
      arrowLeft: isTablet() ? '32%' : '28%',
      arrowTop: isTablet() ? '60%' : '54%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.LeftBlack,
      left: isTablet() ? '33.5%' : '33%',
      top: isTablet() ? '83%' : '85%',
      arrowLeft: isTablet() ? '32%' : '28%',
      arrowTop: isTablet() ? '72%' : '67%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightWhite,
      left: '61%',
      top: isTablet() ? '49%' : '50%',
      arrowLeft: isTablet() ? '58%' : '56%',
      arrowTop: isTablet() ? '42%' :'31%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightYellow,
      left: '61%',
      top: isTablet() ? '61%' : '62%',
      arrowLeft: isTablet() ? '58%' :  '56%',
      arrowTop: isTablet() ? '51%' : '44%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightRed,
      left: '61.5%',
      top: isTablet() ? '72%' : '73.5%',
      arrowLeft: isTablet() ? '58%' : '56%',
      arrowTop: isTablet() ? '61%' : '54%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightGreen,
      left: '61.5%',
      top: isTablet() ? '83%' : '85%',
      arrowLeft: isTablet() ? '58%' :'56%',
      arrowTop: isTablet() ? '70%': '67%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightPaddle,
      left: '68%',
      top: '27%',
      arrowLeft: isTablet() ? '66%' : '65%',
      arrowTop:isTablet() ? '20%' :'13%',
      width: screenHeight * 0.2,
      height: screenHeight * 0.2,
    },
  ];

  const handleLangugae = () => {
    navigation.navigate(NavgationNames.home);
  };

  const handleShare = async () => {
    const options = {
      title: t('share.title'),
      message: t('share.message'),
      // url: 'https://www.bmw-m.com/en/index.html',
    };

    try {
      await Share.open(options);
    } catch (error: any) {
      // Alert.alert(error?.message);
    }
  };

  const getLanguage = () => {
    const LANGUAGES = {
      en: t('languageList.english'),
      de: t('languageList.german'),
      es: t('languageList.spanish'),
    };
    const lang = storage.getString('lang') || 'en';
    return LANGUAGES[lang] || LANGUAGES.en;
  };

  useEffect(() => {
    let firstLoaded = storage.getString('isFirstLoaded');
    if (firstLoaded) {
      setCurrentStep(-1); // hide tutorial if already loaded
    } else {
      setCurrentStep(0);
    }
  }, []);

  const handleOnPress = (button: {
    id: string;
    left: string;
    top: string;
    width: number;
    height: number;
  }, index: number) => {
    // ✅ Only allow clicking the current step button
   // Check if the tutorial is active (currentStep is not -1)
    if (currentStep !== -1) {
      // Only allow clicking the current step button
      if (button.id === buttonPositions[currentStep].id) {
        // If it's the last button in the tutorial
        onButtonPress(button.id);
        if (currentStep === buttonPositions.length - 1) {
          setCurrentStep(-1); // Hide the tutorial
          storage.set('isFirstLoaded', 'true');
        } else {
          setCurrentStep(prev => prev + 1); // Move to the next step
        }
      }
    } else {
      // Normal flow should happen only if the tutorial is done
      onButtonPress(button.id);
    }
  };

  const handleOnLongPress = (button: {
    id: string;
    left: string;
    top: string;
    width: number;
    height: number;
  }) => {
    if(currentStep === -1){
    storage.set('isFirstLoaded', 'true');
    setShowToolTip(false);
    onButtonLongPress(button.id);
    }
  };

  // Arrow guide renderer
  const renderArrow = () => {
    if (currentStep === -1) return null; // finished tutorial
    const button = buttonPositions[currentStep];

    return (
      <ArrowAnimated
        style={{
          position: 'absolute',
          left: button.arrowLeft,
          top: button.arrowTop,
          zIndex: 999,
        }}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity style={styles.topleftView} onPress={handleShare}>
        <FastImage source={APP_IMAGE.shareIcon} style={styles.shareIconStyle}  tintColor={theme.color.yellow}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.topRightView} onPress={handleLangugae}>
        <AppText size={ isTablet() ? 'md' : 'xs'} style={styles.language}>
          {getLanguage()} ▼
        </AppText>
      </TouchableOpacity>

      <View style={styles.centerView}>
        <AppText size={'md'} style={styles.title}>
          {t('homeTwoTitle').toUpperCase()}
        </AppText>
        <AppText size={'xs'} style={styles.description}>
          {t('homeTwoDes')}
        </AppText>
      </View>

      {/* Arrow tutorial */}
      {renderArrow()}

      {/* Overlay buttons */}
      <View style={styles.buttonOverlay}>
        {buttonPositions.map((button, index) => (
          <Pressable
            key={button.id}
            onPress={() => handleOnPress(button, index)}
            onLongPress={() => handleOnLongPress(button)}
            onPressOut={onPressOut}
            style={({pressed}) => [
              styles.button,
              {
                left: button.left,
                top: button.top,
                width: button.width,
                height: button.height,
              },
              buttonStyle,
              pressed && styles.pressedButton,
              disabled && styles.disabledButton,
            ]}
            disabled={disabled}>
            <View style={styles.buttonInner} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    aspectRatio: 2.5,
  },
  topRightView: {
    borderWidth: 1,
    borderColor: theme.color.borderLightGray,
    backgroundColor: theme.color.white + '60',
    padding: theme.spacing.sm,
    alignSelf: 'flex-end',
    borderRadius: 5,
    right: isTablet() ? '20%' : '12%',
    top: isTablet() ? '8%' : '5%',
  },
  topleftView: {
    // backgroundColor: theme.color.white + '50',
    padding: theme.spacing.sm,
    // borderRadius: 5,
    alignSelf: 'flex-start',
    position: 'absolute',
    left: isTablet() ? '20%' : '8%',
    top: isTablet() ? '8%' : '5%',
  },
  title: {
    color: theme.color.green,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontWeight: '400',
    color: theme.color.green,
    textAlign: 'center',
  },
  language: {
    fontWeight: 'bold',
    color: theme.color.red,
    textAlign: 'center',
  },
  toolTipStyle: {
    alignSelf: 'flex-end',
    right: isTablet() ? '19%' : '10%',
    top: isTablet() ? '15%' : '2%',
  },
  centerView: {
    top: isTablet() ? '25%' : '16%',
  },
  buttonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent
    borderRadius: 9999, // Circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    width: '60%',
    height: '60%',
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  pressedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{scale: 0.95}],
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  shareIconStyle: {
    height: 30,
    width: 30,
    tintColor: theme.color.yellow,
  },
});

export default Controller;
