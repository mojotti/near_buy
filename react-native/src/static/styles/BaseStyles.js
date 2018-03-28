import { Platform } from 'react-native';

const baseFontAndroid = 'sans-serif-light';
const baseFontIos = null;

export const baseFont = Platform.OS === 'ios' ? baseFontIos : baseFontAndroid;
