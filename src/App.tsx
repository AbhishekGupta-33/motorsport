import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import NavigationHead from './navigation/NavigationHead';
import {I18nextProvider} from 'react-i18next';
import i18n from './localization/i18n';


function App(): React.JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationHead />
    </I18nextProvider>
  );
}

export default App;
