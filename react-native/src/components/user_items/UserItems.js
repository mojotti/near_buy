'use strict';

import React from 'react';
import { Button, ListView, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { localhost, userHasNoItemsText } from '../../static/constants';
import { ListViewItem } from './ListViewItem';
import { styles } from '../../static/styles/ItemsStyles';

export class UserItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      data: '',
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'My items',
      headerLeft: (
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('DrawerOpen')}>
            <Icon name="menu" size={30} color="blue" />
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
      });
  }

  handleAllItemsRequest(responseJson) {
    if (responseJson.items === 'no user_items') {
      this.setState({
        loaded: true,
        data: responseJson.items,
      });
    } else {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseJson.items),
        loaded: true,
        data: responseJson.items,
      });
    }
  }

  renderUserData() {
    if (this.state.loaded === false) {
      return <Text style={[styles.infoText]}>{'Loading user data...'}</Text>;
    }
    if (this.state.data === 'no user_items') {
      return <Text style={[styles.infoText]}>{userHasNoItemsText}</Text>;
    } else {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={data => <ListViewItem item={data} />}
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
