import { StyleSheet } from 'react-native';
import { baseFont } from './BaseStyles';
import { headerButton } from './ItemsStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  noItemsText: {
    paddingHorizontal: 30,
    fontFamily: baseFont,
  },
  headerButton,
});
