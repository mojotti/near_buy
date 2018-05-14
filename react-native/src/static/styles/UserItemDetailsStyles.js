import { Dimensions, StyleSheet } from 'react-native';
import { baseFont } from './BaseStyles';
const { width, height } = Dimensions.get('window');

const button = {
  marginTop: 15,
  elevation: 1,
  borderRadius: 30,
  backgroundColor: '#ff3c21',
  paddingTop: 8,
  paddingBottom: 8,
  alignItems: 'center',
  width: width * 0.7,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carousel: {
    height: height * 0.5,
    width,
  },
  headerText: {
    fontSize: 25,
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'left',
    alignSelf: 'stretch',
    marginLeft: width * 0.075,
    fontFamily: baseFont,
    color: '#848484',
  },
  deleteButton: {
    ...button,
    backgroundColor: '#ff3c21',
    marginBottom: 15,
  },
  editButton: {
    ...button,
    backgroundColor: '#100eff',
  },
  buttonText: {
    fontFamily: baseFont,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
