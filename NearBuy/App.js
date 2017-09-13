import React from 'react';
import { Platform , StyleSheet, Text, View } from 'react-native';
import NearBuyRestApi from './api/NearBuyRestApi';

const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';


export default class App extends React.Component {
  state = {
        data: ''
  }

  componentDidMount() {
      this.fetchData();
  }

  fetchData() {
    fetch('http://' + LOCALHOST + ':5000/todo/api/v1.0/items/1', {
         method: 'GET'
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
});
