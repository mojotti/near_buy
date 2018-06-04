'use strict';

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { localhost, userHasNoItemsText } from '../../static/constants';
import UserItem from './UserItem';
import { styles } from '../../static/styles/ItemsStyles';
import ItemSeparator from './ItemSeparator';
import { getBearerHeaders } from '../../networking/networking';

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
        <Text onPress={() => navigate('NewItem')} style={styles.headerButton}>
          New item
        </Text>
      ),
    };
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const url = `http://${localhost}:5000/api/v1.0/user/items`;
    this.setState(() => ({ isRefreshing: true }));

    fetch(url, {
      method: 'GET',
      headers: getBearerHeaders(this.props.token),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.handleAllItemsResponse(responseJson);
      })
      .catch(error => {
        console.error(error);
        this.setState(() => ({ isRefreshing: false }));
      });
  };

  handleAllItemsResponse(responseJson) {
    console.log('Items', responseJson.items);
    this.setState(() => ({
      isLoaded: true,
      data: responseJson.items,
      isRefreshing: false,
    }));
  }

  renderUserData() {
    if (!this.state.isLoaded) {
      return (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.activityIndicator}
        />
      );
    }
    if (!this.state.data || this.state.data === 'no items') {
      return <Text style={[styles.infoText]}>{userHasNoItemsText}</Text>;
    } else {
      return (
        <FlatList
          data={this.state.data}
          renderItem={rowData => {
            return (
              <UserItem
                item={rowData.item}
                itemId={rowData.index}
                fetchItems={this.fetchData}
                navigation={this.props.navigation}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={this.fetchData}
          refreshing={this.state.isRefreshing}
          ItemSeparatorComponent={ItemSeparator}
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
