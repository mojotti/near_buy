import React, { Component } from 'react';
import { Alert, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from '../../static/styles/UserItemDetailsStyles';
import { DELETION_ERROR, localhost } from '../../static/constants';
import { getBearerHeaders } from '../../networking/networking';

export default class DeleteButton extends Component {
  _navigateBack = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };

  _removeItemAndNavigateBack = () => {
    const url = `http://${localhost}:5000/api/v1.0/user/items/${this.props.id}`;
    fetch(url, {
      method: 'DELETE',
      headers: getBearerHeaders(this.props.token),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok) {
          this.props.fetchItems();
          this._navigateBack();
        }
      })
      .catch(error => {
        Alert.alert(...DELETION_ERROR);
        console.error(error);
      });
  };

  render() {
    return (
      <TouchableHighlight
        onPress={this._removeItemAndNavigateBack}
        style={styles.deleteButton}
      >
        <Text style={styles.buttonText}>Delete item</Text>
      </TouchableHighlight>
    );
  }
}

DeleteButton.propTypes = {
  id: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};
