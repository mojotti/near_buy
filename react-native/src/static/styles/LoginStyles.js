import { Dimensions, StyleSheet } from 'react-native';
import { widthWithThirtyPercentPadding } from '../constants';

const eightyPercentWidth = Dimensions.get('window').width * 0.7;
const sixteenPercentHeight = Dimensions.get('window').height * 0.16;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 50,
  },
  loginHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
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
  textInputStyleSmallMargin: {
    marginBottom: 4,
  },
  textInputStyleLargeMargin: {
    marginBottom: 16,
  },
  altPageTitle: {
    fontSize: 16,
    color: 'blue',
  },
});
