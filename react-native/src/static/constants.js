import { Dimensions,
    Platform} from 'react-native';

const localhost = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const loginText = "New user? Press 'Sign up' to register.";
const registerText = "Existing user? Press 'Login'.";
const widthWithThirtyPercentPadding = Dimensions.get('window').width * 0.7;
const width = Dimensions.get('window').width;


export { localhost,
    loginText,
    registerText,
    widthWithThirtyPercentPadding,
    width};