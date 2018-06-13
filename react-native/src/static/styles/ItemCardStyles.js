import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');
const ITEM_CARD_WIDTH = width * 0.8;
const ITEM_CARD_HEIGHT = height * 0.7;
const IMAGE_HEIGHT = width * 0.8;

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    height: ITEM_CARD_HEIGHT,
    width: ITEM_CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
  },
  image: {
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
});
