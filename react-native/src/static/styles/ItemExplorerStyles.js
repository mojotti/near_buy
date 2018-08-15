import { Dimensions, StyleSheet } from 'react-native';
import { baseFont } from './BaseStyles';
import { headerButton } from './ItemsStyles';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  noItemsText: {
    paddingHorizontal: 30,
    fontFamily: baseFont,
    textAlign: 'center',
  },
  headerButton,
  poopContainer: {
    width: width * 0.24,
    height: width * 0.24,
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 15,
  },
  poopStyles: {
    alignSelf: 'center',
  },
});
