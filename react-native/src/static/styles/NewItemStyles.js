import { Dimensions, StyleSheet } from 'react-native';
import { widthWithThirtyPercentPadding } from '../constants';
import { baseFont } from './baseStyles';

const { width, height } = Dimensions.get('window');

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
  headerText: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'left',
    alignSelf: 'stretch',
    marginLeft: width * 0.075,
    fontFamily: baseFont,
  },
  itemDetailContainer: {
    height: height * 0.06,
    ...itemContainer,
  },
  itemDescriptionContainer: {
    height: height * 0.2,
    ...itemContainer,
  },
  itemDetails: {
    width: widthWithThirtyPercentPadding,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 15,
    elevation: 1,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    width: width * 0.7,
    backgroundColor: '#4d4dff',
  },
  addPhotoButton: {
    width: width * 0.3,
    height: width * 0.3,
    margin: 10,
    elevation: 1,
    flex: 0.4,
    backgroundColor: 'white',
  },
  submitText: {
    fontFamily: baseFont,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageRow: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'transparent',
  },
  imageRowMargin: {
    marginBottom: 10,
    marginTop: 10,
  },
});
