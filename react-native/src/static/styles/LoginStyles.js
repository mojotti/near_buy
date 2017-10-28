import { StyleSheet } from 'react-native';
import { widthWithThirtyPercentPadding } from '../constants';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    welcomeText: {
        fontSize: 24,
        textAlign: 'center',
        marginTop: 50
    },
    loginHint: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
    },
    logo: {
        width: 350,
        height: 150,
    },
    loginContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: widthWithThirtyPercentPadding,
    },
    logoContainer: {
        justifyContent: 'center',
        alignSelf: 'stretch',
        padding: 0,
    },
    altPageContainer: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
