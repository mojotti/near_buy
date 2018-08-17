import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../static/styles/ItemDetailsStyles';


export default class ChatButton extends React.Component {
  render() {
    return (
      <View>
        <TouchableOpacity style={styles.chatButton}>
          <View style={styles.chatButtonContainer}>
            <FontAwesome name="comments" size={50} color="#FFFFFF" />
            <Text style={styles.chatText}>Chat with owner</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
