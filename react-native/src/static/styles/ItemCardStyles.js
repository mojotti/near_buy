import { Platform, Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');
const ITEM_CARD_WIDTH = width * 0.8;
const ITEM_CARD_HEIGHT = height * 0.7;
const IMAGE_HEIGHT = width * 0.8;

const SHADOW =
  Platform.OS === 'android' ?
    { elevation: 10 } :
    {
      shadowOpacity: 0.9,
      shadowRadius: 10,
      shadowColor: '#919191',
      shadowOffset: { height: 0, width: 0 },
    };

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    height: ITEM_CARD_HEIGHT,
    width: ITEM_CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOW,
  },
  image: {
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
});
