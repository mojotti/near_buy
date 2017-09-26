'use strict';

import React from 'react';
import { Image, Platform , StyleSheet,
        Text, View, ScrollView, Button } from 'react-native';
import { logout } from '../redux/actions/auth';
import { connect } from 'react-redux';

const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const base64  = require('base-64');


class HomeScreen extends React.Component {
  userLogout(e) {
      this.props.onLogout();
      e.preventDefault();
  }

  state = {
        data: ''
  }

  componentDidMount() {
      this.fetchData();
  }

  getHeaders() {
    var headers = new Headers();
    headers.append("Authorization", "Basic " +
                    base64.encode("mojo:best_password_ever"));
    return headers;
  }

  fetchData() {
    fetch('http://' + LOCALHOST + ':5000/todo/api/v1.0/items/1', {
         method: 'GET',
         headers: this.getHeaders()
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson);

         this.setState({
            data: responseJson.item
         })
      })
      .catch((error) => {
         console.error(error);
      });
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View style={{padding: 20}}>
          <Text style={{fontSize: 27}}>
              {`Welcome ${this.props.username}`}
          </Text>
          <View style={{margin: 20}}/>
        </View>
        <Text style={[styles.header]}>
          Your items:
        </Text>
        <Text>
           {"Title: " + this.state.data.title}
        </Text>
         <Text>
            {"Description: " + this.state.data.description}
         </Text>
         <Text>
            {"Price: " + this.state.data.price + " €"}
         </Text>
         <Button
            onPress={(e) => this.userLogout(e)}
            title="Logout"
            style = {{margin: 15}}
          />
      </View>
    );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
});

const mapStateToProps = (state, ownProps) => {
    return {
        username: state.auth.username
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
