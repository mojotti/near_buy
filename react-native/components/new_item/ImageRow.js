import React from 'react';
import { Alert, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { styles } from '../../src/static/styles/NewItemStyles';

export class ImageRow extends React.Component {
  render() {
    return (
      <View style={styles.imageRow}>
        <MaterialIcons.Button
          name={'add-a-photo'}
          backgroundColor={'transparent'}
          size={100}
          color={'gray'}
          style={styles.addPhotoButton}
          onPress={() => Alert.alert('You pressed me')}
        />
        <MaterialIcons.Button
          name={'add-a-photo'}
          backgroundColor={'transparent'}
          size={100}
          color={'gray'}
          style={styles.addPhotoButton}
          onPress={() => Alert.alert('You pressed me')}
        />
      </View>
    );
  }
}

ImageRow.propTypes = {
  onLeftImageSelected: PropTypes.func.isRequired,
  onRightImageSelected: PropTypes.func.isRequired,
};
