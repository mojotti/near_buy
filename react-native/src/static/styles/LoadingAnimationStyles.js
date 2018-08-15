import { Dimensions, StyleSheet } from 'react-native';
import { baseFont } from './BaseStyles';

const { width } = Dimensions.get('window');


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    paddingVertical: 14,
    fontFamily: baseFont,
    fontSize: 20,
  },
  viewWrapper: {
    width: width * 0.6,
    height: width * 0.6,
    alignSelf: 'center',
    borderRadius: 150,
    overflow: 'hidden',
    backgroundColor: 'white',
    padding: 10,
  },

});

