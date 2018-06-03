import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableHighlight, View } from 'react-native';
import { styles } from '../../static/styles/UserItemDetailsStyles';

export default class UpdateLocationButton extends React.Component {
  render() {
    return (
      <View>
        <TouchableHighlight
          onPress={this.props.updateLocation}
          style={styles.updateLocationButton}
        >
          <Text style={styles.buttonText}>Update item's location</Text>
        </TouchableHighlight>
      </View>
    );
  }
}


UpdateLocationButton.propTypes = {
  updateLocation: PropTypes.func.isRequired,
};
