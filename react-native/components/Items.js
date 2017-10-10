'use strict';

import React from 'react';
import { Image, Platform , StyleSheet, Dimensions,
        Text, View, ScrollView, Button, ListView } from 'react-native';
import { logout } from '../redux/actions/auth';
import { connect } from 'react-redux';

const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const width = Dimensions.get('window').width; //full width


class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      data: ''
    };
  }

  static navigationOptions = {
    title: 'Your items',
    headerLeft: null
  };

  userLogout(e) {
      this.props.onLogout();
      e.preventDefault();
  }

  componentDidMount() {
      this.fetchData();
  }

  getHeaders() {
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.token);
    return headers;
  }

  fetchData() {
    fetch('http://' + LOCALHOST + ':5000/api/v1.0/user/items', {
         method: 'GET',
         headers: this.getHeaders()
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.handleAllItemsRequest(responseJson);
      })
      .catch((error) => {
         console.error(error);
      });
  }

  handleAllItemsRequest(responseJson) {
    console.log(responseJson);
    if (responseJson.items === 'no items') {
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={[styles.container]}>
        {this.renderUserData()}
        <Button
          title="Add new item"
          onPress={() =>
            navigate('NewItem')
          }
        />
        <Button
          onPress={(e) => this.userLogout(e)}
          title="Logout"
          style = {{margin: 15}}
        />
      </View>
    );
  }

  renderUserData() {
    while (this.state.loaded === false) {
      return (
        <Text style={[styles.infoText]}>
          {"Loading user data..."}
        </Text>
      )
    }
    if (this.state.data === 'no items') {
      return (
        <Text style={[styles.infoText]}>
          {"You don't have any items yet. You should start to sell some shit!"}
        </Text>
      );
    } else {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={data => this.renderItem(data)}
        />
      );
    }
  }

  renderItem(item) {
    return (
      <View style={[styles.item, styles.separator]}>
        <Text>
           {"Title: " + item.title}
        </Text>
        <Text>
          {"Description: " + item.description}
        </Text>
        <Text>
          {"Price: " + item.price + " €"}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    padding: 10,
    backgroundColor: '#F1F1F1',
    width: width,
  },
  separator: {
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  infoText: {
    textAlign: 'center',
    padding: 10
  }
});

const mapStateToProps = (state, ownProps) => {
    return {
        username: state.auth.username,
        token: state.auth.token
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);
