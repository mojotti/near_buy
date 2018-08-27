import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../static/styles/ItemDetailsStyles';


export default class ChatButton extends React.Component {
  _getIcon = () => {
    if (this.props.isCreatingChat) {
      return <ActivityIndicator size="large" color="#FFFFFF" />;
    }
    return <FontAwesome name="comments" size={35} color="#FFFFFF" />;
  };

  _getText = () => {
    if (this.props.isCreatingChat) {
      return 'Creating chat...';
    }
    return 'Chat with owner';
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          disabled={this.props.isCreatingChat}
          onPress={this.props.onPress}
          style={styles.chatButton}
        >
          <View style={styles.chatButtonContainer}>
            {this._getIcon()}
            <Text style={styles.chatText}>{this._getText()}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

ChatButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  isCreatingChat: PropTypes.bool.isRequired,
};
