import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ListRenderItemInfo,
  NativeEventEmitter,
  NativeModules,
  Platform,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleState,
  Peripheral,
} from 'react-native-ble-manager';
import {PERMISSIONS} from 'react-native-permissions';
import DeviceItem from '../components/DeviceItem';
import Loader from '../helper/Loader';
import {
  mergeAllPermissionFlags,
  requestMultiplePermissionHandler,
} from '../utils/permissionHandler';
import styles from './styles';
import {showSnackBar} from '../utils/toastUtils';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Scanner = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [peripherals, setPeripherals] = useState<Peripheral[]>([]);
  const [connectedDevicePeripherals, setConnectedDevicePeripherals] = useState<
    Peripheral[]
  >([]);
  const [pairedDevicePeripherals, setPairedDevicePeripherals] = useState<
    Peripheral[]
  >([]);

  const peripheralsRef = useRef<Peripheral[]>([]);

  const getConnectedDevice = async () => {
    try {
      Loader.showLoader();
      const connectedDevice = await BleManager.getConnectedPeripherals();
      setConnectedDevicePeripherals(connectedDevice);
      // const response = await BleManager.getDiscoveredPeripherals();
      // setPeripherals(response);
      // console.log('response :- ', response);
      // const response2 = await BleManager.getBondedPeripherals();
      // console.log(
      //   'response2 :- ',
      //   response2.map(obj => obj.name),
      // );
    } catch (err) {
      console.log('', err);
    } finally {
      Loader.hideLoader();
    }
  };

  const connectWithDeviceHandler = async (peripheral: Peripheral) => {
    try {
      Loader.showLoader();
      await BleManager.connect(peripheral.id);
      console.log(`Connected with ${peripheral.id}`);
      showSnackBar('Connection Successfully');
    } catch (err) {
      showSnackBar('Connection failed');
      console.log('Error in connection with device :- ', err);
    } finally {
      Loader.hideLoader();
    }
  };

  const disconnectWithDeviceHandler = async (peripheral: Peripheral) => {
    try {
      Loader.showLoader();
      await BleManager.disconnect(peripheral.id);
      console.log(`Connected with ${peripheral.id}`);
      showSnackBar('Disconnect Successfully');
    } catch (err) {
      showSnackBar('Disconnect failed');
      console.log('Error in connection with device :- ', err);
    } finally {
      Loader.hideLoader();
    }
  };

  // const clearPeripheralsList = () => {
  //   peripheralsRef.current = [];
  //   setPeripherals([]);
  // };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    const isExits = peripheralsRef.current.findIndex(
      obj => obj.id === peripheral.id,
    );
    if (isExits === -1 && peripheral?.name) {
      peripheralsRef.current = [...peripheralsRef.current, peripheral];
      setPeripherals(peripheralsRef.current);
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    getConnectedDevice();
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
  };

  const handleUpdateValueForCharacteristic = (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  const handleConnectPeripheral = (event: any) => {
    getConnectedDevice();
    console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
  };

  const handleBleManagerPeripheralDidBond = (peripheral: Peripheral) => {
    console.log('BleManagerPeripheralDidBond :- ', peripheral);
    setPairedDevicePeripherals([peripheral]);
  };

  const attachListeners = () => {
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );
    bleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      handleConnectPeripheral,
    );
    bleManagerEmitter.addListener(
      'BleManagerPeripheralDidBond',
      handleBleManagerPeripheralDidBond,
    );
  };

  const removeAllListeners = () => {
    bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerStopScan');
    bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
    bleManagerEmitter.removeAllListeners(
      'BleManagerDidUpdateValueForCharacteristic',
    );
    bleManagerEmitter.removeAllListeners('BleManagerConnectPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerPeripheralDidBond');
    bleManagerEmitter.removeAllListeners('BleManagerPeripheralDidBond');
  };

  const onScanStart = async () => {
    console.log('Click Start Scanning');
    BleManager.scan([], 0, true)
      .then(() => {
        console.log('Start Scanning');
        setIsScanning(true);
        attachListeners();
      })
      .catch(err => {
        console.log('Error in onScanStart :- ', err);
      });
    console.log('Click Start Scanning End');
  };

  const onScanStop = async () => {
    try {
      await BleManager.stopScan();
      // clearPeripheralsList();
      // removeAllListeners();
      console.log('Start Stopped');
    } catch (err) {
      console.log('Error in Stopped :- ', err);
    }
  };

  const getPairedDevicesHandler = async () => {
    try {
      const response = await BleManager.getBondedPeripherals();
      console.log(
        'getPairedDevicesHandler :- ',
        response.map(obj => obj?.name),
      );
      // setPairedDevicePeripherals(response);
    } catch (error) {
      console.log('Err in get Paired Devices :- ', error);
    }
  };

  const pairedHandler = async (obj: Peripheral) => {
    try {
      Loader.showLoader();
      await BleManager.createBond(obj.id);
      await getPairedDevicesHandler();
      showSnackBar('Paired Successfully');
    } catch (err) {
      showSnackBar('Paired Failed');
      console.log('Error in pairedHandler :- ', err);
    } finally {
      Loader.hideLoader();
    }
  };

  const unpairedHandler = async (obj: Peripheral) => {
    try {
      await BleManager.removeBond(obj.id);
      setPairedDevicePeripherals([]);
      // await getPairedDevicesHandler();
      showSnackBar('Unpaired Successfully');
    } catch (err) {
      showSnackBar('Unpaired Failed');
      console.log('Error in unpairedHandler :- ', err);
    } finally {
      Loader.hideLoader();
    }
  };

  const renderItemHandler = (data: ListRenderItemInfo<Peripheral>) => {
    return (
      <DeviceItem
        data={data.item}
        disconnectHandler={disconnectWithDeviceHandler}
        connectedDevicePeripherals={connectedDevicePeripherals}
        connectHandler={connectWithDeviceHandler}
        pairedDevicePeripherals={pairedDevicePeripherals}
        pairHandler={pairedHandler}
        unpairedHandler={unpairedHandler}
      />
    );
  };

  const initial = () => {
    if (Platform.OS === 'android') {
      requestMultiplePermissionHandler([
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ])
        .then(async responses => {
          const flag = mergeAllPermissionFlags(responses);
          console.log('Permission flag Android :- ', flag);
          if (flag) {
            const state = await BleManager.checkState();
            try {
              if (state === BleState.Off) {
                await BleManager.enableBluetooth();
              }
              console.log('Bluetooth is Enabled !');
              await BleManager.start();
              BleManager.setName('React native BLE Demo');
              console.log('Bluetooth is Start !');
              attachListeners();
            } catch (err) {
              console.log('Error in ', err);
            }
          }
        })
        .catch(err => {
          console.log('Error in enableBluetooth :- ', err);
        });
    } else {
      requestMultiplePermissionHandler([
        PERMISSIONS.IOS.BLUETOOTH,
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ])
        .then(async responses => {
          const flag = mergeAllPermissionFlags(responses);
          console.log('Permission flag IOS :- ', flag);
          if (flag) {
            try {
              console.log('Bluetooth is Enabled !');
              await BleManager.start();
              console.log('Bluetooth is Start !');
              attachListeners();
            } catch (err) {
              console.log('Error in ', err);
            }
          }
        })
        .catch(err => {
          console.log('Error in requestSinglePermissionHandler :- ', err);
        });
    }
  };

  useEffect(() => {
    initial();
    return () => {
      removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extraLoaderStyle: ViewStyle = {
    display: isScanning ? 'flex' : 'none',
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listStyle}
        data={peripherals}
        renderItem={renderItemHandler}
        keyExtractor={(_, index) => index?.toString()}
        ListEmptyComponent={
          <View style={styles.row}>
            <Text style={styles.noPeripherals}>
              No Peripherals, press "Scan For Devices" above.
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <View style={styles.buttonContainer}>
              {isScanning ? (
                <Button title="Stop Scan" onPress={onScanStop} />
              ) : (
                <Button title="Scan For Devices" onPress={onScanStart} />
              )}
            </View>
            <Text style={styles.countText}>
              Total Discovered Device :- {peripherals?.length}
            </Text>
            <View style={styles.detailContainer}>
              <Text style={styles.titleText}>Connected Device :-</Text>
              {connectedDevicePeripherals.map(obj => (
                <View key={obj?.id}>
                  <Text style={styles.detailText}>
                    Name : {obj?.name ?? obj?.id}
                  </Text>
                  <Text style={styles.detailText}>Id : {obj?.id}</Text>
                  <View style={styles.breakLine} />
                </View>
              ))}
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.titleText}>Paired Device :-</Text>
              {pairedDevicePeripherals.map(obj => (
                <View key={obj?.id}>
                  <Text style={styles.detailText}>
                    Name : {obj?.name ?? obj?.id}
                  </Text>
                  <Text style={styles.detailText}>Id : {obj?.id}</Text>
                  <View style={styles.breakLine} />
                </View>
              ))}
            </View>
            <ActivityIndicator size={'large'} style={extraLoaderStyle} />
          </>
        }
      />
    </View>
  );
};

export default Scanner;
