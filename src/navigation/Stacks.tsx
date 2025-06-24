import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import SplashScreen from '../screens/Splash/Splash';
import HomeScreen from '../screens/Home/Home';
import HomeTwo from '../screens/HomeTwo/HomeTwo';
import EngineDetail from '../screens/EngineDetail/EngineDetail';
import { theme } from '../constants/theme';

const Stack = createStackNavigator();

export default function Stacks() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          cardStyle: {
          backgroundColor: theme.color.pureMaroon, // 👈 Set to match your app background
        },

      }}
    >
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="HomeTwo" component={HomeTwo} />
      <Stack.Screen
        name="EngineDetail"
        component={EngineDetail}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
    </Stack.Navigator>
  );
}
