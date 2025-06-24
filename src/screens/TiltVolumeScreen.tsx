// screens/TiltVolumeScreen.tsx
import React from 'react';
import { View, Button, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTiltVolumeSound } from '../hooks/useTiltVolumeSound';

export default function TiltVolumeScreen() {
  const { startSound, stopSound, volumeValue } = useTiltVolumeSound('demofour.mp3');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${volumeValue.value * 100}%`,
      backgroundColor: 'green',
      height: 20,
      borderRadius: 4,
    };
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ marginBottom: 10, fontSize: 16 }}>Tilt Down to Increase Volume</Text>

      <Animated.View style={[animatedStyle]} />

      <View style={{ marginTop: 30 }}>
        <Button title="Start Sound" onPress={startSound} />
        <View style={{ height: 10 }} />
        <Button title="Stop Sound" onPress={stopSound} />
      </View>
    </View>
  );
}
