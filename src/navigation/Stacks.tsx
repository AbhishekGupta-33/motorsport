import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import SplashScreen from '../screens/Splash/Splash';
import HomeScreen from '../screens/Home/Home';
import HomeTwo from '../screens/HomeTwo/HomeTwo';
import EngineDetail from '../screens/EngineDetail/EngineDetail';
import {theme} from '../constants/theme';

const Stack = createStackNavigator();

export default function Stacks() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 800,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
        },
        cardStyleInterpolator: ({current, next, layouts}) => {
          return {
            cardStyle: {
              // transform: [
              //   {
              //     // translateX: current.progress.interpolate({
              //     //   inputRange: [0, 1],
              //     //   outputRange: [layouts.screen.width, 0],
              //     // }),
              //     // scale: current.progress.interpolate({
              //     //   inputRange: [0, 1],
              //     //   outputRange: [0, 1],
              //     // }),
              //   },
              // ],
               opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.6],
              }),
            },
          };
        },
        cardStyle: {
          backgroundColor: theme.color.pureMaroon, // 👈 Set to match your app background
        },
      }}>
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="HomeTwo" component={HomeTwo} />
      <Stack.Screen
        name="EngineDetail"
        component={EngineDetail}
      />
    </Stack.Navigator>
  );
}
