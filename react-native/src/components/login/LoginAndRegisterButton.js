import React, { Component } from 'react';
import { Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from '../../static/styles/LoginStyles';

export default class LoginAndRegisterButton extends Component {
  render() {
    return (
      <TouchableHighlight
        id="loginButton"
        onPress={() => this.props.handlePress()}
        style={styles.loginButton}
      >
        <Text style={styles.loginText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

LoginAndRegisterButton.propTypes = {
  text: PropTypes.string.isRequired,
  handlePress: PropTypes.func.isRequired,
};
