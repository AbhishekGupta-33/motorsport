import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {theme} from '../constants/theme';
import {useTranslation} from 'react-i18next';
import i18n from '../localization/i18n';
import {useNavigation} from '@react-navigation/native';
import {NavgationNames} from '../constants/NavgationNames';
import {storage} from '../utils/storage';

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
    navigation.replace(NavgationNames.homeTwo);
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
        <Text style={styles.buttonText}>
          {selectedLanguage
            ? LANGUAGES[selectedLanguage]
            : `${t('language_choose')} ${isOpen ? '▲' : '▼'}`}
        </Text>
      </TouchableOpacity>

      {/* Confirm button */}
      {selectedLanguage && !isOpen && (
        <Text style={styles.confirmButtonStyle} onPress={onConfirm}>
          {t('confirm')}
        </Text>
      )}

      {/* Dropdown list */}
      {isOpen && (
        <View style={styles.dropdown}>
          {Object.keys(LANGUAGES).map(langCode => (
            <TouchableOpacity key={langCode} onPress={() => onSelect(langCode)}>
              <Text
                style={[
                  styles.itemText,
                  langCode === selectedLanguage && styles.activeText,
                ]}>
                {LANGUAGES[langCode]}
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
