import React, {useEffect} from 'react';
import {Text, StyleSheet} from 'react-native';
import {APP_IMAGE} from '../../../assets/images';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NavgationNames} from '../../constants/NavgationNames';
import AppBackground from '../../components/SplashBackground';

const SplashScreen = () => {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigate(NavgationNames.home);
    }, 400);
  }, []);
  return (
    <>
      <AppBackground
        backgroundImage={APP_IMAGE.splashBG}
        controllerImage={APP_IMAGE.controler}>
        <Text style={styles.title}>{t('splash_title').toUpperCase()}</Text>
      </AppBackground>
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
});

export default SplashScreen;
