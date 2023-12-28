import {NavigationContainer} from '@react-navigation/native';
import React, {useCallback} from 'react';
import StackNavigator from './StackNavigator';
import AppLoader from '../components/AppLoader';
import Loader from '../helper/Loader';

const MainNavigator = () => {
  const setLoaderRef = useCallback((e: HTMLInputElement): void => {
    Loader.setLoader(e);
  }, []);
  return (
    <NavigationContainer>
      <StackNavigator />
      <AppLoader ref={setLoaderRef} />
    </NavigationContainer>
  );
};

export default MainNavigator;
