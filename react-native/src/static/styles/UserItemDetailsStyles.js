import { Dimensions, StyleSheet } from 'react-native';
import { baseFont, button } from './BaseStyles';
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
  arrowStyle: {
    height: height * 0.5,
    width: width * 0.3,
    backgroundColor: 'transparent',
  },
  deleteButton: {
    ...button,
    backgroundColor: '#ff5a3e',
    marginBottom: 15,
  },
  updateLocationButton: {
    ...button,
    marginBottom: 5,
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
  paragraph: {
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: baseFont,
    marginBottom: 10,
  },
  infoText: {
    textAlign: 'left',
    fontFamily: baseFont,
    marginBottom: 5,
    marginLeft: width * 0.12,
  },
  mapContainer: {
    height: height * 0.45,
    width: width,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
