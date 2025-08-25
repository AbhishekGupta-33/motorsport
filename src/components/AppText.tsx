import React from 'react';
import { Text, TextProps, TextStyle, StyleSheet, Dimensions, Platform } from 'react-native';

const isTablet = () => {
  const { height, width } = Dimensions.get('window');
  return Math.min(height, width) >= 600;
};

type AppTextProps = TextProps & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  children: React.ReactNode;
};

const baseFontSizes: Record<string, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  title: 30,
  xxl: 32,
  xxxl: 42
};

const AppText: React.FC<AppTextProps> = ({
  size = 'md',
  style,
  children,
  ...rest
}) => {
  const tabletBoostFactor = isTablet() ? 1.25 : 1;
  const fontSize = baseFontSizes[size] * tabletBoostFactor;

  return (
    <Text
      style={[
        styles.base,
        {
          fontSize,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
  },
});

export default AppText;
