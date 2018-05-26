import React, { PureComponent } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import ImageLoad from 'react-native-image-placeholder';

import Swipeout from 'react-native-swipeout';
import { styles } from '../../static/styles/ListViewItemStyle';
import { DELETION_ERROR, localhost } from '../../static/constants';
import { getBearerHeaders } from '../../networking/networking';

export class _UserItem extends PureComponent {
 _navigateToItem = () => {
    const { navigate } = this.props.navigation;
    navigate('UserItemDetails', {
      item: this.props.item,
      fetchItems: this.props.fetchItems,
    });
  };

  _removeItem = () => {
    const url = `http://${localhost}:5000/api/v1.0/user/items/${
      this.props.item.id
    }`;
    fetch(url, {
      method: 'DELETE',
      headers: getBearerHeaders(this.props.token),
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
  };

  render() {
    const swipeButtons = [
      {
        text: 'Edit',
        backgroundColor: '#1b01d3',
        onPress: this._navigateToItem,
      },
      {
        text: 'Delete',
        backgroundColor: '#ff1018',
        onPress: this._removeItem,
      },
    ];

    const imagePath = `http://${localhost}:5000/api/v1.0/${
      this.props.item.id
    }/image0.jpg`;

    return (
      <View>
        <Swipeout right={swipeButtons} autoClose={true}>
          <TouchableOpacity onPress={this._navigateToItem}>
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