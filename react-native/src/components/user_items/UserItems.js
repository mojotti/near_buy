'use strict';

import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { localhost, userHasNoItemsText } from '../../static/constants';
import UserItem from './UserItem';
import { styles } from '../../static/styles/ItemsStyles';

export class UserItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLoaded: false,
      isRefreshing: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'My items',
      headerLeft: (
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('DrawerOpen')}>
            <Icon name="menu" size={30} color="#4d4dff" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: (
        <Text onPress={() => navigate('NewItem')} style={styles.newItem}>
          New item
        </Text>
      ),
    };
  };

  componentDidMount() {
    this.fetchData();
  }

  getHeaders() {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.props.token}`);
    return headers;
  }

  fetchData() {
    let url = `http://${localhost}:5000/api/v1.0/user/items`;
    this.setState(() => ({ isRefreshing: false }));

    fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.handleAllItemsRequest(responseJson);
      })
      .catch(error => {
        console.error(error);
        this.setState(() => ({ isRefreshing: false }));
      });
  }

  handleAllItemsRequest(responseJson) {
    this.setState(() => ({
      isLoaded: true,
      data: responseJson.items,
      isRefreshing: false,
    }));
  }

  renderUserData() {
    if (!this.state.isLoaded) {
      return <Text style={[styles.infoText]}>{'Loading user data...'}</Text>;
    }
    if (this.state.data === 'no user_items') {
      return <Text style={[styles.infoText]}>{userHasNoItemsText}</Text>;
    } else {
      return (
        <FlatList
          data={this.state.data}
          renderItem={(rowData, sectionID, rowID) => {
            return <UserItem item={rowData.item} itemId={rowData.index} />;
          }}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={() => {
            this.fetchData();
          }}
          refreshing={this.state.isRefreshing}
        />
      );
    }
  }

  render() {
    return <View style={[styles.container]}>{this.renderUserData()}</View>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.authorizationReducer.username,
    token: state.authorizationReducer.token,
  };
};

export default connect(mapStateToProps, null)(UserItems);
