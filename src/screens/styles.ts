import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
  },
  buttonContainer: {
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  loaderStyle: {},
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: 'blue',
  },
  listStyle: {
    flex: 1,
    marginTop: 15,
  },
  countText: {
    color: 'red',
    marginBottom: 15,
    alignSelf: 'center',
  },
  detailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 15,
    marginBottom: 15,
  },
  detailText: {
    color: 'green',
  },
  breakLine: {
    marginVertical: 5,
    height: 1,
  },
  titleText: {
    color: 'green',
    marginBottom: 10,
  },
});

export default styles;
