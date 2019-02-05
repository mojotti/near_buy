import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import { localhost } from '../../static/constants';
import NavigationBarIconAndText from '../common/NavigationBarIconAndText';
import { connectSocket, sendMessage } from '../../networking/socketIO';

class _Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.sellerId = props.navigation.state.params.item.seller_id;
    this.buyerId = props.navigation.state.params.item.buyer_id;
    this.itemId = props.navigation.state.params.item.id;
    this.imagePath = `http://${localhost}:5000/api/v1.0/${
      this.itemId
    }/image0.jpg`;
  }

  static navigationOptions = ({ navigation }) => {
    const { id, title } = navigation.state.params.item;
    return {
      headerTitle: <NavigationBarIconAndText imageId={id} title={title} />,
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

  componentDidMount() {
    connectSocket(this.itemId, this.buyerId, this.sellerId);
  }

  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    console.log('messages', messages);
    sendMessage(messages);
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}
        isAnimated
      />
    );
  }
}

_Chat.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        item: PropTypes.shape({
          seller_id: PropTypes.number.isRequired,
          buyer_id: PropTypes.number.isRequired,
          id: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = state => {
  const { chatHeaders, isFetching } = state.currentChatsReducer;
  const { token } = state.authorizationReducer;

  return { chatHeaders, isFetching, token };
};

const Chat = connect(mapStateToProps)(_Chat);
export default Chat;
