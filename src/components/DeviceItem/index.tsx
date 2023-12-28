import React from 'react';
import {Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Peripheral} from 'react-native-ble-manager';
import styles from './styles';

interface IDeviceItem {
  data: Peripheral;
  connectedDevicePeripherals: Peripheral[];
  pairedDevicePeripherals: Peripheral[];
  connectHandler: (obj: Peripheral) => void;
  disconnectHandler: (obj: Peripheral) => void;
  pairHandler: (obj: Peripheral) => void;
  unpairedHandler: (obj: Peripheral) => void;
}

const DeviceItem = (props: IDeviceItem) => {
  const {
    data,
    connectedDevicePeripherals,
    pairedDevicePeripherals,
    connectHandler,
    disconnectHandler,
    pairHandler,
    unpairedHandler,
  } = props;

  const isConnected =
    connectedDevicePeripherals.findIndex(obj => obj.id === data.id) !== -1;

  const isPaired =
    pairedDevicePeripherals.findIndex(obj => obj.id === data.id) !== -1;

  const onConnectHandler = () => {
    connectHandler(data);
  };

  const onDisconnectHandler = () => {
    disconnectHandler(data);
  };

  const onConnectDisconnectHandler = () => {
    if (isConnected) {
      onDisconnectHandler();
    } else {
      onConnectHandler();
    }
  };

  const pairedAndUnPairedHandler = () => {
    if (isPaired) {
      unpairedHandler(data);
    } else {
      pairHandler(data);
    }
  };

  const extraIsConnectButtonStyle: ViewStyle = {
    ...styles.buttonStyle,
    backgroundColor: isConnected ? 'red' : 'blue',
  };

  const extraPairedButtonStyle: ViewStyle = {
    ...styles.buttonStyle,
    backgroundColor: isPaired ? 'red' : 'blue',
  };

  return (
    <View style={styles.container}>
      <Text>{data.name ? data.name : data.id}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={extraIsConnectButtonStyle}
          onPress={onConnectDisconnectHandler}>
          <Text style={styles.textStyle}>
            {isConnected ? 'Disconnect' : 'connect'}
          </Text>
        </TouchableOpacity>
        <View style={styles.breakLine} />
        <TouchableOpacity
          style={extraPairedButtonStyle}
          onPress={pairedAndUnPairedHandler}>
          <Text style={styles.textStyle}>
            {isPaired ? 'Unpaired' : 'Paired'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeviceItem;
