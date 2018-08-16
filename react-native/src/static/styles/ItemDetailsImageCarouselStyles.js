import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const WIDTH = width;

export const styles = StyleSheet.create({
  size: {
    width: WIDTH,
    height: WIDTH,
  },
});
