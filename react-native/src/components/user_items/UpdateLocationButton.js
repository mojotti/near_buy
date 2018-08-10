import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableHighlight, View } from 'react-native';
import { styles } from '../../static/styles/UserItemDetailsStyles';

export default class UpdateLocationButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: `Update item's location`,
    };
    this.isAccessible = false;
  }

  handleButtonPress = () => {
    this.props.updateLocation();
    this.isAccessible = true;
    this.setState(() => ({ buttonText: 'Location updated' }));
  };

  render() {
    return (
      <View>
        <TouchableHighlight
          disabled={this.isAccessible}
          onPress={this.handleButtonPress}
          style={styles.updateLocationButton}
        >
          <Text style={styles.buttonText}>{this.state.buttonText}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}


UpdateLocationButton.propTypes = {
  updateLocation: PropTypes.func.isRequired,
};
