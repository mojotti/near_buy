import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';
import ItemDetailsImageCarousel from './ItemDetailsImageCarousel';
import { getNumOfPictures } from '../../networking/ApiCalls';
import { localhost } from '../../static/constants';
import { baseStyles } from '../../static/styles/BaseStyles';
import { styles } from '../../static/styles/ItemDetailsStyles';
import ChatButton from './ChatButton';
import ItemSeparator from '../user_items/ItemSeparator';
import { createChat } from '../../redux/actions/ChatActions';



export class _ItemDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrls: ['foo.bar'], // provide some uri while loading actual img uris
    };
  }

  static navigationOptions = ({ navigation }) =>
    ({ title: navigation.state.params.item.title });

  componentWillMount() {
    this.getImageUrls();
  }

  componentDidUpdate(prevProps) {
    if (this._isChatCreated(prevProps)) {
      this._navigateToChat();
    }
  }

  _isChatCreated = (prevProps) => {
    return (
      !this.props.isCreatingChat &&
      this.props.error === null &&
      prevProps.isCreatingChat
    );
  };

  _navigateToChat = () => {
    const item = {
      id: this.props.item.id,
      title: this.props.item.title,
      buyer_id: this.props.id,
      seller_id: this.props.item.seller_id,
    };
    this.props.navigation.navigate('Chat', { item });
  };

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
    const itemDetails = {
      sellerId: this.props.item.seller_id,
      itemId: this.props.item.id,
      title: this.props.item.title,
    };
    this.props.dispatch(createChat(itemDetails, this.props.token));
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
  const { id, token } = state.authorizationReducer;
  const { isLoading, error } = state.chatCreationReducer;

  return {
    item,
    token,
    distance,
    isCreatingChat: isLoading,
    error,
    id
  };
};

const ItemDetails = connect(mapStateToProps, null)(_ItemDetails);
export default withNavigation(ItemDetails);
