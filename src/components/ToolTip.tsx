import React from 'react';
import { View, Text, StyleSheet, Pressable, GestureResponderEvent, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import { useTranslation } from 'react-i18next';

interface TooltipProps {
  onPress?: (event: GestureResponderEvent) => void;
  viewStyle?: ViewStyle
}

const Tooltip: React.FC<TooltipProps> = ({ onPress, viewStyle }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.container, viewStyle]}>
      {/* Arrow */}
      <View style={styles.arrow} />

      {/* Gradient Label */}
      <Pressable onPress={onPress}>
        <LinearGradient
          colors={[theme.color.purple, theme.color.maroon]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.labelBox}
        >
          <Text style={styles.labelText}>{t('toolTipTitle')}</Text>
        </LinearGradient>
      </Pressable>
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
    fontSize: 12,
    fontWeight: '400',
  },
});
