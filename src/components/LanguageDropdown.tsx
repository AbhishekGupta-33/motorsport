import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../constants/theme';
import {useTranslation} from 'react-i18next';
import i18n from '../localization/i18n';
import {useNavigation} from '@react-navigation/native';
import { NavgationNames } from '../constants/NavgationNames';

const LanguageDropdown = () => {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const LANGUAGES = {
    [t('languageList.english')]: 'en',
    [t('languageList.german')]: 'de',
    [t('languageList.spanish')]: 'es',
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const onSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
  };

  const onCOnfirm = () => {
    i18n.changeLanguage(LANGUAGES[selectedLanguage]);
    navigate(NavgationNames.homeTwo)
  };

  return (
    <View style={styles.container}>
      {/* Dropdown button */}
      <TouchableOpacity
        onPress={toggleDropdown}
        activeOpacity={0.8}
        style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedLanguage
            ? selectedLanguage
            : `${t('language_choose')} ${isOpen ? '▲' : '▼'}`}
        </Text>
      </TouchableOpacity>
      {selectedLanguage && !isOpen && (
        <Text style={styles.confirmButtonStyle} onPress={onCOnfirm}>
          {t('confirm')}
        </Text>
      )}

      {/* Dropdown list */}
      {isOpen && (
        <View style={styles.dropdown}>
          {Object.keys(LANGUAGES).map(lang => (
            <TouchableOpacity key={lang} onPress={() => onSelect(lang)}>
              <Text
                style={[
                  styles.itemText,
                  lang === selectedLanguage && styles.activeText,
                ]}>
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    zIndex: 100,
  },
  button: {
    padding: 12,
    minWidth: 180,
    alignItems: 'center',
    borderColor: theme.color.white,
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 14,
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: 'white',
    paddingVertical: 6,
    width: 180,
    shadowColor: theme.color.darkGrey,
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
    elevation: 4,
  },
  itemText: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: theme.color.darkGrey,
    fontSize: 16,
  },
  activeText: {
    color: 'purple',
    fontWeight: 'bold',
  },
  confirmButtonStyle: {
    color: 'white',
    fontWeight: '400',
    fontSize: 14,
    padding: theme.spacing.lg,
  },
});

export default LanguageDropdown;
