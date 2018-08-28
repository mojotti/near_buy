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
    borderBottomWidth: 0.5,
    borderBottomColor: '#858585',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imagePlaceholderContainer: {
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  imageContainer: {
    width: WIDTH * 0.15,
    height: WIDTH * 0.15,
    overflow: 'hidden',
    borderRadius: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  image: {
    width: WIDTH * 0.15,
    height: WIDTH * 0.15,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
});
