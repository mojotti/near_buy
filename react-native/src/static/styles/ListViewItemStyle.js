import { Dimensions, StyleSheet } from 'react-native';

const WIDTH = Dimensions.get('window').width;

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
    borderBottomWidth: 1,
    borderBottomColor: '#858585',
    width: WIDTH * 0.93,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  image: {
    width: WIDTH * 0.15,
    height: WIDTH * 0.15,
    margin: 10,
    overflow: 'hidden',
    borderRadius: 100,
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
  }
});
