import { Dimensions, Platform, StyleSheet } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const BORDER_RADIUS = Platform.OS === 'ios' ? 15 : 100;

export const styles = StyleSheet.create({
  item: {
    flexDirection: 'column',
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
    width: WIDTH,
  },
  separator: {
    marginBottom: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#858585',
    width: WIDTH * 0.93,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imageContainer: {
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  image: {
    width: WIDTH * 0.15,
    height: WIDTH * 0.15,
    margin: 10,
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
  price: {
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
});
