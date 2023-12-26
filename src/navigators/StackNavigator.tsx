import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Scanner from '../screens/Scanner';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Scan" component={Scanner} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
