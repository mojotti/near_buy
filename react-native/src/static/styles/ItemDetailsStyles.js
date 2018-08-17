import { Dimensions, StyleSheet } from 'react-native';
import { baseFont } from './BaseStyles';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  plainText: {
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'stretch',
    marginLeft: width * 0.1,
    marginRight: width * 0.1,
    fontFamily: baseFont,
    color: '#2b2b2b',
  },
  chatButton: {
    marginHorizontal: width * 0.15,
    backgroundColor: '#4d4dff',
    marginBottom: 20,
    padding: 6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  chatButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chatText: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: baseFont,
    textAlign: 'left',
    marginLeft: 15,
    fontWeight: 'bold',
  },
});
