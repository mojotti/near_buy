import { StyleSheet } from 'react-native';
import { widthWithThirtyPercentPadding } from '../constants';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    itemDetails: {
        width: widthWithThirtyPercentPadding,
        alignItems: 'center',
    }
});
