import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MaterialIconAndText from '../common/MaterialIconAndText';
import {
  NO_CHATS_TEXT_HEADER,
  NO_CHATS_TEXT_CONTENT
} from '../../static/constants';
import { requestChatsAction } from '../../redux/actions/ChatActions';
import Chat from './Chat';


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
    // this.props.dispatch(requestChatsAction(this.props.token));
  }

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

  _renderChat = (rowData) => {
    return (
      <Chat
        item={rowData}
        itemId={rowData.index}
      />
    );
  };

  _renderChats = () => {
    return (
      <FlatList
        data={this.props.chatHeaders}
        renderItem={this._renderChat}
        keyExtractor={(item, index) => index.toString()}
        //onRefresh={this.fetchData}
        //refreshing={this.state.isRefreshing}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  };

  render() {
    return this.props.chatHeaders ? this._renderChats() : this._renderNoChats();
  }
}

const mapStateToProps = (state) => {
  const { chatHeaders } = state.currentChatsReducer;
  return { chatHeaders };
};

const MyChats = connect(mapStateToProps)(_MyChats);
export default MyChats;
