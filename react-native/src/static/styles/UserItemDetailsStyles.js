import { Dimensions, StyleSheet } from 'react-native';
import { baseFont } from './BaseStyles';
const { width, height } = Dimensions.get('window');

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
});
