import React from 'react';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import { localhost } from '../../static/constants';
import NavigationBarIconAndText from '../common/NavigationBarIconAndText';


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.sellerId = props.navigation.state.params.item.seller_id;
    this.buyerId = props.navigation.state.params.item.buyer_id;
    this.itemId = props.navigation.state.params.item.id;
    this.imagePath =
      `http://${localhost}:5000/api/v1.0/${this.itemId}/image0.jpg`;
  }

  static navigationOptions = ({ navigation }) => {
    const { id, title } = navigation.state.params.item;
    return {
      headerTitle: (<NavigationBarIconAndText imageId={id} title={title} />),
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
        {
          _id: 2,
          text: 'Hello stranger!',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'Raimo',
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
