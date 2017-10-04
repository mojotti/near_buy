'use strict';

import React from 'react';
import { Image, Platform , StyleSheet,
        Text, View, ScrollView, Button, ListView } from 'react-native';
import { logout } from '../redux/actions/auth';
import { connect } from 'react-redux';

const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const base64  = require('base-64');


class HomeScreen extends React.Component {
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
    return (
      <View style={[styles.container]}>
        <View style={[styles.welcomeText]}>
          <Text style={{fontSize: 27}}>
              {'Welcome ' + this.props.username}
          </Text>
          <Text style={[styles.header]}>
            Your items:
          </Text>
        </View>
        {this.renderUserData()}
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
          renderRow={this.renderItems}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      );
    }
  }

  renderItems(item) {
    return (
      <View style={styles.item}>
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
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20
  },
  item: {
    padding: 10,
    backgroundColor: '#F1F1F1',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  welcomeText: {
    paddingTop: 50
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
