import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {APP_IMAGE} from '../../../assets/images';
import {useTranslation} from 'react-i18next';
import LanguageDropdown from '../../components/LanguageDropdown';
import StackedFastImageLayout from '../../components/StackedFastImageLayout';
import AppText from '../../components/AppText';
import { theme } from '../../constants/theme';


const Home = () => {
  const {t} = useTranslation();

  const [intialLoad, setIntialLoad] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIntialLoad(true);
    }, 1000);
  }, []);

  return (
    <>
     <StackedFastImageLayout
      backgroundImage={APP_IMAGE.HomeBG}
      middleImage={APP_IMAGE.LinearGradiant}
      topImage={APP_IMAGE.FullController}
      containerStyle={{height: '100%'}}
      middleImageStyle={{tintColor: theme.color.black}}
      childrenStyle={styles.viewStyle}>
      {!intialLoad ? (
        <AppText size={'xs'} style={styles.title}>{t('home_button').toUpperCase()}</AppText>
      ) : (
        <LanguageDropdown />
      )}
    </StackedFastImageLayout>
    </>
   
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontWeight: '400',
    textAlign: 'center',
  },
  viewStyle: {
    top: '30%',
  },
});

export default Home;
