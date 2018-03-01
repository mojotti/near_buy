import { Dimensions, StyleSheet } from 'react-native';
import { widthWithThirtyPercentPadding } from '../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemDetailContainer: {
    flex: 0.5,
    backgroundColor: '#fff',
    width: Dimensions * 0.85,
    justifyContent: 'space-around',
    elevation: 1,
    borderRadius: 10,
  },
  itemDetails: {
    width: widthWithThirtyPercentPadding,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
  },
  submitButton: {
    flex: 0.05,
    marginTop: 20,
    elevation: 1,
    borderRadius: 10,
  },
});
