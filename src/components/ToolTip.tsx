import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../constants/theme';
import {useTranslation} from 'react-i18next';
import AppText from './AppText';

interface TooltipProps {
  viewStyle?: ViewStyle;
}

const Tooltip: React.FC<TooltipProps> = ({viewStyle}) => {
  const {t} = useTranslation();
  const [testWidth, setTextWidth] = useState(null);

  return (
    <View style={[styles.container, viewStyle]}>
      {/* Arrow */}
      <View style={styles.arrow} />

      {/* Gradient Label */}
        <LinearGradient
          colors={[theme.color.purple, theme.color.maroon]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.labelBox}>
          <AppText
            onLayout={({nativeEvent}) => {
              setTextWidth(nativeEvent.layout.width);
            }}
            size={'sm'}
            style={[styles.labelText, {width: testWidth > '1%' ? '1%' : testWidth}]}
            numberOfLines={testWidth > '1%' ? 2 : 1}>
            {t('toolTipTitle')}
          </AppText>
        </LinearGradient>
    </View>
  );
};

export default Tooltip;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 30,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#8C081B',
    marginRight: -2,
  },
  labelBox: {
    padding: 10,
    borderRadius: 8,
  },
  labelText: {
    color: 'white',
    fontWeight: '400',
  },
  pressable:{
    height: '80%',
    width: '5%',
  }
});
