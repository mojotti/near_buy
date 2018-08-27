import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ItemDetailsImageCarousel from './ItemDetailsImageCarousel';
import { getNumOfPictures } from '../../networking/ApiCalls';
import { localhost } from '../../static/constants';
import { baseStyles } from '../../static/styles/BaseStyles';
import { styles } from '../../static/styles/ItemDetailsStyles';
import ChatButton from './ChatButton';
import ItemSeparator from '../user_items/ItemSeparator';
import { createChatAction } from '../../redux/actions/ChatActions';

window.navigator.userAgent = 'ReactNative';

const io = require('socket.io-client/dist/socket.io');
const connectionConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ['websocket'], // you need to explicitly tell it to use websockets
};

const path = `http://${localhost}:5000`;

export class _ItemDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrls: ['foo.bar'], // provide some uri while loading actual img uris
    };

    this.socket = null;
    if (!this.socket || !this.socket.connected) {
      this.socket = io(path, connectionConfig);
      this.socket.on('connect', () => {
        console.log('connected!');
      });
      this.socket.emit('lol', 'Hello world!');
    }
  }

  static navigationOptions = ({ navigation }) =>
    ({ title: navigation.state.params.item.title });

  componentWillMount() {
    this.getImageUrls();
  }

  getImageUrls = () => {
    getNumOfPictures(this.props.item.id, this.props.token)
      .then((numOfPics) => {
        this.setImageUrls(numOfPics);
      });
  };

  setImageUrls = (numOfPics) => {
    const urls = [];
    for (let i = 0; i < numOfPics; i++) {
      const imagePath =
        `http://${localhost}:5000/api/v1.0/${this.props.item.id}/image${i}.jpg`;
      urls.push(imagePath);
    }
    this.setState(() => ({ imageUrls: urls }));
  };

  _openChat = () => {
    this.props.dispatch(createChatAction(
      this.props.item.seller_id,
      this.props.item.id,
      this.props.token,
    ));
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <ItemDetailsImageCarousel images={this.state.imageUrls} />
        <Text style={baseStyles.headerText}>Distance</Text>
        <View style={styles.locationIconContainer}>
          <FontAwesome name="map-marker" size={20} color={'#9f9f9f'} style={styles.locationIcon} />
          <Text style={styles.plainText}>{this.props.distance}</Text>
        </View>
        <ItemSeparator widthPercentage={0.86} />
        <Text style={baseStyles.headerText}>Description</Text>
        <Text style={styles.plainText}>{this.props.item.description}</Text>
        <ItemSeparator widthPercentage={0.86} />
        <ChatButton onPress={this._openChat} isCreatingChat={this.props.isCreatingChat} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { item } = ownProps.navigation.state.params;
  const { distance } = ownProps.navigation.state.params;
  const { token } = state.authorizationReducer;
  const { isLoading } = state.chatCreationReducer;

  return {
    item,
    token,
    distance,
    isCreatingChat: isLoading,
  };
};

const ItemDetails = connect(mapStateToProps, null)(_ItemDetails);
export default ItemDetails;
