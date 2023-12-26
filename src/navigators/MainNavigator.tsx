import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import StackNavigator from './StackNavigator';

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default MainNavigator;
