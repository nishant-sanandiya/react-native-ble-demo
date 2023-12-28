/*
  Reuseable Loader ui component with controls.
*/
import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {Modal, View, ActivityIndicator} from 'react-native';
import styles from './styles';

/* The code is defining a functional component called `AppLoader` using the `forwardRef` function from
React. */
const AppLoader = forwardRef((_, ref) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    // methods connected to `ref`
    showLoader: () => {
      showLoader();
    },
    hideLoader: () => {
      hideLoader();
    },
  }));

  const showLoader = (): void => {
    setIsLoading(true);
  };

  const hideLoader = (): void => {
    setIsLoading(false);
  };

  return (
    <Modal animationType="fade" visible={isLoading} transparent>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ActivityIndicator color={'blue'} size="large" />
        </View>
      </View>
    </Modal>
  );
});

export default AppLoader;
