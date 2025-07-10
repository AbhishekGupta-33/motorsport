import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Stacks from './Stacks';
import { StatusBar } from 'react-native';

export default function NavigationHead() {
  return (
    <NavigationContainer>
       {/* <StatusBar translucent={true} backgroundColor={'transparent'} /> */}
        <StatusBar hidden />
      <Stacks />
    </NavigationContainer>
  );
}
