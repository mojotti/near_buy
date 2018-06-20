import React, { Component } from 'react';
import { Alert, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import * as itemsStyles from '../../static/styles/ItemsStyles';
import { DELETION_ERROR, localhost } from '../../static/constants';
import { getApplicationJsonHeaders } from '../../networking/networking';
import { connect } from 'react-redux';

export class _SaveButton extends Component {
  _navigateBack = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };

  _updateItemAndNavigateBack = () => {
    const url = `http://${localhost}:5000/api/v1.0/items/${this.props.id}`;
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
      <View>
        <Text
          style={itemsStyles.styles.headerButton}
          onPress={this._updateItemAndNavigateBack}
        >
          Save
        </Text>
      </View>
    );
  }
}

_SaveButton.propTypes = {
  id: PropTypes.number.isRequired,
  fetchItems: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    created: PropTypes.number.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
  })
};

const mapStateToProps = state => {
  const { latitude, longitude } = state.locationReducer;
  return {
    token: state.authorizationReducer.token,
    location: {
      latitude,
      longitude,
    },
  };
};

const SaveButton = connect(mapStateToProps, null)(_SaveButton);
export default SaveButton;
