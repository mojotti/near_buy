import { Platform, StyleSheet } from 'react-native';

const headerButtonAndroid = {
  margin: 10,
  padding: 8,
  backgroundColor: '#4d4dff',
  color: 'white',
  borderRadius: 6,
  overflow: 'hidden',
};

const headerButtonIos = {
  color: '#4d4dff',
  margin: 8,
};

export const headerButton = Platform.OS === 'ios' ? headerButtonIos : headerButtonAndroid;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  infoText: {
    textAlign: 'center',
    padding: 10,
  },
  headerButton,
});
