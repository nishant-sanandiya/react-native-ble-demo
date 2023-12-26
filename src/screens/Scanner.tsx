import React, {useEffect, useState} from 'react';
import {Button, FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import BleManager from 'react-native-ble-manager';
import styles from './styles';

const Scanner = () => {
  const [deviceList, setDeviceList] = useState();

  useEffect(() => {
    BleManager.start({showAlert: true}).then(() => {
      console.log('Module initialized');
    });
  }, []);

  const onScanStart = async () => {
    try {
      await BleManager.scan([], 0, true);
      console.log('Start Scanning');
    } catch (err) {
      console.log('Error in onScanStart :- ', err);
    }
  };

  const onScanStop = async () => {
    try {
      await BleManager.scan([], 5, true);
      console.log('Start Scanning');
    } catch (err) {
      console.log('Error in onScanStart :- ', err);
    }
  };

  const renderItemHandler = (data: ListRenderItemInfo<any>) => {
    return (
      <View>
        <Text>{data.item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Scan For Devices" onPress={onScanStart} />
        <Button title="Stop Scan" onPress={onScanStop} />
      </View>
      <FlatList data={deviceList} renderItem={renderItemHandler} />
    </View>
  );
};

export default Scanner;
