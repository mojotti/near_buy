import { Dimensions, StyleSheet } from 'react-native';
import { widthWithThirtyPercentPadding } from '../constants';
import { baseFont } from './baseStyles';

const { width } = Dimensions.get('window');

const itemContainer = {
  backgroundColor: '#fff',
  width: width * 0.85,
  elevation: 1,
  borderRadius: 10,
  marginBottom: 10,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 15,
  },
  itemDetailsHeader: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'left',
    alignSelf: 'stretch',
    marginLeft: width * 0.075,
    fontFamily: baseFont,
  },
  itemDetailContainer: {
    flex: 0.15,
    ...itemContainer,
  },
  itemDescriptionContainer: {
    flex: 0.3,
    ...itemContainer,
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
