import { Dimensions, Platform, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const baseFontAndroid = 'sans-serif-light';
const baseFontIos = null;
export const baseFont = Platform.OS === 'ios' ? baseFontIos : baseFontAndroid;


export const button = {
  marginTop: 15,
  elevation: 1,
  borderRadius: 30,
  backgroundColor: '#ff3c21',
  paddingTop: 8,
  paddingBottom: 8,
  alignItems: 'center',
  width: width * 0.7,
};

export const baseStyles = StyleSheet.create({
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
