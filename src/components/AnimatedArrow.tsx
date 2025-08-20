import React, {useEffect} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {theme} from '../constants/theme';

const ArrowAnimated = ({style}: {style: ViewStyle}) => {
  const translate = useSharedValue(0); // start at position 0

  useEffect(() => {
    translate.value = withRepeat(
      withSequence(
        withTiming(-20, {duration: 400}), // move forward (upward)
        withTiming(0, {duration: 400}), // come back (downward)
      ),
      -1, // infinite loop
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translate.value,
      },
      {
        translateY: translate.value,
      },
      {rotate: '-45deg'},
    ],
  }));

  return (
    // <View style={styles.container}>
    <Animated.View style={[styles.arrowContainer, animatedStyle, style]}>
      {/* Arrow Body */}
      <View style={styles.body} />
      {/* Arrow Head */}
      <View style={styles.head} />
    </Animated.View>
    // </View>
  );
};

export default ArrowAnimated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: 10,
    height: 60,
    backgroundColor: theme.color.yellow,
  },
  head: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderTopWidth: 30,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.color.yellow,
  },
});
