import React from 'react';
import { TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import NavigationBarIconAndText from '../common/NavigationBarIconAndText';
import {
  connectSocket,
  destroySocket,
  getRoomId,
} from '../../networking/socketIO';
import { addMessageToChat } from '../../redux/actions/ChatActions';

class _Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.sellerId = props.navigation.state.params.item.seller_id;
    this.buyerId = props.navigation.state.params.item.buyer_id;
    this.itemId = props.navigation.state.params.item.id;
    this.chatId = getRoomId(this.itemId, this.buyerId, this.sellerId);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: _Chat.getHeaderTitle(
        navigation.navigate,
        navigation.state.params.item
      ),
    };
  };

  static getHeaderTitle = (navigate, item) => {
    const navigateToItem = () => {
      navigate('ItemDetails', { item });
    };
    return (
      <TouchableHighlight onPress={navigateToItem}>
        <NavigationBarIconAndText imageId={item.id} title={item.title} />
      </TouchableHighlight>
    );
  };

  componentDidMount() {
    connectSocket(this.itemId, this.buyerId, this.sellerId);

    const messages = this.props.chatMessages[this.chatId] || [];
    this.setState(() => ({ messages }));
  }

  componentWillUnmount() {
    destroySocket(this.itemId, this.buyerId, this.sellerId);
  }

  onSend = (message = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, message),
    }));
    console.log('new message', message);
    this.props.dispatch(addMessageToChat(this.chatId, message[0]));
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
  const { chatMessages } = state.chatMessagesReducer;
  const { token } = state.authorizationReducer;

  return { chatHeaders, chatMessages, isFetching, token };
};

const Chat = connect(mapStateToProps)(_Chat);
export default Chat;
