import React from 'react';
import { Image, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import { localhost } from '../../static/constants';
import { baseFont } from '../../static/styles/BaseStyles';


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.sellerId = props.navigation.state.params.item.seller_id;
    this.buyerId = props.navigation.state.params.item.buyer_id;
    this.itemId = props.navigation.state.params.item.item_id;
    this.imagePath =
      `http://${localhost}:5000/api/v1.0/${this.itemId}/image0.jpg`;
  }

  static getImageAndHeader = (navigation) => {
    const id = navigation.state.params.item.item_id;
    const uri = `http://${localhost}:5000/api/v1.0/${id}/image0.jpg`;
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri }} style={{ width: 40, height: 40, overflow: 'hidden', borderRadius: 100, marginRight: 15 }} />
        <View style={{ justifyContent: 'flex-start', alignSelf: 'center' }}>
          <Text style={{ fontStyle: baseFont, fontSize: 20, color: '#161616', fontWeight: '500', fontFamily: 'sans-serif-light' }}>{navigation.state.params.item.title}</Text>
        </View>
      </View>
    );
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: Chat.getImageAndHeader(navigation),
    };
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: this.imagePath,
          },
        },
      ],
    });
  }

  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}
      />
    );
  }
}


Chat.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        item: PropTypes.shape({
          seller_id: PropTypes.number.isRequired,
          buyer_id: PropTypes.number.isRequired,
          item_id: PropTypes.number.isRequired,
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
};
