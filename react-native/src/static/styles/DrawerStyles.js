import { Dimensions, StyleSheet } from 'react-native';
import { baseFont } from './BaseStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 2,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: baseFont,
    color: '#232c44',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    elevation: 1,
    borderRadius: 30,
    backgroundColor: '#4d4dff',
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 30,
    marginVertical: 10,
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.53,
    alignSelf: 'center',
  },
  loginText: {
    fontFamily: baseFont,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconStyles: {
    paddingRight: 4,
  },
});
