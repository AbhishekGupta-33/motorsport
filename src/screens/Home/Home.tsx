import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, StatusBar} from 'react-native';
import {APP_IMAGE} from '../../../assets/images';
import {useTranslation} from 'react-i18next';
import LanguageDropdown from '../../components/LanguageDropdown';
import StackedFastImageLayout from '../../components/StackedFastImageLayout';


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
      childrenStyle={styles.viewStyle}>
      {!intialLoad ? (
        <Text style={styles.title}>{t('home_button').toUpperCase()}</Text>
      ) : (
        <LanguageDropdown />
      )}
    </StackedFastImageLayout>
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
  viewStyle: {
    top: '30%',
  },
});

export default Home;
