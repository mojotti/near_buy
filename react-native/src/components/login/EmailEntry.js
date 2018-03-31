import React, { Component } from 'react';
import { TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from '../../static/styles/LoginStyles';

export default class EmailEntry extends Component {
  render() {
    return (
      <View>
        <TextInput
          id="emailTextInput"
          placeholder="Email address"
          style={styles.textInputStyleNegativeMargin}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={false}
          keyboardType="email-address"
          value={this.props.email}
          onChangeText={text => this.props.handleEmailChange(text)}
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}

EmailEntry.propTypes = {
  email: PropTypes.string.isRequired,
  handleEmailChange: PropTypes.func.isRequired,
};
