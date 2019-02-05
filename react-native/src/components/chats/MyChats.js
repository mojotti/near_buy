import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MaterialIconAndText from '../common/MaterialIconAndText';
import {
  NO_CHATS_TEXT_HEADER,
  NO_CHATS_TEXT_CONTENT,
} from '../../static/constants';
import { requestChats } from '../../redux/actions/ChatActions';
import Chat from './ChatDetails';
import ItemSeparator from '../user_items/ItemSeparator';

export class _MyChats extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Chats',
      headerLeft: (
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('DrawerOpen')}>
            <Icon name="menu" size={30} color="#4d4dff" />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  componentWillMount() {
    this._updateChats();
  }

  _updateChats = () => this.props.dispatch(requestChats(this.props.token));

  _renderNoChats = () => {
    return (
      <View style={{ flex: 1 }}>
        <MaterialIconAndText
          iconName="emoticon-poop"
          headerText={NO_CHATS_TEXT_HEADER}
          containerText={NO_CHATS_TEXT_CONTENT}
        />
      </View>
    );
  };

  _renderChat = rowData => <Chat item={rowData} itemId={rowData.index} />;

  _renderSeparator = () => <ItemSeparator widthPercentage={0.93} />;

  _renderChats = () => {
    return (
      <FlatList
        data={this.props.chatHeaders}
        renderItem={this._renderChat}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={this._updateChats}
        refreshing={this.props.isFetching}
        ItemSeparatorComponent={this._renderSeparator}
      />
    );
  };

  render() {
    const isVisible =
      this.props.chatHeaders && this.props.chatHeaders.length > 0;
    const backgroundColor = isVisible ? '#FFFFFF' : 'transparent';
    const bgColor = { backgroundColor };

    return (
      <View style={[bgColor, { flex: 1 }]}>
        {isVisible ? this._renderChats() : this._renderNoChats()}
      </View>
    );
  }
}

_MyChats.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  chatHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      seller_id: PropTypes.number.isRequired,
      buyer_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      item_id: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
};

const mapStateToProps = state => {
  const { chatHeaders, isFetching } = state.currentChatsReducer;
  const { token } = state.authorizationReducer;

  return { chatHeaders, isFetching, token };
};

const MyChats = connect(mapStateToProps)(_MyChats);
export default MyChats;
