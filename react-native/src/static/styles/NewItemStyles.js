import { Dimensions, StyleSheet } from 'react-native';
import { widthWithThirtyPercentPadding } from '../constants';
import { baseFont, button } from './BaseStyles';

const { width, height } = Dimensions.get('window');
export const cameraIconSize = width * 0.28;
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
    marginTop: 5,
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
    padding: 5,
    fontSize: 16,
  },
  submitButton: {
    margin: 15,
    ...button,
    backgroundColor: '#4d4dff',
  },
  addPhotoButton: {
    width: width * 0.35,
    height: width * 0.35,
    margin: 14,
    elevation: 1,
    flex: 0.4,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
  },
  photoStyles: {
    width: width * 0.35,
    height: width * 0.35,
    margin: 10,
    flex: 0.4,
    borderRadius: 10,
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
