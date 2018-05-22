import React, { Component } from 'react';
import { Alert, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from '../../static/styles/UserItemDetailsStyles';
import { DELETION_ERROR, localhost } from '../../static/constants';
import { getApplicationJsonHeaders } from '../../networking/networking';

export default class EditButton extends Component {
  _navigateBack = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };

  _updateItemAndNavigateBack = () => {
    const url = `http://${localhost}:5000/api/v1.0/items/${this.props.id}`;
    console.log(this.props.location);
    fetch(url, {
      method: 'PUT',
      headers: getApplicationJsonHeaders(this.props.token),
      body: JSON.stringify({
        id: this.props.item.id,
        title: this.props.item.title,
        description: this.props.item.description,
        price: this.props.item.price,
        longitude: this.props.location.longitude,
        latitude: this.props.location.latitude,
        sold: false,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('response', responseJson);
        this.props.fetchItems();
        this._navigateBack();
      })
      .catch(error => {
        Alert.alert(...DELETION_ERROR);
        console.error(error);
      });
  };

  render() {
    return (
      <TouchableHighlight
        onPress={this._updateItemAndNavigateBack}
        style={styles.editButton}
      >
        <Text style={styles.buttonText}>Edit item</Text>
      </TouchableHighlight>
    );
  }
}

EditButton.propTypes = {
  id: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};
