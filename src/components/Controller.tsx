import FastImage from '@d11/react-native-fast-image';
import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import Tooltip from './ToolTip';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../constants/theme';
import {storage} from '../utils/storage';
import {ControllerButtonId, NavgationNames} from '../constants/NavgationNames';
import { isTablet } from 'react-native-device-info';
import AppText from './AppText';

const Controller = ({
  onButtonPress = (buttonId: string) => {},
  onButtonLongPress = (buttonId: string) => {},
  onPressOut = () => {},
  containerStyle = {},
  buttonStyle = {},
  disabled = false,
}) => {
  const {height: screenHeight} = useWindowDimensions();
  const [showToolTip, setShowToolTip] = useState(true);
  const {t} = useTranslation();
  const navigation = useNavigation();

  // Button positions as percentages of the image dimensions
  // These are approximate positions based on the image you provided
  const buttonPositions = [
    {
      id: ControllerButtonId.LeftPaddle,
      left: '24%',
      top: '27%',
      width: screenHeight * 0.2,
      height: screenHeight * 0.2,
    },
    {
      id: ControllerButtonId.LeftWhite,
      left: isTablet() ? '34%' : '33.5%',
      top:  '49%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.LeftBlue,
      left: isTablet() ? '34%' : '33%',
      top: isTablet() ? '60%' : '61%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.LeftYellow,
      left: isTablet() ? '34%' : '33%',
      top: isTablet() ? '71.5%' : '73%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.LeftBlack,
      left: isTablet() ? '33.5%' : '33%',
      top: isTablet() ? '83%' :'85%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightWhite,
      left: '61%',
      top: isTablet() ? '49%' : '50%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightYellow,
      left: '61%',
      top: isTablet() ? '61%' :'62%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightRed,
      left: '61.5%',
      top: isTablet() ? '72%' :'73.5%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightGreen,
      left: '61.5%',
      top: isTablet() ? '83%' : '85%',
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
    },
    {
      id: ControllerButtonId.RightPaddle,
      left: '68%',
      top: '27%',
      width: screenHeight * 0.2,
      height: screenHeight * 0.2,
    },
  ];

  const handleLangugae = () => {
    navigation.navigate(NavgationNames.home);
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
      setShowToolTip(false);
    } else {
      setShowToolTip(true);
      storage.set('isFirstLoaded', 'true');
    }
  }, []);

  const handleOnPress = (button: {
    id: string;
    left: string;
    top: string;
    width: number;
    height: number;
  }) => {
    storage.set('isFirstLoaded', 'true');
    setShowToolTip(false);
    onButtonPress(button.id);
  };

  const handleOnLongPress = (button: {
    id: string;
    left: string;
    top: string;
    width: number;
    height: number;
  }) => {
    storage.set('isFirstLoaded', 'true');
    setShowToolTip(false);
    onButtonLongPress(button.id);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity style={styles.topRightView} onPress={handleLangugae}>
        <AppText size={'xs'} style={styles.language}>{getLanguage()} ▼</AppText>
      </TouchableOpacity>
      
        <View style={styles.centerView}>
          <AppText size={'md'} style={styles.title}>{t('homeTwoTitle').toUpperCase()}</AppText>
          <AppText size={'xs'} style={styles.description}>{t('homeTwoDes')}</AppText>
        </View>

      {showToolTip && <Tooltip viewStyle={styles.tollTipStyle} />}

      {/* Overlay container for buttons */}
      <View style={styles.buttonOverlay}>
        {buttonPositions.map(button => (
          <Pressable
            key={button.id}
            style={[
              styles.button,
              {
                left: button.left,
                top: button.top,
                width: button.width,
                height: button.height,
              },
              buttonStyle,
              disabled && styles.disabledButton,
            ]}
            onPress={() => handleOnPress(button)}
            onLongPress={() => handleOnLongPress(button)}
            onPressOut={onPressOut}
            android_ripple={{
              color: 'rgba(255, 255, 255, 0.3)',
              borderless: true,
              radius: 20,
            }}
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
    // alignItems: 'flex-end',
    // justifyContent: 'center',
    height: '100%',
    width: '100%',
    // position: 'absolute',
    // zIndex:10,
    aspectRatio: 2.5, // Adjust based on your image aspect ratio
  },
  topRightView: {
    borderWidth: 1,
    borderColor: theme.color.borderLightGray,
    padding: theme.spacing.sm,
    alignSelf: 'flex-end',
    right: isTablet() ? '20%' : '12%',
    top: isTablet() ? '8%' : '5%',
  },
  title: {
    color:theme.color.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontWeight: '400',
    color: theme.color.borderLightGray,
    textAlign: 'center',
  },
  language: {
    fontWeight: '400',
    color: theme.color.white,
    textAlign: 'center',
  },
  tollTipStyle: {
    alignSelf: 'flex-end',
    right: isTablet() ? '19%' : '12%',
    top: isTablet() ? '15%' : '6%',
  },
  centerView: {
    top: isTablet() ? '25%' : '16%',
  },
  steeringWheelImage: {
    width: '100%',
    height: '100%',
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
    backgroundColor: 'rgba(255, 255, 255, 0)', // Semi-transparent for development
    borderRadius: '100%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    // Remove backgroundColor in production for invisible buttons
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
});

export default Controller;
