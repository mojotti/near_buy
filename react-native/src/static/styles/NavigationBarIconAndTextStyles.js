import { Platform, StyleSheet } from 'react-native';
import { baseFont } from './BaseStyles';

const appBarHeight = Platform.OS === 'ios' ? 44 : 56; // from react-navigation
const headerSize = Platform.OS === 'ios' ? 17 : 20;
const fontWeight = Platform.OS === 'ios' ? '700' : '500';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 100,
    marginRight: 15,
  },
  image: {
    width: appBarHeight * 0.8,
    height: appBarHeight * 0.8,
  },
  textContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'center'
  },
  text: {
    fontFamily: baseFont,
    fontSize: headerSize,
    color: '#161616',
    fontWeight,
  },
});
