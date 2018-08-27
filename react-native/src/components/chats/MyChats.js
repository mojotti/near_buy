import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MaterialIconAndText from '../common/MaterialIconAndText';
import { NO_CHATS_TEXT_HEADER, NO_CHATS_TEXT_CONTENT } from '../../static/constants';


export default class MyChats extends React.Component {
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MaterialIconAndText
          iconName="emoticon-poop"
          headerText={NO_CHATS_TEXT_HEADER}
          containerText={NO_CHATS_TEXT_CONTENT}
        />
      </View>
    );
  }
}
