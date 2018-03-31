import React, { Component } from 'react';
import { TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from '../../static/styles/LoginStyles';

export default class CredentialsEntry extends Component {
  render() {
    return (
      <View>
        <TextInput
          id="usernameTextInput"
          placeholder="Username"
          style={styles.textInputStyleNegativeMargin}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={false}
          value={this.props.username}
          underlineColorAndroid="transparent"
          onChangeText={text =>
            this.props.handleCredentialChange({
              username: text,
              password: null,
            })
          }
        />
        <TextInput
          id="passwordTextInput"
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInputStyleLargeMargin}
          autoCorrect={false}
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          value={this.props.password}
          onChangeText={text =>
            this.props.handleCredentialChange({
              password: text,
              username: null,
            })
          }
        />
      </View>
    );
  }
}

CredentialsEntry.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleCredentialChange: PropTypes.func.isRequired,
};
