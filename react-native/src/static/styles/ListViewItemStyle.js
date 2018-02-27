import { StyleSheet } from 'react-native';
import { width } from '../constants';

export const styles = StyleSheet.create({
  item: {
    padding: 10,
    backgroundColor: 'azure',
    width,
  },
  separator: {
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gainsboro',
  },
});
