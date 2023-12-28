import React from 'react';
import {Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Peripheral} from 'react-native-ble-manager';
import styles from './styles';

interface IDeviceItem {
  data: Peripheral;
  connectedDevicePeripherals: Peripheral[];
  connectHandler: (obj: Peripheral) => void;
  disconnectHandler: (obj: Peripheral) => void;
}

const DeviceItem = (props: IDeviceItem) => {
  const {data, connectHandler, disconnectHandler, connectedDevicePeripherals} =
    props;

  const isConnected =
    connectedDevicePeripherals.findIndex(obj => obj.id === data.id) !== -1;

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

  const extraButtonStyle: ViewStyle = {
    ...styles.buttonStyle,
    backgroundColor: isConnected ? 'red' : 'blue',
  };

  return (
    <View style={styles.container}>
      <Text>{data.name ? data.name : data.id}</Text>
      <TouchableOpacity
        style={extraButtonStyle}
        onPress={onConnectDisconnectHandler}>
        <Text style={styles.textStyle}>
          {isConnected ? 'Disconnect' : 'connect'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeviceItem;
