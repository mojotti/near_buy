'use strict';

import React from 'react';
import { Image, Platform , StyleSheet, Text, View } from 'react-native';

const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const base64  = require('base-64');


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

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
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={require('./logo.png')}
        />
        <Text>
           {"Title: " + this.state.data.title}
        </Text>
         <Text>
            {"Description: " + this.state.data.description}
         </Text>
         <Text>
            {"Price: " + this.state.data.price + " €"}
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
    justifyContent: 'center',
  },
  logo: {
    width: 350,
    height: 150
  }
});
