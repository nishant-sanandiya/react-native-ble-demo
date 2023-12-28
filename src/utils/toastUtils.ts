import {Alert, Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';

/**
 * The function `showSnackBar` displays a snackbar with a given message after a delay of 500
 * milliseconds.
 * @param {string} message - The `message` parameter is a string that represents the text that will be
 * displayed in the snackbar.
 */
export const showSnackBar = (
  message: string,
  backgroundColor: string = 'blue',
): void => {
  setTimeout(
    () => {
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_LONG,
        textColor: 'white',
        backgroundColor: backgroundColor,
      });
    },
    Platform.OS === 'android' ? 0 : 500,
  );
};

/**
 * The function `showAlertWithCallBack` displays an alert with a message and a callback function that
 * is triggered when the user clicks the OK button.
 * @param {string} msg - The `msg` parameter is a string that represents the message to be displayed in
 * the alert dialog.
 * @param onOkClick - The `onOkClick` parameter is a callback function that will be executed when the
 * user clicks on the "OK" button in the alert dialog. It is of type `() => void`, which means it takes
 * no arguments and does not return anything.
 */
export const showAlertWithCallBack = (
  msg: string,
  onOkClick: () => void,
): void => {
  Alert.alert(
    '',
    msg,
    [
      {
        text: 'OK',
        onPress: () => {
          onOkClick();
        },
      },
    ],
    {
      cancelable: false,
    },
  );
};
