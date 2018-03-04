import { Dimensions, StyleSheet } from 'react-native';
import { widthWithThirtyPercentPadding } from '../constants';
import { baseFont } from './baseStyles';

const eightyPercentWidth = Dimensions.get('window').width * 0.8;
const sixteenPercentHeight = Dimensions.get('window').height * 0.16;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  welcomeText: {
    fontFamily: baseFont,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 50,
  },
  loginHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: baseFont,
  },
  logo: {
    width: eightyPercentWidth,
    height: sixteenPercentHeight,
    marginBottom: sixteenPercentHeight,
  },
  loginContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: widthWithThirtyPercentPadding,
  },
  logoContainer: {
    justifyContent: 'center',
    alignSelf: 'stretch',
    padding: 0,
  },
  altPageContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textInputStyleNegativeMargin: {
    marginBottom: -12,
  },
  textInputStyleLargeMargin: {
    marginBottom: 16,
  },
  altPageTitle: {
    fontSize: 16,
    color: 'blue',
  },
  loginButton: {
    elevation: 1,
    borderRadius: 30,
    backgroundColor: '#4d4dff',
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: baseFont,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
