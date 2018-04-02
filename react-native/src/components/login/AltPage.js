import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from '../../static/styles/LoginStyles';
import { loginText, registerText } from '../../static/constants';

export default class AltPage extends Component {
  render() {
    return (
      <View>
        <View style={styles.altPageContainer}>
          <Text
            id="altPageTitle"
            onPress={() => this.props.togglePage()}
            style={styles.altPageTitle}
          >
            {this.props.page === 'Login' ? 'Sign up' : 'Login'}
          </Text>
        </View>
        <Text id="helperText" style={styles.loginHint}>
          {this.props.page === 'Login' ? loginText : registerText}
        </Text>
      </View>
    );
  }
}

AltPage.propTypes = {
  togglePage: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
};
