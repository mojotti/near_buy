import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import ImageLoad from 'react-native-image-placeholder';

import Swipeout from 'react-native-swipeout';
import { styles } from '../../static/styles/ListViewItemStyle';
import { localhost } from '../../static/constants';

export class _UserItem extends PureComponent {
  _getHeaders() {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.props.token}`);
    return headers;
  }

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

    const imagePath = `http://${localhost}:5000/${
      this.props.item.id
    }/image0.jpg`;

    return (
      <Swipeout right={deleteButton} autoClose={true}>
        <View style={[{ flexDirection: 'row', flex: 1 }, styles.separator]}>
          <ImageLoad
            style={{ width: 70 }}
            placeholderStyle={{ height: 70, resizeMode: 'contain' }}
            source={{
              uri: imagePath,
            }}
          />
          <View style={styles.item}>
            <Text>{`Title: ${this.props.item.title}`}</Text>
            <Text>{`Description: ${this.props.item.description}`}</Text>
            <Text>{`Price: ${this.props.item.price} €`}</Text>
          </View>
        </View>
      </Swipeout>
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
