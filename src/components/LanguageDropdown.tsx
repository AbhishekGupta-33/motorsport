import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {theme} from '../constants/theme';
import {useTranslation} from 'react-i18next';
import i18n from '../localization/i18n';
import {useNavigation} from '@react-navigation/native';
import {NavgationNames} from '../constants/NavgationNames';
import {storage} from '../utils/storage';
import AppText from './AppText';

const LanguageDropdown = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  // Language codes and labels (translated)
  const LANGUAGES: Record<string, string> = {
    en: t('languageList.english'),
    de: t('languageList.german'),
    es: t('languageList.spanish'),
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const onSelect = (langCode: string) => {
    setSelectedLanguage(langCode); // e.g. 'en'
    setIsOpen(false);
  };

  const onConfirm = () => {
    if (!selectedLanguage) return;
    i18n.changeLanguage(selectedLanguage);
    storage.set('lang', selectedLanguage);
    navigation.replace(NavgationNames.homeTwo, { noAnimation: true });
  };

  const handleLanguageInit = async () => {
    const storedLang = storage.getString('lang');
    if (storedLang) {
      await i18n.changeLanguage(storedLang);
      setSelectedLanguage(storedLang);
    }
  };

  useEffect(() => {
    handleLanguageInit();
  }, []);

  return (
    <View style={styles.container}>
      {/* Dropdown button */}
      <TouchableOpacity
        onPress={toggleDropdown}
        activeOpacity={0.8}
        style={styles.button}>
        <AppText size={'sm'} style={styles.buttonText}>
          {selectedLanguage
            ? LANGUAGES[selectedLanguage]
            : `${t('language_choose')} ${isOpen ? '▲' : '▼'}`}
        </AppText>
      </TouchableOpacity>

      {/* Confirm button */}
      {selectedLanguage && !isOpen && (
        <AppText size={'sm'} style={styles.confirmButtonStyle} onPress={onConfirm}>
          {t('confirm')}
        </AppText>
      )}

      {/* Dropdown list */}
      {isOpen && (
        <View style={styles.dropdown}>
          {Object.keys(LANGUAGES).map(langCode => (
            <TouchableOpacity key={langCode} onPress={() => onSelect(langCode)}>
              <AppText
              size={'sm'}
                style={[
                  styles.itemText,
                  langCode === selectedLanguage && styles.activeText,
                ]}>
                {LANGUAGES[langCode]}
              </AppText>
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
    borderRadius: 5
  },
  buttonText: {
    color: theme.color.white,
    fontWeight: '400',
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
  },
  activeText: {
    color: 'purple',
    fontWeight: 'bold',
  },
  confirmButtonStyle: {
    color: theme.color.white,
    fontWeight: '400',
    padding: theme.spacing.lg,
  },
});

export default LanguageDropdown;
