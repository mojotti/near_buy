import React, { PureComponent } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import ImageLoad from 'react-native-image-placeholder';

import Swipeout from 'react-native-swipeout';
import { styles } from '../../static/styles/ListViewItemStyle';
import { DELETION_ERROR, localhost } from '../../static/constants';

export class _UserItem extends PureComponent {
  _getHeaders() {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.props.token}`);
    return headers;
  }

  _onPress = () => {
    const { navigate } = this.props.navigation;
    navigate('UserItemDetails', { item: this.props.item, fetchItems: this.props.fetchItems });
  };

  _removeItem(itemId) {
    const url = `http://${localhost}:5000/api/v1.0/user/items/${itemId}`;
    fetch(url, {
      method: 'DELETE',
      headers: this._getHeaders(),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok) {
          this.props.fetchItems();
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert(...DELETION_ERROR);
      });
  }

  render() {
    const deleteButton = [
      {
        text: 'Delete',
        backgroundColor: '#ff1018',
        onPress: () => {
          this._removeItem(this.props.item.id);
        },
      },
    ];

    const imagePath = `http://${localhost}:5000/api/v1.0/${
      this.props.item.id
    }/image0.jpg`;

    return (
      <View>
        <Swipeout right={deleteButton} autoClose={true}>
          <TouchableOpacity onPress={this._onPress}>
            <View style={styles.itemContainer}>
              <ImageLoad
                style={styles.image}
                placeholderStyle={{ height: 70, resizeMode: 'contain' }}
                source={{ uri: imagePath }}
              />
              <View style={styles.item}>
                <Text style={styles.title}>{this.props.item.title}</Text>
                <Text style={styles.price}>{`${this.props.item.price} €`}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeout>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.authorizationReducer.username,
    token: state.authorizationReducer.token,
  };
};

const UserItem = connect(mapStateToProps, null)(_UserItem);
export default UserItem;
